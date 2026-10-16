import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { parseContentDate } from "@/lib/markdown-utils";

/** Hoisted so each compiles once rather than per file/post. */
const WHITESPACE = /\s+/;
const MD_EXTENSION = /\.md$/;

export interface BlogPost {
	content: string;
	date: string;
	excerpt?: string;
	readingTime: number; // in minutes
	slug: string;
	tags?: string[];
	title: string;
	updated?: string;
}

function parseTags(raw: unknown): string[] | undefined {
	if (!Array.isArray(raw)) {
		return;
	}
	const tags = raw.reduce<string[]>((acc, tag) => {
		const trimmed = String(tag).trim();
		if (trimmed) {
			acc.push(trimmed);
		}
		return acc;
	}, []);
	return tags.length > 0 ? tags : undefined;
}

function calculateReadingTime(content: string): number {
	const wordsPerMinute = 200;
	const words = content.trim().split(WHITESPACE).length;
	return Math.max(1, Math.ceil(words / wordsPerMinute));
}

const blogDirectory = join(process.cwd(), "content/blog");

export async function getBlogPosts(): Promise<BlogPost[]> {
	try {
		const files = await readdir(blogDirectory);
		const markdownFiles = files.filter((file) => file.endsWith(".md"));

		const posts = await Promise.all(
			markdownFiles.map((file) => getBlogPost(file.replace(MD_EXTENSION, "")))
		);

		// Sort by date, newest first
		return posts
			.filter((post) => post !== null)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

		// Local previews only. All readers, including direct URLs, share this boundary.
		if (data.draft === true && process.env.NODE_ENV !== "development") {
			return null;
		}
		const date = parseContentDate(data.date);
		if (!date) {
			console.error(`Skipping blog post ${slug}: missing or invalid publication date`);
			return null;
		}

		return {
			slug,
			title: data.title || slug,
			date,
			updated: parseContentDate(data.updated),
			excerpt: data.excerpt,
			tags: parseTags(data.tags),
			content,
			readingTime: calculateReadingTime(content),
		};
	} catch (error) {
		console.error(`Error reading blog post ${slug}:`, error);
		return null;
	}
}

export async function getAllBlogSlugs(): Promise<string[]> {
	const posts = await getBlogPosts();
	return posts.map((post) => post.slug);
}
