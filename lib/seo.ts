import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";
const siteName = "Byron Wade";
const defaultDescription =
	"Expert full-stack developer specializing in high-performance web applications, modern JavaScript frameworks, and scalable solutions.";
const defaultAuthor = "Byron Wade";

export interface SEOConfig {
	title: string;
	description?: string;
	keywords?: string[];
	image?: string;
	type?: "website" | "article" | "project";
	author?: string;
	publishedTime?: string;
	modifiedTime?: string;
	tags?: string[];
	canonical?: string;
	noindex?: boolean;
	nofollow?: boolean;
	alternateLanguages?: Record<string, string>;
	structuredData?: Record<string, unknown>;
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
		`${baseUrl}/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&type=${type}${tags.length > 0 ? `&tags=${encodeURIComponent(tags.join(", "))}` : ""}${publishedTime ? `&date=${encodeURIComponent(publishedTime)}` : ""}`;
	const pageUrl = canonical || baseUrl;

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
		metadataBase: new URL(baseUrl),
		title: fullTitle,
		description,
		keywords: allKeywords,
		authors: [{ name: author, url: baseUrl }],
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
				"application/rss+xml": `${baseUrl}/feed.xml`,
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
	return `${baseUrl}/api/og?${queryParams.toString()}`;
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
			url: baseUrl,
		},
		publisher: {
			"@type": "Organization",
			name: siteName,
			url: baseUrl,
			logo: {
				"@type": "ImageObject",
				url: `${baseUrl}/logo.avif`,
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
		url: baseUrl,
		description: defaultDescription,
		publisher: {
			"@type": "Person",
			name: defaultAuthor,
			url: baseUrl,
		},
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${baseUrl}/search?q={search_term_string}`,
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
		url: baseUrl,
		logo: `${baseUrl}/logo.avif`,
		sameAs: [
			"https://github.com/byronwade",
			"https://linkedin.com/in/byronwade",
			"https://twitter.com/byronwade",
		],
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "Professional",
			email: "byron@byronwade.com",
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
		url: baseUrl,
		image: `${baseUrl}/avatar.avif`,
		sameAs: [
			"https://github.com/byronwade",
			"https://linkedin.com/in/byronwade",
			"https://twitter.com/byronwade",
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
			addressLocality: "Santa Cruz",
			addressRegion: "CA",
			addressCountry: "US",
		},
		email: "byron@byronwade.com",
		telephone: "+1-831-295-8460",
		hasOccupation: {
			"@type": "Occupation",
			name: "Full Stack Developer",
			occupationLocation: {
				"@type": "City",
				name: "Santa Cruz, CA",
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
			url: baseUrl,
		},
		publisher: {
			"@type": "Organization",
			name: siteName,
			url: baseUrl,
			logo: {
				"@type": "ImageObject",
				url: `${baseUrl}/logo.avif`,
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

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string, maxKeywords = 10): string[] {
	// Simple keyword extraction - could be enhanced with NLP
	const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
	const wordFreq: Record<string, number> = {};

	for (const word of words) {
		wordFreq[word] = (wordFreq[word] || 0) + 1;
	}

	return Object.entries(wordFreq)
		.sort(([, a], [, b]) => b - a)
		.slice(0, maxKeywords)
		.map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
	return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Generate sitemap entry
 */
export function generateSitemapEntry(
	url: string,
	lastModified?: Date,
	changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never",
	priority?: number
) {
	return {
		url,
		lastModified: lastModified?.toISOString() || new Date().toISOString(),
		changeFrequency,
		priority,
	};
}
