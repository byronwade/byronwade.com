import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";
import { setImmediate } from "node:timers/promises";
import {
	captureAnalyticsRuntime,
	loadAnalyticsRuntime,
	withAnalyticsRuntime,
} from "../scripts/analytics-runtime.mjs";

async function snapshot(context) {
	await mkdir(".next", { recursive: true });
	const root = await mkdtemp(join(".next", "analytics-runtime-"));
	context.after(() => rm(root, { recursive: true, force: true }));
	const calls = [];
	context.mock.method(globalThis, "fetch", (url, options) => {
		calls.push({ url, options });
		return Promise.resolve(
			new Response(`window.fixture = ${JSON.stringify(url)};`, {
				headers: { "content-type": "application/javascript; charset=utf-8" },
			})
		);
	});
	const directory = join(root, "capture");
	const manifest = await captureAnalyticsRuntime(directory);
	return { directory, manifest, calls };
}

test("snapshot pins both public script bodies and refuses to overwrite inputs", async (context) => {
	const { directory, manifest, calls } = await snapshot(context);
	assert.equal(calls.length, 2);
	for (const call of calls) {
		assert.equal(new URL(call.url).origin, "https://www.byronwade.com");
		assert.equal(call.options.redirect, "error");
		assert.ok(call.options.signal instanceof AbortSignal);
		assert.equal(call.options.method, undefined, "Capture only makes GET requests");
	}
	const fixture = await loadAnalyticsRuntime(directory);
	assert.deepEqual(fixture.manifest, manifest);
	assert.equal(fixture.scripts.length, 2);
	for (const script of fixture.scripts) {
		assert.equal(script.body.length, script.bytes);
		assert.equal(script.sha256.length, 64);
	}
	await assert.rejects(captureAnalyticsRuntime(directory), { code: "EEXIST" });
});

for (const mutation of [
	"body",
	"hash",
	"url",
	"file",
	"bytes",
	"contentType",
	"version",
	"missing",
]) {
	test(`runtime replay refuses a snapshot with changed ${mutation}`, async (context) => {
		const { directory, manifest } = await snapshot(context);
		if (mutation === "body") {
			await writeFile(join(directory, "analytics.js"), "changed bytes");
		} else if (mutation === "version") {
			manifest.version = 2;
		} else if (mutation === "missing") {
			manifest.scripts.pop();
		} else {
			const field = mutation === "hash" ? "sha256" : mutation;
			manifest.scripts[0][field] = mutation === "bytes" ? 1 : "changed";
		}
		await writeFile(join(directory, "manifest.json"), JSON.stringify(manifest));
		await assert.rejects(loadAnalyticsRuntime(directory));
	});
}

for (const [index, response] of [
	new Response("unavailable", { status: 503 }),
	new Response("<html>not JavaScript</html>", { headers: { "content-type": "text/html" } }),
	new Response("", { headers: { "content-type": "application/javascript" } }),
	new Response("x".repeat(128 * 1024 + 1), {
		headers: { "content-type": "application/javascript" },
	}),
].entries()) {
	test(`capture rejects invalid script response ${index}`, async (context) => {
		const { directory } = await snapshot(context);
		context.mock.method(globalThis, "fetch", () => Promise.resolve(response.clone()));
		await assert.rejects(captureAnalyticsRuntime(`${directory}-invalid`));
	});
}

class FixturePage extends EventEmitter {
	setUserAgent(value) {
		this.agent = value;
	}
	evaluateOnNewDocument(callback) {
		this.initializer = callback;
	}
	setRequestInterception(value) {
		this.intercept = value;
	}
	setDefaultTimeout(value) {
		this.timeout = value;
	}
	setDefaultNavigationTimeout(value) {
		this.navigationTimeout = value;
	}
	close() {
		this.closed = true;
	}
	async request(url, method = "GET", body = null) {
		let outcome;
		this.emit("request", {
			url: () => url,
			method: () => method,
			fetchPostData: () => Promise.resolve(body),
			continue: () => {
				outcome = "continued";
			},
			abort: () => {
				outcome = "blocked";
			},
			respond: (response) => {
				outcome = response;
			},
		});
		await setImmediate();
		return outcome;
	}
}

test("isolated replay serves exact scripts, sinks telemetry and blocks other HTTP origins", async (context) => {
	const { directory } = await snapshot(context);
	const fixture = await loadAnalyticsRuntime(directory);
	const page = new FixturePage();
	const browser = { newPage: () => page, userAgent: () => "HeadlessChrome/155" };
	const origin = "http://127.0.0.1:34567";
	await withAnalyticsRuntime(browser, origin, fixture, async (activePage, runtime) => {
		assert.equal(activePage, page);
		assert.equal(page.agent, "Chrome/155");
		assert.equal(page.intercept, true);
		assert.equal(typeof page.initializer, "function");
		assert.throws(() => runtime.assertComplete());
		await Promise.all(
			fixture.scripts.map(async (script) => {
				const response = await page.request(`${origin}${script.path}`);
				assert.equal(response.status, 200);
				assert.deepEqual(response.body, script.body);
			})
		);
		assert.equal(await page.request(`${origin}/_next/static/page.js`), "continued");
		assert.equal(await page.request("data:text/plain,local"), "continued");
		assert.equal(
			await page.request("https://vitals.vercel-insights.com/v2/vitals", "POST"),
			"blocked"
		);
		assert.equal(await page.request("http://127.0.0.1:34568/unowned"), "blocked");
		assert.equal(
			(await page.request(`${origin}/_vercel/insights/view`, "POST", "payload")).status,
			204
		);
		assert.deepEqual(runtime.requests.telemetry, [
			{ path: "/_vercel/insights/view", body: "payload" },
		]);
		assert.equal(runtime.requests.blocked.length, 2);
		assert.equal(runtime.provenance.mode, "pinned-runtime-replay");
		runtime.assertComplete();
	});
	assert.equal(page.closed, true);
	assert.equal(page.listenerCount("request"), 0);
});

test("replay closes its page when verification fails and rejects non-loopback servers", async (context) => {
	const { directory } = await snapshot(context);
	const fixture = await loadAnalyticsRuntime(directory);
	const page = new FixturePage();
	const browser = { newPage: () => page, userAgent: () => "HeadlessChrome/155" };
	await assert.rejects(
		withAnalyticsRuntime(browser, "http://127.0.0.1:34567", fixture, () => {
			throw new Error("Synthetic verification failure");
		}),
		{ message: "Analytics replay failed" }
	);
	assert.equal(page.closed, true);
	await assert.rejects(
		withAnalyticsRuntime(browser, "https://byronwade.com", fixture, () =>
			assert.fail("Must reject before verification")
		)
	);
});

test("replay surfaces failed interception and still closes its page", async (context) => {
	const { directory } = await snapshot(context);
	const fixture = await loadAnalyticsRuntime(directory);
	const page = new FixturePage();
	const browser = { newPage: () => page, userAgent: () => "HeadlessChrome/155" };
	await assert.rejects(
		withAnalyticsRuntime(browser, "http://127.0.0.1:34567", fixture, async () => {
			page.emit("request", {
				url: () => "https://blocked.invalid/",
				abort: () => Promise.reject(new Error("Synthetic interception failure")),
			});
			await setImmediate();
		}),
		(error) =>
			error instanceof AggregateError &&
			error.errors.some((item) => item.message === "Synthetic interception failure")
	);
	assert.equal(page.closed, true);
	assert.equal(page.listenerCount("request"), 0);
});

test("replay preserves verification and page cleanup failures together", async (context) => {
	const { directory } = await snapshot(context);
	const fixture = await loadAnalyticsRuntime(directory);
	const page = new FixturePage();
	page.close = () => {
		throw new Error("Synthetic page cleanup failure");
	};
	const browser = { newPage: () => page, userAgent: () => "HeadlessChrome/155" };
	await assert.rejects(
		withAnalyticsRuntime(browser, "http://127.0.0.1:34567", fixture, () => {
			throw new Error("Synthetic verification failure");
		}),
		(error) => {
			assert.ok(error instanceof AggregateError);
			assert.deepEqual(
				error.errors.map((item) => item.message),
				["Synthetic verification failure", "Synthetic page cleanup failure"]
			);
			return true;
		}
	);
	assert.equal(page.listenerCount("request"), 0);
});
