import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";

// components/ui/input.tsx draws a native input without hooks, so the server
// rendered search form is plain HTML and the contact forms ship one small
// function. Base UI's Input wraps Field.Control, whose validation, labelling and
// floating-ui helpers cost /contact and /search about 5 KB of gzip. See
// docs/PERFORMANCE.md.
const APP = new URL("../../.next/server/app/", import.meta.url);
const BASE_UI_FIELD = /@base-ui[\\/]+react[\\/]+esm[\\/]+(input|field)[\\/]/;
const INPUT_SLOT = /<input\b[^>]*\bdata-slot="input"[^>]*>/g;
const ATTRIBUTE = (name) => new RegExp(`\\s${name}="([^"]*)"`);

function files(suffix) {
	return readdirSync(APP, { recursive: true })
		.filter((file) => file.endsWith(suffix))
		.map((file) => file.replaceAll("\\", "/"));
}

test("no page's client code includes Base UI's Input or Field", () => {
	const manifests = files("page_client-reference-manifest.js");
	assert.ok(manifests.length > 10, "Run npm run build before checking client manifests");
	const including = manifests.filter((file) =>
		BASE_UI_FIELD.test(readFileSync(new URL(file, APP), "utf8"))
	);
	assert.deepEqual(including, [], "These routes ship Base UI's Input or Field again");
});

test("the prerendered contact form keeps its labelled, named, required fields", () => {
	const contact = readFileSync(new URL("contact.html", APP), "utf8");
	const fields = [...contact.matchAll(INPUT_SLOT)].map(([tag]) => ({
		id: tag.match(ATTRIBUTE("id"))?.[1],
		name: tag.match(ATTRIBUTE("name"))?.[1],
		required: ATTRIBUTE("required").test(tag),
		type: tag.match(ATTRIBUTE("type"))?.[1],
	}));
	assert.deepEqual(fields, [
		{ id: "name", name: "name", required: true, type: undefined },
		{ id: "email", name: "email", required: true, type: "email" },
	]);
	for (const { id } of fields) {
		assert.match(contact, new RegExp(`<label[^>]*\\sfor="${id}"`), `#${id} keeps its label`);
	}
});
