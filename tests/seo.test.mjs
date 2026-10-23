import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
});

const { generateMetadata } = await import("../lib/seo.ts");
const { metadata: root } = await import("../app/metadata.config.ts");

test("root and page metadata share the site's current description and keywords", () => {
	const page = generateMetadata({ title: "Example" });
	assert.equal(root.description, page.description);
	assert.deepEqual(root.keywords, page.keywords);
	assert.ok(page.keywords.includes("Thorbis"));
	assert.ok(page.keywords.includes("Service Business Software"));
	for (const stale of ["California Developer", "JavaScript Expert", "SEO Optimization"]) {
		assert.equal(page.keywords.includes(stale), false, stale);
	}
});

test("the home description reaches social metadata and the share card", () => {
	assert.equal(root.openGraph.description, root.description);
	assert.equal(root.twitter.description, root.description);
	const card = new URL(root.openGraph.images[0].url);
	assert.equal(card.searchParams.get("description"), root.description);
	assert.deepEqual(root.twitter.images, [card.href]);
});

test("page keywords add context without repeating the shared keywords", () => {
	const page = generateMetadata({
		title: "Case studies",
		keywords: ["Thorbis", "Case Studies", "Case Studies"],
	});
	assert.ok(page.keywords.includes("Thorbis"));
	assert.ok(page.keywords.includes("Case Studies"));
	assert.equal(page.keywords.length, new Set(page.keywords).size);
});

test("a page description reaches its social metadata and generated card", () => {
	const description = "Current products and earlier experiments.";
	const page = generateMetadata({ title: "Projects", description });
	assert.equal(page.description, description);
	assert.equal(page.openGraph.description, description);
	assert.equal(page.twitter.description, description);
	const card = new URL(page.openGraph.images[0].url);
	assert.equal(card.searchParams.get("title"), "Projects");
	assert.equal(card.searchParams.get("description"), description);
});
