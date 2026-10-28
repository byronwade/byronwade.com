import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const preload = new URL("../scripts/preview-fixture.mjs", import.meta.url).href;
const DEV_ONLY = /only supports next dev/;
const VALID_STATES = /state must be success, error or retry/;

// A separate process keeps the preload's env/fetch changes out of other tests.
// Outbound provider traffic is rejected beneath the fixture, never sent.
function run(
	source,
	{ command = "dev", state, nodeEnv = "", worker = false, marker = worker ? "active" : "" } = {}
) {
	const entry =
		worker === "jest"
			? "node_modules/next/dist/compiled/jest-worker/processChild.js"
			: worker === "transform"
				? ".next/dev/build/chunks/local-fixture.js"
				: worker
					? "node_modules/next/dist/server/lib/start-server.js"
					: "node_modules/next/dist/bin/next";
	const result = spawnSync(
		process.execPath,
		[
			"--input-type=module",
			"--eval",
			`
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
process.argv = [process.execPath, resolve(${JSON.stringify(entry)}), ${JSON.stringify(command)}, ...${JSON.stringify(state ? [`--fixture-state=${state}`] : [])}];
const calls = [];
globalThis.fetch = (input, options) => {
  const url = new URL(input instanceof Request ? input.url : input);
  assert.notEqual(url.hostname, "api.screenshotone.com", "Provider traffic escaped the fixture");
  calls.push({ url: url.href, options });
  return Promise.resolve(new Response("passthrough"));
};
await import(${JSON.stringify(preload)});
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") {
      return nextResolve(pathToFileURL(resolve("tests/fixtures/server-only.mjs")).href, context);
    }
    if (specifier === "next/server") return nextResolve("next/server.js", context);
    if (specifier.startsWith("@/lib/")) return nextResolve(pathToFileURL(resolve(specifier.slice(2) + ".ts")).href, context);
    return nextResolve(specifier, context);
  }
});
${source}
`,
		],
		{
			windowsHide: true,
			encoding: "utf8",
			timeout: 15_000,
			env: {
				...process.env,
				NODE_OPTIONS: "",
				NODE_ENV: nodeEnv,
				SCREENSHOTONE_ACCESS_KEY: "inherited-test-credential-must-be-replaced",
				LOCAL_PREVIEW_FIXTURE: marker,
				LOCAL_PREVIEW_STATE: "",
			},
		}
	);
	assert.ifError(result.error);
	return result;
}

function succeeds(source, options) {
	const result = run(source, options);
	assert.equal(result.status, 0, result.stderr || result.stdout);
	assert.ok(!result.stdout.includes("inherited-test-credential"), "No credential is printed");
}

test("local preview fixture drives the real resolve and image routes for every preset", () => {
	succeeds(`
const { GET: resolveRoute } = await import("./app/api/screenshot/route.ts");
const { GET: imageRoute } = await import("./app/api/screenshot/image/route.ts");
const { SCREENSHOT_VIEWPORTS } = await import("./lib/screenshot-viewports.ts");
assert.equal(process.env.SCREENSHOTONE_ACCESS_KEY, "local-preview-fixture-not-a-credential");
assert.equal(process.env.NODE_ENV, "development");
assert.ok(process.env.NODE_OPTIONS.includes(${JSON.stringify(preload)}));
for (const { width, height } of Object.values(SCREENSHOT_VIEWPORTS)) {
  const query = new URLSearchParams({ url: "https://thorbis.com/", width: String(width), height: String(height) });
  const resolution = await resolveRoute(new Request("http://127.0.0.1/api/screenshot?" + query));
  assert.equal(resolution.status, 200);
  const { url, mode } = await resolution.json();
  assert.equal(mode, "static");
  const image = await imageRoute(new Request("http://127.0.0.1" + url));
  assert.equal(image.status, 200);
  assert.equal(image.headers.get("content-type"), "image/svg+xml");
  const text = await image.text();
  assert.ok(text.includes('width="' + width + '" height="' + height + '"'));
  assert.ok(text.includes("Local development fixture"));
  assert.ok(text.includes("Not a capture of the project site"));
}
assert.equal(calls.length, 0);
`);
});

test("fixture errors stay retryable and fail-once recovers separately for each capture", () => {
	succeeds(
		`
const { GET } = await import("./app/api/screenshot/image/route.ts");
for (const width of [1920, 375]) {
  const height = width === 1920 ? 1080 : 667;
  const request = () => new Request("http://127.0.0.1/api/screenshot/image?" + new URLSearchParams({ url: "https://thorbis.com/", width: String(width), height: String(height) }));
  const first = await GET(request());
  assert.equal(first.status, 502);
  assert.equal(first.headers.get("cache-control"), "no-store");
  assert.deepEqual(await first.json(), { error: "Failed to capture screenshot" });
  assert.equal((await GET(request())).status, 200);
}
assert.equal(calls.length, 0);
`,
		{ state: "retry" }
	);
});

test("persistent fixture failures never reach ScreenshotOne", () => {
	succeeds(
		`
const url = "https://api.screenshotone.com/take?url=https://thorbis.com/&viewport_width=1920&viewport_height=1080";
for (let attempt = 0; attempt < 3; attempt++) assert.equal((await fetch(url)).status, 502);
assert.equal(calls.length, 0);
`,
		{ state: "error" }
	);
});

test("fixture preserves the real URL and viewport allowlist", () => {
	succeeds(`
const { GET } = await import("./app/api/screenshot/image/route.ts");
for (const [query, status] of [
  ["url=https://not-a-project.invalid/", 403],
  ["url=https://thorbis.com/&width=17&height=19", 400],
]) assert.equal((await GET(new Request("http://127.0.0.1/api/screenshot/image?" + query))).status, status);
assert.equal((await fetch("https://api.screenshotone.com/unexpected")).status, 400);
assert.equal((await fetch("https://api.screenshotone.com/take?viewport_width=17&viewport_height=19")).status, 400);
assert.equal(calls.length, 0);
`);
});

test("non-provider requests retain their input and options", () => {
	succeeds(`
const request = new Request("http://127.0.0.1:12345/local");
const options = { headers: { "x-fixture": "preserved" }, signal: AbortSignal.timeout(1000) };
assert.equal(await (await fetch(request, options)).text(), "passthrough");
assert.equal(calls.length, 1);
assert.equal(calls[0].url, request.url);
assert.equal(calls[0].options, options);
`);
});

for (const command of ["build", "start"]) {
	for (const nodeEnv of ["", "development", "production"]) {
		test(`fixture refuses next ${command} with NODE_ENV=${nodeEnv || "unset"}`, () => {
			const result = run("", { command, nodeEnv });
			assert.notEqual(result.status, 0);
			assert.match(result.stderr, DEV_ONLY);
		});
	}
}

test("fixture rejects next dev under production and unknown fixture states", () => {
	assert.match(run("", { nodeEnv: "production" }).stderr, DEV_ONLY);
	assert.match(run("", { state: "unknown" }).stderr, VALID_STATES);
});

test("the inherited development worker installs the fixture", () => {
	succeeds(
		`
const image = await fetch("https://api.screenshotone.com/take?viewport_width=768&viewport_height=1024");
assert.equal(image.status, 200);
assert.equal(calls.length, 0);
`,
		{ worker: true, nodeEnv: "development" }
	);
});

for (const worker of ["jest", "transform"]) {
	test(`the inherited ${worker} development helper keeps captures local`, () => {
		succeeds(
			`
assert.equal((await fetch("https://api.screenshotone.com/take?viewport_width=768&viewport_height=1024")).status, 200);
assert.equal(calls.length, 0);
`,
			{ worker, nodeEnv: "development" }
		);
	});
}

test("development helpers require the fixture marker and reject production", () => {
	for (const worker of [true, "jest", "transform"]) {
		assert.match(run("", { worker, nodeEnv: "development", marker: "" }).stderr, DEV_ONLY);
		assert.match(run("", { worker, nodeEnv: "production" }).stderr, DEV_ONLY);
	}
});
