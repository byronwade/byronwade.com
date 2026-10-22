import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import { fetchScreenshot } from "../lib/screenshot.ts";

// Use real sockets so the deadline must cancel headers and streamed JSON alike.
let handleRequest = (_request, response) => response.end();
const server = createServer((request, response) => handleRequest(request, response));
const realFetch = globalThis.fetch;
const realTimeout = AbortSignal.timeout.bind(AbortSignal);
const WIDTH = 1920;
const HEIGHT = 1080;
const IMAGE_PATH = "/api/screenshot/image?url=https%3A%2F%2Fproject.example%2F";

before(async () => {
	await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
	const origin = `http://127.0.0.1:${server.address().port}`;

	globalThis.fetch = (input, init) => realFetch(new URL(input, origin), init);
});

after(() => {
	globalThis.fetch = realFetch;
	server.closeAllConnections();
	server.close();
});

function resolveImage(response) {
	response.writeHead(200, { "Content-Type": "application/json" });
	response.end(JSON.stringify({ url: IMAGE_PATH, mode: "static" }));
}

test("successful screenshot URLs are cached for the same target and size", async () => {
	let requests = 0;
	handleRequest = (request, response) => {
		requests += 1;
		const url = new URL(request.url, "http://localhost");
		assert.equal(url.pathname, "/api/screenshot");
		assert.equal(url.searchParams.get("url"), "https://project.example/cache");
		assert.equal(url.searchParams.get("width"), String(WIDTH));
		assert.equal(url.searchParams.get("height"), String(HEIGHT));
		resolveImage(response);
	};
	assert.equal(await fetchScreenshot("https://project.example/cache", WIDTH, HEIGHT), IMAGE_PATH);
	assert.equal(await fetchScreenshot("https://project.example/cache", WIDTH, HEIGHT), IMAGE_PATH);
	assert.equal(requests, 1);
});

test("simultaneous callers share a resolution, while other sizes resolve separately", async () => {
	let requests = 0;
	handleRequest = (_request, response) => {
		requests += 1;
		setTimeout(() => resolveImage(response), 30);
	};
	assert.deepEqual(
		await Promise.all([
			fetchScreenshot("https://project.example/shared", WIDTH, HEIGHT),
			fetchScreenshot("https://project.example/shared", WIDTH, HEIGHT),
			fetchScreenshot("https://project.example/shared", 390, 844),
		]),
		[IMAGE_PATH, IMAGE_PATH, IMAGE_PATH]
	);
	assert.equal(requests, 2);
});

for (const stage of ["headers", "body"]) {
	test(`a stalled screenshot ${stage} times out and releases all callers for retry`, {
		timeout: 5000,
	}, async (context) => {
		const deadlines = [];
		context.mock.method(AbortSignal, "timeout", (duration) => {
			deadlines.push(duration);
			return realTimeout(80);
		});
		let requests = 0;
		handleRequest = (_request, response) => {
			requests += 1;
			if (stage === "body") {
				response.writeHead(200, { "Content-Type": "application/json" });
				response.write('{"url":');
			}
			// A late valid response makes the old unbounded implementation fail
			// deterministically, without leaving the test waiting forever.
			setTimeout(() => {
				if (stage === "body") {
					response.end(`${JSON.stringify(IMAGE_PATH)}}`);
				} else {
					resolveImage(response);
				}
			}, 300);
		};
		const href = `https://project.example/stalled-${stage}`;
		const outcomes = await Promise.allSettled([
			fetchScreenshot(href, WIDTH, HEIGHT),
			fetchScreenshot(href, WIDTH, HEIGHT),
		]);
		for (const outcome of outcomes) {
			assert.equal(outcome.status, "rejected", "All waiting previews leave the loading state");
			assert.equal(outcome.reason.name, "TimeoutError");
		}
		assert.equal(requests, 1, "A stalled request is still deduplicated");
		assert.deepEqual(deadlines, [10_000], "Resolution has a ten-second deadline");

		handleRequest = (_request, response) => {
			requests += 1;
			resolveImage(response);
		};
		assert.equal(await fetchScreenshot(href, WIDTH, HEIGHT), IMAGE_PATH);
		assert.equal(requests, 2, "Retry starts a fresh request after the timeout");
		assert.equal(await fetchScreenshot(href, WIDTH, HEIGHT), IMAGE_PATH);
		assert.equal(requests, 2, "A recovered result remains cacheable");
	});
}

for (const [label, status, body] of [
	["HTTP failure", 503, "{}"],
	["malformed JSON", 200, "{"],
	["null body", 200, "null"],
	["missing URL", 200, "{}"],
	["blank URL", 200, '{"url":"  "}'],
	["non-string URL", 200, '{"url":42}'],
]) {
	test(`a screenshot ${label} is not cached and can recover`, async () => {
		let requests = 0;
		handleRequest = (_request, response) => {
			requests += 1;
			response.writeHead(status, { "Content-Type": "application/json" });
			response.end(body);
		};
		const href = `https://project.example/${encodeURIComponent(label)}`;
		await assert.rejects(fetchScreenshot(href, WIDTH, HEIGHT));
		handleRequest = (_request, response) => {
			requests += 1;
			resolveImage(response);
		};
		assert.equal(await fetchScreenshot(href, WIDTH, HEIGHT), IMAGE_PATH);
		assert.equal(requests, 2);
	});
}
