import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const RETURN_LINK = /<a\b([^>]*href="\/shop"[^>]*)>Return to the shop<\/a>/;
const BUTTON_ROLE = /role="button"/;

for (const route of ["success", "cancel"]) {
	test(`shop ${route} returns through a native link`, async () => {
		const html = await readFile(
			new URL(`../../.next/server/app/shop/${route}.html`, import.meta.url),
			"utf8"
		);
		const link = html.match(RETURN_LINK);
		assert.ok(link, "A visible anchor must link back to the shop");
		assert.doesNotMatch(link[1], BUTTON_ROLE);
	});
}
