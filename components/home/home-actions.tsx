"use client";

import { ArrowRight, Check, Github, Globe, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SocialLinkPreview } from "@/components/common";
import { InlineContact } from "@/components/home/inline-contact";
import { Button } from "@/components/ui/button";
import { pillLinkClass } from "@/components/ui/pill";
import { useRevealedEmail } from "@/hooks/use-revealed-email";

const socials = [
	{ id: "github", label: "GitHub", href: "https://github.com/byronwade", icon: Github },
	{ id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/byronwade", icon: Linkedin },
	{ id: "twitter", label: "X", href: "https://twitter.com/byron_c_wade", icon: Twitter },
	{ id: "thorbis", label: "Thorbis", href: "https://thorbis.com", icon: Globe },
] as const;

const COPIED_RESET_MS = 2000;

/**
 * The only interactive island on the homepage opening.
 *
 * Split out of the old HomeInteractive so the claim, the proof, and the prose
 * render on the server. This component owns the single contact entry point for
 * the page — there were previously two InlineContact instances mounted at once.
 */
export function HomeActions() {
	const [contactOpen, setContactOpen] = useState(false);
	const [copied, setCopied] = useState(false);
	const email = useRevealedEmail();

	const copyEmail = async () => {
		setContactOpen(true);
		try {
			await navigator.clipboard.writeText(email);
			setCopied(true);
			setTimeout(() => setCopied(false), COPIED_RESET_MS);
		} catch (error) {
			// Clipboard is unavailable on insecure origins and some browsers. The
			// sheet is already open, so the visitor still has a way through.
			console.warn("Clipboard copy unavailable", error);
		}
	};

	return (
		<div className="flex flex-col gap-5">
			<InlineContact email={email} onClose={() => setContactOpen(false)} open={contactOpen} />

			{!contactOpen && (
				<div className="flex flex-wrap items-center gap-2">
					<Button className="gap-2" onClick={() => setContactOpen(true)} size="lg" type="button">
						Start a conversation
						<ArrowRight aria-hidden="true" className="size-4" />
					</Button>
					<Button
						render={<Link href="/projects">See selected work</Link>}
						size="lg"
						variant="outline"
					/>
				</div>
			)}

			<div className="flex flex-wrap items-center gap-2">
				{socials.map((social) =>
					social.id === "github" ? (
						<SocialLinkPreview key={social.id} platform="github">
							<a
								aria-label={social.label}
								className={pillLinkClass}
								href={social.href}
								rel="noopener noreferrer"
								target="_blank"
							>
								<social.icon className="size-4" />
								{social.label}
							</a>
						</SocialLinkPreview>
					) : (
						<a
							aria-label={social.label}
							className={pillLinkClass}
							href={social.href}
							key={social.id}
							rel="noopener noreferrer"
							target="_blank"
						>
							<social.icon className="size-4" />
							{social.label}
						</a>
					)
				)}
				<button className={pillLinkClass} onClick={copyEmail} type="button">
					{copied ? (
						<Check aria-hidden="true" className="size-4 text-brand" />
					) : (
						<Mail aria-hidden="true" className="size-4" />
					)}
					{copied ? "Copied" : "Email"}
				</button>
			</div>
		</div>
	);
}
