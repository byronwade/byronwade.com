import type { MetadataRoute } from "next";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";
import { getAllProjectSlugs, getProject } from "@/lib/projects";

type ChangeFrequency = "daily" | "weekly" | "monthly" | "yearly";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";
	const currentDate = new Date();

	const staticPages: MetadataRoute.Sitemap = [
		{ url: baseUrl, lastModified: currentDate, changeFrequency: "daily", priority: 1.0 },
		{
			url: `${baseUrl}/projects`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.85,
		},
		{
			url: `${baseUrl}/resume`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: currentDate,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/terms`,
			lastModified: currentDate,
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];

	const blogSlugs = await getAllBlogSlugs();
	const blogPages: MetadataRoute.Sitemap = await Promise.all(
		blogSlugs.map(async (slug) => {
			const post = await getBlogPost(slug);
			return {
				url: `${baseUrl}/blog/${slug}`,
				lastModified: post?.date ? new Date(post.date) : currentDate,
				changeFrequency: "monthly" as ChangeFrequency,
				priority: 0.7,
			};
		})
	);

	const projectSlugs = await getAllProjectSlugs();
	const projectPages: MetadataRoute.Sitemap = await Promise.all(
		projectSlugs.map(async (slug) => {
			const project = await getProject(slug);
			return {
				url: `${baseUrl}/projects/${slug}`,
				lastModified: project?.date ? new Date(project.date) : currentDate,
				changeFrequency: "monthly" as ChangeFrequency,
				priority: 0.7,
			};
		})
	);

	return [...staticPages, ...blogPages, ...projectPages];
}
