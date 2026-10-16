import assert from "node:assert/strict";
import { test } from "node:test";
import { motionDuration } from "../lib/motion.ts";

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
