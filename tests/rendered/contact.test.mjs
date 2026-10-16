import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const NON_NATIVE_ROLE_PATTERN = /role="button"/;

test("the contact form keeps native submit-button semantics", async () => {
	const html = await readFile(
		new URL("../../.next/server/app/contact.html", import.meta.url),
		"utf8"
	);
	const buttons = (html.match(/<button\b[^>]*>/g) ?? []).filter((tag) =>
		tag.includes('type="submit"')
	);
	assert.equal(buttons.length, 1);
	assert.doesNotMatch(buttons[0], NON_NATIVE_ROLE_PATTERN);
});
