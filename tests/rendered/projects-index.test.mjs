import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { test } from "node:test";
import matter from "gray-matter";

const TAG = /<[^>]+>/g;
const ENTITY = /&(?:amp|#x27|#39|quot|lt|gt);/g;
const SPACE = /\s+/g;
const ENTITIES = {
	"&amp;": "&",
	"&#x27;": "'",
	"&#39;": "'",
	"&quot;": '"',
	"&lt;": "<",
	"&gt;": ">",
};

function rowText(html, slug) {
	const link = html.indexOf(`href="/projects/${slug}"`);
	assert.ok(link >= 0, `/projects should link to /projects/${slug}`);
	const open = html.indexOf(">", link) + 1;
	return html
		.slice(open, html.indexOf("</a>", open))
		.replace(TAG, " ")
		.replace(ENTITY, (entity) => ENTITIES[entity])
		.replace(SPACE, " ")
		.trim();
}

test("built projects list shows each short name followed by its tagline", async (context) => {
	const html = await readFile(
		new URL("../../.next/server/app/projects.html", import.meta.url),
		"utf8"
	).catch(() => assert.fail("Run npm run build before checking the projects list"));
	const directory = new URL("../../content/projects/", import.meta.url);
	const files = (await readdir(directory)).filter((file) => file.endsWith(".md"));
	const sources = await Promise.all(
		files.map((file) => readFile(new URL(file, directory), "utf8"))
	);
	for (const [index, file] of files.entries()) {
		const slug = file.slice(0, -3);
		const { data } = matter(sources[index]);
		const name = String(data.title).split(":")[0];
		const text = rowText(html, slug);
		assert.ok(
			text.startsWith(`${name} ${data.tagline}`),
			`${slug}: expected "${name} ${data.tagline}", got "${text}"`
		);
	}
	context.diagnostic(`Checked ${files.length} project rows`);
});
