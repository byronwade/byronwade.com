import { MetadataRoute } from "next";

type ChangeFrequency = "daily" | "weekly" | "monthly" | "yearly" | "always" | "hourly" | "never";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://byronwade.com";
	const currentDate = new Date().toISOString();

	// Define static pages first
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: currentDate,
			changeFrequency: "daily" as ChangeFrequency,
			priority: 1,
		},
		{
			url: `${baseUrl}/about-me`,
			lastModified: currentDate,
			changeFrequency: "monthly" as ChangeFrequency,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: currentDate,
			changeFrequency: "daily" as ChangeFrequency,
			priority: 0.9,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: currentDate,
			changeFrequency: "monthly" as ChangeFrequency,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/portfolio`,
			lastModified: currentDate,
			changeFrequency: "weekly" as ChangeFrequency,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/work-with-me`,
			lastModified: currentDate,
			changeFrequency: "monthly" as ChangeFrequency,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/tools`,
			lastModified: currentDate,
			changeFrequency: "weekly" as ChangeFrequency,
			priority: 0.7,
		},
		{
			url: `${baseUrl}/development`,
			lastModified: currentDate,
			changeFrequency: "weekly" as ChangeFrequency,
			priority: 0.7,
		},
		{
			url: `${baseUrl}/design`,
			lastModified: currentDate,
			changeFrequency: "weekly" as ChangeFrequency,
			priority: 0.7,
		},
		{
			url: `${baseUrl}/marketing`,
			lastModified: currentDate,
			changeFrequency: "weekly" as ChangeFrequency,
			priority: 0.7,
		},
		{
			url: `${baseUrl}/analysis`,
			lastModified: currentDate,
			changeFrequency: "weekly" as ChangeFrequency,
			priority: 0.7,
		},
	];

	// Return only static pages for now until we fix the blog posts fetching
	return staticPages;
}
