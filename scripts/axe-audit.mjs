// Runs in the page after axe is injected. One rule set for the full-route audit
// and the rendered regression: WCAG 2.2 A/AA, nothing from best practice.
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
	return results.violations.map(({ id, impact, nodes }) => ({
		id,
		impact,
		nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
	}));
}
