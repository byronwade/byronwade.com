import assert from "node:assert/strict";
import { test } from "node:test";
import { isActive, navItems } from "../components/layout/nav-config.ts";

test("header and footer share destinations, with descriptions for mobile navigation", () => {
	assert.deepEqual(
		navItems.map((item) => item.href),
		["/", "/projects", "/portfolio", "/blog", "/resume"]
	);
	assert.equal(new Set(navItems.map((item) => item.href)).size, navItems.length);
	for (const item of navItems) {
		assert.ok(item.label.trim());
		assert.ok(item.description.trim());
		assert.equal(isActive(item, item.href), true);
	}
});

test("navigation matches nested routes without matching unrelated prefixes", () => {
	for (const item of navItems) {
		assert.equal(isActive(item, `${item.href}/case-study`), item.href !== "/");
		assert.equal(isActive(item, `${item.href}-elsewhere`), false);
		assert.equal(isActive(item, "/contact"), false);
	}
});
