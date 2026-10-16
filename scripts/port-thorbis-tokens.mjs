import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Read-only source adapter. Run with an explicitly selected Thorbis checkout.
const source = process.argv[2];
if (!source) {
	throw new Error("Usage: node scripts/port-thorbis-tokens.mjs <Thorbis checkout>");
}
const generated = readFileSync(resolve(source, "src/styles/tokens.generated.css"), "utf8");
const styles = readFileSync(resolve(source, "src/styles.css"), "utf8").replaceAll("\r\n", "\n");
const declarations = (text) => [...text.matchAll(/(--[\w-]+):\s*([^;]+);/g)];
const tokens = new Map(declarations(generated).map((match) => [match[1], match[2]]));
// Status roles precede the canvas block. Read the primary explicit theme blocks
// through its shadow refinements, before the system-theme fallback. Later base
// layer fallbacks must not override the supported, unlayered declarations.
const canvasStart = styles.indexOf('html[data-resolved="light"] {\n  color-scheme: light;');
const lightEnd = styles.indexOf("@media (prefers-color-scheme: light)", canvasStart);
if (canvasStart < 0 || lightEnd < canvasStart) {
	throw new Error("Thorbis light canvas source changed; inspect before regenerating");
}
const lightBlocks = [
	...styles.slice(0, lightEnd).matchAll(/html\[data-resolved="light"\]\s*\{([^{}]*)\}/g),
];
const light = new Map(
	lightBlocks.flatMap((block) => declarations(block[1]).map((m) => [m[1], m[2]]))
);
if (
	!(
		lightBlocks.some((block) => block[1].includes("color-scheme: light")) &&
		["success", "danger", "warning", "info"].every((role) => light.has(`--color-${role}`))
	)
) {
	throw new Error("Thorbis light theme source changed; inspect before regenerating");
}
// Namespacing avoids collisions with Tailwind's --color-accent semantic contract.
const rename = (text) =>
	text.replaceAll("--color-", "--thorbis-").replaceAll("--text-", "--thorbis-text-");
const emit = (entries) =>
	[...entries].map(([name, value]) => `  ${rename(name)}: ${rename(value)};`).join("\n");
// Fonts are loaded by next/font; radius and motion names remain source-compatible.
tokens.delete("--font-sans");
tokens.delete("--font-mono");
const dark = new Map(
	[...tokens].filter(([name]) => name.startsWith("--color-") || name.startsWith("--shadow-"))
);
const section = `/* Thorbis Design port: 46b6654d02fda9d8fde737395185c3141df52cd2.
 * Source: src/styles/tokens.generated.css + src/styles.css light overrides.
 * Sync: scripts/port-thorbis-tokens.mjs; mapping: docs/THORBIS-DESIGN-PORT.md.
 * Raw design values belong only in this token block. */

/* thorbis-tokens:start */
:root {
${emit(new Map([...tokens, ...light]))}
}
.dark {
${emit(dark)}
}

/* thorbis-tokens:end */`;
const target = "app/globals.css";
const current = readFileSync(target, "utf8");
const start = current.indexOf("/* Thorbis Design port:");
const endMarker = "/* thorbis-tokens:end */";
if (start < 0) {
	throw new Error("Missing Thorbis token destination marker");
}
writeFileSync(
	target,
	current.slice(0, start) +
		section +
		current.slice(current.indexOf(endMarker, start) + endMarker.length)
);
