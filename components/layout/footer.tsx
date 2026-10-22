// Thorbis Design port: site/site-footer + site-shell.stylex @ 46b6654.
import { Link } from "@/components/ui/link";
import { ObfuscatedEmail } from "@/components/ui/obfuscated-contact";
import { publicProfiles } from "@/lib/site";
import { navItems } from "./nav-config";

const signOffLinkClass =
	"inline-flex min-h-11 min-w-11 items-center justify-center px-4 transition-colors hover:text-foreground";

export default function Footer() {
	return (
		<footer className="w-full px-4 pb-10 sm:px-5 print:hidden">
			{/* The sign-off keeps the header's 42rem measure (Thorbis site-footer). */}
			<div
				className="mx-auto grid max-w-2xl gap-8 border-border border-t pt-10 sm:grid-cols-[1.5fr_1fr]"
				data-site-footer
			>
				<div className="flex max-w-sm flex-col items-start gap-3">
					<p className="font-medium text-heading-16">Byron Wade</p>
					<p className="text-body text-copy-14">
						Plumber first. Product engineer today. Building software for the service businesses I
						know firsthand.
					</p>
					{/* Two 44px targets stacked flush: the boxes already space them. */}
					<div className="flex flex-col items-start">
						<ObfuscatedEmail className="min-h-11 text-copy-14 text-foreground" variant="link" />
						<a
							className="link-underline inline-flex min-h-11 items-center text-copy-13"
							href="https://design.thorbis.com"
							rel="noopener noreferrer"
							target="_blank"
						>
							Built with Thorbis Design<span className="sr-only"> (opens in a new tab)</span>
						</a>
					</div>
				</div>
				<nav aria-label="Footer" className="grid grid-cols-2 content-start gap-x-4">
					{navItems.map((item) => (
						<Link
							className="flex min-h-11 items-center text-copy-14 text-muted-foreground transition-colors hover:text-foreground"
							href={item.href}
							key={item.href}
						>
							{item.label}
						</Link>
					))}
					<Link
						className="flex min-h-11 items-center text-copy-14 text-muted-foreground transition-colors hover:text-foreground"
						href="/contact"
					>
						Contact
					</Link>
				</nav>
			</div>
			<div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-between gap-x-6 gap-y-3 text-copy-12 text-muted-foreground">
				<p>© {new Date().getFullYear()} Byron Wade</p>
				{/* Every label gets the same inline padding and nothing else spaces them,
				    so the gaps read equal; 44px is only a floor ("X" alone needs it).
				    The group's matching negative margin puts the first and last label
				    text on the measure's edges. */}
				<div className="-mx-4 flex flex-wrap items-center">
					{publicProfiles.map((item) => (
						<a
							key={item.href}
							className={signOffLinkClass}
							href={item.href}
							rel="noopener noreferrer"
							target="_blank"
						>
							{item.name}
							<span className="sr-only"> (opens in a new tab)</span>
						</a>
					))}
					<Link className={signOffLinkClass} href="/privacy">
						Privacy
					</Link>
					<Link className={signOffLinkClass} href="/terms">
						Terms
					</Link>
				</div>
			</div>
		</footer>
	);
}
