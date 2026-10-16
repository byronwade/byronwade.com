import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";

const APP_SERVER = new URL("../../.next/server/app/", import.meta.url);
const CHROMIUM_BIN = "node_modules/@sparticuz/chromium/bin/";
const REQUIRED = ["chromium.br", "al2023.tar.br", "fonts.tar.br", "swiftshader.tar.br"];

async function tracedFiles(relativePath) {
	const trace = JSON.parse(await readFile(new URL(relativePath, APP_SERVER), "utf8"));
	return trace.files.map((file) => file.replaceAll("\\", "/"));
}

test("the resume PDF route ships the compressed browser it launches", async () => {
	const files = await tracedFiles("api/resume-pdf/route.js.nft.json");
	for (const name of REQUIRED) {
		assert.ok(
			files.some((file) => file.endsWith(`${CHROMIUM_BIN}${name}`)),
			`${name} is missing from the route trace`
		);
	}
});

test("no other route carries the browser", async () => {
	const entries = await readdir(APP_SERVER, { recursive: true });
	const traces = entries
		.map((entry) => entry.replaceAll("\\", "/"))
		.filter((entry) => entry.endsWith(".nft.json") && entry !== "api/resume-pdf/route.js.nft.json");
	assert.ok(traces.length > 0);
	const carriers = [];
	await Promise.all(
		traces.map(async (trace) => {
			const files = await tracedFiles(trace);
			if (files.some((file) => file.includes(CHROMIUM_BIN))) {
				carriers.push(trace);
			}
		})
	);
	assert.deepEqual(carriers, []);
});
