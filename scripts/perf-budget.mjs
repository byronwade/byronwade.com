import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import lighthouse from "lighthouse";
import puppeteer from "puppeteer-core";
import { withProductionServer } from "./production-session.mjs";

const budgets = JSON.parse(readFileSync("lighthouse-budget.json", "utf8"));
await withProductionServer(async (url) => {
	const browser = await puppeteer.launch({
		executablePath:
			process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
		headless: true,
	});
	try {
		const port = Number(new URL(browser.wsEndpoint()).port);
		const result = await lighthouse(
			url,
			{ port, output: "json", onlyCategories: ["performance"], logLevel: "error" },
			{ extends: "lighthouse:default", settings: { budgets } }
		);
		if (!result || result.lhr.runtimeError) {
			throw new Error(result?.lhr.runtimeError?.message || "Lighthouse returned no result");
		}
		const { lhr } = result;
		const resources = lhr.audits["resource-summary"].details.items;
		const failures = [];
		const timings = budgets[0].timings.map(({ metric, budget }) => {
			const value = lhr.audits[metric].numericValue;
			if (value > budget) {
				failures.push(`${metric}: ${value} > ${budget}`);
			}
			return { metric, value, budget };
		});
		for (const { resourceType, budget } of budgets[0].resourceSizes) {
			const value = resources.find((item) => item.resourceType === resourceType)?.transferSize ?? 0;
			if (value > budget * 1024) {
				failures.push(`${resourceType} bytes: ${value} > ${budget * 1024}`);
			}
		}
		for (const { resourceType, budget } of budgets[0].resourceCounts) {
			const value = resources.find((item) => item.resourceType === resourceType)?.requestCount ?? 0;
			if (value > budget) {
				failures.push(`${resourceType} count: ${value} > ${budget}`);
			}
		}
		mkdirSync("docs/evidence/thorbis", { recursive: true });
		writeFileSync(
			"docs/evidence/thorbis/performance.json",
			`${JSON.stringify(
				{
					score: lhr.categories.performance.score,
					lighthouseVersion: lhr.lighthouseVersion,
 diagnostics: Object.fromEntries(["network-requests", "bootup-time", "mainthread-work-breakdown", "largest-contentful-paint-element", "lcp-breakdown-insight"].map((name) => [name, lhr.audits[name]?.details])),
					timings,
					resources,
					failures,
				},
				null,
				2
			)}\n`
		);
		console.log(JSON.stringify({ timings, resources, failures }, null, 2));
		if (failures.length) {
			throw new Error("Performance budget exceeded");
		}
	} finally {
		await browser.close();
	}
});
