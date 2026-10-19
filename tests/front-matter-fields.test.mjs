import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import { join } from "node:path";
import { after, test } from "node:test";

const root = process.cwd();
const originalEnvironment = process.env.NODE_ENV;
await mkdir(join(root, ".next"), { recursive: true });
const directory = await mkdtemp(join(root, ".next", "front-matter-fields-"));
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

const projectFixtures = {
	valid: [
		'title: "Valid project"',
		'url: "https://valid.example/"',
		'category: "Client work"',
		'excerpt: "Readable summary."',
		'status: "Live"',
		'tagline: "a tagline"',
		'problem: "A problem."',
		'outcome: "An outcome."',
		"flagship: true",
		"order: 2",
		"date: 2026-10-16",
		"metrics:",
		"  - label: Users",
		"    value: 24",
		"  - label: Focus",
		'    value: "Reviews"',
	],
	"status-number": ["title: Status number", "status: 2026"],
	"title-object": ["title: { a: 1 }", 'excerpt: "Still listed."'],
	"url-number": ["title: Url number", "url: 42"],
	"url-script": ["title: Url script", 'url: "javascript:alert(1)"'],
	"url-relative": ["title: Url relative", 'url: "not a url"'],
	"order-nan": ["title: Order nan", "order: .nan"],
	"metric-object": [
		"title: Metric object",
		"metrics:",
		"  - label: { a: 1 }",
		'    value: "Hidden"',
		"  - label: Kept",
		'    value: "Shown"',
	],
	"flag-text": ["title: Flag text", 'flagship: "yes"', 'featured: "no"'],
	"type-unknown": ["title: Type unknown", 'type: "Client"', 'category: "Client work"'],
};

const postFixtures = {
	"tag-object": ["title: Tag object", "tags:", "  - { a: 1 }", "  - Real"],
	"title-list": ["title: [a, b]"],
	"excerpt-number": ["title: Excerpt number", "excerpt: 5"],
	"draft-yes": ["title: Draft yes", "draft: yes"],
	"draft-false": ["title: Draft false", "draft: false"],
};

async function writeFixtures(kind, fixtures, extra = []) {
	const destination = join(directory, "content", kind);
	await mkdir(destination, { recursive: true });
	await Promise.all(
		Object.entries(fixtures).map(([slug, lines]) =>
			writeFile(
				join(destination, `${slug}.md`),
				`---\n${[...lines, ...extra].join("\n")}\n---\nLocal content fixture.\n`
			)
		)
	);
}
await writeFixtures("projects", projectFixtures);
await writeFixtures("blog", postFixtures, ["date: 2026-10-16"]);

const { getProjects } = await import("../lib/projects.ts");
const { getBlogPost, getBlogPosts } = await import("../lib/blog.ts");

async function loadProjects(context) {
	const errors = [];
	context.mock.method(console, "error", (...args) => errors.push(args.join(" ")));
	const projects = Object.fromEntries(
		(await getProjects()).map((project) => [project.slug, project])
	);
	return { projects, errors };
}

function assertReported(errors, kind, slug, field) {
	assert.ok(
		errors.some((message) => message.includes(`"${field}"`) && message.includes(`${kind} ${slug}`)),
		`${kind} ${slug} reports ${field}; got ${JSON.stringify(errors)}`
	);
}

test("a wrongly typed field keeps its project listed and drops only that field", async (context) => {
	const { projects, errors } = await loadProjects(context);
	assert.deepEqual(Object.keys(projects).sort(), Object.keys(projectFixtures).sort());

	// /projects calls status.toLowerCase(); a number there broke the whole page.
	assert.equal(projects["status-number"].status, undefined);
	assertReported(errors, "project", "status-number", "status");
	// An object title is not a valid React child; the slug is the existing fallback.
	assert.equal(projects["title-object"].title, "title-object");
	assert.equal(projects["title-object"].excerpt, "Still listed.");
	assertReported(errors, "project", "title-object", "title");
	assert.equal(projects["order-nan"].order, undefined);
	assertReported(errors, "project", "order-nan", "order");
	assert.equal(projects["flag-text"].flagship, false);
	assert.equal(projects["flag-text"].featured, false);
	assertReported(errors, "project", "flag-text", "flagship");
	assertReported(errors, "project", "flag-text", "featured");
	assert.equal(projects["type-unknown"].type, "client");
	assertReported(errors, "project", "type-unknown", "type");
});

test("every project text field is text or absent", async (context) => {
	const { projects } = await loadProjects(context);
	const fields = ["title", "url", "category", "excerpt", "status", "tagline", "problem", "outcome"];
	for (const project of Object.values(projects)) {
		assert.equal(typeof project.title, "string", project.slug);
		for (const field of fields) {
			const value = project[field];
			assert.ok(value === undefined || typeof value === "string", `${project.slug}.${field}`);
		}
	}
});

test("project links must be absolute web addresses", async (context) => {
	const { projects, errors } = await loadProjects(context);
	for (const slug of ["url-number", "url-script", "url-relative"]) {
		assert.equal(projects[slug].url, undefined, slug);
		assertReported(errors, "project", slug, "url");
	}
	assert.equal(projects.valid.url, "https://valid.example/");
});

test("metrics keep valid entries, numeric values read as text, and bad labels are reported", async (context) => {
	const { projects, errors } = await loadProjects(context);
	assert.deepEqual(projects.valid.metrics, [
		{ label: "Users", value: "24" },
		{ label: "Focus", value: "Reviews" },
	]);
	assert.deepEqual(projects["metric-object"].metrics, [{ label: "Kept", value: "Shown" }]);
	assertReported(errors, "project", "metric-object", "metrics");
});

test("a fully valid project is unchanged and reports nothing", async (context) => {
	const { projects, errors } = await loadProjects(context);
	assert.deepEqual(
		{ ...projects.valid, content: projects.valid.content.trim() },
		{
			slug: "valid",
			title: "Valid project",
			url: "https://valid.example/",
			category: "Client work",
			type: "client",
			date: "2026-10-16T00:00:00.000Z",
			excerpt: "Readable summary.",
			flagship: true,
			featured: true,
			status: "Live",
			tagline: "a tagline",
			problem: "A problem.",
			outcome: "An outcome.",
			metrics: [
				{ label: "Users", value: "24" },
				{ label: "Focus", value: "Reviews" },
			],
			order: 2,
			content: "Local content fixture.",
		}
	);
	assert.ok(!errors.some((message) => message.includes("project valid")));
});

test("blog fields are text, tags drop non-text entries, and a malformed draft stays hidden", async (context) => {
	const errors = [];
	context.mock.method(console, "error", (...args) => errors.push(args.join(" ")));
	const posts = Object.fromEntries((await getBlogPosts()).map((post) => [post.slug, post]));
	assert.deepEqual(Object.keys(posts).sort(), [
		"draft-false",
		"excerpt-number",
		"tag-object",
		"title-list",
	]);
	assert.deepEqual(posts["tag-object"].tags, ["Real"]);
	assertReported(errors, "post", "tag-object", "tags");
	assert.equal(posts["title-list"].title, "title-list");
	assertReported(errors, "post", "title-list", "title");
	assert.equal(posts["excerpt-number"].excerpt, undefined);
	assertReported(errors, "post", "excerpt-number", "excerpt");
	// YAML reads `yes` as text, which used to publish the draft.
	assert.equal(await getBlogPost("draft-yes"), null);
	assertReported(errors, "post", "draft-yes", "draft");
});
