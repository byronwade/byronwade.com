import type { MetadataRoute } from "next";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";
import { getAllProjectSlugs, getProject } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

type ChangeFrequency = "daily" | "weekly" | "monthly" | "yearly";

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

	const [blogSlugs, projectSlugs] = await Promise.all([getAllBlogSlugs(), getAllProjectSlugs()]);
	const [blogPages, projectPages]: [MetadataRoute.Sitemap, MetadataRoute.Sitemap] =
		await Promise.all([
			Promise.all(
				blogSlugs.map(async (slug) => {
					const post = await getBlogPost(slug);
					return {
						url: `${siteUrl}/blog/${slug}`,
						lastModified: post?.date ? new Date(post.date) : currentDate,
						changeFrequency: "monthly" as ChangeFrequency,
						priority: 0.7,
					};
				})
			),
			Promise.all(
				projectSlugs.map(async (slug) => {
					const project = await getProject(slug);
					return {
						url: `${siteUrl}/projects/${slug}`,
						lastModified: project?.date ? new Date(project.date) : currentDate,
						changeFrequency: "monthly" as ChangeFrequency,
						priority: 0.7,
					};
				})
			),
		]);

	return [...staticPages, ...blogPages, ...projectPages];
}
