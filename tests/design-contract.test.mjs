import assert from "node:assert/strict";
import { access, readdir, readFile, stat } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";
import { cn } from "../lib/utils.ts";

const ROOT = new URL("../", import.meta.url);

async function sourceFiles(directories) {
	const listed = await Promise.all(
		directories.map((directory) => readdir(new URL(directory, ROOT), { recursive: true }))
	);
	const paths = listed.flatMap((entries, index) =>
		entries
			.filter((entry) => entry.endsWith(".tsx"))
			.map((entry) => `${directories[index]}/${entry.replaceAll("\\", "/")}`)
	);
	return Promise.all(
		paths.map(async (path) => {
			const text = await readFile(new URL(path, ROOT), "utf8");
			return {
				path,
				text,
				source: ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX),
			};
		})
	);
}

function visit(node, callback) {
	callback(node);
	ts.forEachChild(node, (child) => visit(child, callback));
}

function location({ path, source }, node) {
	return `${path}:${source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1}`;
}

function jsxAttribute(element, name) {
	return element.attributes.properties.find(
		(property) => ts.isJsxAttribute(property) && property.name.getText() === name
	);
}

/** A literal attribute value, or undefined when it is computed at runtime. */
function literalValue(attribute) {
	const value = attribute.initializer;
	if (value && ts.isStringLiteral(value)) {
		return value.text;
	}
	if (
		value &&
		ts.isJsxExpression(value) &&
		value.expression &&
		ts.isStringLiteralLike(value.expression)
	) {
		return value.expression.text;
	}
}

test("Thorbis type roles survive color merging and allow explicit size overrides", () => {
	assert.equal(cn("text-copy-13", "text-foreground"), "text-copy-13 text-foreground");
	assert.equal(cn("text-body text-heading-20", "text-copy-14"), "text-body text-copy-14");
	assert.equal(
		cn("text-body text-copy-13", "text-muted-foreground"),
		"text-copy-13 text-muted-foreground"
	);
});

const TOKEN_BLOCK = /\/\* thorbis-tokens:start \*\/[\s\S]*?\/\* thorbis-tokens:end \*\//;
const COLOR_LITERAL = /(?:oklch|oklab|rgb|hsl)\(/;
const OLD_DESIGN = /Warm Precision|reveal-up|animation-timeline/;
const RAW_COLOR =
	/#[\da-f]{3,8}\b|(?:bg|text|fill)-(?:white|black|pink|amber)-?\d*|Warm Precision/i;

test("Thorbis tokens remain the only color values in the migrated surface", async () => {
	const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
	const outsideTokens = css.replace(TOKEN_BLOCK, "");
	assert.doesNotMatch(outsideTokens, COLOR_LITERAL);
	assert.doesNotMatch(css, OLD_DESIGN);
	const paths = [
		"app/page.tsx",
		"app/portfolio/figma/[key]/page.tsx",
		"app/metadata.config.ts",
		"components/home/home-hero.tsx",
		"components/portfolio/figma-viewer.tsx",
		"components/portfolio/figma-viewer-client.tsx",
		"components/layout/footer.tsx",
		"components/layout/nav-dock.tsx",
		"components/layout/site-header.tsx",
		"components/layout/header-popover.tsx",
		"components/layout/header-popover-content.tsx",
		"components/layout/header-search-panel.tsx",
		"components/layout/dock-toolbar-client.tsx",
		"components/layout/dock-toolbar.tsx",
		"components/ui/button.tsx",
		"components/ui/badge.tsx",
		"components/layout/sheet.tsx",
		"components/ui/input.tsx",
		"components/ui/textarea.tsx",
	];
	const files = await Promise.all(
		paths.map((path) => readFile(new URL(`../${path}`, import.meta.url), "utf8"))
	);
	for (const text of files) {
		assert.doesNotMatch(text, RAW_COLOR);
	}
});

// The redesign retired the Card primitive: surfaces are wells, rows and specimens
// built from tokens, so a bordered box cannot creep back in through an import.
test("no route or component imports the retired Card primitive", async () => {
	const consumers = (await sourceFiles(["app", "components"]))
		.filter(({ text }) => text.includes('from "@/components/ui/card"'))
		.map(({ path }) => path);
	assert.deepEqual(consumers, []);
});

test("live regions are siblings of their controls, never inside a button", async () => {
	const files = await sourceFiles(["app", "components"]);
	const nested = [];
	for (const file of files) {
		visit(file.source, (node) => {
			if (
				!(
					ts.isJsxElement(node) &&
					["button", "Button"].includes(node.openingElement.tagName.getText())
				)
			) {
				return;
			}
			for (const child of node.children) {
				visit(child, (descendant) => {
					if (
						(ts.isJsxOpeningElement(descendant) || ts.isJsxSelfClosingElement(descendant)) &&
						(jsxAttribute(descendant, "aria-live") ||
							literalValue(jsxAttribute(descendant, "role") ?? {}) === "status")
					) {
						nested.push(location(file, descendant));
					}
				});
			}
		});
	}
	// Button descendants are flattened into its name, so a nested status is not announced reliably.
	assert.deepEqual(nested, []);
});

test("the small favicon route cannot be shadowed by a full-size public asset", async () => {
	await assert.rejects(access(new URL("../public/icon.png", import.meta.url)), { code: "ENOENT" });
	const icon = await stat(new URL("../app/icon.png", import.meta.url));
	assert.ok(icon.size < 10_000, "the browser favicon must stay below 10KB");
	await access(new URL("../public/icon-original.png", import.meta.url));
});

const FULL_ITALIC_LATIN = "UcC53FwrK3iLTcvneQg7B5iqpJlhKnPCkaL5UUM.woff2";
const ITALIC_CORE = "inter-italic-latin-core.woff2";

test("quoted posts load the italic Latin core subset instead of the full face", async () => {
	const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
	const generatedEnd = css.indexOf("/* thorbis-fonts:end */");
	const core = css.indexOf(`/fonts/${ITALIC_CORE}`);
	assert.ok(css.indexOf(`/fonts/${FULL_ITALIC_LATIN}`) < generatedEnd);
	// A later face wins for overlapping characters; before the full face it never would.
	assert.ok(core > generatedEnd, "the core subset must follow the generated Thorbis faces");
	const [full, subset] = await Promise.all(
		[FULL_ITALIC_LATIN, ITALIC_CORE].map((file) =>
			stat(new URL(`../public/fonts/${file}`, import.meta.url))
		)
	);
	assert.ok(subset.size < full.size - 10_000, "the subset must stay materially smaller");
});
