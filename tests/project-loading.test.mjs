import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import { join } from "node:path";
import { after, test } from "node:test";

const root = process.cwd();
await mkdir(join(root, ".next"), { recursive: true });
const directory = await mkdtemp(join(root, ".next", "project-loading-"));
const projectsDirectory = join(directory, "content", "projects");
process.chdir(directory);
after(async () => {
	process.chdir(root);
	await rm(directory, { recursive: true, force: true });
});

registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier === "next/cache") {
			return nextResolve("next/cache.js", context);
		}
		if (specifier === "server-only") {
			return nextResolve(new URL("./fixtures/server-only.mjs", import.meta.url).href, context);
		}
		if (specifier.startsWith("@/lib/")) {
			return nextResolve(new URL(`../${specifier.slice(2)}.ts`, import.meta.url).href, context);
		}
		return nextResolve(specifier, context);
	},
});

await mkdir(projectsDirectory, { recursive: true });
await mkdir(join(directory, "content", "blog"));
const fixtures = [
	[
		"newer",
		"title: Newer project\ndate: 2026-10-16\nflagship: true\norder: 2\nurl: https://project.example/\n",
	],
	["older", "title: Older project\ndate: 2024-01-01\nflagship: true\norder: 1\n"],
	["undated", "title: Undated project\n"],
	["broken-yaml", "title: [unclosed\n"],
	["scalar-yaml", "a scalar instead of a mapping\n"],
	["sequence-yaml", "- a sequence instead of a mapping\n"],
];
await Promise.all(
	fixtures.map(([slug, frontMatter]) =>
		writeFile(
			join(projectsDirectory, `${slug}.md`),
			`---\n${frontMatter}---\nReadable project evidence.\n`
		)
	)
);
// A Markdown-named directory reproduces a per-file read error without relying
// on OS-specific file permissions (which elevated Windows users can bypass).
await mkdir(join(projectsDirectory, "unreadable.md"));
await writeFile(join(projectsDirectory, "notes.txt"), "Not a project.");

const { getAllProjectSlugs, getFeaturedProjects, getProject, getProjects } = await import(
	"../lib/projects.ts"
);
const { buildPageSearchIndex, buildSearchIndex } = await import("../lib/search-index.ts");
const { resolveCapture } = await import("../lib/screenshot-capture.ts");
const { default: sitemap } = await import("../app/sitemap.ts");
const healthy = ["newer", "older", "undated"];
const invalid = ["broken-yaml", "scalar-yaml", "sequence-yaml", "unreadable"];

test("development search follows draft body and metadata edits immediately", async (context) => {
	const originalEnvironment = process.env.NODE_ENV;
	const postPath = join(directory, "content", "blog", "local-draft.md");
	const errors = [];
	context.mock.method(console, "error", (...args) => errors.push(args));
	process.env.NODE_ENV = "development";
	try {
		await writeFile(
			postPath,
			"---\ntitle: Local draft\ndate: 2026-10-22\ndraft: true\n---\nfirstDraftToken\n"
		);
		const first = (await buildPageSearchIndex()).find(
			(entry) => entry.href === "/blog/local-draft"
		);
		assert.equal(first?.label, "Local draft");
		assert.ok(first?.keywords.includes("firstDraftToken"));
		await writeFile(
			postPath,
			"---\ntitle: Edited draft\ndate: 2026-10-22\ndraft: true\n---\nsecondDraftToken\n"
		);
		const second = (await buildPageSearchIndex()).find(
			(entry) => entry.href === "/blog/local-draft"
		);
		assert.equal(second?.label, "Edited draft");
		assert.ok(second?.keywords.includes("secondDraftToken"));
		assert.ok(!second?.keywords.includes("firstDraftToken"));
		const header = (await buildSearchIndex()).find((entry) => entry.href === "/blog/local-draft");
		assert.equal(header?.label, "Edited draft");
		assert.ok(!header?.keywords.includes("secondDraftToken"));
		assert.ok(errors.length > 0, "unrelated malformed project fixtures remain isolated");
	} finally {
		await rm(postPath, { force: true });
		if (originalEnvironment === undefined) {
			delete process.env.NODE_ENV;
		} else {
			process.env.NODE_ENV = originalEnvironment;
		}
	}
});

test("a failed project does not remove healthy siblings or their date ordering", async (context) => {
	const errors = [];
	context.mock.method(console, "error", (...args) => errors.push(args));
	const projects = await getProjects();
	assert.deepEqual(
		projects.map((project) => project.slug),
		healthy
	);
	assert.equal(projects[0].title, "Newer project");
	assert.equal(projects[0].content.trim(), "Readable project evidence.");
	assert.equal(projects[2].date, undefined);
	const projectErrors = errors.filter(([message]) => message.startsWith("Error reading project "));
	assert.equal(projectErrors.length, invalid.length);
	for (const slug of invalid) {
		assert.ok(
			projectErrors.some(([message]) => message.includes(`project ${slug}:`)),
			slug
		);
	}
});

for (const slug of invalid) {
	test(`direct lookup of ${slug} returns null and identifies the failed project`, async (context) => {
		const errors = [];
		context.mock.method(console, "error", (...args) => errors.push(args));
		assert.equal(await getProject(slug), null);
		assert.equal(errors.length, 1);
		assert.ok(errors[0][0].includes(`project ${slug}:`));
	});
}

test("static slugs include exactly the projects that can render", async (context) => {
	context.mock.method(console, "error", () => undefined);
	assert.deepEqual((await getAllProjectSlugs()).sort(), [...healthy].sort());
});

test("homepage featured selections retain their explicit order and limit", async (context) => {
	context.mock.method(console, "error", () => undefined);
	assert.deepEqual(
		(await getFeaturedProjects()).map((project) => project.slug),
		["older", "newer"]
	);
	assert.deepEqual(
		(await getFeaturedProjects(1)).map((project) => project.slug),
		["older"]
	);
});

for (const [name, buildIndex] of [
	["header", buildSearchIndex],
	["page", buildPageSearchIndex],
]) {
	test(`${name} search retains healthy projects and excludes failed files`, async (context) => {
		context.mock.method(console, "error", () => undefined);
		const entries = (await buildIndex()).filter((entry) => entry.kind === "Project");
		assert.deepEqual(
			entries.map((entry) => entry.href),
			healthy.map((slug) => `/projects/${slug}`)
		);
	});
}

test("sitemap retains healthy projects and never advertises failed files", async (context) => {
	context.mock.method(console, "error", () => undefined);
	const entries = (await sitemap()).filter((entry) => entry.url.includes("/projects/"));
	assert.deepEqual(
		entries.map((entry) => new URL(entry.url).pathname),
		healthy.map((slug) => `/projects/${slug}`)
	);
	assert.equal(new Date(entries[0].lastModified).toISOString(), "2026-10-16T00:00:00.000Z");
	assert.equal(entries[2].lastModified, undefined);
});

test("preview allowlist retains healthy URLs without admitting arbitrary URLs", async (context) => {
	context.mock.method(console, "error", () => undefined);
	const allowed = await resolveCapture(new URLSearchParams({ url: "https://project.example/" }));
	assert.equal(allowed.ok, true);
	assert.equal(allowed.capture.target, "https://project.example/");
	const rejected = await resolveCapture(new URLSearchParams({ url: "https://unlisted.example/" }));
	assert.equal(rejected.ok, false);
	assert.equal(rejected.status, 403);
});

test("empty and missing project directories preserve the empty-list fallback", async (context) => {
	context.mock.method(console, "error", () => undefined);
	await rm(projectsDirectory, { recursive: true });
	await mkdir(projectsDirectory);
	assert.deepEqual(await getProjects(), []);
	assert.deepEqual(await getAllProjectSlugs(), []);
	await rm(projectsDirectory, { recursive: true });
	assert.deepEqual(await getProjects(), []);
	assert.deepEqual(await getAllProjectSlugs(), []);
	assert.deepEqual(await getFeaturedProjects(), []);
	assert.equal(await getProject("missing"), null);
});
