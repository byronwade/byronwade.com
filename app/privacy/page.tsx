import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { Link } from "@/components/ui/link";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
	title: "Privacy Policy | Byron Wade",
	description:
		"How Byron Wade and Wade's Plumbing & Septic collect, use, and protect your information.",
	alternates: {
		canonical: `${siteUrl}/privacy`,
	},
	robots: { index: true, follow: true },
};

const LAST_UPDATED = "June 1, 2026";

export default function PrivacyPage() {
	return (
		<SiteShell>
			<article className="prose dark:prose-invert mx-auto max-w-3xl py-16 prose-headings:font-semibold prose-a:text-brand prose-headings:tracking-tight hover:prose-a:text-brand">
				<header className="not-prose mb-10">
					<h1 className="font-semibold text-3xl tracking-tight sm:text-4xl">Privacy Policy</h1>
					<p className="mt-3 text-muted-foreground text-sm">Last updated: {LAST_UPDATED}</p>
				</header>

				<p>
					This Privacy Policy describes how Byron Wade (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
					&ldquo;our&rdquo;), including the Wade&rsquo;s Plumbing &amp; Septic brand, collects,
					uses, and shares information when you visit this website or contact us for services.
				</p>

				<h2>Information we collect</h2>
				<ul>
					<li>
						<strong>Information you provide.</strong> When you submit a contact or quote form, we
						collect your name, email address, phone number, and any details you choose to share.
					</li>
					<li>
						<strong>Usage data.</strong> We collect anonymized analytics (pages visited, performance
						metrics, approximate region) through privacy-friendly tooling to improve the site.
					</li>
					<li>
						<strong>Device data.</strong> Standard technical information such as browser type and
						screen size, used only for compatibility and performance.
					</li>
				</ul>

				<h2>How we use your information</h2>
				<ul>
					<li>To respond to inquiries and provide requested services or quotes.</li>
					<li>To improve site performance, accessibility, and content.</li>
					<li>To comply with legal obligations and prevent abuse or spam.</li>
				</ul>

				<h2>Sharing your information</h2>
				<p>
					We do not sell your personal information. We share data only with service providers that
					help us operate the site (such as hosting and analytics), and only as needed to deliver
					the service, or when required by law.
				</p>

				<h2>Data retention</h2>
				<p>
					We keep inquiry information only as long as necessary to respond and maintain our business
					records, after which it is deleted or anonymized.
				</p>

				<h2>Your rights</h2>
				<p>
					You may request access to, correction of, or deletion of your personal information at any
					time by contacting us. We will respond within a reasonable timeframe.
				</p>

				<h2>Contact</h2>
				<p>
					Questions about this policy? Reach out through our{" "}
					<Link href="/contact">contact page</Link> and we&rsquo;ll be happy to help.
				</p>
			</article>
		</SiteShell>
	);
}
