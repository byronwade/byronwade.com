import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SOURCE = "https://www.byronwade.com";
const SCRIPTS = [
	{ path: "/_vercel/insights/script.js", file: "analytics.js" },
	{ path: "/_vercel/speed-insights/script.js", file: "speed-insights.js" },
];
const MAX_SCRIPT_BYTES = 128 * 1024;
const hash = (body) => createHash("sha256").update(body).digest("hex");

/** Snapshot only the two public scripts; no telemetry, credentials or redirects. */
export async function captureAnalyticsRuntime(directory) {
	const scripts = await Promise.all(
		SCRIPTS.map(async (script) => {
			const url = `${SOURCE}${script.path}`;
			const response = await fetch(url, {
				redirect: "error",
				signal: AbortSignal.timeout(15_000),
			});
			const contentType = response.headers.get("content-type") || "";
			if (!(response.ok && contentType.includes("javascript"))) {
				throw new Error(`Analytics script is unavailable: ${script.path} (${response.status})`);
			}
			const body = Buffer.from(await response.arrayBuffer());
			if (!body.length || body.length > MAX_SCRIPT_BYTES) {
				throw new Error(`Invalid analytics script size: ${script.path}`);
			}
			return { ...script, url, contentType, bytes: body.length, sha256: hash(body), body };
		})
	);
	// A new directory prevents accidentally replacing a pinned measurement input.
	await mkdir(directory);
	await Promise.all(
		scripts.map((script) => writeFile(resolve(directory, script.file), script.body))
	);
	const manifest = {
		version: 1,
		capturedAt: new Date().toISOString(),
		scripts: scripts.map(({ body, ...script }) => script),
	};
	await writeFile(resolve(directory, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
	return manifest;
}

/** Refuse changed or incomplete snapshots before launching a browser. */
export async function loadAnalyticsRuntime(directory) {
	const manifest = JSON.parse(await readFile(resolve(directory, "manifest.json"), "utf8"));
	if (
		manifest.version !== 1 ||
		!Number.isFinite(Date.parse(manifest.capturedAt)) ||
		!Array.isArray(manifest.scripts) ||
		manifest.scripts.length !== SCRIPTS.length
	) {
		throw new Error("Invalid analytics runtime manifest");
	}
	const scripts = await Promise.all(
		SCRIPTS.map(async (expected) => {
			const entry = manifest.scripts.find((script) => script.path === expected.path);
			const body = await readFile(resolve(directory, expected.file));
			if (
				!entry ||
				entry.file !== expected.file ||
				entry.url !== `${SOURCE}${expected.path}` ||
				typeof entry.contentType !== "string" ||
				!entry.contentType.includes("javascript") ||
				!body.length ||
				body.length > MAX_SCRIPT_BYTES ||
				entry.bytes !== body.length ||
				entry.sha256 !== hash(body)
			) {
				throw new Error(`Analytics runtime integrity failure: ${expected.path}`);
			}
			return { ...entry, body };
		})
	);
	return { manifest, scripts };
}

/** Own one intercepted page: real script bytes, local sinks, no off-origin HTTP. */
export async function withAnalyticsRuntime(browser, origin, fixture, verify) {
	const local = new URL(origin);
	if (local.protocol !== "http:" || local.hostname !== "127.0.0.1") {
		throw new Error("Analytics replay requires an allocated loopback origin");
	}
	const page = await browser.newPage();
	const requests = { scripts: [], telemetry: [], blocked: [] };
	const pending = new Set();
	const errors = [];
	const respond = async (request) => {
		const url = new URL(request.url());
		if (!["http:", "https:"].includes(url.protocol)) {
			await request.continue();
		} else if (url.origin !== origin) {
			requests.blocked.push(url.origin);
			await request.abort("blockedbyclient");
		} else if (url.pathname.startsWith("/_vercel/")) {
			const script = fixture.scripts.find((item) => item.path === url.pathname);
			if (script && request.method() === "GET") {
				requests.scripts.push(script.path);
				await request.respond({ status: 200, contentType: script.contentType, body: script.body });
			} else {
				requests.telemetry.push({ path: url.pathname, body: await request.fetchPostData() });
				await request.respond({ status: 204 });
			}
		} else {
			await request.continue();
		}
	};
	const onRequest = (request) => {
		const task = respond(request).catch((error) => errors.push(error));
		pending.add(task);
		task.then(() => pending.delete(task));
	};
	let outcome;
	try {
		page.setDefaultTimeout(15_000);
		page.setDefaultNavigationTimeout(30_000);
		// The served runtimes deliberately ignore automation. Activate them only in
		// this isolated page, preserving the scripts and disclosing the lab policy.
		await page.setUserAgent((await browser.userAgent()).replaceAll("HeadlessChrome", "Chrome"));
		await page.evaluateOnNewDocument(() => {
			Object.defineProperty(navigator, "webdriver", { get: () => false });
		});
		await page.setRequestInterception(true);
		page.on("request", onRequest);
		outcome = {
			value: await verify(page, {
				requests,
				provenance: {
					mode: "pinned-runtime-replay",
					automationSignals: "webdriver=false; HeadlessChrome removed from user agent",
					transport: "browser interception; off-origin HTTP blocked; telemetry answered locally",
					...fixture.manifest,
				},
				assertComplete() {
					if (SCRIPTS.some((script) => !requests.scripts.includes(script.path))) {
						throw new Error("Both analytics runtime scripts must be replayed");
					}
					if (errors.length) {
						throw new AggregateError(errors, "Analytics replay interception failed");
					}
				},
			}),
		};
	} catch (error) {
		errors.push(error);
	}
	// Keep interception active through pagehide so closing never sends telemetry.
	try {
		await page.close();
	} catch (error) {
		errors.push(error);
	}
	await Promise.all(pending);
	page.off("request", onRequest);
	if (errors.length) {
		throw new AggregateError(errors, "Analytics replay failed");
	}
	return outcome.value;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	if (process.argv[2] !== "capture" || !process.argv[3] || process.argv.length !== 4) {
		throw new Error("Usage: node scripts/analytics-runtime.mjs capture <new-local-directory>");
	}
	console.log(JSON.stringify(await captureAnalyticsRuntime(process.argv[3]), null, 2));
}
