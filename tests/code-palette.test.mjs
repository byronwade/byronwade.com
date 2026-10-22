import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

// WCAG 2.2 AA for body-size text. Code in the well is 14px, never large text.
const AA = 4.5;

const COMMENT = /\/\*[\s\S]*?\*\//g;
const DECLARATION = /(--[\w-]+)\s*:\s*([^;]+);/g;
const VARIABLE = /^var\((--[\w-]+)(?:,\s*(.+))?\)$/;
const OKLCH = /^oklch\(\s*([^\s]+)\s+([^\s]+)\s+([^\s/)]+)/;
const OKLAB = /^oklab\(\s*([^\s]+)\s+([^\s]+)\s+([^\s/)]+)/;
const MIX = /^color-mix\(in oklab,(.+)\)$/;
const MIX_WEIGHT = /\s(\d+(?:\.\d+)?)%$/;
const SYNTAX_RULE = /([^{}]*\.hljs-[^{}]*)\{([^{}]*)\}/g;
const COLOR_DECLARATION = /(?:^|;|\s)color\s*:\s*([^;]+);/;
const THEME_IMPORT = /@import\s+["']highlight\.js/;

const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

/** Top-level `--name: value` declarations of every rule whose selector is exactly `selector`. */
function declarations(selector) {
	const found = new Map();
	const opener = new RegExp(`(?:^|\\n)\\s*${selector.replace(".", "\\.")}\\s*\\{`, "g");
	for (const match of css.matchAll(opener)) {
		let depth = 1;
		let index = match.index + match[0].length;
		const start = index;
		while (depth > 0 && index < css.length) {
			depth += css[index] === "{" ? 1 : css[index] === "}" ? -1 : 0;
			index += 1;
		}
		const body = css.slice(start, index - 1).replace(COMMENT, "");
		for (const [, name, value] of body.matchAll(DECLARATION)) {
			found.set(name, value.trim());
		}
	}
	return found;
}

const light = declarations(":root");
const dark = new Map([...light, ...declarations(".dark")]);

function oklchToOklab([lightness, chroma, hue]) {
	const radians = (hue * Math.PI) / 180;
	return [lightness, chroma * Math.cos(radians), chroma * Math.sin(radians)];
}

const number = (token) => (token === "none" ? 0 : Number.parseFloat(token));
const unit = (token) => (token.endsWith("%") ? number(token) / 100 : number(token));

/** Splits a function's arguments on top-level commas. */
function argumentsOf(inner) {
	const parts = [];
	let depth = 0;
	let current = "";
	for (const character of inner) {
		depth += character === "(" ? 1 : character === ")" ? -1 : 0;
		if (character === "," && depth === 0) {
			parts.push(current.trim());
			current = "";
		} else {
			current += character;
		}
	}
	parts.push(current.trim());
	return parts;
}

/** Resolves a CSS colour value in a theme scope to OKLab, following var() and color-mix(). */
function resolve(value, scope, seen = new Set()) {
	const text = value.trim();
	const variable = text.match(VARIABLE);
	if (variable) {
		const [, name, fallback] = variable;
		assert.ok(!seen.has(name), `circular custom property ${name}`);
		const next = scope.get(name) ?? fallback;
		assert.ok(next, `${name} is not defined in the theme`);
		return resolve(next, scope, new Set([...seen, name]));
	}
	if (text === "black") {
		return [0, 0, 0];
	}
	if (text === "white") {
		return [1, 0, 0];
	}
	const oklch = text.match(OKLCH);
	if (oklch) {
		return oklchToOklab([unit(oklch[1]), number(oklch[2]), number(oklch[3])]);
	}
	const oklab = text.match(OKLAB);
	if (oklab) {
		return [unit(oklab[1]), number(oklab[2]), number(oklab[3])];
	}
	const mix = text.match(MIX);
	if (mix) {
		const [first, second] = argumentsOf(mix[1]).map((part) => {
			const weight = part.match(MIX_WEIGHT);
			return {
				color: weight ? part.slice(0, weight.index) : part,
				weight: weight ? Number(weight[1]) / 100 : undefined,
			};
		});
		assert.ok(first && second, `unsupported color-mix: ${text}`);
		assert.notEqual(first.color, "transparent", "a code colour must be opaque");
		assert.notEqual(second.color, "transparent", "a code colour must be opaque");
		const p = first.weight ?? (second.weight === undefined ? 0.5 : 1 - second.weight);
		const a = resolve(first.color, scope, seen);
		const b = resolve(second.color, scope, seen);
		return a.map((channel, index) => channel * p + b[index] * (1 - p));
	}
	assert.fail(`unsupported colour value: ${text}`);
}

/** WCAG relative luminance of an OKLab colour, gamut-clipped to sRGB. */
function luminance([lightness, a, b]) {
	const l = (lightness + 0.396_337_777_4 * a + 0.215_803_757_3 * b) ** 3;
	const m = (lightness - 0.105_561_345_8 * a - 0.063_854_172_8 * b) ** 3;
	const s = (lightness - 0.089_484_177_5 * a - 1.291_485_548 * b) ** 3;
	const [red, green, blue] = [
		4.076_741_662_1 * l - 3.307_711_591_3 * m + 0.230_969_929_2 * s,
		-1.268_438_004_6 * l + 2.609_757_401_1 * m - 0.341_319_396_5 * s,
		-0.004_196_086_3 * l - 0.703_418_614_7 * m + 1.707_614_701 * s,
	].map((channel) => Math.min(1, Math.max(0, channel)));
	return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(foreground, background) {
	const [high, low] = [luminance(foreground), luminance(background)].sort((x, y) => y - x);
	return (high + 0.05) / (low + 0.05);
}

/** Every colour set by a `.hljs-*` rule, so a later rule cannot skip the check. */
function syntaxColors() {
	const colors = new Map();
	for (const [, selectors, body] of css.matchAll(SYNTAX_RULE)) {
		const color = body.match(COLOR_DECLARATION)?.[1];
		if (color) {
			colors.set(selectors.replace(COMMENT, "").trim(), color.trim());
		}
	}
	return colors;
}

test("the luminance model matches WCAG's known extremes", () => {
	assert.equal(contrast([1, 0, 0], [0, 0, 0]).toFixed(1), "21.0");
	assert.equal(contrast([0.5, 0, 0], [0.5, 0, 0]), 1);
});

test("the code well no longer imports a third-party highlight theme", () => {
	assert.doesNotMatch(css, THEME_IMPORT);
	assert.ok(syntaxColors().size >= 4, "the syntax roles are defined in globals.css");
});

for (const [theme, scope] of [
	["light", light],
	["dark", dark],
]) {
	test(`every code colour holds WCAG AA on the ${theme} code well`, () => {
		const well = resolve("var(--thorbis-code-bg)", scope);
		const failures = [["the code well's default text", "var(--thorbis-code-fg)"], ...syntaxColors()]
			.map(([selectors, color]) => ({
				selectors,
				color,
				ratio: contrast(resolve(color, scope), well),
			}))
			// Compare at full precision; 4.496 must fail even though it prints as 4.50.
			.filter(({ ratio }) => ratio < AA)
			.map((failure) => ({ ...failure, ratio: failure.ratio.toFixed(3) }));
		assert.deepEqual(failures, [], `code colours below ${AA}:1 in the ${theme} theme`);
	});
}
