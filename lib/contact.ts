/**
 * Contact details, encoded so they never appear as plain text in the shipped
 * HTML or JS source. Base64 is obfuscation, not encryption — it defeats bulk
 * scrapers, not a determined reader. See docs/SPAM_PROTECTION.md.
 *
 * This lives in lib/ so both the UI components and the structured-data helpers
 * read from one place; nothing should hardcode a raw address anywhere else.
 */

// byron@byronwade.com
const ENCODED_EMAIL = "Ynlyb25AYnlyb253YWRlLmNvbQ==";
// +18312958460
const ENCODED_PHONE = "KzE4MzEyOTU4NDYw";
// +1 (831) 295-8460
const ENCODED_PHONE_DISPLAY = "KzEgKDgzMSkgMjk1LTg0NjA=";

/** Decodes on the client. Returns "" rather than throwing if atob is unavailable. */
export function decodeContact(encoded: string): string {
	try {
		return atob(encoded);
	} catch {
		return "";
	}
}

export const CONTACT_ENCODED = {
	email: ENCODED_EMAIL,
	phone: ENCODED_PHONE,
	phoneDisplay: ENCODED_PHONE_DISPLAY,
} as const;

/**
 * Values safe to embed in JSON-LD.
 *
 * Structured data is served in the initial HTML, so anything here is readable
 * by every crawler — which is the point for search engines and the problem for
 * harvesters. These are deliberately a role address and a masked number, not
 * the real ones the click-to-reveal components decode.
 */
export function getContactForStructuredData() {
	return {
		email: `contact${String.fromCharCode(64)}byronwade.com`,
		telephone: "+1-8xx-xxx-xxxx",
	};
}
