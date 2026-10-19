import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import lighthouse from "lighthouse";
import { launchAuditBrowser } from "./audit-browser.mjs";
import { writeEvidenceJson } from "./evidence-json.mjs";
import { assessBudget } from "./lighthouse-budget.mjs";
import { withProductionServer } from "./production-session.mjs";

const budgets = JSON.parse(readFileSync("lighthouse-budget.json", "utf8"));
await withProductionServer(async (url) => {
	const browser = await launchAuditBrowser({ lighthouse: true });
	try {
		const port = Number(new URL(browser.wsEndpoint()).port);
		// Lighthouse 12 removed built-in budgets; assertions below own enforcement.
		const result = await lighthouse(url, {
			port,
			output: "json",
			onlyCategories: ["performance"],
			logLevel: "error",
		});
		if (!result || result.lhr.runtimeError) {
			throw new Error(result?.lhr.runtimeError?.message || "Lighthouse returned no result");
		}
		const { lhr } = result;
		const { timings, resources, failures } = assessBudget(lhr, budgets[0]);
		const destination = "docs/evidence/a11y-perf";
		mkdirSync(destination, { recursive: true });
		writeEvidenceJson(
			`${destination}/home-budget${process.argv.includes("--baseline") ? "-baseline" : ""}.json`,
			{
				checkedAt: new Date().toISOString(),
				buildId: readFileSync(".next/BUILD_ID", "utf8").trim(),
				workingTreeDirty: Boolean(
					execFileSync("git", ["diff", "--name-only"], {
						encoding: "utf8",
						windowsHide: true,
					}).trim()
				),
				commit: execFileSync("git", ["rev-parse", "HEAD"], {
					encoding: "utf8",
					windowsHide: true,
				}).trim(),
				chrome: await browser.version(),
				score: lhr.categories.performance.score,
				lighthouseVersion: lhr.lighthouseVersion,
				profile: {
					formFactor: lhr.configSettings.formFactor,
					screenEmulation: lhr.configSettings.screenEmulation,
					throttlingMethod: lhr.configSettings.throttlingMethod,
					throttling: lhr.configSettings.throttling,
				},
				diagnostics: Object.fromEntries(
					[
						"network-requests",
						"bootup-time",
						"mainthread-work-breakdown",
						"largest-contentful-paint-element",
						"lcp-breakdown-insight",
					].map((name) => [name, lhr.audits[name]?.details])
				),
				timings,
				resources,
				failures,
			}
		);
		console.log(JSON.stringify({ timings, resources, failures }, null, 2));
		if (failures.length) {
			throw new Error("Performance budget exceeded");
		}
	} finally {
		await browser.close();
	}
});
