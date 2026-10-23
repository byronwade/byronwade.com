import assert from "node:assert/strict";
import filesystem, { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { registerHooks, syncBuiltinESMExports } from "node:module";
import { join } from "node:path";
import { after, test } from "node:test";

const root = process.cwd();
await mkdir(join(root, ".next"), { recursive: true });
const directory = await mkdtemp(join(root, ".next", "content-paths-"));
process.chdir(directory);
after(async () => {
	process.chdir(root);
	await rm(directory, { recursive: true, force: true });
});

registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
});

const document = "---\ntitle: Local evidence\ndate: 2026-10-23\n---\nFixture body.\n";
const names = ["ordinary-post", "release.v2", "under_score", "café", "two words", "..prefixed"];
await Promise.all(
	["blog", "projects"].map(async (collection) => {
		const destination = join(directory, "content", collection);
		await mkdir(destination, { recursive: true });
		await mkdir(join(destination, "nested"));
		await writeFile(join(destination, "nested", "child.md"), document);
		await Promise.all(names.map((name) => writeFile(join(destination, `${name}.md`), document)));
	})
);
await writeFile(join(directory, "content", "outside.md"), document);
await writeFile(join(directory, "outside.md"), document);

const { getBlogPost } = await import("../lib/blog.ts");
const { getProject } = await import("../lib/projects.ts");

for (const [collection, load] of [
	["blog", getBlogPost],
	["projects", getProject],
]) {
	for (const slug of [
		"../outside",
		"../../outside",
		"nested/child",
		"nested/../ordinary-post",
		"..\\outside",
		"nested\\child",
	]) {
		test(`${collection} refuses path-like slug ${JSON.stringify(slug)}`, async () => {
			assert.equal(await load(slug), null);
		});
	}
	const sibling = collection === "blog" ? "projects" : "blog";
	test(`${collection} cannot read a sibling collection`, async () => {
		assert.equal(await load(`../${sibling}/ordinary-post`), null);
	});

	test(`${collection} accepts ordinary single filenames unchanged`, async () => {
		await Promise.all(
			names.map(async (slug) => {
				const entry = await load(slug);
				assert.equal(entry?.slug, slug);
				assert.equal(entry?.title, "Local evidence");
				assert.equal(entry?.content.trim(), "Fixture body.");
			})
		);
	});

	test(`${collection} rejects invalid segments before filesystem access`, async (context) => {
		const reads = context.mock.method(filesystem, "readFile", () => {
			throw new Error("Invalid slugs must never reach the filesystem");
		});
		context.mock.method(console, "error", () => undefined);
		syncBuiltinESMExports();
		try {
			const invalid = [
				"",
				".",
				"..",
				"../outside",
				"..\\outside",
				"/absolute",
				"C:\\absolute",
				"C:relative",
				"ordinary-post.md:stream",
				"null\0byte",
			];
			await Promise.all(invalid.map(async (slug) => assert.equal(await load(slug), null)));
			assert.equal(reads.mock.callCount(), 0, "rejection happens before readFile");
		} finally {
			reads.mock.restore();
			syncBuiltinESMExports();
		}
	});
}
