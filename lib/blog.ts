import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	excerpt?: string;
	content: string;
	readingTime: number; // in minutes
}

function calculateReadingTime(content: string): number {
	const wordsPerMinute = 200;
	const words = content.trim().split(/\s+/).length;
	return Math.max(1, Math.ceil(words / wordsPerMinute));
}

const blogDirectory = join(process.cwd(), "content/blog");

export async function getBlogPosts(): Promise<BlogPost[]> {
	try {
		const files = await readdir(blogDirectory);
		const markdownFiles = files.filter((file) => file.endsWith(".md"));

		const posts = await Promise.all(
			markdownFiles.map(async (file) => {
				const slug = file.replace(/\.md$/, "");
				const fullPath = join(blogDirectory, file);
				const fileContents = await readFile(fullPath, "utf8");
				const { data, content } = matter(fileContents);

				return {
					slug,
					title: data.title || slug,
					date: data.date || new Date().toISOString(),
					excerpt: data.excerpt,
					content,
					readingTime: calculateReadingTime(content),
				};
			})
		);

		// Sort by date, newest first
		return posts.sort((a, b) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		});
	} catch (error) {
		console.error("Error reading blog posts:", error);
		return [];
	}
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
	try {
		const fullPath = join(blogDirectory, `${slug}.md`);
		const fileContents = await readFile(fullPath, "utf8");
		const { data, content } = matter(fileContents);

		return {
			slug,
			title: data.title || slug,
			date: data.date || new Date().toISOString(),
			excerpt: data.excerpt,
			content,
			readingTime: calculateReadingTime(content),
		};
	} catch (error) {
		console.error(`Error reading blog post ${slug}:`, error);
		return null;
	}
}

export async function getAllBlogSlugs(): Promise<string[]> {
	try {
		const files = await readdir(blogDirectory);
		return files.filter((file) => file.endsWith(".md")).map((file) => file.replace(/\.md$/, ""));
	} catch (error) {
		console.error("Error reading blog slugs:", error);
		return [];
	}
}




