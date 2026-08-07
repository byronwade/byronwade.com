import { Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "@/components/ui/link";
import { ObfuscatedEmail } from "@/components/ui/obfuscated-contact";

/**
 * Site footer — Shared profile.
 *
 * Rebuilt to use the site's own grammar rather than the generic
 * logo/tagline/link-column/social-circles template: hairline rules, mono
 * tabular labels, and open rows, matching the three indexes.
 *
 * Brand is deliberately absent. DESIGN.md §5.1 reserves it for authorship,
 * focus, selection, and the one earned primary action; the previous footer spent
 * it on an icon tint, four hover states, and a decorative bullet, which is what
 * made it stop meaning anything.
 */

const NAV = [
	{ name: "Projects", href: "/projects" },
	{ name: "Portfolio", href: "/portfolio" },
	{ name: "Blog", href: "/blog" },
	{ name: "Resume", href: "/resume" },
	{ name: "Contact", href: "/contact" },
];

const SOCIAL = [
	{ name: "GitHub", href: "https://github.com/byronwade", icon: Github },
	{ name: "LinkedIn", href: "https://linkedin.com/in/byronwade", icon: Linkedin },
	{ name: "X", href: "https://twitter.com/byron_c_wade", icon: Twitter },
];

export default function Footer() {
	return (
		<footer className="mt-24 border-border border-t">
			{/* pb-28 below `sm` clears the bottom-fixed nav dock; see site-shell.tsx. */}
			<div className="mx-auto w-full max-w-5xl px-4 pt-12 pb-28 sm:px-6 sm:pb-12">
				<div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
					<div className="flex max-w-sm flex-col gap-3">
						<p className="font-mono text-muted-foreground text-xs tracking-[0.18em]">BYRON WADE</p>
						<p className="text-muted-foreground text-sm leading-relaxed">
							Product engineering for service businesses. Currently building Thorbis.
						</p>
						<ObfuscatedEmail
							className="w-fit text-muted-foreground text-sm hover:text-foreground"
							showIcon={false}
							variant="link"
						/>
					</div>

					<nav aria-label="Footer" className="flex flex-col">
						{NAV.map((link) => (
							<Link
								className="border-border border-b py-2.5 text-muted-foreground text-sm transition-colors last:border-b-0 hover:text-foreground sm:min-w-40"
								href={link.href}
								key={link.href}
							>
								{link.name}
							</Link>
						))}
					</nav>
				</div>

				<div className="mt-10 flex flex-col items-start justify-between gap-4 border-border border-t pt-6 sm:flex-row sm:items-center">
					<p className="font-mono text-muted-foreground/80 text-xs tabular-nums">
						© {new Date().getFullYear()} Byron Wade
					</p>

					<div className="flex items-center gap-5">
						{SOCIAL.map((social) => (
							<a
								aria-label={social.name}
								className="text-muted-foreground transition-colors hover:text-foreground"
								href={social.href}
								key={social.name}
								rel="noopener noreferrer"
								target="_blank"
							>
								<social.icon aria-hidden="true" className="size-4" />
							</a>
						))}
						<span aria-hidden="true" className="h-4 w-px bg-border" />
						<Link
							className="text-muted-foreground text-xs transition-colors hover:text-foreground"
							href="/privacy"
						>
							Privacy
						</Link>
						<Link
							className="text-muted-foreground text-xs transition-colors hover:text-foreground"
							href="/terms"
						>
							Terms
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
