import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * A crawler obeys only the most specific group that names it, so every rule
 * every crawler should follow lives in the `*` group, and no search engine gets
 * a group of its own that would silently skip it.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				// Share cards stay fetchable: social previews request /api/og, and the
				// longer path outranks the /api/ block.
				allow: "/api/og",
				// The other API routes are data and server work (the resume PDF launches
				// a browser; project previews spend screenshot quota), not pages.
				disallow: "/api/",
				crawlDelay: 1,
			},
			{
				// SEO scrapers and other crawlers this site turns away entirely.
				userAgent: [
					"SemrushBot",
					"AhrefsBot",
					"MJ12bot",
					"DotBot",
					"BLEXBot",
					"DataForSeoBot",
					"PetalBot",
				],
				disallow: "/",
			},
		],
		sitemap: `${siteUrl}/sitemap.xml`,
	};
}
