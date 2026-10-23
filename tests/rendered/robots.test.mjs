import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { siteUrl } from "../../lib/site.ts";
import { withProductionServer } from "../../scripts/production-session.mjs";
import { assertCrawlerPolicy, parseRobots } from "../fixtures/robots.mjs";

// Crawlers read the served text, not app/robots.ts, so the policy is checked on
// the file the build writes and on what the production server answers with.
const PLAIN_TEXT = /^text\/plain/;
const BUILT = new URL("../../.next/server/app/robots.txt.body", import.meta.url);

test("the built robots.txt keeps the crawler policy and names the sitemap on the site origin", () => {
	const { groups, sitemaps } = parseRobots(readFileSync(BUILT, "utf8"));
	assertCrawlerPolicy(groups);
	assert.deepEqual(sitemaps, [`${siteUrl}/sitemap.xml`]);
});

test("the production server answers /robots.txt with the built file as plain text", {
	timeout: 60_000,
}, async () => {
	const { status, type, text } = await withProductionServer(async (origin) => {
		const response = await fetch(`${origin}/robots.txt`, { signal: AbortSignal.timeout(30_000) });
		return {
			status: response.status,
			type: response.headers.get("content-type") ?? "",
			text: await response.text(),
		};
	});
	assert.equal(status, 200);
	assert.match(type, PLAIN_TEXT);
	assert.equal(text, readFileSync(BUILT, "utf8"));
});
