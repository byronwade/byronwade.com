import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

export type ProjectType = "client" | "product" | "hobby";

export interface Project {
	slug: string;
	title: string;
	url?: string;
	category?: string;
	type?: ProjectType;
	date?: string;
	excerpt?: string;
	content: string;
}

const projectsDirectory = join(process.cwd(), "content/projects");

export async function getProjects(): Promise<Project[]> {
	try {
		const files = await readdir(projectsDirectory);
		const markdownFiles = files.filter((file) => file.endsWith(".md"));

		const projects = await Promise.all(
			markdownFiles.map(async (file) => {
				const slug = file.replace(/\.md$/, "");
				const fullPath = join(projectsDirectory, file);
				const fileContents = await readFile(fullPath, "utf8");
				const { data, content } = matter(fileContents);

				// Determine type from category or explicit type field
				let type: ProjectType = "hobby";
				if (data.type) {
					type = data.type;
				} else if (data.category) {
					const cat = data.category.toLowerCase();
					if (cat.includes("client")) type = "client";
					else if (cat.includes("product")) type = "product";
					else if (cat.includes("hobby")) type = "hobby";
				}

				return {
					slug,
					title: data.title || slug,
					url: data.url,
					category: data.category,
					type,
					date: data.date || new Date().toISOString(),
					excerpt: data.excerpt,
					content,
				};
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
		const { data, content } = matter(fileContents);

		// Determine type from category or explicit type field
		let type: ProjectType = "hobby";
		if (data.type) {
			type = data.type;
		} else if (data.category) {
			const cat = data.category.toLowerCase();
			if (cat.includes("client")) type = "client";
			else if (cat.includes("product")) type = "product";
			else if (cat.includes("hobby")) type = "hobby";
		}

		return {
			slug,
			title: data.title || slug,
			url: data.url,
			category: data.category,
			type,
			date: data.date || new Date().toISOString(),
			excerpt: data.excerpt,
			content,
		};
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




