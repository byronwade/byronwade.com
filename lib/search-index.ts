import { unstable_cache } from "next/cache";
import { type BlogPost, type BlogTopic, getBlogPosts, getBlogTopics } from "@/lib/blog";
import { getProjects, type Project } from "@/lib/projects";
import { searchPlainText } from "@/lib/search-text";
import type { SearchEntry } from "@/lib/search-types";

const PAGES: SearchEntry[] = [
	{ kind: "Page", label: "Home", href: "/", keywords: "start landing" },
	{ kind: "Page", label: "Projects", href: "/projects", keywords: "work case studies products" },
	{
		kind: "Page",
		label: "Portfolio",
		href: "/portfolio",
		keywords: "design dribbble figma github shots",
	},
	{ kind: "Page", label: "Blog", href: "/blog", keywords: "writing articles posts notes" },
	{ kind: "Page", label: "Resume", href: "/resume", keywords: "cv experience work history" },
	{ kind: "Page", label: "Contact", href: "/contact", keywords: "email hire get in touch" },
	{ kind: "Page", label: "Search", href: "/search", keywords: "find command palette" },
	{ kind: "Page", label: "Privacy policy", href: "/privacy", keywords: "data information" },
	{ kind: "Page", label: "Terms of service", href: "/terms", keywords: "legal use" },
];

function joinKeywords(parts: Array<string | undefined>): string {
	return parts
		.map((part) => part?.trim() ?? "")
		.filter((part) => part.length > 0)
		.join(" ");
}

function withBody(keywords: string, body: string | undefined): string {
	if (!body) {
		return keywords;
	}
	const plain = searchPlainText(body);
	if (!plain) {
		return keywords;
	}
	return keywords ? `${keywords} ${plain}` : plain;
}

/** The short name stays the label. Breadcrumbs use it, and the rest of the title stays searchable. */
function projectLabel(title: string): string {
	return title.split(":")[0] ?? title;
}

function projectEntry(project: Project, includeBody: boolean): SearchEntry {
	const keywords = joinKeywords([
		project.title,
		project.tagline,
		project.excerpt,
		project.category,
		project.problem,
		project.outcome,
	]);
	return {
		kind: "Project",
		label: projectLabel(project.title),
		href: `/projects/${project.slug}`,
		meta: project.status ?? project.category,
		keywords: includeBody ? withBody(keywords, project.content) : keywords,
	};
}

function postEntry(post: BlogPost, includeBody: boolean): SearchEntry {
	const keywords = joinKeywords([post.excerpt, post.tags?.join(" ")]);
	return {
		kind: "Writing",
		label: post.title,
		href: `/blog/${post.slug}`,
		meta: `${post.readingTime} min read`,
		keywords: includeBody ? withBody(keywords, post.content) : keywords,
	};
}

/** Topic pages are searchable by name, and their labels name the breadcrumb leaf. */
function topicEntry(topic: BlogTopic): SearchEntry {
	return {
		kind: "Writing",
		label: topic.label,
		href: `/blog/topic/${topic.slug}`,
		meta: `${topic.posts.length} posts`,
		keywords: "topic",
	};
}

function fromCorpus(
	projects: Project[],
	posts: BlogPost[],
	topics: BlogTopic[],
	includeBody: boolean
): SearchEntry[] {
	return [
		...PAGES,
		...projects.map((project) => projectEntry(project, includeBody)),
		...posts.map((post) => postEntry(post, includeBody)),
		...topics.map(topicEntry),
	];
}

// Loader results key every body, metadata and publication change; keep file reads
// outside the cache so a repaired or newly published document is visible immediately.
// Bump this revision when the mapping, PAGES or shared Markdown grammar changes:
// Next's Data Cache can survive deployments as well as individual requests.
const cachedPageCorpus = unstable_cache(
	async (projects: Project[], posts: BlogPost[], topics: BlogTopic[]) =>
		fromCorpus(projects, posts, topics, true),
	["page-search-corpus-v2"],
	{ revalidate: false }
);

/**
 * Names, summaries, and tags for the header palette.
 * Every page ships this list, so it does not include article text.
 */
export async function buildSearchIndex(): Promise<SearchEntry[]> {
	const [projects, posts, topics] = await Promise.all([
		getProjects(),
		getBlogPosts(),
		getBlogTopics(),
	]);
	return fromCorpus(projects, posts, topics, false);
}

/**
 * The search page corpus. Same entries as the header, plus the readable text
 * of each project and article. The page is a server render, so that text stays
 * off the client.
 */
export async function buildPageSearchIndex(): Promise<SearchEntry[]> {
	const [projects, posts, topics] = await Promise.all([
		getProjects(),
		getBlogPosts(),
		getBlogTopics(),
	]);
	return process.env.NODE_ENV === "production"
		? cachedPageCorpus(projects, posts, topics)
		: fromCorpus(projects, posts, topics, true);
}
