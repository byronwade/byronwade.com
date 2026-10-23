import { readFileSync } from "node:fs";

export const COMMENT = /\/\*[\s\S]*?\*\//g;
const DECLARATION = /(--[\w-]+)\s*:\s*([^;]+);/g;

/** `app/globals.css`, the one owner of every design token value. */
export const globalCss = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");

/** Top-level `--name: value` declarations of every rule whose selector is exactly `selector`. */
export function declarations(selector) {
	const found = new Map();
	const opener = new RegExp(`(?:^|\\n)\\s*${selector.replace(".", "\\.")}\\s*\\{`, "g");
	for (const match of globalCss.matchAll(opener)) {
		let depth = 1;
		let index = match.index + match[0].length;
		const start = index;
		while (depth > 0 && index < globalCss.length) {
			depth += globalCss[index] === "{" ? 1 : globalCss[index] === "}" ? -1 : 0;
			index += 1;
		}
		const body = globalCss.slice(start, index - 1).replace(COMMENT, "");
		for (const [, name, value] of body.matchAll(DECLARATION)) {
			found.set(name, value.trim());
		}
	}
	return found;
}
