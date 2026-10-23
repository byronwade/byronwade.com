import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import { join } from "node:path";
import { after, test } from "node:test";

const root = process.cwd();
const originalEnvironment = process.env.NODE_ENV;
await mkdir(join(root, ".next"), { recursive: true });
const directory = await mkdtemp(join(root, ".next", "content-publication-"));
process.chdir(directory);
process.env.NODE_ENV = "production";
after(async () => {
	process.chdir(root);
	if (originalEnvironment === undefined) {
		delete process.env.NODE_ENV;
	} else {
		process.env.NODE_ENV = originalEnvironment;
	}
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

const invalidDates = [
	["missing", ""],
	["null", "date: null\n"],
	["blank", 'date: "  "\n'],
	["invalid", "date: not-a-date\n"],
	["impossible", 'date: "2026-02-30"\n'],
	["impossible-unquoted", "date: 2026-02-30\n"],
	["impossible-month", "date: 2026-13-01\n"],
	["impossible-stamp", "date: 2026-02-30T00:00:00Z\n"],
	["non-leap", "date: 2025-02-29\n"],
	["numeric", "date: 123\n"],
	["object", "date: { year: 2026 }\n"],
];
const validDates = [
	["calendar", "date: 2026-01-01\n", "2026-01-01T00:00:00.000Z"],
	["quoted", 'date: "2024-02-29"\n', "2024-02-29"],
	["timestamp", 'date: "2026-01-01T23:30:00-05:00"\n', "2026-01-01T23:30:00-05:00"],
];
await Promise.all(
	["blog", "projects"].map(async (kind) => {
		const destination = join(directory, "content", kind);
		await mkdir(destination, { recursive: true });
		await Promise.all(
			[...invalidDates, ...validDates].map(([slug, date]) =>
				writeFile(
					join(destination, `${slug}.md`),
					`---\ntitle: ${slug}\n${date}---\nLocal content fixture.\n`
				)
			)
		);
	})
);
await writeFile(
	join(directory, "content/blog/updated.md"),
	"---\ntitle: Updated post\ndate: 2024-01-01\nupdated: 2026-08-07\n---\nUpdated body.\n"
);
await writeFile(
	join(directory, "content/blog/invalid-update.md"),
	'---\ntitle: Invalid update\ndate: 2024-01-01\nupdated: "2026-02-30"\n---\nBody.\n'
);
await writeFile(
	join(directory, "content/blog/draft.md"),
	"---\ntitle: Draft\ndate: 2026-01-01\ndraft: true\n---\nDraft body.\n"
);
await writeFile(
	join(directory, "content/blog/leap.md"),
	"---\ntitle: Leap\ndate: 2024-02-29\n---\nLeap day.\n"
);

const { getBlogPost, getBlogPosts, getAllBlogSlugs } = await import("../lib/blog.ts");
const { getProject, getProjects } = await import("../lib/projects.ts");
const { default: sitemap } = await import("../app/sitemap.ts");
const { GET: feed } = await import("../app/feed.xml/route.ts");

for (const [slug] of invalidDates) {
	test(`a ${slug} publication date cannot publish a blog post`, async () => {
		assert.equal(await getBlogPost(slug), null);
	});
	test(`a ${slug} project date stays unknown without hiding the project`, async () => {
		const project = await getProject(slug);
		assert.ok(project);
		assert.equal(project.date, undefined);
	});
}

for (const [slug, , expected] of validDates) {
	test(`${slug} dates retain their authored calendar day or timestamp`, async () => {
		assert.equal((await getBlogPost(slug))?.date, expected);
		assert.equal((await getProject(slug))?.date, expected);
	});
}

test("publication lists and slugs exclude invalid dates and production drafts", async () => {
	const expected = ["calendar", "invalid-update", "leap", "quoted", "timestamp", "updated"];
	assert.deepEqual((await getBlogPosts()).map((post) => post.slug).sort(), expected);
	assert.deepEqual((await getAllBlogSlugs()).sort(), expected);
	assert.equal(await getBlogPost("draft"), null);
	assert.equal((await getBlogPost("invalid-update"))?.updated, undefined);
});

test("projects sort dated work first and retain every undated project", async () => {
	const projects = await getProjects();
	assert.equal(projects.length, invalidDates.length + validDates.length);
	assert.deepEqual(
		projects.slice(0, 3).map((project) => project.slug),
		["timestamp", "calendar", "quoted"]
	);
	assert.ok(projects.slice(3).every((project) => project.date === undefined));
});

test("sitemap uses authored updates and omits unknown modification dates", async () => {
	const entries = await sitemap();
	const updated = entries.find((entry) => entry.url.endsWith("/blog/updated"));
	assert.equal(new Date(updated.lastModified).toISOString(), "2026-08-07T00:00:00.000Z");
	const invalidUpdate = entries.find((entry) => entry.url.endsWith("/blog/invalid-update"));
	assert.equal(new Date(invalidUpdate.lastModified).toISOString(), "2024-01-01T00:00:00.000Z");
	for (const [slug] of invalidDates) {
		assert.equal(
			entries.some((entry) => entry.url.endsWith(`/blog/${slug}`)),
			false
		);
		const project = entries.find((entry) => entry.url.endsWith(`/projects/${slug}`));
		assert.ok(project);
		assert.equal(project.lastModified, undefined);
	}
	assert.equal(
		entries.some((entry) => entry.url.endsWith("/blog/draft")),
		false
	);
	for (const entry of entries) {
		if (entry.lastModified !== undefined) {
			assert.ok(Number.isFinite(new Date(entry.lastModified).getTime()), entry.url);
		}
	}
});

test("static sitemap pages omit modification dates and stay stable as the clock advances", async (context) => {
	context.mock.timers.enable({ apis: ["Date"], now: Date.UTC(2030, 0, 1) });
	const first = await sitemap();
	for (const path of [
		"/",
		"/projects",
		"/portfolio",
		"/blog",
		"/resume",
		"/contact",
		"/privacy",
		"/terms",
	]) {
		const entry = first.find((item) => new URL(item.url).pathname === path);
		assert.ok(entry, `${path} should remain discoverable`);
		assert.equal(entry.lastModified, undefined, `${path} has no recorded modification date`);
	}
	context.mock.timers.setTime(Date.UTC(2040, 0, 1));
	assert.deepEqual(await sitemap(), first, "time alone must not change sitemap entries");
});

test("an unquoted leap day stays February 29", async () => {
	assert.equal((await getBlogPost("leap"))?.date, "2024-02-29T00:00:00.000Z");
});

test("an impossible unquoted date leaves the rest of the project front matter", async () => {
	const project = await getProject("impossible-unquoted");
	assert.ok(project);
	assert.equal(project.title, "impossible-unquoted");
	assert.equal(project.date, undefined);
	assert.equal(project.content.trim(), "Local content fixture.");
});

test("RSS includes only publishable posts with valid publication dates", async () => {
	const response = await feed();
	assert.equal(response.status, 200);
	const xml = await response.text();
	assert.equal([...xml.matchAll(/<item>/g)].length, 6);
	assert.equal(xml.includes("Invalid Date"), false);
	for (const [slug] of invalidDates) {
		assert.equal(xml.includes(`/blog/${slug}<`), false);
	}
	assert.equal(xml.includes("/blog/draft<"), false);
	assert.ok(xml.includes("Thu, 01 Jan 2026 00:00:00 GMT"));
});
