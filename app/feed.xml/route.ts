import { getBlogPosts } from "@/lib/blog";
import { siteUrl } from "@/lib/site";

export async function GET() {
	const posts = await getBlogPosts();

	const escapeXml = (str: string) =>
		str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&apos;");

	const rssItems = posts
		.map((post) => {
			const categories = (post.tags ?? [])
				.map((tag) => `\n\t\t\t<category>${escapeXml(tag)}</category>`)
				.join("");
			return `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${siteUrl}/blog/${post.slug}</link>
			<guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
			<description>${escapeXml(post.excerpt || `Read ${post.title} on Byron Wade's blog`)}</description>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
			<author>byron@byronwade.com (Byron Wade)</author>${categories}
		</item>`;
		})
		.join("");

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<title>Byron Wade — Writing</title>
		<link>${siteUrl}/blog</link>
		<description>Notes on building products, design systems, and software for service businesses — from field operations to modern Next.js apps.</description>
		<language>en-us</language>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
		<copyright>Copyright ${new Date().getFullYear()} Byron Wade. All rights reserved.</copyright>
		<managingEditor>byron@byronwade.com (Byron Wade)</managingEditor>
		<webMaster>byron@byronwade.com (Byron Wade)</webMaster>
		<ttl>60</ttl>
		<image>
			<url>${siteUrl}/logo.avif</url>
			<title>Byron Wade — Writing</title>
			<link>${siteUrl}</link>
		</image>
		${rssItems}
	</channel>
</rss>`;

	return new Response(rss, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
		},
	});
}
