import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
});

const { getNextProject, getProjects, sortProjectsForIndex } = await import("../lib/projects.ts");

const project = (slug, fields = {}) => ({ slug, title: slug, content: "", ...fields });

test("the index order puts current work first, leads by order, then recency", () => {
	const ordered = sortProjectsForIndex([
		project("old-archived", { status: "Archived", date: "2020-01-01" }),
		project("recent", { date: "2026-05-01" }),
		project("lead-second", { featured: true, order: 2, date: "2024-01-01" }),
		project("new-archived", { status: "archived", date: "2025-01-01" }),
		project("lead-first", { flagship: true, order: 1, date: "2023-01-01" }),
		project("older", { date: "2026-01-01" }),
	]);
	assert.deepEqual(
		ordered.map(({ slug }) => slug),
		["lead-first", "lead-second", "recent", "older", "new-archived", "old-archived"]
	);
});

test("each case study points to the next one in the index, wrapping to the first", async () => {
	const ordered = sortProjectsForIndex(await getProjects());
	assert.ok(ordered.length > 1, "the site has more than one project");
	const nexts = await Promise.all(ordered.map(({ slug }) => getNextProject(slug)));
	for (const [index, current] of ordered.entries()) {
		assert.equal(nexts[index]?.slug, ordered[(index + 1) % ordered.length].slug, current.slug);
	}
	assert.equal(await getNextProject("not-a-project"), null);
});
