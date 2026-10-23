import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import matter from "gray-matter";
import { sfntCodePoints, sfntTables } from "./fixtures/sfnt.mjs";

// app/api/og draws every og:image. Satori renders only the fonts handed to it:
// with the résumé signature face as the only one, every card was set in script.
// It cannot read WOFF2, it does not apply variable axes, it places words by
// their unkerned width but draws them kerned, and anything it has no glyph for
// (emoji included) is fetched from a CDN while the crawler waits.
const ROUTE = "app/api/og/route.tsx";
const source = readFileSync(ROUTE, "utf8");
const FILE_PATH = /join\(process\.cwd\(\),\s*((?:"[^"]+",?\s*)+)\)/g;
const SEGMENT = /"([^"]+)"/g;
const FONT = /\.(?:ttf|otf|woff2?)$/;
const JSX_TEXT = />([^<>{}]+)</g;
const PICTOGRAPH = /\p{Extended_Pictographic}/u;
const WHITESPACE = /\s/;
// date-fns "MMMM d, yyyy", as safeFormatDate prints the card's date.
const MONTHS = Array.from({ length: 12 }, (_, month) =>
	new Date(2026, month, 1).toLocaleString("en-US", { month: "long" })
);

const fontPaths = [...source.matchAll(FILE_PATH)]
	.map((match) => join(...[...match[1].matchAll(SEGMENT)].map((segment) => segment[1])))
	.filter((path) => FONT.test(path));

function cardText() {
	const strings = [...source.matchAll(JSX_TEXT)].map((match) => match[1]);
	strings.push(...MONTHS, "0123456789 ·,…");
	for (const folder of ["content/blog", "content/projects"]) {
		for (const file of readdirSync(folder).filter((name) => name.endsWith(".md"))) {
			const { data } = matter(readFileSync(join(folder, file), "utf8"));
			strings.push(String(data.title ?? ""), String(data.excerpt ?? ""));
		}
	}
	return strings.join("");
}

test("the share card reads static TrueType faces Satori lays out correctly", () => {
	assert.ok(fontPaths.length > 0, `${ROUTE} should read its fonts from the repository`);
	for (const path of fontPaths) {
		assert.ok(existsSync(path), `${path} is missing`);
		const tables = sfntTables(readFileSync(path));
		assert.ok(tables, `${path} must be TrueType or OpenType, not a compressed web font`);
		assert.equal(tables.has("fvar"), false, `${path} must be a static instance`);
		assert.equal(tables.has("GPOS"), false, `${path} kerning would widen gaps after words`);
	}
});

test("the share card fonts cover every character a card shows", () => {
	const text = cardText();
	for (const path of fontPaths) {
		const covered = sfntCodePoints(readFileSync(path));
		const missing = [...new Set(text)].filter(
			(character) => !(covered.has(character.codePointAt(0)) || WHITESPACE.test(character))
		);
		assert.deepEqual(missing, [], `${path} has no glyph for these characters`);
	}
});

test("nothing on a share card makes Satori fetch emoji at render time", () => {
	assert.equal(PICTOGRAPH.test(source), false, `${ROUTE} should not draw emoji`);
	assert.equal(PICTOGRAPH.test(cardText()), false, "a title or excerpt contains an emoji");
});
