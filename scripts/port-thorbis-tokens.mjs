import { execFileSync } from "node:child_process";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Read-only source adapter. Run with an explicitly selected Thorbis checkout.
const source = process.argv[2];
if (!source) {
	throw new Error("Usage: node scripts/port-thorbis-tokens.mjs <Thorbis checkout>");
}
const sourceCommit = "46b6654d02fda9d8fde737395185c3141df52cd2";
const actualCommit = execFileSync("git", ["-C", resolve(source), "rev-parse", "HEAD"], {
	encoding: "utf8",
	windowsHide: true,
}).trim();
if (actualCommit !== sourceCommit) {
	throw new Error("Inspect the upstream diff and update the port pin before regenerating tokens");
}
const generated = readFileSync(resolve(source, "src/styles/tokens.generated.css"), "utf8");
const styles = readFileSync(resolve(source, "src/styles.css"), "utf8").replaceAll("\r\n", "\n");
const fontFaces = [...styles.matchAll(/@font-face\s*\{[^}]+\}/g)]
	.map(([face]) => face)
	.filter((face) => face.includes("font-family: 'Inter'"));
if (!fontFaces.length) {
	throw new Error("Missing upstream Inter font faces");
}
const fontFiles = new Set(
	fontFaces.flatMap((face) =>
		[...face.matchAll(/\/fonts\/([\w.-]+\.woff2)/g)].map((match) => match[1])
	)
);
for (const file of [...fontFiles, "inter-OFL.txt"]) {
	copyFileSync(resolve(source, "public/fonts", file), resolve("public/fonts", file));
}
const declarations = (text) => [...text.matchAll(/(--[\w-]+):\s*([^;]+);/g)];
const tokens = new Map(declarations(generated).map((match) => [match[1], match[2]]));
const themeEntries = (theme) => {
	const blocks = [
		...styles.matchAll(new RegExp(`html\\[data-resolved="${theme}"\\]\\s*\\{([^}]+)\\}`, "g")),
	];
	if (!blocks.length) {
		throw new Error(`Thorbis ${theme} theme source changed; inspect before regenerating`);
	}
	return new Map(
		blocks.flatMap((block) =>
			declarations(block[1])
				.filter((match) => tokens.has(match[1]) && !match[2].includes("#"))
				.map((match) => [match[1], match[2]])
		)
	);
};
const light = themeEntries("light");
// Namespacing avoids collisions with Tailwind's --color-accent semantic contract.
const rename = (text) =>
	text.replaceAll("--color-", "--thorbis-").replaceAll("--text-", "--thorbis-text-");
const emit = (entries) =>
	[...entries].map(([name, value]) => `  ${rename(name)}: ${rename(value)};`).join("\n");
// Inter faces are copied above; next/font owns deferred Mono/signature faces.
tokens.delete("--font-sans");
tokens.delete("--font-mono");
const dark = new Map(
	[...tokens, ...themeEntries("dark")].filter(
		([name]) => name.startsWith("--color-") || name.startsWith("--shadow-")
	)
);
const section = `/* Thorbis Design port: ${sourceCommit}.
 * Source: src/styles/tokens.generated.css + src/styles.css theme overrides.
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
const fontStart = "/* thorbis-fonts:start */";
const fontEnd = "/* thorbis-fonts:end */";
const current = readFileSync(target, "utf8").replace(
	/\/\* thorbis-fonts:start \*\/[\s\S]*?\/\* thorbis-fonts:end \*\//,
	`${fontStart}\n/* Thorbis src/styles.css font faces @ ${sourceCommit}; OFL: public/fonts/inter-OFL.txt. */\n${fontFaces.join("\n")}\n${fontEnd}`
);
if (!current.includes(fontStart)) {
	throw new Error("Missing Thorbis font destination marker");
}
const start = current.indexOf("/* Thorbis Design port:");
const endMarker = "/* thorbis-tokens:end */";
const end = current.indexOf(endMarker, start);
if (start < 0 || end < 0) {
	throw new Error("Missing Thorbis token destination marker");
}
writeFileSync(target, current.slice(0, start) + section + current.slice(end + endMarker.length));
