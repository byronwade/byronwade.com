import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import {
	type FrontMatterFields,
	frontMatterFields,
	isText,
	readContentMatter,
} from "@/lib/content-matter";
import { parseContentDate } from "@/lib/markdown-utils";

/** Hoisted so it compiles once rather than per file. */
const MD_EXTENSION = /\.md$/;

export type ProjectType = "client" | "product" | "concept" | "hobby";

interface ProjectMetric {
	label: string;
	value: string;
}

export interface Project {
	category?: string;
	content: string;
	date?: string;
	excerpt?: string;
	/** Featured on the homepage (defaults to flagship). */
	featured?: boolean;
	/** Floats to the top of the index with a flagship marker. */
	flagship?: boolean;
	/** Key proof metrics shown on homepage + project detail. */
	metrics?: ProjectMetric[];
	/** Explicit ordering among flagships (lower first); non-flagships sort by date. */
	order?: number;
	/** One-line outcome / result. */
	outcome?: string;
	/** One-line problem statement for case-study proof. */
	problem?: string;
	slug: string;
	/** Short status label, e.g. "Live", "In development", "Open source". */
	status?: string;
	/** Punchy phrase shown inline in the index (falls back to nothing). */
	tagline?: string;
	title: string;
	type?: ProjectType;
	url?: string;
}

const projectsDirectory = join(process.cwd(), "content/projects");

/** Also the order a category is matched in when `type` is absent. */
const PROJECT_TYPES: readonly ProjectType[] = ["client", "concept", "product", "hobby"];
const WEB_PROTOCOLS = new Set(["https:", "http:"]);

function resolveType(fields: FrontMatterFields, category?: string): ProjectType | undefined {
	const explicitType = fields.text("type");
	if (explicitType !== undefined) {
		const known = PROJECT_TYPES.find((type) => type === explicitType);
		if (known) {
			return known;
		}
		fields.report("type", PROJECT_TYPES.join(", "));
	}
	const cat = category?.toLowerCase();
	return cat ? PROJECT_TYPES.find((type) => cat.includes(type)) : undefined;
}

/** The link and the preview allowlist both need an absolute web address. */
function readUrl(fields: FrontMatterFields): string | undefined {
	const url = fields.text("url");
	if (url === undefined || (URL.canParse(url) && WEB_PROTOCOLS.has(new URL(url).protocol))) {
		return url;
	}
	return fields.report("url", "an absolute http(s) address");
}

/** Metrics are often figures, so a number reads as its text. */
function metricText(value: unknown): string {
	if (isText(value)) {
		return value.trim();
	}
	return Number.isFinite(value) ? String(value) : "";
}

function metricEntry(item: unknown): ProjectMetric | undefined {
	if (typeof item !== "object" || item === null || !("label" in item && "value" in item)) {
		return;
	}
	const label = metricText(item.label);
	const value = metricText(item.value);
	return label && value ? { label, value } : undefined;
}

function parseMetrics(fields: FrontMatterFields): ProjectMetric[] | undefined {
	const metrics: ProjectMetric[] = [];
	for (const item of fields.list("metrics") ?? []) {
		const metric = metricEntry(item);
		if (metric) {
			metrics.push(metric);
		} else {
			fields.report("metrics", "entries with a text label and value");
		}
	}
	return metrics.length > 0 ? metrics : undefined;
}

function toProject(slug: string, fileContents: string): Project {
	const { data, content } = readContentMatter(fileContents);
	const fields = frontMatterFields(data, `project ${slug}`);
	const category = fields.text("category");
	const flagship = fields.flag("flagship") === true;
	return {
		slug,
		title: fields.text("title") || slug,
		url: readUrl(fields),
		category,
		type: resolveType(fields, category),
		// Undated work must not acquire a fabricated publication date at build time.
		date: parseContentDate(data.date),
		excerpt: fields.text("excerpt"),
		flagship,
		featured: fields.flag("featured") ?? flagship,
		status: fields.text("status"),
		tagline: fields.text("tagline"),
		problem: fields.text("problem"),
		outcome: fields.text("outcome"),
		metrics: parseMetrics(fields),
		order: fields.number("order"),
		content,
	};
}

export async function getProjects(): Promise<Project[]> {
	try {
		const files = await readdir(projectsDirectory);
		const markdownFiles = files.filter((file) => file.endsWith(".md"));

		// Use the same per-file boundary as detail pages: one read or YAML failure
		// must not remove healthy siblings from indexes, search or previews.
		const projects = await Promise.all(
			markdownFiles.map((file) => getProject(file.replace(MD_EXTENSION, "")))
		);

		// Sort by date, newest first
		return projects
			.filter((project) => project !== null)
			.sort((a, b) => {
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
	const projects = await getProjects();
	return projects.map((project) => project.slug);
}

/** Featured projects for the homepage, ordered by `order`, then date. */
export async function getFeaturedProjects(limit = 4): Promise<Project[]> {
	const projects = await getProjects();
	return projects
		.filter((project) => project.featured)
		.sort((a, b) => {
			const orderA = a.order ?? Number.POSITIVE_INFINITY;
			const orderB = b.order ?? Number.POSITIVE_INFINITY;
			if (orderA !== orderB) {
				return orderA - orderB;
			}
			const dateA = a.date ? new Date(a.date).getTime() : 0;
			const dateB = b.date ? new Date(b.date).getTime() : 0;
			return dateB - dateA;
		})
		.slice(0, limit);
}
