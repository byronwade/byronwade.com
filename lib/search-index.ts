import { getBlogPosts } from "./blog";
import { getProjects } from "./projects";
import type { SearchEntry } from "./search-types";

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
];

/** Build the ⌘K search corpus from static pages + project and blog content. */
export async function buildSearchIndex(): Promise<SearchEntry[]> {
	const [projects, posts] = await Promise.all([getProjects(), getBlogPosts()]);

	const projectEntries: SearchEntry[] = projects.map((p) => ({
		kind: "Project",
		label: p.title.split(":")[0] ?? p.title,
		href: `/projects/${p.slug}`,
		meta: p.status ?? p.category,
		keywords: [p.tagline, p.excerpt, p.category].filter(Boolean).join(" "),
	}));

	const postEntries: SearchEntry[] = posts.map((p) => ({
		kind: "Writing",
		label: p.title,
		href: `/blog/${p.slug}`,
		meta: `${p.readingTime} min read`,
		keywords: p.excerpt ?? "",
	}));

	return [...PAGES, ...projectEntries, ...postEntries];
}
