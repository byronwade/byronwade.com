"use client";

import { Check, Github, Globe, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { GradientText, LiveStatus, MagneticButton, SocialLinkPreview } from "@/components/common";
import { InlineContact } from "@/components/home/inline-contact";
import { customFont } from "@/lib/fonts";

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
		<>
			<InlineContact open={contactOpen} onClose={() => setContactOpen(false)} email={email} />

			<div className="animate-in w-full">
				<div className="flex w-full flex-col items-start gap-6">
					<Link
						className="group touch-target flex w-full items-center justify-start"
						aria-label="Go to home"
						href="/"
					>
						<div className="relative">
							<div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/25 via-accent/10 to-transparent blur-xl transition-all duration-500 group-hover:blur-2xl" />
							<div className="profile-hover relative size-20 overflow-hidden rounded-full ring-2 ring-accent/25 transition-all duration-300 group-hover:ring-accent/50 sm:size-24">
								<Image
									alt="Byron Wade - Full Stack Developer"
									className="size-full rounded-full object-cover"
									src="/avatar.avif"
									width={96}
									height={96}
									loading="eager"
									priority
								/>
							</div>
						</div>
					</Link>

					<div className="flex w-full flex-col gap-3 sm:gap-4">
						<Link
							className="group touch-target flex w-full items-center gap-2"
							aria-label="Byron Wade home"
							href="/"
						>
							<GradientText
								as="h1"
								variant="accent"
								className={`${customFont.className} mobile-text text-3xl font-medium leading-tight transition-opacity duration-300 group-hover:opacity-90 sm:text-4xl`}
							>
								Byron Wade
							</GradientText>
						</Link>
						<p className="font-display text-lg italic text-muted-foreground sm:text-xl">
							Builder · Developer · Operator
						</p>
						<LiveStatus status="Available for conversations" className="mt-1" />
					</div>
				</div>
			</div>

			<div className="relative flex min-w-full shrink-0 flex-col gap-5 text-base font-normal text-foreground">
				<p className="animate-in animate-delay-1 relative leading-relaxed">
					Full stack developer and designer based in Jasper, Georgia. I grew a plumbing company to{" "}
					<span className="font-semibold text-green-600 dark:text-green-500">$2.4M</span> in revenue
					during my second year in Santa Cruz, California — before relocating to Georgia.
				</p>

				<p className="animate-in animate-delay-2 leading-relaxed">
					Currently building{" "}
					<a
						href="https://thorbis.com"
						target="_blank"
						rel="noopener noreferrer"
						className="link-underline font-medium"
					>
						Thorbis
					</a>
					, a field management system for service professionals — with{" "}
					<a
						href="https://nextjs.org"
						target="_blank"
						rel="noopener noreferrer"
						className="link-underline font-medium"
					>
						Next.js
					</a>{" "}
					and{" "}
					<a
						href="https://react.dev"
						target="_blank"
						rel="noopener noreferrer"
						className="link-underline font-medium"
					>
						React
					</a>
					. Real problems from the field, solved in code.
				</p>

				<p className="animate-in animate-delay-3 leading-relaxed">
					Scaling a service business from zero taught me what software actually needs to do. I build
					tools for people who work with their hands and their phones — not just their laptops.
				</p>

				<p className="animate-in animate-delay-4 leading-relaxed">
					Vibecoder at heart. Claude Code is my AI of choice. I love the craft of building and
					collaborating with tools that understand software as an art form.
				</p>

				<p className="animate-in animate-delay-5 leading-relaxed">
					Open to conversations about development, design, and software for service businesses.{" "}
					<button
						type="button"
						onClick={() => handleEmailClick("say-hello")}
						className="link-underline cursor-pointer border-none bg-transparent p-0 text-base font-medium"
						aria-label="Open contact panel"
					>
						<span className={copiedButton === "say-hello" ? "bounce-subtle" : ""}>
							{copiedButton === "say-hello" ? "Copied!" : "Say hello"}
						</span>
					</button>{" "}
					or find me on{" "}
					<SocialLinkPreview platform="github">
						<a
							href="https://github.com/byronwade"
							target="_blank"
							rel="noopener noreferrer"
							className="link-underline font-medium"
						>
							GitHub
						</a>
					</SocialLinkPreview>
					,{" "}
					<a
						href="https://linkedin.com/in/byronwade"
						target="_blank"
						rel="noopener noreferrer"
						className="link-underline font-medium"
					>
						LinkedIn
					</a>
					, or{" "}
					<a
						href="https://twitter.com/byron_c_wade"
						target="_blank"
						rel="noopener noreferrer"
						className="link-underline font-medium"
					>
						X
					</a>
					.
				</p>
			</div>

			<div className="animate-in animate-delay-7 w-full">
				<div className="flex flex-wrap items-center justify-start gap-2 py-4 sm:gap-3 sm:py-6">
					<SocialLinkPreview platform="github">
						<MagneticButton
							as="a"
							href="https://github.com/byronwade"
							target="_blank"
							rel="noopener noreferrer"
							className="social-button focus-ring inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 transition-all duration-300 hover:border-accent/50 hover:bg-accent/15 sm:px-3.5 sm:py-2"
							aria-label="GitHub"
							strength={0.2}
						>
							<Github className="size-3.5 text-accent sm:size-4" />
							<span className="text-xs font-medium text-accent sm:text-sm">GitHub</span>
						</MagneticButton>
					</SocialLinkPreview>
					<SocialLinkPreview platform="linkedin">
						<MagneticButton
							as="a"
							href="https://linkedin.com/in/byronwade"
							target="_blank"
							rel="noopener noreferrer"
							className="social-button focus-ring inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 transition-all duration-300 hover:border-accent/50 hover:bg-accent/15 sm:px-3.5 sm:py-2"
							aria-label="LinkedIn"
							strength={0.2}
						>
							<Linkedin className="size-3.5 text-accent sm:size-4" />
							<span className="text-xs font-medium text-accent sm:text-sm">LinkedIn</span>
						</MagneticButton>
					</SocialLinkPreview>
					<SocialLinkPreview platform="twitter">
						<MagneticButton
							as="a"
							href="https://twitter.com/byron_c_wade"
							target="_blank"
							rel="noopener noreferrer"
							className="social-button focus-ring inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 transition-all duration-300 hover:border-accent/50 hover:bg-accent/15 sm:px-3.5 sm:py-2"
							aria-label="X (Twitter)"
							strength={0.2}
						>
							<Twitter className="size-3.5 text-accent sm:size-4" />
							<span className="text-xs font-medium text-accent sm:text-sm">X</span>
						</MagneticButton>
					</SocialLinkPreview>
					<MagneticButton
						as="button"
						type="button"
						onClick={() => handleEmailClick("social")}
						className="social-button button-press focus-ring inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 transition-all duration-300 hover:border-accent/50 hover:bg-accent/15 sm:px-3.5 sm:py-2"
						aria-label="Contact via email"
						strength={0.2}
					>
						{copiedButton === "social" ? (
							<Check className="bounce-subtle size-3.5 text-accent sm:size-4" />
						) : (
							<Mail className="size-3.5 text-accent sm:size-4" />
						)}
						<span
							className={`text-xs font-medium text-accent sm:text-sm ${copiedButton === "social" ? "bounce-subtle" : ""}`}
						>
							{copiedButton === "social" ? "Copied!" : "Email"}
						</span>
					</MagneticButton>
					<MagneticButton
						as="a"
						href="https://thorbis.com"
						target="_blank"
						rel="noopener noreferrer"
						className="social-button focus-ring inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 transition-all duration-300 hover:border-accent/50 hover:bg-accent/15 sm:px-3.5 sm:py-2"
						aria-label="Thorbis"
						strength={0.2}
					>
						<Globe className="size-3.5 text-accent sm:size-4" />
						<span className="text-xs font-medium text-accent sm:text-sm">Thorbis</span>
					</MagneticButton>
				</div>
			</div>
		</>
	);
}
