import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

registerHooks({
	resolve(specifier, context, nextResolve) {
		if (["next/dynamic", "next/link", "next/image", "next/navigation"].includes(specifier)) {
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

const { TopicNav } = await import("../components/blog/topic-nav.tsx");
const { PostPager } = await import("../components/blog/post-pager.tsx");
const { EmptyState, failureCopyClass, failureTitleClass } = await import(
	"../components/common/empty-state.tsx"
);
const { quietPressClass, indexRowLinkClass } = await import("../components/common/index-list.tsx");
const { PageHeader, ledeClass, pageTitleClass, sectionHeadingClass } = await import(
	"../components/layout/page.tsx"
);
const { PreviewFallback } = await import(
	"../components/project/full-width-project-preview-client.tsx"
);

const topic = {
	label: "Product engineering",
	slug: "product-engineering",
	posts: [{ slug: "one" }, { slug: "two" }],
};
const post = {
	slug: "older-note",
	title: "An older note",
	date: "2024-01-01",
	readingTime: 4,
};

const topicHeadingPattern = /<h2[^>]*id="post-topics"[^>]*>More on these topics<\/h2>/;
const currentChipPattern = /aria-current="page"[^>]*bg-muted/;
const selectedCountPattern = /text-foreground">2</;
const writingHeadingPattern = /<h2[^>]*id="more-writing"[^>]*>More writing<\/h2>/;
const previewStartPattern = /^<div class="[^"]*\bitems-start\b[^"]*\btext-left\b/;
const previewCenterPattern = /^<div class="[^"]*\btext-center\b/;

function markup(element) {
	return renderToStaticMarkup(element);
}

test("topic links use the index row press and the section heading role", () => {
	const html = markup(
		createElement(TopicNav, {
			heading: "More on these topics",
			topics: [topic],
			current: topic.slug,
		})
	);
	assert.match(html, topicHeadingPattern);
	assert.ok(html.includes(sectionHeadingClass), "The topic heading is the section role");
	assert.ok(html.includes(quietPressClass), "Topic links share the index press fill");
	assert.ok(html.includes("min-h-11"), "Topic links meet the 44px target");
	assert.match(html, currentChipPattern);
	assert.match(html, selectedCountPattern, "The selected count uses foreground ink");
	assert.equal(html.includes("blur-"), false);
	assert.equal(html.includes("#"), false);
});

test("the writing pager names itself and reuses the index row", () => {
	const html = markup(
		createElement(PostPager, {
			older: post,
			newer: { ...post, slug: "newer-note", title: "A newer note" },
		})
	);
	assert.match(html, writingHeadingPattern);
	assert.ok(html.includes(sectionHeadingClass));
	assert.ok(html.includes(indexRowLinkClass));
	assert.ok(html.includes("text-copy-13"));
	assert.ok(html.includes("size-4"));
	assert.equal(html.split("<a ").length - 1, 2);
});

test("page titles, ledes and failure copy are one role each", () => {
	const header = markup(
		createElement(PageHeader, { title: "Projects", lede: "What is shipping." })
	);
	const empty = markup(
		createElement(EmptyState, { title: "Nothing here", description: "Check back later." })
	);
	assert.ok(header.includes(`class="${pageTitleClass}"`));
	assert.ok(header.includes(`class="${ledeClass}"`));
	assert.ok(empty.includes(failureTitleClass));
	assert.ok(empty.includes(failureCopyClass));
	assert.ok(empty.includes("items-start"));
});

test("preview recovery uses the failure roles and starts on the reading edge", () => {
	const html = markup(
		createElement(PreviewFallback, {
			href: "https://thorbis.com",
			icons: { retry: null, open: null },
			onRetry: () => undefined,
			reason: "off",
			url: "thorbis.com",
		})
	);
	assert.ok(html.includes("Live preview is off"));
	assert.ok(html.includes("itself is unaffected"));
	assert.ok(html.includes(failureTitleClass));
	assert.ok(html.includes(failureCopyClass));
	assert.match(html, previewStartPattern);
	assert.doesNotMatch(html, previewCenterPattern);
	assert.equal(html.includes(">Retry<"), false);
	assert.ok(html.includes(">Open site<"));
});
