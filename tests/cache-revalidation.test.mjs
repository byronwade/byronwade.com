import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { beforeEach, test } from "node:test";
import { invalidations } from "./fixtures/next-cache.mjs";

// Exercise the route with real requests/responses, without mutating a live cache.
registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier === "next/cache") {
			return nextResolve(new URL("./fixtures/next-cache.mjs", import.meta.url).href, context);
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

const { GET, POST } = await import("../app/api/cache/revalidate/route.ts");
const { CACHE_TAGS } = await import("@/lib/cache");
const fixtureSecret = "cache-revalidation-test-only";

function request(body) {
	return new Request("http://localhost/api/cache/revalidate", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
}

beforeEach(() => {
	process.env.REVALIDATION_SECRET = fixtureSecret;
	invalidations.reset();
});

test("an omitted secret cannot authorize refresh when the server secret is unset", async () => {
	delete process.env.REVALIDATION_SECRET;
	const response = await POST(request({ tag: CACHE_TAGS.PORTFOLIO }));
	assert.equal(response.status, 401);
	assert.deepEqual(await response.json(), { error: "Invalid secret" });
	assert.deepEqual(invalidations.requests, []);
});

for (const secret of ["", " \t "]) {
	test(`blank server configuration cannot authorize refresh (${JSON.stringify(secret)})`, async () => {
		process.env.REVALIDATION_SECRET = secret;
		const response = await POST(request({ tag: CACHE_TAGS.GITHUB, secret }));
		assert.equal(response.status, 401);
		assert.deepEqual(invalidations.requests, []);
	});
}

for (const secret of [undefined, null, "", "wrong", 123, [], {}, ` ${fixtureSecret}`]) {
	test(`rejects a nonmatching secret (${JSON.stringify(secret)})`, async () => {
		const response = await POST(request({ tag: CACHE_TAGS.GITHUB, secret }));
		assert.equal(response.status, 401);
		assert.deepEqual(await response.json(), { error: "Invalid secret" });
		assert.deepEqual(invalidations.requests, []);
	});
}

for (const body of [null, [], "text", 123, true]) {
	test(`rejects a non-object JSON body (${JSON.stringify(body)})`, async () => {
		const response = await POST(request(body));
		assert.equal(response.status, 400);
		assert.deepEqual(await response.json(), { error: "Invalid request body" });
		assert.deepEqual(invalidations.requests, []);
	});
}

test("malformed JSON is a client error without logging submitted credentials", async (t) => {
	const log = t.mock.method(console, "error", () => undefined);
	const response = await POST(
		new Request("http://localhost/api/cache/revalidate", {
			method: "POST",
			body: `{"secret":"${fixtureSecret}",`,
		})
	);
	assert.equal(response.status, 400);
	assert.deepEqual(await response.json(), { error: "Invalid request body" });
	assert.deepEqual(invalidations.requests, []);
	assert.equal(log.mock.callCount(), 0);
});

for (const tag of [undefined, null, "", "unknown", "GITHUB", 123, [], {}]) {
	test(`rejects a noncanonical tag (${JSON.stringify(tag)})`, async () => {
		const response = await POST(request({ tag, secret: fixtureSecret }));
		assert.equal(response.status, 400);
		assert.deepEqual(await response.json(), {
			error: "Invalid tag",
			validTags: Object.values(CACHE_TAGS),
		});
		assert.deepEqual(invalidations.requests, []);
	});
}

for (const tag of Object.values(CACHE_TAGS)) {
	test(`authorized refresh preserves the ${tag} success contract`, async () => {
		const response = await POST(request({ tag, secret: fixtureSecret }));
		assert.equal(response.status, 200);
		const body = await response.json();
		assert.deepEqual(Object.keys(body).sort(), ["message", "success", "timestamp"]);
		assert.equal(body.success, true);
		assert.equal(body.message, `Cache revalidated for tag: ${tag}`);
		assert.equal(new Date(body.timestamp).toISOString(), body.timestamp);
		assert.deepEqual(invalidations.requests, [{ tag, profile: { expire: 0 } }]);
	});
}

test("runtime cache errors return the existing generic failure", async (t) => {
	const log = t.mock.method(console, "error", () => undefined);
	invalidations.error = new Error(`Fixture cache failure containing ${fixtureSecret}`);
	const response = await POST(request({ tag: CACHE_TAGS.GITHUB, secret: fixtureSecret }));
	assert.equal(response.status, 500);
	assert.deepEqual(await response.json(), { error: "Failed to revalidate cache" });
	assert.deepEqual(invalidations.requests, []);
	assert.equal(log.mock.callCount(), 1);
	assert.ok(
		!log.mock.calls
			.flatMap((call) => call.arguments)
			.join(" ")
			.includes(fixtureSecret)
	);
});

test("GET lists canonical tags without exposing the configured secret or invalidating", async () => {
	const response = GET();
	assert.equal(response.status, 200);
	const body = await response.json();
	assert.deepEqual(body.availableTags, Object.values(CACHE_TAGS));
	assert.equal(body.usage.endpoint, "/api/cache/revalidate");
	assert.equal(body.usage.method, "POST");
	assert.ok(!JSON.stringify(body).includes(fixtureSecret));
	assert.deepEqual(invalidations.requests, []);
});
