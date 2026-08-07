import type { Metadata } from "next";
import { getContactForStructuredData } from "@/lib/contact";
import { siteUrl } from "@/lib/site";

const siteName = "Byron Wade";
const defaultDescription =
	"Expert full-stack developer specializing in high-performance web applications, modern JavaScript frameworks, and scalable solutions.";
const defaultAuthor = "Byron Wade";

interface SEOConfig {
	alternateLanguages?: Record<string, string>;
	author?: string;
	canonical?: string;
	description?: string;
	image?: string;
	keywords?: string[];
	modifiedTime?: string;
	nofollow?: boolean;
	noindex?: boolean;
	publishedTime?: string;
	structuredData?: Record<string, unknown>;
	tags?: string[];
	title: string;
	type?: "website" | "article" | "project";
}

/**
 * Generate comprehensive metadata for any page
 */
export function generateMetadata(config: SEOConfig): Metadata {
	const {
		title,
		description = defaultDescription,
		keywords = [],
		image,
		type = "website",
		author = defaultAuthor,
		publishedTime,
		modifiedTime,
		tags = [],
		canonical,
		noindex = false,
		nofollow = false,
		alternateLanguages = {},
	} = config;

	const fullTitle = title.includes("|") ? title : `${title} | ${siteName}`;
	const ogImage =
		image ||
		`${siteUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=${type}${tags.length > 0 ? `&tags=${encodeURIComponent(tags.join(", "))}` : ""}${publishedTime ? `&date=${encodeURIComponent(publishedTime)}` : ""}`;
	const pageUrl = canonical || siteUrl;

	// Combine default keywords with page-specific ones
	const allKeywords = [
		"Full Stack Developer",
		"Web Development",
		"JavaScript Expert",
		"React Developer",
		"NextJS Developer",
		"Web Performance",
		"SEO Optimization",
		"Byron Wade",
		"California Developer",
		"Tech Entrepreneur",
		"Accessibility",
		"Web Standards",
		...keywords,
	];

	const metadata: Metadata = {
		metadataBase: new URL(siteUrl),
		title: fullTitle,
		description,
		keywords: allKeywords,
		authors: [{ name: author, url: siteUrl }],
		creator: author,
		publisher: author,
		applicationName: siteName,
		generator: "Next.js",
		referrer: "origin-when-cross-origin",
		category: "technology",
		formatDetection: {
			email: false,
			address: false,
			telephone: false,
		},
		robots: {
			index: !noindex,
			follow: !nofollow,
			nocache: false,
			googleBot: {
				index: !noindex,
				follow: !nofollow,
				noimageindex: false,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		alternates: {
			canonical: pageUrl,
			languages: {
				"en-US": pageUrl,
				en: pageUrl,
				...alternateLanguages,
			},
			types: {
				"application/rss+xml": `${siteUrl}/feed.xml`,
			},
		},
		openGraph: {
			type: type === "article" ? "article" : type === "project" ? "website" : "website",
			locale: "en_US",
			alternateLocale: ["en_GB", "en_CA"],
			siteName,
			title: fullTitle,
			description,
			url: pageUrl,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: `${title} - ${siteName}`,
					type: "image/png",
				},
			],
			...(type === "article" && publishedTime
				? {
						publishedTime,
						modifiedTime: modifiedTime || publishedTime,
						authors: [author],
						tags: tags.length > 0 ? tags : undefined,
					}
				: {}),
		},
		twitter: {
			card: "summary_large_image",
			site: "@byronwade",
			creator: "@byronwade",
			title: fullTitle,
			description,
			images: [ogImage],
		},
		other: {
			"article:author": author,
			...(tags.length > 0
				? {
						"article:tag": tags.join(", "),
					}
				: {}),
			"theme-color": "#000000",
			"msapplication-TileColor": "#000000",
		},
	};

	return metadata;
}

/**
 * Generate Open Graph image URL
 */
export function generateOGImageUrl(params: {
	title: string;
	description?: string;
	type?: "website" | "article" | "project" | "blog";
	tags?: string[];
	author?: string;
	date?: string;
}): string {
	const { title, description, type = "website", tags, author, date } = params;
	const queryParams = new URLSearchParams({
		title,
		...(description ? { description } : {}),
		type,
		...(tags && tags.length > 0 ? { tags: tags.join(", ") } : {}),
		...(author ? { author } : {}),
		...(date ? { date } : {}),
	});
	return `${siteUrl}/api/og?${queryParams.toString()}`;
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
	items: { name: string; url: string }[]
): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};
}

/**
 * Generate Article structured data
 */
export function generateArticleStructuredData(params: {
	title: string;
	description: string;
	author: string;
	publishedTime: string;
	modifiedTime?: string;
	image?: string;
	url: string;
	tags?: string[];
}): Record<string, unknown> {
	const { title, description, author, publishedTime, modifiedTime, image, url, tags } = params;
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: title,
		description,
		author: {
			"@type": "Person",
			name: author,
			url: siteUrl,
		},
		publisher: {
			"@type": "Organization",
			name: siteName,
			url: siteUrl,
			logo: {
				"@type": "ImageObject",
				url: `${siteUrl}/logo.avif`,
			},
		},
		datePublished: publishedTime,
		dateModified: modifiedTime || publishedTime,
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": url,
		},
		...(image
			? {
					image: {
						"@type": "ImageObject",
						url: image,
						width: 1200,
						height: 630,
					},
				}
			: {}),
		...(tags && tags.length > 0
			? {
					keywords: tags.join(", "),
				}
			: {}),
	};
}

/**
 * Generate WebSite structured data
 */
export function generateWebSiteStructuredData(): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: siteName,
		url: siteUrl,
		description: defaultDescription,
		publisher: {
			"@type": "Person",
			name: defaultAuthor,
			url: siteUrl,
		},
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${siteUrl}/search?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationStructuredData(): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: siteName,
		url: siteUrl,
		logo: `${siteUrl}/logo.avif`,
		sameAs: [
			"https://github.com/byronwade",
			"https://linkedin.com/in/byronwade",
			"https://twitter.com/byron_c_wade",
		],
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "Professional",
			email: getContactForStructuredData().email,
			areaServed: "US",
			availableLanguage: "English",
		},
	};
}

/**
 * Generate Person structured data (enhanced)
 */
export function generatePersonStructuredData(): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		name: defaultAuthor,
		url: siteUrl,
		image: `${siteUrl}/avatar.avif`,
		sameAs: [
			"https://github.com/byronwade",
			"https://linkedin.com/in/byronwade",
			"https://twitter.com/byron_c_wade",
		],
		jobTitle: "Full Stack Developer",
		worksFor: {
			"@type": "Organization",
			name: "Byron Wade Development",
		},
		knowsAbout: [
			"Web Development",
			"JavaScript",
			"React",
			"Next.js",
			"Node.js",
			"TypeScript",
			"Performance Optimization",
			"SEO",
			"Accessibility",
		],
		description: defaultDescription,
		address: {
			"@type": "PostalAddress",
			addressLocality: "Jasper",
			addressRegion: "GA",
			addressCountry: "US",
		},
		email: getContactForStructuredData().email,
		hasOccupation: {
			"@type": "Occupation",
			name: "Full Stack Developer",
			occupationLocation: {
				"@type": "City",
				name: "Jasper, GA",
			},
			skills:
				"JavaScript, TypeScript, React, Next.js, Node.js, Python, Web Performance, SEO, Accessibility",
		},
	};
}

/**
 * Generate Project structured data
 */
export function generateProjectStructuredData(params: {
	title: string;
	description: string;
	url?: string;
	image?: string;
	datePublished?: string;
	category?: string;
}): Record<string, unknown> {
	const { title, description, url, image, datePublished, category } = params;
	return {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: title,
		description,
		author: {
			"@type": "Person",
			name: defaultAuthor,
			url: siteUrl,
		},
		publisher: {
			"@type": "Organization",
			name: siteName,
			url: siteUrl,
			logo: {
				"@type": "ImageObject",
				url: `${siteUrl}/logo.avif`,
			},
		},
		...(url
			? {
					url,
					mainEntityOfPage: {
						"@type": "WebPage",
						"@id": url,
					},
				}
			: {}),
		...(image
			? {
					image: {
						"@type": "ImageObject",
						url: image,
						width: 1200,
						height: 630,
					},
				}
			: {}),
		...(datePublished
			? {
					datePublished,
				}
			: {}),
		...(category
			? {
					keywords: category,
				}
			: {}),
	};
}
