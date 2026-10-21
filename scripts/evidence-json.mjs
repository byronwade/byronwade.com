import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { CONTACT_ENCODED, decodeContact } from "../lib/contact.ts";

const contactDetails = Object.values(CONTACT_ENCODED).map(decodeContact).filter(Boolean);

// Reveal-state selectors can contain contact details; diagnostics must not publish them.
export function serializeEvidence(value) {
	return JSON.stringify(value, (_key, item) =>
		typeof item === "string"
			? contactDetails.reduce((text, detail) => text.replaceAll(detail, "[redacted contact]"), item)
			: item
	);
}

// Generated evidence must satisfy the same formatter as checked-in source.
export function writeEvidenceJson(path, value) {
	const formatted = execFileSync(
		process.execPath,
		["node_modules/@biomejs/biome/bin/biome", "format", "--stdin-file-path", path],
		{
			input: serializeEvidence(value),
			encoding: "utf8",
			// Complete route matrices exceed Node's default 1 MiB subprocess output buffer.
			maxBuffer: 16 * 1024 * 1024,
			windowsHide: true,
		}
	);
	writeFileSync(path, formatted);
}
