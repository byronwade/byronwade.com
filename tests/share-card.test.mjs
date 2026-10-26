import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import matter from "gray-matter";
import { declarations } from "./fixtures/global-css.mjs";
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
// A palette entry copied from one token, like `body: "#4a4139", // --thorbis-body`,
// or from its dark-theme value, `// --thorbis-body (dark)`.
const PALETTE_ENTRY = /\w+: "(#[\da-f]{6})", \/\/ (--[\w-]+)( \(dark\))?$/gm;
const OKLCH = /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)$/;
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

/** sRGB channels (0-255) of an `oklch(L% C H)` token, gamut-clipped. */
function oklchToSrgb(value) {
	const match = value.match(OKLCH);
	assert.ok(match, `unsupported token value ${value}`);
	const lightness = Number(match[1]) / 100;
	const radians = (Number(match[3]) * Math.PI) / 180;
	const a = Number(match[2]) * Math.cos(radians);
	const b = Number(match[2]) * Math.sin(radians);
	const l = (lightness + 0.396_337_777_4 * a + 0.215_803_757_3 * b) ** 3;
	const m = (lightness - 0.105_561_345_8 * a - 0.063_854_172_8 * b) ** 3;
	const s = (lightness - 0.089_484_177_5 * a - 1.291_485_548 * b) ** 3;
	return [
		4.076_741_662_1 * l - 3.307_711_591_3 * m + 0.230_969_929_2 * s,
		-1.268_438_004_6 * l + 2.609_757_401_1 * m - 0.341_319_396_5 * s,
		-0.004_196_086_3 * l - 0.703_418_614_7 * m + 1.707_614_701 * s,
	].map((linear) => {
		const channel = Math.min(1, Math.max(0, linear));
		const encoded = channel <= 0.003_130_8 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
		return Math.round(encoded * 255);
	});
}

test("the share card palette still matches the tokens it copies", () => {
	const light = declarations(":root");
	const dark = new Map([...light, ...declarations(".dark")]);
	const entries = [...source.matchAll(PALETTE_ENTRY)];
	assert.ok(entries.length >= 4, `${ROUTE} should name the token behind each color`);
	for (const [, hex, token, theme] of entries) {
		const tokens = theme ? dark : light;
		const expected = oklchToSrgb(tokens.get(token) ?? "");
		const actual = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
		const drift = Math.max(...actual.map((channel, index) => Math.abs(channel - expected[index])));
		assert.ok(drift <= 1, `${hex} no longer matches ${token} (${tokens.get(token)})`);
	}
});
