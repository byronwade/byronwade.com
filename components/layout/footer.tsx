import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { ObfuscatedEmail } from "@/components/ui/obfuscated-contact";
import { footerCompanyLinks, footerProductLinks, footerWorkLinks, siteConfig } from "@/lib/site";

const socialLinks = [
	{ name: "GitHub", href: siteConfig.social.github, icon: Github },
	{ name: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin },
	{ name: "Twitter", href: siteConfig.social.twitter, icon: Twitter },
];

function FooterColumn({
	title,
	links,
}: {
	title: string;
	links: ReadonlyArray<{ href: string; label: string; external?: boolean }>;
}) {
	return (
		<nav aria-label={title}>
			<p className="mb-4 text-xs font-medium tracking-[0.06em] text-muted-foreground uppercase">
				{title}
			</p>
			<ul className="flex flex-col gap-3">
				{links.map((link) => (
					<li key={link.href}>
						{link.external ? (
							<a
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{link.label}
							</a>
						) : (
							<Link
								href={link.href}
								prefetch
								className="text-sm text-muted-foreground transition-colors hover:text-foreground"
							>
								{link.label}
							</Link>
						)}
					</li>
				))}
			</ul>
		</nav>
	);
}

export default function Footer() {
	return (
		<footer className="border-t border-border/70 bg-sunken text-foreground">
			<div className="container-shell py-[var(--space-section-y-tight)]">
				<div className="grid gap-[var(--space-block)] sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
					<div>
						<Link
							aria-label={`${siteConfig.name} home`}
							className="inline-flex flex-col"
							href="/"
							prefetch
						>
							<span className="text-xl leading-tight font-medium tracking-[-0.02em]">
								{siteConfig.name}
							</span>
							<span className="mt-1.5 text-sm text-muted-foreground">{siteConfig.tagline}</span>
						</Link>
						<p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
							{siteConfig.description}
						</p>
						<p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
							{siteConfig.location}
						</p>
						<div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
							<Mail className="size-4" aria-hidden="true" />
							<ObfuscatedEmail
								className="text-muted-foreground hover:text-foreground"
								showIcon={false}
								variant="link"
							/>
						</div>
						<div className="mt-6 flex gap-2">
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={social.name}
									className="grid size-10 place-items-center rounded-2xl border border-border/70 bg-card text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
								>
									<social.icon className="size-4" />
								</a>
							))}
						</div>
					</div>

					<FooterColumn title="Work" links={footerWorkLinks} />
					<FooterColumn title="Company" links={footerCompanyLinks} />
					<FooterColumn title="Products" links={footerProductLinks} />
				</div>

				<div className="mt-[var(--space-block)] flex flex-col gap-4 border-t border-border/70 pt-7 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
					<p>
						© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
					</p>
					<div className="flex flex-wrap gap-x-6 gap-y-2">
						<Link className="transition-colors hover:text-foreground" href="/privacy" prefetch>
							Privacy
						</Link>
						<Link className="transition-colors hover:text-foreground" href="/terms" prefetch>
							Terms
						</Link>
						<a className="transition-colors hover:text-foreground" href="/sitemap.xml">
							Sitemap
						</a>
					</div>
				</div>
			</div>

			<div className="border-t border-border/60">
				<div className="container-shell flex flex-col items-center gap-2 py-8 text-center sm:py-10">
					<p className="text-xs font-medium tracking-[0.06em] text-muted-foreground uppercase">
						Built in the field
					</p>
					<p className="max-w-lg text-sm leading-relaxed text-pretty text-muted-foreground sm:text-[0.9375rem]">
						I grew a plumbing company to $2.4M — then started building the software service
						businesses actually need.
					</p>
				</div>
			</div>
		</footer>
	);
}
