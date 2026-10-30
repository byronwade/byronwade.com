import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import lighthouse from "lighthouse";
import { closeBrowser } from "../tests/fixtures/browser.mjs";
import { loadAnalyticsRuntime, withAnalyticsRuntime } from "./analytics-runtime.mjs";
import { launchAuditBrowser } from "./audit-browser.mjs";
import { writeEvidenceJson } from "./evidence-json.mjs";
import { assessBudget } from "./lighthouse-budget.mjs";
import { withProductionServer } from "./production-session.mjs";

const route = process.argv.find((argument) => argument.startsWith("--route="))?.slice(8) || "/";
if (!route.startsWith("/") || route.startsWith("//") || route.includes("\\")) {
	throw new Error("The budget route must be a same-origin path");
}
const reportStem = route === "/" ? "home-budget" : `route-budget${route.replaceAll("/", "_")}`;
const budgets = JSON.parse(readFileSync("lighthouse-budget.json", "utf8"));
const destination = process.env.THORBIS_EVIDENCE_DIR || "docs/evidence/a11y-perf";
const runtimeDirectory = process.argv
	.find((argument) => argument.startsWith("--analytics-runtime="))
	?.slice("--analytics-runtime=".length);
if (runtimeDirectory === "") {
	throw new Error("--analytics-runtime requires a pinned snapshot directory");
}
const runtimeFixture = runtimeDirectory ? await loadAnalyticsRuntime(runtimeDirectory) : undefined;

async function checkRuntime(page, runtime, failures) {
	if (!runtime) {
		return;
	}
	runtime.assertComplete();
	const active = await page.evaluate(() => window.vai === true && window.sil === true);
	if (!active) {
		failures.push("Analytics runtime did not activate");
	}
	if (runtime.requests.blocked.length) {
		failures.push("Analytics replay blocked off-origin HTTP");
	}
}

await withProductionServer(
	async (url) => {
		const browser = await launchAuditBrowser({ lighthouse: true });
		try {
			const audit = async (page, runtime) => {
				const port = Number(new URL(browser.wsEndpoint()).port);
				// Lighthouse 12 removed built-in budgets and 13 did not restore them.
				const result = await lighthouse(
					`${url}${route}`,
					{
						port,
						output: "json",
						onlyCategories: ["performance"],
						logLevel: "error",
					},
					undefined,
					page
				);
				if (!result || result.lhr.runtimeError) {
					throw new Error(result?.lhr.runtimeError?.message || "Lighthouse returned no result");
				}
				const { lhr } = result;
				const { timings, resources, failures } = assessBudget(lhr, budgets[0]);
				await checkRuntime(page, runtime, failures);
				mkdirSync(destination, { recursive: true });
				const outputStem = `${destination}/${reportStem}${process.argv.includes("--baseline") ? "-baseline" : ""}`;
				writeEvidenceJson(`${outputStem}.json`, {
					checkedAt: new Date().toISOString(),
					route,
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
					analytics: runtime
						? {
								...runtime.provenance,
								scriptRequests: runtime.requests.scripts,
								telemetryRequests: runtime.requests.telemetry.length,
								blockedOrigins: runtime.requests.blocked,
							}
						: { mode: "unmodified-local-server" },
					score: lhr.categories.performance.score,
					lighthouseVersion: lhr.lighthouseVersion,
					environment: lhr.environment,
					runWarnings: lhr.runWarnings,
					profile: {
						formFactor: lhr.configSettings.formFactor,
						screenEmulation: lhr.configSettings.screenEmulation,
						throttlingMethod: lhr.configSettings.throttlingMethod,
						throttling: lhr.configSettings.throttling,
					},
					diagnostics: Object.fromEntries(
						[
							// Keep observed paint beside the simulated budget timings: the
							// request graph can change without an equally large paint change.
							"metrics",
							"network-requests",
							"bootup-time",
							"mainthread-work-breakdown",
							// Lighthouse 13 removed largest-contentful-paint-element.
							// lcp-breakdown-insight is the audit that still names the element.
							"lcp-breakdown-insight",
						].map((name) => [name, lhr.audits[name]?.details])
					),
					timings,
					resources,
					failures,
				});
				if (process.argv.includes("--save-assets")) {
					// Lighthouse's Node API ignores its CLI saveAssets flag. Reuse its
					// exporter, including the simulator's own optimistic/pessimistic traces.
					const { saveAssets } = await import("lighthouse/core/lib/asset-saver.js");
					const previousDebug = process.env.LANTERN_DEBUG;
					try {
						process.env.LANTERN_DEBUG = "1";
						await saveAssets(result.artifacts, lhr.audits, outputStem);
					} finally {
						if (previousDebug === undefined) {
							delete process.env.LANTERN_DEBUG;
						} else {
							process.env.LANTERN_DEBUG = previousDebug;
						}
					}
				}
				console.log(JSON.stringify({ timings, resources, failures }, null, 2));
				if (failures.length) {
					throw new Error("Performance budget exceeded");
				}
			};
			if (runtimeFixture) {
				await withAnalyticsRuntime(browser, url, runtimeFixture, audit);
			} else {
				await audit();
			}
		} finally {
			await closeBrowser(browser, { diagnostic: console.log });
		}
	},
	{ env: { SCREENSHOTONE_ACCESS_KEY: "" } }
);
