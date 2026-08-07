import type { Metadata } from "next";
import { PageHeader, Prose } from "@/components/layout/page";
import { SiteShell } from "@/components/layout/site-shell";
import { Link } from "@/components/ui/link";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
	title: "Terms of Service | Byron Wade",
	description:
		"The terms that govern your use of byronwade.com and services provided by Byron Wade and Wade's Plumbing & Septic.",
	alternates: {
		canonical: `${siteUrl}/terms`,
	},
	robots: { index: true, follow: true },
};

const LAST_UPDATED = "June 1, 2026";

export default function TermsPage() {
	return (
		<SiteShell>
			<article className="flex flex-col gap-8">
				<PageHeader lede={`Last updated ${LAST_UPDATED}`} title="Terms of service" />

				<Prose className="reveal reveal-delay-1">
					<p>
						These Terms of Service (&ldquo;Terms&rdquo;) govern your use of byronwade.com and any
						services provided by Byron Wade, including the Wade&rsquo;s Plumbing &amp; Septic brand.
						By using this site, you agree to these Terms.
					</p>

					<h2>Use of the site</h2>
					<p>
						You may use this site for lawful purposes only. You agree not to misuse the site,
						interfere with its operation, or attempt to access it in ways other than the interfaces
						we provide.
					</p>

					<h2>Intellectual property</h2>
					<p>
						All content on this site — including code, design, text, and images — is owned by Byron
						Wade unless otherwise noted, and may not be reproduced without permission. Project work
						shown in the portfolio remains the property of its respective owners.
					</p>

					<h2>Services and quotes</h2>
					<p>
						Information about web development and plumbing services is provided for general
						reference. Quotes, timelines, and pricing are estimates until confirmed in a written
						agreement. Plumbing services are provided in accordance with applicable California
						licensing and regulations.
					</p>

					<h2>Disclaimers</h2>
					<p>
						The site is provided &ldquo;as is&rdquo; without warranties of any kind. We do not
						guarantee that the site will be uninterrupted, error-free, or free of harmful
						components, though we work hard to keep it fast and reliable.
					</p>

					<h2>Limitation of liability</h2>
					<p>
						To the fullest extent permitted by law, Byron Wade will not be liable for any indirect,
						incidental, or consequential damages arising from your use of the site.
					</p>

					<h2>Changes to these Terms</h2>
					<p>
						We may update these Terms from time to time. Continued use of the site after changes
						take effect constitutes acceptance of the revised Terms.
					</p>

					<h2>Contact</h2>
					<p>
						Questions about these Terms? Reach out through our{" "}
						<Link href="/contact">contact page</Link>.
					</p>
				</Prose>
			</article>
		</SiteShell>
	);
}
