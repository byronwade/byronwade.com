// Both the home release gate and the route matrix enforce the same JSON budget.
export function assessBudget(lhr, budget) {
	const resources = lhr.audits["resource-summary"]?.details?.items;
	if (!(Array.isArray(resources) && resources.some((item) => item.resourceType === "total"))) {
		throw new Error("Lighthouse returned no resource summary");
	}
	const failures = [];
	const timings = budget.timings.map(({ metric, budget: limit }) => {
		const value = lhr.audits[metric]?.numericValue;
		if (!Number.isFinite(value)) {
			failures.push(`${metric}: missing numeric measurement`);
		} else if (value > limit) {
			failures.push(`${metric}: ${value} > ${limit}`);
		}
		return { metric, value, budget: limit };
	});
	for (const { resourceType, budget: limit } of budget.resourceSizes) {
		const resource = resources.find((item) => item.resourceType === resourceType);
		const value = resource ? resource.transferSize : 0;
		if (!Number.isFinite(value) || value < 0) {
			failures.push(`${resourceType} bytes: invalid measurement`);
		} else if (value > limit * 1024) {
			failures.push(`${resourceType} bytes: ${value} > ${limit * 1024}`);
		}
	}
	for (const { resourceType, budget: limit } of budget.resourceCounts) {
		const resource = resources.find((item) => item.resourceType === resourceType);
		const value = resource ? resource.requestCount : 0;
		if (!Number.isFinite(value) || value < 0) {
			failures.push(`${resourceType} count: invalid measurement`);
		} else if (value > limit) {
			failures.push(`${resourceType} count: ${value} > ${limit}`);
		}
	}
	return { timings, resources, failures };
}
