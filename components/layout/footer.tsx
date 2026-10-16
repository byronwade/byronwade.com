// Thorbis Design port: site/site-footer + site-shell.stylex @ 46b6654.
import { Link } from "@/components/ui/link";
import { ObfuscatedEmail } from "@/components/ui/obfuscated-contact";
import { navItems } from "./nav-config";

const SOCIAL = [
	{ name: "GitHub", href: "https://github.com/byronwade" },
	{ name: "LinkedIn", href: "https://linkedin.com/in/byronwade" },
	{ name: "X", href: "https://x.com/byron_c_wade" },
];

export default function Footer() {
	return (
		<footer className="mx-auto w-full max-w-5xl border-border border-t px-4 py-10 sm:px-6">
			<div className="grid gap-8 sm:grid-cols-[1.5fr_1fr]">
				<div className="flex max-w-sm flex-col items-start gap-3">
					<p className="font-medium text-heading-16">Byron Wade</p>
					<p className="text-body text-copy-14">
						Plumber first. Product engineer today. Building software for the service businesses I
						know firsthand.
					</p>
					<ObfuscatedEmail
						className="min-h-11 text-copy-14 text-foreground"
						showIcon={false}
						variant="link"
					/>
					<a
						className="link-underline inline-flex min-h-11 items-center text-copy-13"
						href="https://design.thorbis.com"
						rel="noopener noreferrer"
						target="_blank"
					>
						Built with Thorbis Design<span className="sr-only"> (opens in a new tab)</span>
					</a>
				</div>
				<nav aria-label="Footer" className="grid grid-cols-2 content-start gap-x-4">
					{navItems.map((item) => (
						<Link
							className="flex min-h-11 items-center text-copy-14 text-muted-foreground hover:text-foreground"
							href={item.href}
							key={item.href}
						>
							{item.label}
						</Link>
					))}
					<Link
						className="flex min-h-11 items-center text-copy-14 text-muted-foreground hover:text-foreground"
						href="/contact"
					>
						Contact
					</Link>
				</nav>
			</div>
			<div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-border border-t pt-5 text-copy-12 text-muted-foreground">
				<p>© {new Date().getFullYear()} Byron Wade</p>
				<div className="flex flex-wrap items-center gap-x-5">
					{SOCIAL.map((item) => (
						<a
							key={item.href}
							className="inline-flex min-h-11 items-center hover:text-foreground"
							href={item.href}
							rel="noopener noreferrer"
							target="_blank"
						>
							{item.name}
							<span className="sr-only"> (opens in a new tab)</span>
						</a>
					))}
					<Link className="inline-flex min-h-11 items-center hover:text-foreground" href="/privacy">
						Privacy
					</Link>
					<Link className="inline-flex min-h-11 items-center hover:text-foreground" href="/terms">
						Terms
					</Link>
				</div>
			</div>
		</footer>
	);
}
