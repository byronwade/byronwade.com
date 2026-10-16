import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { afterEach, beforeEach, mock, test } from "node:test";

registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
});

const { createTestCheckout, isTestCheckoutEnabled } = await import("@/lib/shop/checkout");
const { shopProducts } = await import("@/lib/shop/products");
const originalKey = process.env.STRIPE_SECRET_KEY;
const session = {
	id: "cs_test_fixture",
	livemode: false,
	url: "https://checkout.stripe.com/c/pay/cs_test_fixture",
};
let transport;

beforeEach(() => {
	// Deliberately invalid fixture credential; no real provider request is possible.
	process.env.STRIPE_SECRET_KEY = "sk_test_fixture_not_a_credential";
	transport = mock.method(globalThis, "fetch", () => Promise.resolve(Response.json(session)));
});

afterEach(() => {
	mock.restoreAll();
	if (originalKey === undefined) {
		delete process.env.STRIPE_SECRET_KEY;
	} else {
		process.env.STRIPE_SECRET_KEY = originalKey;
	}
});

for (const key of [
	undefined,
	"",
	"sk_live_fixture",
	"rk_test_fixture",
	"sk_test_",
	" sk_test_fixture",
]) {
	test(`fails closed for ${key === undefined ? "missing" : key || "empty"} key before any network request`, async () => {
		if (key === undefined) {
			delete process.env.STRIPE_SECRET_KEY;
		} else {
			process.env.STRIPE_SECRET_KEY = key;
		}
		assert.equal(isTestCheckoutEnabled(), false);
		const result = await createTestCheckout("field-notes", "http://localhost:3000", "fixture");
		assert.equal(result.ok, false);
		assert.ok(result.error.includes("Shop coming soon"));
		assert.equal(transport.mock.callCount(), 0);
	});
}

test("only known product IDs reach Stripe", async () => {
	const results = await Promise.all(
		[null, {}, ["field-notes"], "unknown", "__proto__", 1200].map((input) =>
			createTestCheckout(input, "http://localhost:3000", "fixture")
		)
	);
	assert.ok(results.every((result) => !result.ok));
	assert.equal(transport.mock.callCount(), 0);
});

for (const product of shopProducts) {
	test(`${product.id} uses server-owned price_data, test labels and same-origin return routes`, async () => {
		assert.equal(shopProducts.length, 3);
		assert.equal(isTestCheckoutEnabled(), true);
		const result = await createTestCheckout(product.id, "http://localhost:3000", "fixture");
		assert.deepEqual(result, { ok: true, url: session.url });
		const [url, options] = transport.mock.calls.at(-1).arguments;
		assert.equal(url, "https://api.stripe.com/v1/checkout/sessions");
		assert.equal(options.method, "POST");
		assert.equal(options.cache, "no-store");
		assert.ok(options.signal instanceof AbortSignal);
		assert.equal(options.headers["Idempotency-Key"], `shop-${product.id}-fixture`);
		const body = options.body;
		assert.equal(body.get("mode"), "payment");
		assert.equal(body.get("line_items[0][quantity]"), "1");
		assert.equal(body.get("line_items[0][price_data][unit_amount]"), String(product.unitAmount));
		assert.equal(body.get("line_items[0][price_data][currency]"), "usd");
		assert.ok(
			body.get("line_items[0][price_data][product_data][name]").includes(product.placeholderLabel)
		);
		assert.equal(body.get("line_items[0][price]"), null);
		assert.equal(body.get("success_url"), "http://localhost:3000/shop/success");
		assert.equal(body.get("cancel_url"), "http://localhost:3000/shop/cancel");
	});
}

test("repeat submission preserves the idempotency key", async () => {
	await createTestCheckout("field-notes", "http://localhost:3000", "same-request");
	await createTestCheckout("field-notes", "http://localhost:3000", "same-request");
	assert.equal(
		transport.mock.calls[0].arguments[1].headers["Idempotency-Key"],
		transport.mock.calls[1].arguments[1].headers["Idempotency-Key"]
	);
});

for (const invalid of [
	null,
	{},
	{ ...session, livemode: true },
	{ ...session, id: "cs_live_fixture" },
	{ ...session, url: "https://example.com" },
	{ ...session, url: "https://checkout.stripe.com.example.com" },
	{ ...session, url: "https://user@checkout.stripe.com/c/pay/cs_test_fixture" },
	{ ...session, url: "not-a-url" },
]) {
	test(`rejects untrusted checkout response ${JSON.stringify(invalid)}`, async () => {
		transport.mock.mockImplementation(() => Promise.resolve(Response.json(invalid)));
		assert.equal(
			(await createTestCheckout("field-notes", "http://localhost:3000", "fixture")).ok,
			false
		);
	});
}

test("provider failures never expose credentials or provider details", async () => {
	transport.mock.mockImplementation(() =>
		Promise.resolve(new Response("private provider detail", { status: 401 }))
	);
	const result = await createTestCheckout("field-notes", "http://localhost:3000", "fixture");
	assert.equal(result.ok, false);
	assert.equal(result.error.includes("sk_test_"), false);
	assert.equal(result.error.includes("private provider detail"), false);
});

for (const [label, response] of [
	["network timeout", () => Promise.reject(new Error("private failure"))],
	["invalid JSON", () => Promise.resolve(new Response("invalid JSON"))],
]) {
	test(`${label} produces a recoverable message`, async () => {
		transport.mock.mockImplementation(response);
		const result = await createTestCheckout("field-notes", "http://localhost:3000", "fixture");
		assert.equal(result.ok, false);
		assert.ok(result.error.includes("try again"));
	});
}
