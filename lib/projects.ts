import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

export type ProjectType = "client" | "product" | "concept" | "hobby";

export interface Project {
	slug: string;
	title: string;
	url?: string;
	category?: string;
	type?: ProjectType;
	date?: string;
	excerpt?: string;
	/** Floats to the top of the index with a flagship marker. */
	flagship?: boolean;
	/** Short status label, e.g. "Live", "In development", "Open source". */
	status?: string;
	/** Punchy phrase shown inline in the index (falls back to nothing). */
	tagline?: string;
	/** Explicit ordering among flagships (lower first); non-flagships sort by date. */
	order?: number;
	content: string;
}

const projectsDirectory = join(process.cwd(), "content/projects");

function resolveType(data: matter.GrayMatterFile<string>["data"]): ProjectType {
	if (data.type) return data.type;
	if (data.category) {
		const cat = String(data.category).toLowerCase();
		if (cat.includes("client")) return "client";
		if (cat.includes("concept")) return "concept";
		if (cat.includes("product")) return "product";
		if (cat.includes("hobby")) return "hobby";
	}
	return "hobby";
}

function toProject(slug: string, fileContents: string): Project {
	const { data, content } = matter(fileContents);
	return {
		slug,
		title: data.title || slug,
		url: data.url,
		category: data.category,
		type: resolveType(data),
		date: data.date || new Date().toISOString(),
		excerpt: data.excerpt,
		flagship: data.flagship === true,
		status: data.status,
		tagline: data.tagline,
		order: typeof data.order === "number" ? data.order : undefined,
		content,
	};
}

export async function getProjects(): Promise<Project[]> {
	try {
		const files = await readdir(projectsDirectory);
		const markdownFiles = files.filter((file) => file.endsWith(".md"));

		const projects = await Promise.all(
			markdownFiles.map(async (file) => {
				const slug = file.replace(/\.md$/, "");
				const fullPath = join(projectsDirectory, file);
				const fileContents = await readFile(fullPath, "utf8");
				return toProject(slug, fileContents);
			})
		);

		// Sort by date, newest first
		return projects.sort((a, b) => {
			const dateA = a.date ? new Date(a.date).getTime() : 0;
			const dateB = b.date ? new Date(b.date).getTime() : 0;
			return dateB - dateA;
		});
	} catch (error) {
		console.error("Error reading projects:", error);
		return [];
	}
}

export async function getProject(slug: string): Promise<Project | null> {
	try {
		const fullPath = join(projectsDirectory, `${slug}.md`);
		const fileContents = await readFile(fullPath, "utf8");
		return toProject(slug, fileContents);
	} catch (error) {
		console.error(`Error reading project ${slug}:`, error);
		return null;
	}
}

export async function getAllProjectSlugs(): Promise<string[]> {
	try {
		const files = await readdir(projectsDirectory);
		return files.filter((file) => file.endsWith(".md")).map((file) => file.replace(/\.md$/, ""));
	} catch (error) {
		console.error("Error reading project slugs:", error);
		return [];
	}
}
