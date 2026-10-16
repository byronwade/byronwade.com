import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { shopProducts } from "../../lib/shop/products.ts";
import { withProductionServer } from "../../scripts/production-session.mjs";

const RETURN_LINK = /<a\b([^>]*href="\/shop"[^>]*)>Return to the shop<\/a>/;
const BUTTON_ROLE = /role="button"/;
const NOINDEX = /<meta name="robots" content="[^"]*noindex/;
const PLACEHOLDER = /Placeholder - pending Byron(?:&#x27;|')s choice/;

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

test("shop detail routes are catalog-owned, noindex and absent from the sitemap", async () => {
	await withProductionServer(async (origin) => {
		const shop = await fetch(`${origin}/shop`).then((response) => response.text());
		assert.match(shop, NOINDEX);
		await Promise.all(
			shopProducts.map(async (product) => {
				assert.ok(shop.includes(`href="/shop/${product.id}"`));
				const response = await fetch(`${origin}/shop/${product.id}`);
				assert.equal(response.status, 200);
				const html = await response.text();
				assert.match(html, NOINDEX);
				assert.match(html, PLACEHOLDER);
				assert.ok(html.includes(product.description));
				assert.ok(html.includes(`href="/shop"`));
			})
		);
		const missing = await fetch(`${origin}/shop/not-a-product`, {
			headers: { "User-Agent": "Googlebot" },
		});
		assert.equal(missing.status, 404);
		const sitemap = await fetch(`${origin}/sitemap.xml`).then((response) => response.text());
		assert.ok(!sitemap.includes("/shop"));
	});
});
