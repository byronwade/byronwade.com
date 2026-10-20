import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { createSlugger, extractToc } from "../lib/markdown-utils.ts";

const markdownUrl = new URL("../components/common/markdown.tsx", import.meta.url).href;
registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
	load(url, context, nextLoad) {
		if (url === markdownUrl) {
			return {
				format: "module",
				shortCircuit: true,
				source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
					compilerOptions: {
						jsx: ts.JsxEmit.ReactJSX,
						module: ts.ModuleKind.ESNext,
						target: ts.ScriptTarget.ES2022,
					},
				}).outputText,
			};
		}
		return nextLoad(url, context);
	},
});
const { Markdown } = await import(markdownUrl);
const HEADING_ID = /<h[1-4]\b[^>]*\bid="([^"]+)"/g;

const cases = [
	{
		name: "ordinary headings retain their existing anchors",
		headings: ["Overview", "The problem", "What changed?", "Next steps"],
		expected: ["overview", "the-problem", "what-changed", "next-steps"],
	},
	{
		name: "repeated headings retain their existing numeric suffixes",
		headings: ["Overview", "Overview", "Overview"],
		expected: ["overview", "overview-1", "overview-2"],
	},
	{
		name: "an authored suffix cannot reuse an already emitted anchor",
		headings: ["Overview", "Overview", "Overview-1"],
		expected: ["overview", "overview-1", "overview-1-1"],
	},
	{
		name: "generated suffixes skip an earlier authored suffix",
		headings: ["Overview-1", "Overview", "Overview"],
		expected: ["overview-1", "overview", "overview-2"],
	},
	{
		name: "nested suffix collisions remain unique",
		headings: ["Overview", "Overview", "Overview-1", "Overview-1", "Overview-1-1"],
		expected: ["overview", "overview-1", "overview-1-1", "overview-1-2", "overview-1-1-1"],
	},
	{
		name: "punctuation and case normalization cannot bypass uniqueness",
		headings: ["Overview!", "OVERVIEW", "Overview-1?"],
		expected: ["overview", "overview-1", "overview-1-1"],
	},
	{
		name: "empty normalized headings share the same collision protection",
		headings: ["!!!", "???", "Section-1", "Section"],
		expected: ["section", "section-1", "section-1-1", "section-2"],
	},
];

for (const { name, headings, expected } of cases) {
	test(name, () => {
		const slugger = createSlugger();
		assert.deepEqual(headings.map(slugger), expected);
	});

	test(`rendered Markdown: ${name}`, () => {
		const content = headings
			.map((heading, index) => `${index % 2 ? "###" : "##"} ${heading}`)
			.join("\n\n");
		const html = renderToStaticMarkup(createElement(Markdown, { content }));
		const ids = [...html.matchAll(HEADING_ID)].map((match) => match[1]);
		assert.deepEqual(ids, expected);
		assert.deepEqual(
			extractToc(content).map((item) => item.id),
			ids
		);
	});
}

test("a new document starts its own anchor namespace", () => {
	const first = createSlugger();
	first("Overview");
	first("Overview");
	assert.equal(createSlugger()("Overview"), "overview");
});

test("a long document cannot emit any duplicate IDs", () => {
	const headings = Array.from({ length: 2000 }, (_, index) =>
		index % 2 ? "Overview" : `Overview-${index / 2}`
	);
	const anchors = headings.map(createSlugger());
	assert.equal(new Set(anchors).size, headings.length);
});

test("contents entries use unique anchors across h2 and h3 collisions", () => {
	assert.deepEqual(extractToc("## Overview\n\n### Overview\n\n## Overview-1\n"), [
		{ id: "overview", depth: 2, text: "Overview" },
		{ id: "overview-1", depth: 3, text: "Overview" },
		{ id: "overview-1-1", depth: 2, text: "Overview-1" },
	]);
});

test("contents anchors account for other rendered heading levels", () => {
	const content = "# Overview\n\n#### Overview\n\n## Overview\n\n### Overview-1";
	const html = renderToStaticMarkup(createElement(Markdown, { content }));
	const ids = [...html.matchAll(HEADING_ID)].map((match) => match[1]);
	assert.deepEqual(ids, ["overview", "overview-1", "overview-2", "overview-1-1"]);
	assert.deepEqual(extractToc(content), [
		{ id: ids[2], depth: 2, text: "Overview" },
		{ id: ids[3], depth: 3, text: "Overview-1" },
	]);
});
