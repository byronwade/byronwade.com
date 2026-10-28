import type { MetadataRoute } from "next";
import { getBlogPosts, getBlogTopics } from "@/lib/blog";
import { getProjects } from "@/lib/projects";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Only authored content below has a recorded date; deployments are not page edits.
	const staticPages: MetadataRoute.Sitemap = [
		{ url: siteUrl, changeFrequency: "daily", priority: 1.0 },
		{
			url: `${siteUrl}/projects`,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/portfolio`,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${siteUrl}/blog`,
			changeFrequency: "weekly",
			priority: 0.85,
		},
		{
			url: `${siteUrl}/resume`,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${siteUrl}/contact`,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${siteUrl}/privacy`,
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${siteUrl}/terms`,
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];

	const [posts, topics, projects] = await Promise.all([
		getBlogPosts(),
		getBlogTopics(),
		getProjects(),
	]);
	const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
		url: `${siteUrl}/blog/${post.slug}`,
		lastModified: new Date(post.updated ?? post.date),
		changeFrequency: "monthly",
		priority: 0.7,
	}));
	// Topics follow publication order, but an older post can have the latest edit.
	const topicPages: MetadataRoute.Sitemap = topics.map((topic) => {
		const latestChange = Math.max(
			...topic.posts.map((post) => new Date(post.updated ?? post.date).getTime())
		);
		return {
			url: `${siteUrl}/blog/topic/${topic.slug}`,
			lastModified: new Date(latestChange),
			changeFrequency: "monthly",
			priority: 0.5,
		};
	});
	const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
		url: `${siteUrl}/projects/${project.slug}`,
		...(project.date ? { lastModified: new Date(project.date) } : {}),
		changeFrequency: "monthly",
		priority: 0.7,
	}));

	return [...staticPages, ...blogPages, ...topicPages, ...projectPages];
}
