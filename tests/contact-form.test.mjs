import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { beforeEach, test } from "node:test";
import { delivery } from "./fixtures/resend.mjs";

// Resolve the same aliases as Next.js while replacing the email transport.
registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier === "resend") {
			return nextResolve(new URL("./fixtures/resend.mjs", import.meta.url).href, context);
		}
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
});

const { sendEmail } = await import("@/lib/actions/send-email");
const { CONTACT_TOPICS } = await import("@/lib/contact-form");
const valid = {
	name: "Test Visitor",
	email: "visitor@example.com",
	topic: "conversation",
	message: "I'd like to discuss a project.",
};

beforeEach(() => delivery.reset());

test("blank messages are rejected before contacting the email service", async () => {
	const result = await sendEmail({ ...valid, message: " \n\t " });
	assert.equal(result.success, false);
	assert.equal(delivery.requests.length, 0);
});

test("visitor HTML is delivered as literal plain text", async () => {
	const message = '<a href="https://example.com">This is a message, not a link</a>';
	const result = await sendEmail({ ...valid, message });
	assert.equal(result.success, true);
	assert.equal(delivery.requests.length, 2);
	for (const request of delivery.requests) {
		assert.equal(request.html, undefined);
		assert.ok(request.text.includes(message));
	}
});

test("provider response details stay on the server", async () => {
	const result = await sendEmail(valid);
	assert.deepEqual(result, { success: true });
});

test("a failed owner delivery does not send a confirmation", async () => {
	delivery.results.push({ data: null, error: { message: "Fixture failure" } });
	const result = await sendEmail(valid);
	assert.equal(result.success, false);
	assert.equal(delivery.requests.length, 1);
});

test("confirmation failure does not undo a delivered message", async () => {
	delivery.results.push(
		{ data: { id: "owner-fixture" }, error: null },
		new Error("Fixture failure")
	);
	assert.deepEqual(await sendEmail(valid), { success: true });
});

const invalidSubmissions = [
	["null", null],
	["array", []],
	["string", "invalid"],
	["missing fields", {}],
	["non-string name", { ...valid, name: 123 }],
	["blank name", { ...valid, name: "   " }],
	["long name", { ...valid, name: "a".repeat(121) }],
	["name header injection", { ...valid, name: "Visitor\r\nBcc: other@example.com" }],
	["name Unicode line break", { ...valid, name: "First\u2028Second" }],
	["non-string email", { ...valid, email: [valid.email] }],
	["malformed email", { ...valid, email: "not-an-address" }],
	["multiple recipients", { ...valid, email: "one@example.com,two@example.com" }],
	["email header injection", { ...valid, email: "one@example.com\r\nBcc: other@example.com" }],
	["invalid domain", { ...valid, email: "visitor@-example.com" }],
	["long email", { ...valid, email: `${"a".repeat(254)}@example.com` }],
	["non-string message", { ...valid, message: {} }],
	["long message", { ...valid, message: "a".repeat(10_001) }],
	["missing topic", { name: valid.name, email: valid.email, message: valid.message }],
	["unknown topic", { ...valid, topic: "injected topic" }],
];

for (const [label, input] of invalidSubmissions) {
	test(`rejects ${label} without delivering email`, async () => {
		const result = await sendEmail(input);
		assert.equal(result.success, false);
		assert.equal(typeof result.error, "string");
		assert.equal(delivery.requests.length, 0);
	});
}

for (const topic of CONTACT_TOPICS) {
	test(`delivers the canonical ${topic.value} topic`, async () => {
		assert.deepEqual(await sendEmail({ ...valid, topic: topic.value }), { success: true });
		assert.ok(delivery.requests[0].text.includes(`Topic: ${topic.label}`));
	});
}

test("trims boundary whitespace while preserving message paragraphs", async () => {
	await sendEmail({
		...valid,
		name: "  Visitor  ",
		email: "  visitor+project@sub.example.com  ",
		message: "  First paragraph.\n\nSecond paragraph.  ",
	});
	assert.equal(delivery.requests[0].replyTo, "visitor+project@sub.example.com");
	assert.ok(delivery.requests[0].text.startsWith("Name: Visitor\n"));
	assert.ok(delivery.requests[0].text.endsWith("First paragraph.\n\nSecond paragraph."));
});

test("accepts names and messages at the exact length limit", async () => {
	assert.deepEqual(
		await sendEmail({
			...valid,
			name: "a".repeat(120),
			message: "a".repeat(10_000),
		}),
		{ success: true }
	);
});

test("ignores forged recipients, attachments and legacy project labels", async () => {
	await sendEmail({
		...valid,
		to: "other@example.com",
		attachments: [{ name: "unexpected.html", data: "not supported" }],
		projectType: ["untrusted topic"],
	});
	assert.notEqual(delivery.requests[0].to, "other@example.com");
	for (const request of delivery.requests) {
		assert.equal(request.attachments, undefined);
		assert.ok(!request.text.includes("untrusted topic"));
	}
});

test("provider exceptions return a generic error without request details", async () => {
	delivery.results.push(new Error("private provider detail"));
	const result = await sendEmail(valid);
	assert.equal(result.success, false);
	assert.ok(!result.error.includes("private provider detail"));
	assert.equal(delivery.requests.length, 1);
});

test("confirmation rejection does not undo a delivered message", async () => {
	delivery.results.push(
		{ data: { id: "owner-fixture" }, error: null },
		{ data: null, error: { message: "Fixture failure" } }
	);
	assert.deepEqual(await sendEmail(valid), { success: true });
});

test("an empty provider acknowledgement is a delivery failure", async () => {
	delivery.results.push({ data: null, error: null });
	assert.equal((await sendEmail(valid)).success, false);
	assert.equal(delivery.requests.length, 1);
});
