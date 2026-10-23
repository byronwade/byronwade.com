import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { assertCrawlerPolicy, groupsFromRules } from "./fixtures/robots.mjs";

registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
});

const { default: robots } = await import("../app/robots.ts");
const { siteUrl } = await import("../lib/site.ts");

test("crawlers read pages and share cards but skip the server-work API routes", () => {
	assertCrawlerPolicy(groupsFromRules(robots().rules));
});

test("robots.txt points crawlers at the sitemap on the site origin", () => {
	assert.equal(robots().sitemap, `${siteUrl}/sitemap.xml`);
});
