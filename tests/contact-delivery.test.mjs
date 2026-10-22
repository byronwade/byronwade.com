import assert from "node:assert/strict";
import { createServer } from "node:http";
import { registerHooks } from "node:module";
import { after, before, test } from "node:test";

// Keep the real SDK and fetch: cancellation must reach both headers and body.
registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
});

let respond = (_request, response) => response.end();
const server = createServer((request, response) => {
	request.resume();
	respond(request, response);
});
const realTimeout = AbortSignal.timeout.bind(AbortSignal);
const UNCONFIRMED = /confirm/i;
const DRAFT = /draft/i;
const SUBMISSION_ID = "6a19a7fe-5504-4262-8bbf-ecad29e40522";
const valid = {
	name: "Test Visitor",
	email: "visitor@example.com",
	topic: "conversation",
	message: "A draft that must survive a stalled delivery.",
};
let sendEmail;

before(async () => {
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	process.env.RESEND_BASE_URL = `http://127.0.0.1:${server.address().port}`;
	process.env.RESEND_API_KEY = "local-fixture-not-a-credential";
	({ sendEmail } = await import("../lib/actions/send-email.ts"));
});

after(() => {
	server.closeAllConnections();
	server.close();
});

function accepted(response) {
	response.writeHead(200, { "Content-Type": "application/json" });
	response.end(JSON.stringify({ id: "local-fixture" }));
}

for (const stage of ["headers", "body"]) {
	test(`stalled contact ${stage} cancels delivery and permits an explicit retry`, {
		timeout: 5000,
	}, async (context) => {
		const deadlines = [];
		context.mock.method(AbortSignal, "timeout", (duration) => {
			deadlines.push(duration);
			return realTimeout(80);
		});
		context.mock.method(console, "error", () => undefined);
		let requests = 0;
		const received = [];
		let closed;
		const connectionClosed = new Promise((resolve) => {
			closed = resolve;
		});
		respond = (request, response) => {
			received.push([request.method, request.url, request.headers["idempotency-key"]]);
			requests += 1;
			response.once("close", closed);
			if (stage === "body") {
				response.writeHead(200, { "Content-Type": "application/json" });
				response.write('{"id":');
			}
			// Let the original implementation finish, but prove it wrongly succeeds.
			const timer = setTimeout(() => {
				if (stage === "body") {
					response.end('"late-acknowledgement"}');
				} else {
					accepted(response);
				}
			}, 350);
			response.once("close", () => clearTimeout(timer));
		};
		const result = await sendEmail(valid, SUBMISSION_ID);
		assert.equal(result.success, false, "A stalled acknowledgement must not report success");
		assert.match(result.error, UNCONFIRMED, "The outcome is unknown, not a guaranteed rejection");
		assert.match(result.error, DRAFT);
		assert.deepEqual(deadlines, [10_000]);
		assert.equal(requests, 1, "A timeout must not automatically send another email");
		assert.deepEqual(received, [["POST", "/emails", `contact/${SUBMISSION_ID}`]]);
		await connectionClosed;

		respond = (request, response) => {
			received.push([request.method, request.url, request.headers["idempotency-key"]]);
			requests += 1;
			accepted(response);
		};
		assert.deepEqual(await sendEmail(valid, SUBMISSION_ID), { success: true });
		assert.equal(requests, 2, "The visitor can choose to send again");
		assert.deepEqual(received[1], received[0], "An unchanged retry keeps its provider key");
	});
}

test("prompt acknowledgement succeeds through the real SDK", { timeout: 5000 }, async () => {
	respond = (_request, response) => accepted(response);
	assert.deepEqual(await sendEmail(valid, SUBMISSION_ID), { success: true });
});
