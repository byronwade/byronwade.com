import AxeBuilder from '@axe-core/playwright';

export async function checkAccessibility(page: import('playwright').Page) {
	await page.waitForSelector('body');

	const accessibilityScanResults = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
		.analyze();

	const violationCount = accessibilityScanResults.violations.length;
	const incompleteCount = accessibilityScanResults.incomplete.length;
	const violationSummary = accessibilityScanResults.violations.reduce((summary: Record<string, number>, violation) => {
		summary[violation.id] = violation.nodes.length;
		return summary;
	}, {});

	return {
		violationCount,
		incompleteCount, 
		violationSummary
	};
}
