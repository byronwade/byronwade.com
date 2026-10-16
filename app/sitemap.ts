import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog";
import { getProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const currentDate = new Date();

	const staticPages: MetadataRoute.Sitemap = [
		{ url: siteUrl, lastModified: currentDate, changeFrequency: "daily", priority: 1.0 },
		{
			url: `${siteUrl}/projects`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/portfolio`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/blog`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.85,
		},
		{
			url: `${siteUrl}/resume`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${siteUrl}/contact`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${siteUrl}/privacy`,
			lastModified: currentDate,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${siteUrl}/terms`,
			lastModified: currentDate,
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];

	const [posts, projects] = await Promise.all([getBlogPosts(), getProjects()]);
	const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
		url: `${siteUrl}/blog/${post.slug}`,
		lastModified: new Date(post.updated ?? post.date),
		changeFrequency: "monthly",
		priority: 0.7,
	}));
	const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
		url: `${siteUrl}/projects/${project.slug}`,
		...(project.date ? { lastModified: new Date(project.date) } : {}),
		changeFrequency: "monthly",
		priority: 0.7,
	}));

	return [...staticPages, ...blogPages, ...projectPages];
}
