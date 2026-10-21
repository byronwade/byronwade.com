import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { promisify } from "node:util";

const runNode = promisify(execFile);
const blogModule = new URL("../lib/blog.ts", import.meta.url).href;
const libDirectory = new URL("../lib/", import.meta.url).href;

test("older and newer follow the writing index and skip drafts in production", async (context) => {
	const directory = await mkdtemp(join(tmpdir(), "blog-adjacent-"));
	context.after(() => rm(directory, { recursive: true, force: true }));
	const contentDirectory = join(directory, "content", "blog");
	await mkdir(contentDirectory, { recursive: true });
	await Promise.all(
		[
			["first", "2026-01-01", ""],
			["second", "2026-02-01", ""],
			["unpublished", "2026-02-15", "draft: true\n"],
			["third", "2026-03-01", ""],
		].map(([slug, date, draft]) =>
			writeFile(
				join(contentDirectory, `${slug}.md`),
				`---\ntitle: ${slug}\ndate: ${date}\n${draft}---\nPost body.\n`
			)
		)
	);

	const { stdout } = await runNode(
		process.execPath,
		[
			"--experimental-strip-types",
			"--input-type=module",
			"-e",
			`import { registerHooks } from "node:module";
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/lib/")) {
      return nextResolve(new URL(specifier.slice(6) + ".ts", ${JSON.stringify(libDirectory)}).href, context);
    }
    return nextResolve(specifier, context);
  },
});
const { getAdjacentPosts } = await import(${JSON.stringify(blogModule)});
const pair = async (slug) => {
  const { newer, older } = await getAdjacentPosts(slug);
  return [newer?.slug ?? null, older?.slug ?? null];
};
console.log(JSON.stringify({
  third: await pair("third"),
  second: await pair("second"),
  first: await pair("first"),
  missing: await pair("missing"),
}));`,
		],
		{ cwd: directory, env: { ...process.env, NODE_ENV: "production" }, windowsHide: true }
	);
	assert.deepEqual(JSON.parse(stdout), {
		third: [null, "second"],
		second: ["third", "first"],
		first: ["second", null],
		missing: [null, null],
	});
});
