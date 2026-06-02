import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Link } from "@/components/ui/link";
import { ObfuscatedEmail } from "@/components/ui/obfuscated-contact";
import { customFont } from "@/lib/fonts";

const navLinks = [
	{ name: "Projects", href: "/projects" },
	{ name: "Portfolio", href: "/portfolio" },
	{ name: "Blog", href: "/blog" },
	{ name: "Resume", href: "/resume" },
	{ name: "Contact", href: "/contact" },
];

const socialLinks = [
	{ name: "GitHub", href: "https://github.com/byronwade", icon: Github },
	{ name: "LinkedIn", href: "https://linkedin.com/in/byronwade", icon: Linkedin },
	{ name: "Twitter", href: "https://twitter.com/byronwade", icon: Twitter },
];

export default function Footer() {
	return (
		<footer className="mt-24 border-t border-border/60">
			<div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
				<div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
					<div className="max-w-sm space-y-4">
						<Link
							href="/"
							className={`${customFont.className} text-2xl text-foreground transition-colors hover:text-accent`}
						>
							Byron Wade
						</Link>
						<p className="text-sm leading-relaxed text-muted-foreground">
							Full-stack developer building fast, thoughtful web applications with Next.js, React,
							and TypeScript.
						</p>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Mail className="size-4 text-accent" aria-hidden="true" />
							<ObfuscatedEmail
								className="text-muted-foreground hover:text-foreground"
								showIcon={false}
								variant="link"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
						<nav aria-label="Footer" className="flex flex-col gap-3">
							{navLinks.map((link) => (
								<Link
									key={link.href}
									href={link.href}
									className="text-sm text-muted-foreground transition-colors hover:text-foreground"
								>
									{link.name}
								</Link>
							))}
						</nav>

						<div className="flex gap-2">
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={social.name}
									className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-ring"
								>
									<social.icon className="size-[1.1rem]" />
								</a>
							))}
						</div>
					</div>
				</div>

				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 text-sm text-muted-foreground sm:flex-row">
					<p>© {new Date().getFullYear()} Byron Wade. All rights reserved.</p>
					<div className="flex items-center gap-6">
						<Link href="/privacy" className="transition-colors hover:text-foreground">
							Privacy
						</Link>
						<Link href="/terms" className="transition-colors hover:text-foreground">
							Terms
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
