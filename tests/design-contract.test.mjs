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
		"app/metadata.config.ts",
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

// A full border width; `border-0` and colour-only classes such as `border-border/30` do not count.
const BORDER_WIDTH = /^border(?:-[xytblrse])?(?:-[1-9]\d*|-\[[^\]]+\])?$/;
// Cards that deliberately drop the primitive's border. Every other consumer keeps it.
const OPEN_CARDS = new Set(["components/home/home-hero.tsx"]);

test("every Card consumer keeps the primitive's border unless it opts out on purpose", async () => {
	const primitive = ts.createSourceFile(
		"card.tsx",
		await readFile(new URL("components/ui/card.tsx", ROOT), "utf8"),
		ts.ScriptTarget.Latest,
		true,
		ts.ScriptKind.TSX
	);
	let base;
	visit(primitive, (node) => {
		if (
			base === undefined &&
			ts.isCallExpression(node) &&
			node.expression.getText() === "cn" &&
			ts.isStringLiteralLike(node.arguments[0])
		) {
			base = node.arguments[0].text;
		}
	});
	assert.ok(
		base?.split(" ").some((name) => BORDER_WIDTH.test(name)),
		"Card owns a border width"
	);

	const consumers = (await sourceFiles(["app", "components"])).filter(({ text }) =>
		text.includes('from "@/components/ui/card"')
	);
	const cards = [];
	for (const file of consumers) {
		visit(file.source, (node) => {
			if (
				(ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
				node.tagName.getText() === "Card"
			) {
				const attribute = jsxAttribute(node, "className");
				const className = attribute ? literalValue(attribute) : "";
				assert.notEqual(className, undefined, `${location(file, node)} needs a literal className`);
				const bordered = cn(base, className)
					.split(" ")
					.some((name) => BORDER_WIDTH.test(name));
				cards.push({ at: location(file, node), bordered, open: OPEN_CARDS.has(file.path) });
			}
		});
	}
	assert.ok(cards.length >= 10, "the Card consumer scan must find the Figma detail cards");
	assert.deepEqual(
		cards.filter(({ bordered, open }) => bordered === open).map(({ at }) => at),
		[],
		"a Card lost its border, or an intended open card kept one"
	);
});

test("the small favicon route cannot be shadowed by a full-size public asset", async () => {
	await assert.rejects(access(new URL("../public/icon.png", import.meta.url)), { code: "ENOENT" });
	const icon = await stat(new URL("../app/icon.png", import.meta.url));
	assert.ok(icon.size < 10_000, "the browser favicon must stay below 10KB");
	await access(new URL("../public/icon-original.png", import.meta.url));
});
