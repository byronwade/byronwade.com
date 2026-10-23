import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

// Lighthouse already ships axe for its own accessibility audit. Every audit here
// injects that copy, so all of them run the version Lighthouse runs, offline and
// with no separate package.
const fromLighthouse = createRequire(import.meta.resolve("lighthouse"));
const axeSource = readFileSync(fromLighthouse.resolve("axe-core/axe.min.js"), "utf8");
export const axeVersion = fromLighthouse("axe-core/package.json").version;

/** Adds axe to the current document unless an earlier check already did. */
export async function injectAxe(page) {
	if (!(await page.evaluate(() => Boolean(window.axe)))) {
		await page.addScriptTag({ content: axeSource });
	}
}

// Runs in the page after axe is injected. One rule set for every audit: WCAG 2.2
// A/AA, nothing from best practice. `incomplete` lists the rules axe could not
// decide on its own; they need a human look, not a pass.
export async function readAxe() {
	const results = await window.axe.run(document, {
		runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] },
	});
	const errors = results.incomplete.filter((result) => result.error);
	if (errors.length) {
		throw new Error(`axe could not evaluate ${errors.map((result) => result.id).join(", ")}`);
	}
	// A page axe found nothing to check on is a broken audit, not a clean one.
	if (!results.passes.length) {
		throw new Error("axe passed no rules; the page had nothing to evaluate");
	}
	return {
		version: results.testEngine.version,
		violations: results.violations.map(({ id, impact, nodes }) => ({
			id,
			impact,
			nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
		})),
		incomplete: results.incomplete.map(({ id }) => id),
	};
}
