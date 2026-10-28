import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const runner = new URL("../scripts/perf-budget.mjs", import.meta.url).href;
const metrics = {
	firstContentfulPaint: 1200,
	largestContentfulPaint: 2400,
	observedFirstContentfulPaint: 200,
	observedLargestContentfulPaint: 250,
};

// Exercise the CLI and its saved report, replacing only the browser, server and
// evidence formatter boundaries. No inherited provider key reaches a real server.
async function runBudget(context, lcp) {
	await mkdir(join(root, ".next"), { recursive: true });
	const directory = await mkdtemp(join(root, ".next", "perf-budget-"));
	context.after(() => rm(directory, { recursive: true, force: true }));
	const output = join(directory, "evidence");
	const closed = join(directory, "browser-closed");
	const lhr = {
		categories: { performance: { score: 0.9 } },
		configSettings: { throttlingMethod: "simulate" },
		environment: { benchmarkIndex: 2000 },
		lighthouseVersion: "synthetic",
		runWarnings: [],
		audits: {
			"largest-contentful-paint": { numericValue: lcp },
			metrics: { details: { items: [metrics] } },
			"resource-summary": {
				details: {
					items: [{ resourceType: "total", transferSize: 512, requestCount: 1 }],
				},
			},
		},
	};
	const modules = {
		lighthouse: `export default async () => ({ lhr: ${JSON.stringify(lhr)} });`,
		"./production-session.mjs": `
import assert from "node:assert/strict";
export async function withProductionServer(verify, options) {
  assert.equal(options?.env?.SCREENSHOTONE_ACCESS_KEY, "", "Budget runs must disable captures explicitly");
  return await verify("http://127.0.0.1:12345");
}`,
		"./audit-browser.mjs": `
import { writeFileSync } from "node:fs";
export async function launchAuditBrowser() {
  return {
    wsEndpoint: () => "ws://127.0.0.1:12346/fixture",
    version: async () => "synthetic Chrome",
    process: () => null,
    close: async () => writeFileSync(${JSON.stringify(closed)}, "closed"),
  };
}`,
		"./evidence-json.mjs": `
import { writeFileSync } from "node:fs";
export const writeEvidenceJson = (path, value) => writeFileSync(path, JSON.stringify(value));`,
	};
	const preload = `
import { registerHooks } from "node:module";
const modules = ${JSON.stringify(modules)};
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL === ${JSON.stringify(runner)} && Object.hasOwn(modules, specifier)) {
      return { url: "data:text/javascript," + encodeURIComponent(modules[specifier]), shortCircuit: true };
    }
    return nextResolve(specifier, context);
  }
});`;
	// Git can discover the real checkout from this child directory. The build ID
	// and limits are fixture-owned; this never changes the production build.
	const budget = {
		timings: [{ metric: "largest-contentful-paint", budget: 3000 }],
		resourceSizes: [],
		resourceCounts: [],
	};
	await mkdir(join(directory, ".next"));
	await writeFile(join(directory, ".next", "BUILD_ID"), "synthetic-build");
	await writeFile(join(directory, "lighthouse-budget.json"), JSON.stringify([budget]));
	const result = spawnSync(
		process.execPath,
		[
			"--import",
			`data:text/javascript,${encodeURIComponent(preload)}`,
			fileURLToPath(runner),
			"--route=/projects/thorbis",
		],
		{
			cwd: directory,
			env: {
				...process.env,
				SCREENSHOTONE_ACCESS_KEY: "synthetic-inherited-key",
				THORBIS_EVIDENCE_DIR: output,
			},
			encoding: "utf8",
			timeout: 15_000,
			windowsHide: true,
		}
	);
	assert.equal(result.error, undefined);
	return {
		result,
		closed,
		report: join(output, "route-budget_projects_thorbis.json"),
	};
}

test("budget reports retain observed paint diagnostics without using them to pass simulated limits", async (context) => {
	const { result, closed, report } = await runBudget(context, 2400);
	assert.equal(result.status, 0, result.stderr);
	const saved = JSON.parse(await readFile(report, "utf8"));
	assert.deepEqual(saved.diagnostics.metrics.items, [metrics]);
	assert.equal(saved.timings[0].value, 2400);
	assert.deepEqual(saved.failures, []);
	assert.equal(saved.route, "/projects/thorbis");
	assert.equal(saved.buildId, "synthetic-build");
	assert.equal(await readFile(closed, "utf8"), "closed");
});

test("a simulated budget miss still saves diagnostics, fails and closes its browser", async (context) => {
	const { result, closed, report } = await runBudget(context, 3100);
	assert.equal(result.status, 1, result.stderr);
	const saved = JSON.parse(await readFile(report, "utf8"));
	assert.deepEqual(saved.diagnostics.metrics.items, [metrics]);
	assert.deepEqual(saved.failures, ["largest-contentful-paint: 3100 > 3000"]);
	assert.equal(await readFile(closed, "utf8"), "closed");
});
