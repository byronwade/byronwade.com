import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { promisify } from "node:util";

const runNode = promisify(execFile);
const blogModule = new URL("../lib/blog.ts", import.meta.url).href;

test("drafts are local previews and published posts remain available", async (context) => {
	const directory = await mkdtemp(join(tmpdir(), "blog-drafts-"));
	context.after(() => rm(directory, { recursive: true, force: true }));
	const contentDirectory = join(directory, "content", "blog");
	await mkdir(contentDirectory, { recursive: true });
	await Promise.all(
		[
			["draft", "draft: true\n"],
			["published", "draft: false\n"],
			["legacy", ""],
		].map(([slug, draft]) =>
			writeFile(
				join(contentDirectory, `${slug}.md`),
				`---\ntitle: ${slug}\ndate: 2026-10-16\n${draft}---\nPost body.\n`
			)
		)
	);

	await Promise.all(
		["development", "production", "test"].map(async (environment) => {
			const { stdout } = await runNode(
				process.execPath,
				[
					"--experimental-strip-types",
					"--input-type=module",
					"-e",
					`const { getBlogPosts, getBlogPost, getAllBlogSlugs } = await import(${JSON.stringify(blogModule)});
const posts = await getBlogPosts();
console.log(JSON.stringify({
  posts: posts.map(post => post.slug).sort(),
  slugs: (await getAllBlogSlugs()).sort(),
  draft: (await getBlogPost("draft"))?.slug ?? null,
  published: (await getBlogPost("published"))?.slug,
  legacy: (await getBlogPost("legacy"))?.slug,
}));`,
				],
				{ cwd: directory, env: { ...process.env, NODE_ENV: environment }, windowsHide: true }
			);
			const expected =
				environment === "development" ? ["draft", "legacy", "published"] : ["legacy", "published"];
			assert.deepEqual(
				JSON.parse(stdout),
				{
					posts: expected,
					slugs: expected,
					draft: environment === "development" ? "draft" : null,
					published: "published",
					legacy: "legacy",
				},
				environment
			);
		})
	);
});
