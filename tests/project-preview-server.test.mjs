import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { beforeEach, test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Render the real wrapper, client and glyph slots without a second Next build.
// Only the server-only compiler marker is replaced; configuration stays real.
registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier === "server-only") {
			return nextResolve(new URL("./fixtures/server-only.mjs", import.meta.url).href, context);
		}
		if (specifier === "next/image" || specifier === "next/cache") {
			return nextResolve(`${specifier}.js`, context);
		}
		const base = specifier.startsWith("@/")
			? new URL(`../${specifier.slice(2)}`, import.meta.url)
			: specifier.startsWith(".") && context.parentURL?.startsWith("file:")
				? new URL(specifier, context.parentURL)
				: null;
		if (base) {
			const source = [".ts", ".tsx"]
				.map((extension) => new URL(`${base.href}${extension}`))
				.find((candidate) => existsSync(candidate));
			if (source) {
				return nextResolve(source.href, context);
			}
		}
		return nextResolve(specifier, context);
	},
	load(url, context, nextLoad) {
		if (url.endsWith(".tsx")) {
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

const { FullWidthProjectPreview } = await import(
	"../components/project/full-width-project-preview.tsx"
);
const props = {
	captionClassName: "reading-measure",
	href: "https://project.example/",
	title: "Example project",
	url: "project.example",
};
const CAPTION = /<figcaption\b[^>]*class="[^"]*\breading-measure\b/;

beforeEach((context) => {
	context.mock.method(globalThis, "fetch", () => {
		assert.fail("Server rendering must not request or spend a screenshot capture");
	});
});

for (const [label, key] of [
	["missing", undefined],
	["empty", ""],
	["whitespace-only", " \t\n "],
	["configured", "preview-render-test-only"],
	["configured with surrounding whitespace", "  preview-render-test-only \n"],
	["removed after a configured render", undefined],
]) {
	test(`server preview: ${label}`, () => {
		if (key === undefined) {
			delete process.env.SCREENSHOTONE_ACCESS_KEY;
		} else {
			process.env.SCREENSHOTONE_ACCESS_KEY = key;
		}
		const html = renderToStaticMarkup(createElement(FullWidthProjectPreview, props));
		if (key?.trim()) {
			assert.ok(html.includes('aria-label="Example project site preview"'));
			assert.ok(html.includes('href="https://project.example/"'));
			assert.match(html, CAPTION);
			assert.ok(!html.includes(key.trim()), "The capture key must never appear in markup");
		} else {
			assert.equal(html.length, 0, "A keyless build must omit the entire preview and caption");
		}
		assert.equal(globalThis.fetch.mock.callCount(), 0, "Prerendering must not start a capture");
	});
}
