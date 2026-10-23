import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Link } from "@/components/ui/link";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
	title: "Privacy Policy",
	description:
		"How Byron Wade and Wade's Plumbing & Septic collect, use, and protect your information.",
	alternates: {
		canonical: `${siteUrl}/privacy`,
	},
	robots: { index: true, follow: true },
};

const LAST_UPDATED = "October 23, 2026";

export default function PrivacyPage() {
	return (
		<SiteShell profile="evidence">
			<PageHeader lede={`Last updated ${LAST_UPDATED}`} title="Privacy policy" />

			<Prose>
				<p>
					This Privacy Policy describes how Byron Wade (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
					&ldquo;our&rdquo;), including the Wade&rsquo;s Plumbing &amp; Septic brand, collects,
					uses, and shares information when you visit this website or contact us for services.
				</p>

				<h2>Information we collect</h2>
				<ul>
					<li>
						<strong>Information you provide.</strong> When you send a message through the contact
						form, we collect your name, email address, the topic you choose, and your message.
					</li>
					<li>
						<strong>Usage data.</strong> Vercel Web Analytics and Vercel Speed Insights record
						anonymous page views and page-speed measurements: the address of the page you visit
						(without any words you type into site search), the referring site, your approximate
						location, and your browser and device type. The site also records a few anonymous
						events, such as viewing a project or post and downloading the résumé. Vercel Web
						Analytics does not use third-party cookies.
					</li>
					<li>
						<strong>Saved preferences.</strong> If you pick a light or dark theme, that choice is
						saved in your browser so the site remembers it. It is not sent to us.
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
					help us operate the site, and only as needed to deliver the service, or when required by
					law. Vercel hosts the site and provides its analytics. Resend delivers contact form
					messages to us by email.
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
			</Prose>
		</SiteShell>
	);
}
