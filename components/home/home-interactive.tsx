"use client";

import { Check, Github, Globe, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { SocialLinkPreview } from "@/components/common";
import { InlineContact } from "@/components/home/inline-contact";
import { StatusPill } from "@/components/ui/status-pill";
import { cn } from "@/lib/utils";

const socials = [
	{ id: "github", label: "GitHub", href: "https://github.com/byronwade", icon: Github },
	{ id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/byronwade", icon: Linkedin },
	{ id: "twitter", label: "X", href: "https://twitter.com/byron_c_wade", icon: Twitter },
	{ id: "thorbis", label: "Thorbis", href: "https://thorbis.com", icon: Globe },
] as const;

const socialLinkClass = cn(
	"inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card/80 px-3.5 text-sm font-semibold tracking-[-0.01em] text-foreground transition-colors",
	"hover:border-primary/30 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
);

export function HomeInteractive() {
	const [copiedButton, setCopiedButton] = useState<string | null>(null);
	const [contactOpen, setContactOpen] = useState(false);
	const email = "byron@byronwade.com";

	const copyEmail = async (buttonId: string) => {
		try {
			await navigator.clipboard.writeText(email);
			setCopiedButton(buttonId);
			setTimeout(() => setCopiedButton(null), 2000);
		} catch {
			setContactOpen(true);
		}
	};

	const handleEmailClick = (buttonId: string) => {
		setContactOpen(true);
		if (buttonId !== "panel") copyEmail(buttonId);
	};

	return (
		<section className="reveal flex w-full flex-col gap-8">
			<InlineContact open={contactOpen} onClose={() => setContactOpen(false)} email={email} />

			<div className="flex flex-col items-start gap-6">
				<div className="relative">
					<div
						className="glow-brand pointer-events-none absolute -inset-6 opacity-70"
						aria-hidden
					/>
					<div className="relative size-20 overflow-hidden rounded-2xl ring-1 ring-border sm:size-24">
						<Image
							alt="Byron Wade — Full Stack Developer"
							className="size-full object-cover"
							src="/avatar.avif"
							width={96}
							height={96}
							loading="eager"
							priority
						/>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<p className="spec-label">Jasper, Georgia</p>
					<h1 className="type-display text-foreground">Byron Wade</h1>
					<p className="type-lead">Builder · Developer · Operator</p>
					<StatusPill tone="success" pulse className="w-fit">
						Available for conversations
					</StatusPill>
				</div>
			</div>

			<div className="flex flex-col gap-5 text-base leading-relaxed text-muted-foreground">
				<p className="reveal reveal-delay-1">
					Full-stack developer and designer based in Jasper, Georgia. I grew a plumbing company to{" "}
					<span className="font-bold text-primary">$2.4M</span> in revenue during my second year in
					Santa Cruz, California — before relocating to Georgia.
				</p>

				<p className="reveal reveal-delay-2">
					Currently building{" "}
					<a
						href="https://thorbis.com"
						target="_blank"
						rel="noopener noreferrer"
						className="link-underline font-bold"
					>
						Thorbis
					</a>
					, a field management system for service professionals — with{" "}
					<a
						href="https://nextjs.org"
						target="_blank"
						rel="noopener noreferrer"
						className="link-underline font-bold"
					>
						Next.js
					</a>{" "}
					and{" "}
					<a
						href="https://react.dev"
						target="_blank"
						rel="noopener noreferrer"
						className="link-underline font-bold"
					>
						React
					</a>
					. Real problems from the field, solved in code.
				</p>

				<p className="reveal reveal-delay-3">
					Scaling a service business from zero taught me what software actually needs to do. I build
					tools for people who work with their hands and their phones — not just their laptops.
				</p>

				<p className="reveal reveal-delay-4">
					Vibecoder at heart. Claude Code is my AI of choice. I love the craft of building and
					collaborating with tools that understand software as an art form.
				</p>

				<p className="reveal reveal-delay-5 text-foreground">
					Open to conversations about development, design, and software for service businesses.{" "}
					<button
						type="button"
						onClick={() => handleEmailClick("say-hello")}
						className="link-underline cursor-pointer border-none bg-transparent p-0 text-base font-bold"
						aria-label="Open contact panel"
					>
						{copiedButton === "say-hello" ? "Copied!" : "Say hello"}
					</button>{" "}
					or find me on{" "}
					<SocialLinkPreview platform="github">
						<a
							href="https://github.com/byronwade"
							target="_blank"
							rel="noopener noreferrer"
							className="link-underline font-bold"
						>
							GitHub
						</a>
					</SocialLinkPreview>
					,{" "}
					<a
						href="https://linkedin.com/in/byronwade"
						target="_blank"
						rel="noopener noreferrer"
						className="link-underline font-bold"
					>
						LinkedIn
					</a>
					, or{" "}
					<a
						href="https://twitter.com/byron_c_wade"
						target="_blank"
						rel="noopener noreferrer"
						className="link-underline font-bold"
					>
						X
					</a>
					.
				</p>
			</div>

			<div className="reveal reveal-delay-6 flex flex-wrap items-center gap-2">
				{socials.map((social) =>
					social.id === "github" ? (
						<SocialLinkPreview key={social.id} platform="github">
							<a
								href={social.href}
								target="_blank"
								rel="noopener noreferrer"
								className={socialLinkClass}
								aria-label={social.label}
							>
								<social.icon className="size-4" />
								{social.label}
							</a>
						</SocialLinkPreview>
					) : (
						<a
							key={social.id}
							href={social.href}
							target="_blank"
							rel="noopener noreferrer"
							className={socialLinkClass}
							aria-label={social.label}
						>
							<social.icon className="size-4" />
							{social.label}
						</a>
					)
				)}
				<button
					type="button"
					onClick={() => handleEmailClick("social")}
					className={socialLinkClass}
				>
					{copiedButton === "social" ? (
						<Check className="size-4 text-primary" />
					) : (
						<Mail className="size-4" />
					)}
					{copiedButton === "social" ? "Copied!" : "Email"}
				</button>
			</div>
		</section>
	);
}
