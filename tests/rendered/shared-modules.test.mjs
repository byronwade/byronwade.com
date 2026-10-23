import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

const APP = new URL("../../.next/server/app/", import.meta.url);
const INITIAL_SCRIPT = /<script[^>]+src="\/_next\/([^"]+)"/g;

// Parse webpack's actual registration objects, rather than matching minified
// function text or tying this check to module IDs from one build.
function moduleIds(file, source) {
	const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest);
	const ids = [];
	function visit(node) {
		if (
			ts.isCallExpression(node) &&
			ts.isPropertyAccessExpression(node.expression) &&
			node.expression.name.text === "push" &&
			node.expression.expression.getText(ast).includes("webpackChunk_N_E")
		) {
			const registration = node.arguments[0];
			const factories =
				registration && ts.isArrayLiteralExpression(registration)
					? registration.elements[1]
					: undefined;
			if (factories && ts.isObjectLiteralExpression(factories)) {
				for (const property of factories.properties) {
					assert.ok(ts.isPropertyAssignment(property), "Expected a webpack module factory");
					ids.push(property.name.getText(ast));
				}
			}
		}
		ts.forEachChild(node, visit);
	}
	visit(ast);
	return ids;
}

test("prerendered pages download shared module factories only once", () => {
	const pages = readdirSync(APP, { recursive: true }).filter((file) => file.endsWith(".html"));
	assert.ok(pages.length > 0, "Run npm run build first");
	const directory = new URL("../../.next/static/chunks/", import.meta.url);
	const sharedFile = readdirSync(directory).find((file) => file.startsWith("shared-primitives-"));
	assert.ok(sharedFile, "The canonical shared-primitives chunk must exist");
	const sharedIds = new Set(
		moduleIds(sharedFile, readFileSync(new URL(sharedFile, directory), "utf8"))
	);
	assert.ok(sharedIds.size > 0, "Shared factories must remain detectable");
	const chunks = new Map();
	const duplicates = [];
	for (const file of pages) {
		const html = readFileSync(new URL(file.replaceAll("\\", "/"), APP), "utf8");
		const scripts = [...new Set([...html.matchAll(INITIAL_SCRIPT)].map((match) => match[1]))];
		const owners = new Map();
		let registered = 0;
		for (const script of scripts) {
			if (!chunks.has(script)) {
				const source = readFileSync(new URL(`../../.next/${script}`, import.meta.url), "utf8");
				chunks.set(script, moduleIds(script, source));
			}
			for (const id of chunks.get(script)) {
				if (!sharedIds.has(id)) {
					continue;
				}
				registered += 1;
				const previous = owners.get(id);
				if (previous) {
					duplicates.push({ page: file, id, scripts: [previous, script] });
				}
				owners.set(id, script);
			}
		}
		assert.ok(registered > 0, `${file} must retain detectable webpack module registrations`);
	}
	assert.deepEqual(duplicates, [], "Shared module factories should have one downloaded owner");
});
