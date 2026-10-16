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

const { generateMetadata, generateWebSiteStructuredData } = await import("../lib/seo.ts");
const { entryMatchesQuery, groupSearchResults, normalizeSearchQuery, SEARCH_QUERY_MAX } =
	await import("../lib/search-match.ts");
const { xHandle } = await import("../lib/site.ts");

const entries = [
	{ kind: "Page", label: "Resume", href: "/resume", keywords: "cv experience" },
	{
		kind: "Project",
		label: "Thorbis",
		href: "/projects/thorbis",
		meta: "Active",
		keywords: "field service",
	},
	{
		kind: "Writing",
		label: "What service businesses actually need",
		href: "/blog/need",
		meta: "8 min read",
		keywords: "dispatch invoice",
	},
];

test("search queries collapse whitespace and stop at the shared limit", () => {
	assert.equal(normalizeSearchQuery(undefined), "");
	assert.equal(normalizeSearchQuery("   "), "");
	assert.equal(normalizeSearchQuery("  thorbis   design "), "thorbis design");
	assert.equal(normalizeSearchQuery("a".repeat(SEARCH_QUERY_MAX + 40)).length, SEARCH_QUERY_MAX);
});

test("every word must match, and an empty query keeps the full palette", () => {
	assert.equal(entryMatchesQuery(entries[1], ""), true);
	assert.equal(entryMatchesQuery(entries[1], "THORBIS"), true);
	assert.equal(entryMatchesQuery(entries[1], "field active"), true);
	assert.equal(entryMatchesQuery(entries[1], "thorbis missing"), false);
	assert.equal(entryMatchesQuery(entries[2], "invoice"), true);
});

test("results stay in page, project, then writing order and drop empty groups", () => {
	const groups = groupSearchResults(entries, "i");
	assert.deepEqual(
		groups.map((group) => group.kind),
		["Page", "Project", "Writing"]
	);
	assert.deepEqual(
		groupSearchResults(entries, "invoice").map((group) => group.label),
		["Writing"]
	);
	assert.equal(groupSearchResults(entries, "not-a-real-page").length, 0);
});

test("the site search box and shared cards point at real destinations", () => {
	const website = generateWebSiteStructuredData();
	const action = website.potentialAction;
	assert.equal(action["@type"], "SearchAction");
	assert.equal(action.target.urlTemplate.endsWith("/search?q={search_term_string}"), true);
	const metadata = generateMetadata({ title: "Example" });
	assert.deepEqual(metadata.title, { absolute: "Example | Byron Wade" });
	assert.equal(metadata.twitter.creator, `@${xHandle}`);
	assert.equal(metadata.twitter.site, `@${xHandle}`);
	assert.equal(xHandle, "byron_c_wade");
});
