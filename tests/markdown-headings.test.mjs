import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { test } from "node:test";
import matter from "gray-matter";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { createSlugger, stripLeadingH1 } from "../lib/markdown-utils.ts";

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
const { extractToc } = await import("../lib/markdown.ts");
const HEADING_ID = /<h[1-4]\b[^>]*\bid="([^"]+)"/g;
const CODE_CHIP = /thorbis-code-bg/;

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

const grammarCases = [
	{
		name: "ATX headings indented up to three spaces",
		content: " ## One\n\n  ### Two\n\n   ## Three",
		labels: ["One", "Two", "Three"],
	},
	{
		name: "setext headings reserve h1 anchors and include multiline h2 text",
		content: "One\n===\n\nOne\n---\n\nTwo\nlines\n---\n\n### One",
		labels: ["One", "Two\nlines", "One"],
	},
	{
		name: "headings nested in block quotes and list items",
		content: "> ## One\n>\n> ### Two\n\n- ## Three",
		labels: ["One", "Two", "Three"],
	},
	{
		name: "mixed fence markers do not close each other",
		content: "```text\n~~~\n## Hidden\n```\n\n## Visible",
		labels: ["Visible"],
	},
	{
		name: "shorter fences cannot close longer backtick fences",
		content: "````text\n```\n## Hidden\n````\n\n## Visible",
		labels: ["Visible"],
	},
	{
		name: "shorter fences cannot close longer tilde fences",
		content: "~~~~text\n~~~\n## Hidden\n~~~~~\n\n## Visible",
		labels: ["Visible"],
	},
	{
		name: "indented code does not open a document fence",
		content: "    ```\n    ## Hidden\n\n## Visible",
		labels: ["Visible"],
	},
	{
		name: "closing fence markers with trailing text are code",
		content: "```text\n``` still code\n## Hidden\n```\n\n## Visible",
		labels: ["Visible"],
	},
	{
		name: "an unclosed fence hides every following heading",
		content: "## Visible\n\n~~~\n## Hidden\n```\n## Also hidden",
		labels: ["Visible"],
	},
	{
		name: "literal hashes only close a heading after whitespace",
		content: "## C#\n\n### C# ###",
		labels: ["C#", "C#"],
	},
	{
		name: "reference links and entities use rendered text",
		content: "## [One][ref] &amp; &#50;\n\n[ref]: https://example.com",
		labels: ["One & 2"],
	},
	{
		name: "code spans and escaped emphasis preserve literal characters",
		content: "## `snake_case` and \\*literal\\*\n\n### a_b_c",
		labels: ["snake_case and *literal*", "a_b_c"],
	},
	{
		name: "inline images follow the renderer's existing text and anchor semantics",
		content: "## Before ![diagram](https://example.com/image.png) after\n\n### **Bold** ~~old~~",
		labels: ["Before  after", "Bold old"],
	},
	{
		name: "raw HTML is skipped consistently in heading labels",
		content: "## One <em>two</em> &copy;\n\n### Three",
		labels: ["One two ©", "Three"],
	},
	{
		name: "unanchored h5 and h6 do not consume the existing slug namespace",
		content: "##### Overview\n\n###### Overview\n\n## Overview",
		labels: ["Overview"],
	},
	{
		name: "GFM footnotes retain their renderer-provided heading destination",
		content: "## Notes\n\nText[^1].\n\n[^1]: Definition",
		labels: ["Notes", "Footnotes"],
	},
];

for (const { name, content, labels } of grammarCases) {
	test(`contents agree with rendered grammar: ${name}`, () => {
		const html = renderToStaticMarkup(createElement(Markdown, { content }));
		const headings = [...html.matchAll(/<h([23])\b[^>]*\bid="([^"]+)"/g)];
		const toc = extractToc(content);
		assert.deepEqual(
			toc.map((item) => item.id),
			headings.map((match) => match[2])
		);
		assert.deepEqual(
			toc.map((item) => item.depth),
			headings.map((match) => Number(match[1]))
		);
		assert.deepEqual(
			toc.map((item) => item.text),
			labels
		);
	});
}

test("empty and image-only headings reserve IDs without blank contents entries", () => {
	const content = "#\n\n##\n\n## ![diagram](https://example.com/image.png)\n\n####\n\n## Section";
	const html = renderToStaticMarkup(createElement(Markdown, { content }));
	assert.deepEqual(
		[...html.matchAll(HEADING_ID)].map((match) => match[1]),
		["section", "section-1", "section-2", "section-3", "section-4"]
	);
	assert.deepEqual(extractToc(content), [{ id: "section-4", depth: 2, text: "Section" }]);
});

test("empty and heading-free documents do not invent contents entries", () => {
	for (const content of ["", " \n", "A paragraph", "```\n## Code\n```", "#### Detail only"]) {
		assert.deepEqual(extractToc(content), []);
	}
});

test("fenced code without a language is a block, not an inline chip inside the well", () => {
	const content = '```\n"Analyze src/api/route.ts"\n```\n\nRun `npm test` first.';
	const html = renderToStaticMarkup(createElement(Markdown, { content }));
	const [block, inline] = [...html.matchAll(/<code\b([^>]*)>/g)].map((match) => match[1]);
	assert.ok(html.includes("<pre"), "the fence renders a code well");
	assert.doesNotMatch(block ?? "", CODE_CHIP, "the fenced code carries no chip");
	assert.match(inline ?? "", CODE_CHIP, "a code span keeps its chip");
});

for (const directory of ["blog", "projects"]) {
	for (const filename of readdirSync(new URL(`../content/${directory}/`, import.meta.url))) {
		if (!filename.endsWith(".md")) {
			continue;
		}
		test(`authored ${directory}/${filename} contents match its rendered heading IDs`, () => {
			const raw = readFileSync(
				new URL(`../content/${directory}/${filename}`, import.meta.url),
				"utf8"
			);
			const content = stripLeadingH1(matter(raw).content);
			const html = renderToStaticMarkup(createElement(Markdown, { content }));
			const ids = [...html.matchAll(/<h[23]\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1]);
			assert.deepEqual(
				extractToc(content).map((item) => item.id),
				ids
			);
		});
	}
}
