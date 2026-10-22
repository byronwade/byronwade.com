import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import matter from "gray-matter";

const directory = new URL("../content/projects/", import.meta.url);
const projects = readdirSync(directory)
	.filter((file) => file.endsWith(".md"))
	.map((file) => ({
		slug: file.slice(0, -3),
		data: matter(readFileSync(new URL(file, directory), "utf8")).data,
	}));

// The projects list shows the name before the first colon, then the tagline.
test("every project row has a short name and a tagline", () => {
	assert.ok(projects.length > 0, "content/projects should not be empty");
	const problems = [];
	for (const { slug, data } of projects) {
		if (String(data.title).split(":")[0].includes(",")) {
			problems.push(`${slug}: put the subtitle after a colon, not a comma`);
		}
		const tagline = typeof data.tagline === "string" ? data.tagline.trim() : "";
		if (!tagline) {
			problems.push(`${slug}: add a tagline`);
		} else if (tagline.length > 36) {
			problems.push(`${slug}: keep the tagline to 36 characters`);
		}
	}
	assert.deepEqual(problems, []);
});
