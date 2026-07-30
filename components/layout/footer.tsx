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
			<p className="mb-4 text-xs font-semibold tracking-[0.12em] text-primary-bright uppercase">
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
								className="text-sm text-on-dark-muted transition-colors hover:text-white"
							>
								{link.label}
							</a>
						) : (
							<Link
								href={link.href}
								prefetch
								className="text-sm text-on-dark-muted transition-colors hover:text-white"
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
		<footer className="bg-ink text-white">
			<div className="container-shell py-[var(--space-section-y-tight)]">
				<div className="grid gap-[var(--space-block)] sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
					<div>
						<Link
							aria-label={`${siteConfig.name} home`}
							className="inline-flex flex-col"
							href="/"
							prefetch
						>
							<span className="font-display text-xl leading-tight font-bold tracking-[-0.03em]">
								{siteConfig.name}
							</span>
							<span className="mt-1.5 text-sm text-on-dark-muted">{siteConfig.tagline}</span>
						</Link>
						<p className="mt-5 max-w-xs text-sm leading-relaxed text-on-dark-muted">
							{siteConfig.description}
						</p>
						<p className="mt-4 max-w-xs text-sm leading-relaxed text-on-dark-muted">
							{siteConfig.location}
						</p>
						<div className="mt-4 flex items-center gap-2 text-sm text-on-dark-muted">
							<Mail className="size-4 text-primary-bright" aria-hidden="true" />
							<ObfuscatedEmail
								className="text-on-dark-muted hover:text-white"
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
									className="grid size-10 place-items-center rounded-xl bg-white/8 text-on-dark-muted opacity-90 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring"
								>
									<social.icon className="size-5" />
								</a>
							))}
						</div>
					</div>

					<FooterColumn title="Work" links={footerWorkLinks} />
					<FooterColumn title="Company" links={footerCompanyLinks} />
					<FooterColumn title="Products" links={footerProductLinks} />
				</div>

				<div className="mt-[var(--space-block)] flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-on-dark-subtle sm:flex-row sm:items-center sm:justify-between">
					<p>
						© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
					</p>
					<div className="flex flex-wrap gap-x-6 gap-y-2">
						<Link className="transition-colors hover:text-white" href="/privacy" prefetch>
							Privacy
						</Link>
						<Link className="transition-colors hover:text-white" href="/terms" prefetch>
							Terms
						</Link>
						<a className="transition-colors hover:text-white" href="/sitemap.xml">
							Sitemap
						</a>
					</div>
				</div>
			</div>

			<div className="footer-credit relative overflow-hidden">
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_120%_at_50%_-20%,color-mix(in_oklch,var(--primary)_35%,transparent),transparent_55%)]"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
				/>
				<div className="container-shell relative flex flex-col items-center gap-3 py-8 text-center sm:py-10">
					<p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-primary-bright/90 uppercase">
						Built in the field
					</p>
					<p className="max-w-lg text-[0.9375rem] leading-relaxed text-pretty text-white/78 sm:text-base">
						I grew a plumbing company to $2.4M — then started building the software service
						businesses actually need.
					</p>
				</div>
			</div>
		</footer>
	);
}
