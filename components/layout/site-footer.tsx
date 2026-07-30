import { ArrowUpRight, Github, Linkedin, MapPin, Rss } from "lucide-react";
import { Link } from "@/components/ui/link";
import { ObfuscatedEmail } from "@/components/ui/obfuscated-contact";
import { customFont } from "@/lib/fonts";
import { FooterClock } from "./footer-clock";

const exploreLinks = [
	{ name: "Home", href: "/" },
	{ name: "Projects", href: "/projects" },
	{ name: "Portfolio", href: "/portfolio" },
	{ name: "Blog", href: "/blog" },
	{ name: "Resume", href: "/resume" },
	{ name: "Contact", href: "/contact" },
];

const buildingLinks = [
	{ name: "Thorbis", href: "https://thorbis.com" },
	{ name: "byronwade/ui", href: "https://ui.byronwade.com" },
	{ name: "GoodMarks", href: "https://goodmarks.io" },
	{ name: "SignalRoute", href: "https://getsignalroute.com" },
	{ name: "Fakebase", href: "https://fakebase.byronwade.com" },
];

const socialLinks = [
	{ name: "GitHub", href: "https://github.com/byronwade", icon: Github },
	{ name: "LinkedIn", href: "https://linkedin.com/in/byronwade", icon: Linkedin },
	{ name: "RSS", href: "/feed.xml", icon: Rss },
];

/** X (formerly Twitter) brand glyph: lucide's `X` is the close icon, not the logo. */
function XIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

/**
 * The cinematic close: a lit, always-dark stage that ends every page.
 *
 * Four beats, top to bottom: a horizon beam and drifting aurora, the single
 * call to action at display scale, the link floor, and an oversized signature
 * that dissolves into the bottom bar. Dark in both themes on purpose: it
 * bookends the light reading surface with the same material as the header.
 */
export default function SiteFooter() {
	const year = new Date().getFullYear();

	return (
		<footer className="footer-cinema relative isolate mt-32 overflow-hidden sm:mt-40 print:hidden">
			{/* Horizon: the lit seam where the page ends and the stage begins. */}
			<div className="footer-beam absolute inset-x-0 top-0 h-px" aria-hidden="true" />
			<div className="footer-grid absolute inset-0 -z-10" aria-hidden="true" />
			<div
				className="footer-aurora absolute -top-56 left-1/2 -z-10 h-[38rem] w-[52rem] -translate-x-1/2"
				aria-hidden="true"
			/>

			<div className="mx-auto w-full max-w-5xl px-5 pt-20 sm:px-8 sm:pt-28">
				{/* ── CALL TO ACTION ── */}
				<div className="flex flex-col items-start gap-7">
					<span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-white/70 uppercase">
						<span className="relative flex size-1.5">
							<span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" />
							<span className="relative inline-flex size-1.5 rounded-full bg-brand" />
						</span>
						Available for new work
					</span>

					<h2 className="max-w-3xl text-balance font-heading text-4xl font-semibold tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl">
						Let's build something
						<span className="block text-white/40">worth shipping.</span>
					</h2>

					<p className="max-w-xl text-base leading-relaxed text-white/50 sm:text-lg">
						Software for people who work with their hands and their phones. If you have a problem
						worth solving, I'd like to hear about it.
					</p>

					<div className="flex flex-wrap items-center gap-3 pt-1">
						<Link
							href="/contact"
							className="group inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-neutral-950 transition-transform duration-200 hover:-translate-y-0.5"
						>
							Start a conversation
							<ArrowUpRight
								className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								aria-hidden="true"
							/>
						</Link>
						<Link
							href="/projects"
							className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-6 text-sm font-semibold text-white/80 transition-colors hover:border-white/30 hover:bg-white/5 hover:text-white"
						>
							See the work
						</Link>
					</div>
				</div>

				<div className="footer-rule mt-14 h-px sm:mt-16" aria-hidden="true" />

				{/* ── LINK FLOOR ── */}
				<div className="grid gap-10 py-12 sm:grid-cols-2 sm:gap-12 sm:py-14 lg:grid-cols-4">
					<nav aria-label="Footer: explore" className="flex flex-col gap-3.5">
						<h3 className="text-[11px] font-semibold tracking-[0.14em] text-white/35 uppercase">
							Explore
						</h3>
						{exploreLinks.map((link) => (
							<Link key={link.href} href={link.href} className="footer-link">
								{link.name}
							</Link>
						))}
					</nav>

					<nav aria-label="Footer: building" className="flex flex-col gap-3.5">
						<h3 className="text-[11px] font-semibold tracking-[0.14em] text-white/35 uppercase">
							Building
						</h3>
						{buildingLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="footer-link group"
							>
								{link.name}
								<ArrowUpRight
									className="size-3.5 text-white/25 transition-colors group-hover:text-white/70"
									aria-hidden="true"
								/>
							</a>
						))}
					</nav>

					<nav aria-label="Footer: elsewhere" className="flex flex-col gap-3.5">
						<h3 className="text-[11px] font-semibold tracking-[0.14em] text-white/35 uppercase">
							Elsewhere
						</h3>
						{socialLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								className="footer-link"
							>
								<link.icon className="size-4 text-white/30" aria-hidden="true" />
								{link.name}
							</a>
						))}
						<a
							href="https://x.com/byron_c_wade"
							target="_blank"
							rel="noopener noreferrer"
							className="footer-link"
						>
							<XIcon className="size-3.5 text-white/30" />X
						</a>
					</nav>

					{/* Status card: the human details, in one lit block. */}
					<div className="flex flex-col gap-3.5">
						<h3 className="text-[11px] font-semibold tracking-[0.14em] text-white/35 uppercase">
							Say hello
						</h3>
						<div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
							<p className="text-sm leading-relaxed text-white/60">
								Open to conversations about development, design, and software for service
								businesses.
							</p>
							<div className="mt-4 flex flex-col gap-2 text-[13px]">
								{/* The reveal control paints itself with `--primary`, which is a dark
								    ink in the light theme, so remap it for the always-dark stage. */}
								<ObfuscatedEmail
									className="[&_a]:text-white/70 [&_a:hover]:text-white [&_button]:text-white/70 [&_button:hover]:text-white"
									variant="link"
								/>
								<span className="flex items-center gap-2 text-white/45">
									<MapPin className="size-3.5 shrink-0 text-white/30" aria-hidden="true" />
									Jasper, Georgia
									<span className="text-white/20">·</span>
									<FooterClock />
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ── SIGNATURE: oversized, dissolving into the floor. The script face
			    carries long swashes well past its layout box, so the size is tuned to
			    keep the ink inside the viewport rather than to fill the text box. ── */}
			<div className="relative overflow-hidden pt-2 pb-1" aria-hidden="true">
				<span
					className={`${customFont.className} footer-wordmark block w-full text-center text-[clamp(3rem,14vw,13rem)] leading-[1.05] select-none`}
				>
					Byron Wade
				</span>
			</div>

			{/* ── BOTTOM BAR ── */}
			<div className="relative border-t border-white/[0.07] bg-black/25">
				<div className="mx-auto flex max-w-5xl flex-col-reverse items-center justify-between gap-4 px-5 py-5 text-[13px] text-white/40 sm:flex-row sm:px-8">
					<p>© {year} Byron Wade. Built in Jasper, Georgia.</p>
					<div className="flex items-center gap-5">
						<Link href="/privacy" className="transition-colors hover:text-white/80">
							Privacy
						</Link>
						<Link href="/terms" className="transition-colors hover:text-white/80">
							Terms
						</Link>
						<a
							href="/feed.xml"
							className="transition-colors hover:text-white/80"
							target="_blank"
							rel="noopener noreferrer"
						>
							RSS
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
