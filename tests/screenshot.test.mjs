import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { beforeEach, test } from "node:test";

// Exercise both routes with real requests and a stubbed provider. The key is synthetic.
registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier === "server-only") {
			return nextResolve(new URL("./fixtures/server-only.mjs", import.meta.url).href, context);
		}
		if (specifier === "next/server") {
			return nextResolve("next/server.js", context);
		}
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
});

const { GET: resolveRoute } = await import("../app/api/screenshot/route.ts");
const { GET: imageRoute } = await import("../app/api/screenshot/image/route.ts");
const { getProjects } = await import("@/lib/projects");
const { SCREENSHOT_VIEWPORTS } = await import("@/lib/screenshot-viewports");

const KEY = "screenshot-test-only-key";
const IMAGE_BYTES = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);
const projectUrl = (await getProjects()).find((project) => project.url?.startsWith("https://")).url;
const canonical = new URL(projectUrl).href;
const { width, height } = SCREENSHOT_VIEWPORTS.tablet;
const CDN_CACHED = /\bs-maxage=\d+/;

function query(params) {
	return new URLSearchParams({
		url: projectUrl,
		width: String(width),
		height: String(height),
		...params,
	});
}

function get(route, path, params) {
	return route(new Request(`http://localhost${path}?${query(params)}`));
}

/** Replace the provider and record every outbound request and console line. */
function stubProvider(
	t,
	respond = () => new Response(IMAGE_BYTES, { headers: { "content-type": "image/jpeg" } })
) {
	const calls = [];
	t.mock.method(globalThis, "fetch", (input, init) => {
		calls.push({ url: new URL(String(input)), headers: new Headers(init?.headers) });
		return Promise.try(respond);
	});
	const logs = [];
	for (const level of ["error", "warn", "log", "info"]) {
		t.mock.method(console, level, (...args) => logs.push(args.map(String).join(" ")));
	}
	return { calls, logs };
}

function assertNoKey(label, ...values) {
	for (const value of values) {
		assert.ok(!String(value).includes(KEY), `${label} exposed the provider key`);
	}
}

function headerText(response) {
	return [...response.headers].map(([name, value]) => `${name}: ${value}`).join("\n");
}

beforeEach(() => {
	process.env.SCREENSHOTONE_ACCESS_KEY = KEY;
});

test("resolving a preview returns a same-origin image URL without the key", async (t) => {
	const { calls, logs } = stubProvider(t);
	const response = await get(resolveRoute, "/api/screenshot");
	const text = await response.text();
	assert.equal(response.status, 200);
	assertNoKey("resolve response", text, headerText(response), ...logs);
	const body = JSON.parse(text);
	assert.equal(body.mode, "static");
	const imageUrl = new URL(body.url, "http://localhost");
	assert.equal(imageUrl.origin, "http://localhost");
	assert.equal(imageUrl.pathname, "/api/screenshot/image");
	assert.equal(imageUrl.searchParams.get("url"), canonical);
	assert.equal(calls.length, 0, "resolving must not spend a provider render");
});

test("the resolved image URL streams the capture with the key only in the provider header", async (t) => {
	const { calls, logs } = stubProvider(t);
	const resolved = await (await get(resolveRoute, "/api/screenshot")).json();
	const response = await imageRoute(new Request(new URL(resolved.url, "http://localhost")));

	assert.equal(response.status, 200);
	assert.equal(response.headers.get("content-type"), "image/jpeg");
	assert.match(response.headers.get("cache-control"), CDN_CACHED);
	assert.deepEqual(new Uint8Array(await response.arrayBuffer()), IMAGE_BYTES);
	assertNoKey("image response", headerText(response), ...logs);

	assert.equal(calls.length, 1);
	const [{ url, headers }] = calls;
	assert.equal(url.origin + url.pathname, "https://api.screenshotone.com/take");
	assert.equal(headers.get("x-access-key"), KEY);
	assertNoKey("provider URL", url.href);
	assert.equal(url.searchParams.get("url"), canonical);
	assert.equal(url.searchParams.get("viewport_width"), String(width));
	assert.equal(url.searchParams.get("viewport_height"), String(height));
	assert.equal(url.searchParams.get("cache"), "true");
});

const rejected = [
	["a missing URL", { url: "" }, 400],
	["a malformed URL", { url: "not a url" }, 400],
	["an unpublished host", { url: "https://example.com/" }, 403],
	["another path on a published host", { url: new URL("/other-page", projectUrl).href }, 403],
	["embedded credentials", { url: projectUrl.replace("https://", "https://user:pass@") }, 403],
	["a fragment", { url: `${canonical}#top` }, 403],
	["plain HTTP", { url: projectUrl.replace("https://", "http://") }, 403],
	["an unoffered size", { width: "1921" }, 400],
	["a non-numeric size", { height: "tall" }, 400],
	["the retired scroll mode", { mode: "scroll" }, 400],
];

for (const [label, params, status] of rejected) {
	for (const [name, route, path] of [
		["resolve", resolveRoute, "/api/screenshot"],
		["image", imageRoute, "/api/screenshot/image"],
	]) {
		test(`${name} route rejects ${label} before spending a render`, async (t) => {
			const { calls } = stubProvider(t);
			const response = await get(route, path, params);
			assert.equal(response.status, status);
			assertNoKey(`${name} rejection`, await response.text());
			assert.equal(calls.length, 0);
		});
	}
}

for (const value of [undefined, "", "  "]) {
	test(`missing configuration fails generically on both routes (${JSON.stringify(value)})`, async (t) => {
		const { calls } = stubProvider(t);
		if (value === undefined) {
			delete process.env.SCREENSHOTONE_ACCESS_KEY;
		} else {
			process.env.SCREENSHOTONE_ACCESS_KEY = value;
		}
		const responses = await Promise.all([
			get(resolveRoute, "/api/screenshot"),
			get(imageRoute, "/api/screenshot/image"),
		]);
		const bodies = await Promise.all(responses.map((response) => response.json()));
		assert.deepEqual(
			responses.map((response) => response.status),
			[500, 500]
		);
		assert.deepEqual(bodies, [
			{ error: "Screenshots are not configured" },
			{ error: "Screenshots are not configured" },
		]);
		assert.equal(calls.length, 0);
	});
}

const providerFailures = [
	[
		"a provider error echoing the request",
		() =>
			new Response(`{"error":"bad key ${KEY}"}`, {
				status: 401,
				headers: { "content-type": "application/json" },
			}),
	],
	[
		"a non-image success",
		() => new Response("<html></html>", { headers: { "content-type": "text/html" } }),
	],
	[
		"a request error mentioning the key",
		() => {
			throw new Error(`timeout calling provider with ${KEY}`);
		},
	],
];

for (const [label, respond] of providerFailures) {
	test(`image route turns ${label} into an uncached generic 502`, async (t) => {
		const { calls, logs } = stubProvider(t, respond);
		const response = await get(imageRoute, "/api/screenshot/image");
		const text = await response.text();
		assert.equal(response.status, 502);
		assert.equal(response.headers.get("cache-control"), "no-store");
		assert.deepEqual(JSON.parse(text), { error: "Failed to capture screenshot" });
		assertNoKey("provider failure", text, headerText(response), ...logs);
		assert.equal(calls.length, 1);
	});
}

test("every offered preview size is accepted", async (t) => {
	stubProvider(t);
	const sizes = Object.values(SCREENSHOT_VIEWPORTS);
	const responses = await Promise.all(
		sizes.map((size) =>
			get(resolveRoute, "/api/screenshot", {
				width: String(size.width),
				height: String(size.height),
			})
		)
	);
	assert.deepEqual(
		responses.map((response) => response.status),
		sizes.map(() => 200)
	);
});
