import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

// Generated evidence must satisfy the same formatter as checked-in source.
export function writeEvidenceJson(path, value) {
	const formatted = execFileSync(
		process.execPath,
		["node_modules/@biomejs/biome/bin/biome", "format", "--stdin-file-path", path],
		{ input: JSON.stringify(value), encoding: "utf8", windowsHide: true }
	);
	writeFileSync(path, formatted);
}
