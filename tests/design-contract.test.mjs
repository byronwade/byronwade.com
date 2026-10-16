import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

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
		"components/home/home-hero.tsx",
		"components/layout/footer.tsx",
		"components/layout/nav-dock.tsx",
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
