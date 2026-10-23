import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { declarations } from "./fixtures/global-css.mjs";

/**
 * Thorbis token and profile sensors (DESIGN.md §5, §13; AGENTS.md "Mechanical
 * prevention"). Every rule here is hard: one type scale, token colours, radii
 * and shadows only, one curve and two duration budgets, no gradients or
 * decorative blur, a reduced-motion path, and a declared surface profile on
 * every route.
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

// Tailwind's default type ramp and pixel font sizes bypass the Thorbis roles
// (text-copy-12/13/14/16, text-heading-16/20/32); Thorbis sets every heading
// and emphasis at weight 500.
const OFF_SCALE_TYPE =
	/\btext-(?:xs|sm|base|lg|xl|[2-9]xl)\b|\btext-\[\d+(?:\.\d+)?(?:px|rem|em)\]|\bfont-(?:semibold|bold|extrabold|black)\b/;

test("type uses only the Thorbis copy and heading roles at weight 500", () => {
	const offenders = files.filter((path) => OFF_SCALE_TYPE.test(read(path)));
	assert.deepEqual(offenders, [], "Use text-copy-*/text-heading-* and font-medium.");
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

// Radii, shadows, curves and durations are tokens too (DESIGN.md §5, §6.2). A
// Tailwind default key that globals.css does not redeclare, an arbitrary value
// or a literal curve renders a value from outside the Thorbis scale.
const css = read("app/globals.css");
const DECLARATION_NAME = /(--[\w-]+)\s*:/g;
const RADIUS_TOKEN = /^--radius-([\w-]+)$/;
const DECLARED = new Set([...css.matchAll(DECLARATION_NAME)].map(([, name]) => name));
const RADIUS_CLASS =
	/\brounded(?:-(?:ss|se|ee|es|tl|tr|br|bl|[setrblxy]))?-(\w+|\[[^\]]*\]|\((--[\w-]+)\))/g;
const RADIUS_KEYS = new Set([
	"none",
	"full",
	...[...DECLARED].flatMap((name) => name.match(RADIUS_TOKEN)?.[1] ?? []),
]);
// Bare `rounded` and bare sides (`rounded-t`) compile to Tailwind's 4px, below the scale.
const BARE_RADIUS = /(?<![\w-])rounded(?=[\s"'`;])/;
const OFF_SCALE_SHADOW =
	/\b(?:inset-)?shadow-(?:2xs|xs|sm|md|lg|xl|2xl|inner|\[)|\bdrop-shadow(?:-|\b)|\b(?:boxShadow|borderRadius)\s*:\s*(?:["'`](?!var\()|\d)/;
const TOKEN_REFERENCE = /\b(shadow|rounded(?:-[a-z]{1,2})?|duration|ease|delay)-\((--[\w-]+)\)/g;
const MOTION_TOKEN = /^--(?:motion|ease)-/;
const OFF_SCALE_MOTION =
	/(?<![\w-])(?:(?:duration|delay)-(?:\d|\[)|ease-(?:in|out|in-out|linear|initial|\[)(?![\w-])|animate-(?!(?:spin|pulse|in|out|none)(?![\w-]))[\w[(])/;
const STRING_LITERAL = /"[^"\n]*"|`[^`]*`/g;
const ENTER_EXIT = /\banimate-(?:in|out)\b/;
const LITERAL_CURVE = /cubic-bezier\(|\beasing:\s*["'`]|\bduration:\s*\d/;
const CUBIC_BEZIER = /cubic-bezier\(/g;
const APPLY = /@apply\s[^;]+;/g;
const CSS_TIMING =
	/(?<![\w-])(?:(?:transition|animation)(?:-duration|-delay)?\s*:[^;]*\b\d+(?:\.\d+)?m?s\b|(?:transition|animation)-timing-function\s*:(?!\s*var\())[^;]*/g;
const appliedClasses = [...css.matchAll(APPLY)].map(([rule]) => rule).join("\n");

test("radii use the redeclared Thorbis keys", () => {
	const offenders = [...files, "app/globals.css"].flatMap((path) => {
		const source = path === "app/globals.css" ? appliedClasses : read(path);
		const classLists = path === "app/globals.css" ? [source] : (source.match(STRING_LITERAL) ?? []);
		return [
			...[...source.matchAll(RADIUS_CLASS)]
				.filter(([, key, variable]) =>
					variable ? !variable.startsWith("--radius") : !RADIUS_KEYS.has(key)
				)
				.map(([match]) => `${path}: ${match}`),
			...classLists.filter((list) => BARE_RADIUS.test(list)).map(() => `${path}: rounded`),
		];
	});
	assert.deepEqual(offenders, [], "Use rounded-sm/md/lg/xl/2xl/3xl/4xl/full or --radius-*.");
});

test("shadows use the Thorbis elevation tokens", () => {
	const offenders = files.filter((path) => OFF_SCALE_SHADOW.test(read(path)));
	assert.ok(!OFF_SCALE_SHADOW.test(appliedClasses), "app/globals.css @apply uses a default shadow");
	assert.deepEqual(offenders, [], "Use shadow-card, shadow-float or shadow-(--shadow-*).");
});

test("token-reference utilities name a declared token", () => {
	const offenders = files.flatMap((path) =>
		[...read(path).matchAll(TOKEN_REFERENCE)]
			.filter(
				([, utility, name]) =>
					!DECLARED.has(name) ||
					((utility === "duration" || utility === "ease" || utility === "delay") &&
						!MOTION_TOKEN.test(name))
			)
			.map(([match]) => `${path}: ${match}`)
	);
	assert.deepEqual(offenders, [], "Reference a token declared in app/globals.css.");
});

test("motion classes use the one curve and the two duration budgets", () => {
	const offenders = files.filter((path) => OFF_SCALE_MOTION.test(read(path)));
	assert.ok(!OFF_SCALE_MOTION.test(appliedClasses), "app/globals.css @apply uses a default curve");
	assert.deepEqual(offenders, [], "Use duration-(--motion-*) and ease-(--ease-out).");
});

// tw-animate's enter/exit keyframes fall back to 150ms and the CSS `ease`
// keyword unless the same class list sets both tokens.
test("enter and exit animations set the token duration and curve", () => {
	const offenders = files.flatMap((path) =>
		[...read(path).matchAll(STRING_LITERAL)]
			.map(([literal]) => literal)
			.filter(
				(literal) =>
					ENTER_EXIT.test(literal) &&
					!(literal.includes("duration-(--motion-") && literal.includes("ease-(--"))
			)
			.map((literal) => `${path}: ${literal.slice(0, 60)}…`)
	);
	assert.deepEqual(offenders, []);
});

test("scripted motion reads its curve and duration from lib/motion.ts", () => {
	const offenders = [...files, ...["hooks", "lib"].flatMap((dir) => sourceFiles(dir))]
		.filter((path) => path !== "lib/motion.ts")
		.filter((path) => LITERAL_CURVE.test(read(path)));
	assert.deepEqual(offenders, [], "Use motionToken()/motionDuration().");
});

test("globals.css declares one curve and times motion only through tokens", () => {
	assert.equal(css.match(CUBIC_BEZIER)?.length, 1, "one cubic-bezier, the --ease-out source");
	const literals = [...css.replace(REDUCED_MOTION_BLOCK, "").matchAll(CSS_TIMING)];
	assert.deepEqual(
		literals.map(([declaration]) => declaration),
		[],
		"Time CSS motion with var(--motion-*)."
	);
});

test("Tailwind uses the source motion curve without a second easing namespace", () => {
	const aliases = [...declarations("@theme inline").keys()].filter((name) =>
		name.startsWith("--ease-")
	);
	assert.deepEqual(aliases, [], "Use ease-(--ease-out); scripted motion uses --motion-* tokens.");
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
