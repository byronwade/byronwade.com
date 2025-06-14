import { MetadataRoute } from "next";

type ChangeFrequency = "daily" | "weekly" | "monthly" | "yearly" | "always" | "hourly" | "never";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";
	const currentDate = new Date().toISOString();

	// Define static pages with optimized priorities
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: currentDate,
			changeFrequency: "daily" as ChangeFrequency,
			priority: 1.0,
		},
		{
			url: `${baseUrl}/portfolio`,
			lastModified: currentDate,
			changeFrequency: "weekly" as ChangeFrequency,
			priority: 0.9,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: currentDate,
			changeFrequency: "monthly" as ChangeFrequency,
			priority: 0.9,
		},
		{
			url: `${baseUrl}/resume`,
			lastModified: currentDate,
			changeFrequency: "monthly" as ChangeFrequency,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/work-with-me`,
			lastModified: currentDate,
			changeFrequency: "monthly" as ChangeFrequency,
			priority: 0.8,
		},
		// Service pages
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
			url: `${baseUrl}/tools`,
			lastModified: currentDate,
			changeFrequency: "weekly" as ChangeFrequency,
			priority: 0.6,
		},
		{
			url: `${baseUrl}/analysis`,
			lastModified: currentDate,
			changeFrequency: "weekly" as ChangeFrequency,
			priority: 0.6,
		},
		// Location-specific pages
		{
			url: `${baseUrl}/plumbing-santa-cruz`,
			lastModified: currentDate,
			changeFrequency: "monthly" as ChangeFrequency,
			priority: 0.7,
		},
		{
			url: `${baseUrl}/plumbing-jasper`,
			lastModified: currentDate,
			changeFrequency: "monthly" as ChangeFrequency,
			priority: 0.7,
		},
		{
			url: `${baseUrl}/virtual-plumbing`,
			lastModified: currentDate,
			changeFrequency: "monthly" as ChangeFrequency,
			priority: 0.6,
		},
		{
			url: `${baseUrl}/local/website-design`,
			lastModified: currentDate,
			changeFrequency: "monthly" as ChangeFrequency,
			priority: 0.6,
		},
	];

	return staticPages;
}
