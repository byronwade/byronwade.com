import assert from "node:assert/strict";
import { test } from "node:test";
import { motionDuration, motionToken } from "../lib/motion.ts";
import { declarations } from "./fixtures/global-css.mjs";

const ALIAS = /^var\((--[\w-]+)\)$/;
const root = declarations(":root");

/** A `:root` token's value after following its plain `var()` aliases. */
function rootValue(name, seen = new Set()) {
	const value = root.get(name);
	assert.ok(value, `${name} is not declared on :root in app/globals.css`);
	const alias = value.match(ALIAS)?.[1];
	if (!alias) {
		return value;
	}
	assert.ok(!seen.has(alias), `circular motion token ${alias}`);
	return rootValue(alias, new Set([...seen, name]));
}

test("SSR motion fallbacks match the tokens in app/globals.css", () => {
	for (const name of [
		"--motion-ease-out",
		"--motion-ease-drawer",
		"--motion-fast",
		"--motion-base",
		"--motion-slow",
		"--motion-drawer",
	]) {
		assert.equal(motionToken(name), rootValue(name), name);
	}
});

test("SSR motion durations use the canonical millisecond fallback", () => {
	assert.equal(motionDuration("--motion-base"), 180);
	assert.equal(motionDuration("--motion-fast"), 120);
});

test("CSS seconds and milliseconds produce the same Web Animations duration", () => {
	const properties = ["window", "document", "getComputedStyle"];
	const original = properties.map((name) => Object.getOwnPropertyDescriptor(globalThis, name));
	let value = "0.18s";
	try {
		globalThis.window = {};
		globalThis.document = { documentElement: {} };
		globalThis.getComputedStyle = () => ({ getPropertyValue: () => value });
		assert.equal(motionDuration("--motion-base"), 180);
		value = "180ms";
		assert.equal(motionDuration("--motion-base"), 180);
		value = "0s";
		assert.equal(motionDuration("--motion-base"), 0);
	} finally {
		properties.forEach((name, index) => {
			if (original[index]) {
				Object.defineProperty(globalThis, name, original[index]);
			} else {
				Reflect.deleteProperty(globalThis, name);
			}
		});
	}
});
