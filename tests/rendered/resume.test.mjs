import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const DESCRIPTION = /<meta name="description" content="([^"]*)"/;
const JSON_LD = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
const PRINT_HIDDEN_SECTION = /<(section|div|footer) class="[^"]*\bprint:hidden\b[^"]*"/;
const PRINT_HIDDEN_FOOTER = /<footer class="[^"]*\bprint:hidden\b/;
const OVERSTATED = /multi-million/i;
const MAIN = `id="main-content"`;

async function readResume() {
	const file = new URL("../../.next/server/app/resume.html", import.meta.url);
	try {
		return await readFile(file, "utf8");
	} catch {
		assert.fail("Run npm run build first; /resume should be prerendered to resume.html");
	}
}

/** True when some print:hidden section/div/footer is still open where `marker` appears. */
function isInsidePrintHidden(html, marker) {
	const at = html.indexOf(marker);
	assert.ok(at > 0, `${marker} should be on the page`);
	// Page content only: the site header is print-hidden as a whole.
	const before = html.slice(html.indexOf(MAIN), at);
	return [...before.matchAll(new RegExp(PRINT_HIDDEN_SECTION, "g"))].some((open) => {
		const tag = open[1];
		const between = before.slice(open.index + open[0].length);
		// Walk same-name tags in order; the element is closed once depth returns to zero.
		let depth = 1;
		for (const [, closing] of between.matchAll(new RegExp(`<(/?)${tag}\\b`, "g"))) {
			depth += closing ? -1 : 1;
			if (depth === 0) {
				return false;
			}
		}
		return true;
	});
}

test("the resume record is in the prerendered HTML, without the real contact details", async () => {
	const html = await readResume();

	for (const text of [
		"Experience",
		"Garrison Septic &amp; Plumbing",
		"Lanier Plumbing Services, LLC",
		"Licenses and certifications",
		"Master Plumber License (GA)",
	]) {
		assert.ok(html.includes(text), `prerendered /resume should include ${text}`);
	}

	// Decoded only in the browser after mount (docs/SPAM_PROTECTION.md).
	for (const secret of ["byron@byronwade.com", "8312958460", "295-8460"]) {
		assert.ok(!html.includes(secret), `prerendered /resume must not contain ${secret}`);
	}

	const person = [...html.matchAll(JSON_LD)]
		.map(([, json]) => JSON.parse(json))
		// The site-wide Person block comes first; the resume adds its credentials.
		.find((data) => data["@type"] === "Person" && data.hasCredential);
	assert.ok(person, "/resume should carry its Person JSON-LD");
	assert.equal(person.email, "contact@byronwade.com", "JSON-LD uses the published role address");
	assert.equal(person.telephone, "+1-8xx-xxx-xxxx", "JSON-LD uses the masked number");
});

test("the resume description restates the page instead of overstating it", async () => {
	const html = await readResume();
	const description = html.match(DESCRIPTION)?.[1] ?? "";
	assert.ok(description.length > 0, "/resume should have a meta description");
	assert.ok(!OVERSTATED.test(description), `description overstates: ${description}`);
	assert.ok(description.includes("Thorbis"), "description should name the current work");
});

test("printing the resume leaves out its controls and the site footer", async () => {
	const html = await readResume();

	for (const control of ["Download PDF", "Interested in working together?"]) {
		assert.ok(isInsidePrintHidden(html, control), `${control} should be hidden in print`);
	}
	assert.match(html, PRINT_HIDDEN_FOOTER, "site footer should be hidden in print");
	for (const record of [">Experience<", ">Licenses and certifications<"]) {
		assert.ok(!isInsidePrintHidden(html, record), `${record} must still print`);
	}
});
