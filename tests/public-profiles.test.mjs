import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { publicProfiles } from "../lib/site.ts";

/** This path is a different Byron Wade. It must not appear in shipped source. */
const WRONG_LINKEDIN = ["linkedin.com", "in", "byronwade"].join("/");
const PUBLIC_PROFILES = /publicProfiles/;
const PROFILE_SOURCES = [
	"lib/site.ts",
	"lib/seo.ts",
	"components/layout/footer.tsx",
	"app/layout.tsx",
];

test("public profiles are the verified GitHub and X accounts", () => {
	assert.deepEqual(
		publicProfiles.map((profile) => [profile.name, profile.href]),
		[
			["GitHub", "https://github.com/byronwade"],
			["X", "https://x.com/byron_c_wade"],
		]
	);
});

test("the footer and profile cards do not link the other Byron Wade", async () => {
	const entries = await Promise.all(
		PROFILE_SOURCES.map(async (path) => {
			const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
			return [path, source];
		})
	);
	const sources = new Map(entries);
	for (const [path, source] of sources) {
		assert.equal(source.includes(WRONG_LINKEDIN), false, path);
	}
	assert.match(sources.get("components/layout/footer.tsx"), PUBLIC_PROFILES);
	assert.match(sources.get("lib/seo.ts"), PUBLIC_PROFILES);
});
