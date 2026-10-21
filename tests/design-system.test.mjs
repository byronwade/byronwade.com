import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

/**
 * Thorbis token and profile sensors (DESIGN.md §5, §13; AGENTS.md "Mechanical
 * prevention"). Hard rules have no exceptions. The type-scale rules ratchet:
 * BASELINE is the exact count still allowed per file, so a new violation fails
 * and a removed one must be recorded here, until every entry reaches zero.
 */

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_DIRS = ["app", "components"];
const PROFILES = ["showcase", "evidence", "guided", "shared"];
const SOURCE_FILE = /\.(tsx|ts)$/;
const TSX_FILE = /\.tsx$/;
const LOCAL_IMPORT = /from "((?:\.|@\/)[^"]+)"/g;
const PROFILE_PROP = new RegExp(`\\bprofile="(?:${PROFILES.join("|")})"`);
const ROUTE_ENTRY = /^app\/(?:.*\/)?(?:page|not-found|error)\.tsx$/;
const RAW_COLOUR =
	/-\[(?:#[0-9a-f]{3,8}|(?:rgb|rgba|hsl|hsla|oklch|oklab)\()|(?:color|background|fill|stroke)\s*:\s*["'`]?(?:#[0-9a-f]{3,8}\b|(?:rgb|hsl|oklch)\()/i;
const BANNED_EFFECT =
	/\b(?:bg-gradient-|bg-linear-|bg-radial-|bg-conic-|backdrop-blur|blur-(?:xs|sm|md|lg|xl|2xl|3xl|none|\[)|transition-all)\b|(?:linear|radial|conic)-gradient\(|transition:\s*all\b/;
const CSS_EFFECT = /(?:linear|radial|conic)-gradient\(|backdrop-filter/;
const REDUCED_MOTION_BLOCK = /@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\n {2}\}/;
const REDUCED_ANIMATION = /animation-duration:\s*0\.01ms !important/;
const REDUCED_TRANSITION = /transition-duration:\s*0\.01ms !important/;

function sourceFiles(dir = "") {
	const absolute = join(ROOT, dir);
	return readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) {
			return path === join("app", "api") ? [] : sourceFiles(path);
		}
		return SOURCE_FILE.test(entry.name) ? [path.replaceAll("\\", "/")] : [];
	});
}

const files = SOURCE_DIRS.flatMap((dir) => sourceFiles(dir));
const read = (path) => readFileSync(join(ROOT, path), "utf8");

function count(source, pattern) {
	return (source.match(pattern) ?? []).length;
}

// Tailwind's default type ramp and pixel font sizes bypass the Thorbis roles
// (text-copy-12/13/14/16, text-heading-16/20/32).
const DEFAULT_TYPE = /\btext-(?:xs|sm|base|lg|xl|[2-9]xl)\b/g;
const ARBITRARY_TYPE = /\btext-\[\d+(?:\.\d+)?(?:px|rem|em)\]/g;
// Thorbis sets every heading and emphasis at 500.
const HEAVY_WEIGHT = /\bfont-(?:semibold|bold|extrabold|black)\b/g;

/** Remaining allowance per file. Lower it as files are migrated; never raise it. */
const BASELINE = {
	"app/blog/[slug]/page.tsx": { type: 5, weight: 1 },
	"app/blog/page.tsx": { type: 5 },
	"app/contact/contact-client.tsx": { type: 9 },
	"app/not-found.tsx": { type: 4, weight: 1 },
	"app/portfolio/page.tsx": { type: 5, arbitrary: 1 },
	"app/projects/[slug]/project-content.tsx": { type: 13, weight: 2 },
	"app/projects/page.tsx": { type: 1 },
	"app/resume/page.tsx": { type: 14, weight: 4 },
	"app/resume/resume-actions.tsx": { type: 2 },
	"app/search/page.tsx": { type: 1 },
	"components/blog/related-posts.tsx": { type: 3, weight: 1 },
	"components/common/empty-state.tsx": { type: 2, weight: 1 },
	"components/common/markdown.tsx": { type: 8, weight: 5 },
	"components/home/inline-contact.tsx": { type: 11 },
	"components/project/full-width-project-preview.tsx": { type: 7, arbitrary: 3 },
	"components/project/project-toc.tsx": { type: 2 },
	"components/project/projects-index.tsx": { type: 5 },
	"components/ui/pill.tsx": { type: 1 },
};

test("type scale and weights only shrink (ratchet against BASELINE)", () => {
	const actual = {};
	for (const path of files) {
		const source = read(path);
		const entry = {
			type: count(source, DEFAULT_TYPE),
			arbitrary: count(source, ARBITRARY_TYPE),
			weight: count(source, HEAVY_WEIGHT),
		};
		const kept = Object.fromEntries(Object.entries(entry).filter(([, value]) => value > 0));
		if (Object.keys(kept).length > 0) {
			actual[path] = kept;
		}
	}
	assert.deepEqual(
		actual,
		BASELINE,
		"Use the Thorbis copy/heading roles and weight 500. If you removed violations, lower BASELINE to match."
	);
});

test("no raw colour literals in class names or inline styles", () => {
	const offenders = files.filter((path) => RAW_COLOUR.test(read(path)));
	assert.deepEqual(offenders, [], "Colours come from app/globals.css tokens.");
});

test("no gradients, decorative blur, or transition-all", () => {
	const offenders = files.filter((path) => BANNED_EFFECT.test(read(path)));
	assert.deepEqual(offenders, []);
	assert.doesNotMatch(read("app/globals.css"), CSS_EFFECT);
});

test("reduced motion collapses every animation and transition", () => {
	const css = read("app/globals.css");
	const block = css.match(REDUCED_MOTION_BLOCK)?.[1] ?? "";
	assert.match(block, REDUCED_ANIMATION);
	assert.match(block, REDUCED_TRANSITION);
});

/**
 * Each route entry declares one surface profile, either itself or through the
 * one local module it renders (ContactClient, ErrorNotice).
 */
function declaresProfile(path, depth = 0) {
	const source = read(path);
	if (PROFILE_PROP.test(source)) {
		return true;
	}
	if (depth > 1) {
		return false;
	}
	const imports = [...source.matchAll(LOCAL_IMPORT)].map(([, specifier]) =>
		specifier.startsWith("@/")
			? specifier.slice(2)
			: relative(ROOT, resolve(ROOT, dirname(path), specifier)).replaceAll("\\", "/")
	);
	return imports.some((base) => {
		const candidate = [".tsx", ".ts"]
			.map((ext) => base + ext)
			.find((p) => existsSync(join(ROOT, p)));
		return (
			candidate !== undefined && TSX_FILE.test(candidate) && declaresProfile(candidate, depth + 1)
		);
	});
}

test("every route declares a surface profile", () => {
	const routes = files.filter((path) => ROUTE_ENTRY.test(path));
	assert.ok(routes.length >= 14, `expected every route entry, found ${routes.length}`);
	const missing = routes.filter((path) => !declaresProfile(path));
	assert.deepEqual(missing, [], "Render SiteShell with a profile (DESIGN.md §3).");
});
