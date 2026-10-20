import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { test } from "node:test";
import { cn } from "../lib/utils.ts";

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
		"components/ui/card.tsx",
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
