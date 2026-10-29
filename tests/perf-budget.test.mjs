import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
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
async function runBudget(
	context,
	lcp,
	{
		saveAssets = false,
		assetFailure = false,
		debugValue,
		runtime = false,
		inactive = false,
		blocked = false,
		invalidRuntime = false,
		emptyRuntime = false,
	} = {}
) {
	await mkdir(join(root, ".next"), { recursive: true });
	const directory = await mkdtemp(join(root, ".next", "perf-budget-"));
	context.after(() => rm(directory, { recursive: true, force: true }));
	const output = join(directory, "evidence");
	const closed = join(directory, "browser-closed");
	const assets = join(directory, "saved-assets.json");
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
		lighthouse: `
import assert from "node:assert/strict";
export default async function (_url, flags, _config, page) {
  assert.equal(Boolean(page), ${runtime}, "Replay must pass the intercepted page to Lighthouse");
  assert.equal(flags.onlyCategories[0], "performance");
  return { lhr: ${JSON.stringify(lhr)}, artifacts: { fixture: "captured artifacts" } };
}`,
		"./analytics-runtime.mjs": `
import assert from "node:assert/strict";
export async function loadAnalyticsRuntime(directory) {
  if (${invalidRuntime}) throw new Error("Invalid pinned runtime");
  assert.equal(directory, "pinned runtime");
  return { fixture: true };
}
export async function withAnalyticsRuntime(_browser, origin, fixture, verify) {
  assert.equal(origin, "http://127.0.0.1:12345");
  assert.equal(fixture.fixture, true);
  return await verify({ evaluate: async () => ${!inactive} }, {
    assertComplete() {},
    provenance: { mode: "pinned-runtime-replay", scripts: [{ sha256: "synthetic-pinned-hash" }] },
    requests: { scripts: ["/_vercel/insights/script.js", "/_vercel/speed-insights/script.js"], telemetry: [], blocked: ${JSON.stringify(blocked ? ["https://blocked.invalid"] : [])} }
  });
}`,
		"lighthouse/core/lib/asset-saver.js": `
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
export async function saveAssets(artifacts, audits, stem) {
  assert.equal(process.env.LANTERN_DEBUG, "1", "Simulated traces must be included");
  await writeFile(${JSON.stringify(assets)}, JSON.stringify({ artifacts, audits, stem }));
  if (${assetFailure}) throw new Error("Synthetic asset write failure");
}`,
		"./production-session.mjs": `
import assert from "node:assert/strict";
export async function withProductionServer(verify, options) {
  assert.equal(${invalidRuntime || emptyRuntime}, false, "Invalid replay input must fail before starting a server");
  assert.equal(options?.env?.SCREENSHOTONE_ACCESS_KEY, "", "Budget runs must disable captures explicitly");
  return await verify("http://127.0.0.1:12345");
}`,
		"./audit-browser.mjs": `
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
export async function launchAuditBrowser() {
  return {
    wsEndpoint: () => "ws://127.0.0.1:12346/fixture",
    version: async () => "synthetic Chrome",
    process: () => null,
    close: async () => {
      assert.equal(process.env.LANTERN_DEBUG, ${JSON.stringify(debugValue)}, "Export must restore the environment even on failure");
      writeFileSync(${JSON.stringify(closed)}, "closed");
    },
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
			...(saveAssets ? ["--save-assets"] : []),
			...(runtime ? [`--analytics-runtime=${emptyRuntime ? "" : "pinned runtime"}`] : []),
		],
		{
			cwd: directory,
			env: {
				...process.env,
				SCREENSHOTONE_ACCESS_KEY: "synthetic-inherited-key",
				LANTERN_DEBUG: debugValue,
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
		assets,
		report: join(output, "route-budget_projects_thorbis.json"),
	};
}

test("budget reports retain observed paint diagnostics without using them to pass simulated limits", async (context) => {
	const { result, closed, report, assets } = await runBudget(context, 2400);
	assert.equal(result.status, 0, result.stderr);
	const saved = JSON.parse(await readFile(report, "utf8"));
	assert.deepEqual(saved.diagnostics.metrics.items, [metrics]);
	assert.equal(saved.timings[0].value, 2400);
	assert.deepEqual(saved.failures, []);
	assert.equal(saved.route, "/projects/thorbis");
	assert.equal(saved.buildId, "synthetic-build");
	assert.deepEqual(saved.analytics, { mode: "unmodified-local-server" });
	assert.equal(await readFile(closed, "utf8"), "closed");
	await assert.rejects(readFile(assets), { code: "ENOENT" });
});

test("runtime replay reports pinned provenance and passes the owned page to Lighthouse", async (context) => {
	const { result, closed, report } = await runBudget(context, 2400, { runtime: true });
	assert.equal(result.status, 0, result.stderr);
	const saved = JSON.parse(await readFile(report, "utf8"));
	assert.equal(saved.analytics.mode, "pinned-runtime-replay");
	assert.equal(saved.analytics.scripts[0].sha256, "synthetic-pinned-hash");
	assert.equal(saved.analytics.scriptRequests.length, 2);
	assert.equal(saved.analytics.telemetryRequests, 0);
	assert.deepEqual(saved.analytics.blockedOrigins, []);
	assert.equal(await readFile(closed, "utf8"), "closed");
});

for (const options of [{ invalidRuntime: true }, { emptyRuntime: true }]) {
	test(`invalid replay inputs fail before launching a server: ${JSON.stringify(options)}`, async (context) => {
		const { result, closed } = await runBudget(context, 2400, { runtime: true, ...options });
		assert.equal(result.status, 1);
		assert.ok(
			result.stderr.includes(
				options.emptyRuntime
					? "--analytics-runtime requires a pinned snapshot directory"
					: "Invalid pinned runtime"
			),
			result.stderr
		);
		await assert.rejects(readFile(closed), { code: "ENOENT" });
	});
}

for (const options of [{ inactive: true }, { blocked: true }]) {
	test(`runtime replay fails and retains its report when ${JSON.stringify(options)}`, async (context) => {
		const { result, closed, report } = await runBudget(context, 2400, {
			runtime: true,
			...options,
		});
		assert.equal(result.status, 1, result.stderr);
		assert.equal(JSON.parse(await readFile(report, "utf8")).failures.length, 1);
		assert.equal(await readFile(closed, "utf8"), "closed");
	});
}

for (const lcp of [2400, 3100]) {
	test(`opt-in trace export retains actual artifacts and simulated traces at LCP ${lcp}`, async (context) => {
		const { result, closed, report, assets } = await runBudget(context, lcp, {
			saveAssets: true,
			debugValue: lcp > 3000 ? "inherited-debug-value" : undefined,
		});
		assert.equal(result.status, lcp > 3000 ? 1 : 0, result.stderr);
		const saved = JSON.parse(await readFile(assets, "utf8"));
		assert.deepEqual(saved.artifacts, { fixture: "captured artifacts" });
		assert.equal(saved.audits["largest-contentful-paint"].numericValue, lcp);
		assert.equal(resolve(saved.stem), report.slice(0, -5));
		assert.equal(JSON.parse(await readFile(report, "utf8")).timings[0].value, lcp);
		assert.equal(await readFile(closed, "utf8"), "closed");
	});
}

test("trace export failure retains the budget report and closes its browser", async (context) => {
	const { result, closed, report } = await runBudget(context, 2400, {
		saveAssets: true,
		assetFailure: true,
		debugValue: "inherited-debug-value",
	});
	assert.equal(result.status, 1, result.stderr);
	assert.ok(result.stderr.includes("Synthetic asset write failure"));
	assert.equal(JSON.parse(await readFile(report, "utf8")).timings[0].value, 2400);
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
