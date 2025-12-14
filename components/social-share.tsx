"use client";

import { Check, Copy, Linkedin, Share2, Twitter } from "lucide-react";
import { useState } from "react";

interface SocialShareProps {
	url: string;
	title: string;
	description?: string;
	className?: string;
}

/**
 * Social Share Component
 * Provides sharing buttons for blog posts and projects
 */
export function SocialShare({ url, title, description, className }: SocialShareProps) {
	const [copied, setCopied] = useState(false);
	const encodedUrl = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);
	const encodedDescription = encodeURIComponent(description || "");

	const shareLinks = {
		twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${encodedDescription ? `&via=byronwade` : ""}`,
		linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
		}
	};

	const handleNativeShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title,
					text: description,
					url,
				});
			} catch (err) {
				// User cancelled or error
				if ((err as Error).name !== "AbortError") {
					console.error("Share failed:", err);
				}
			}
		}
	};

	return (
		<div className={`flex flex-wrap items-center gap-2 ${className || ""}`}>
			{/* Native Share (mobile) */}
			{navigator.share && (
				<button
					type="button"
					onClick={handleNativeShare}
					className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-br from-accent/25 to-accent/15 dark:from-accent/20 dark:to-accent/10 border border-accent/40 dark:border-accent/30 hover:from-accent/35 hover:to-accent/25 dark:hover:from-accent/25 dark:hover:to-accent/15 hover:border-accent/50 dark:hover:border-accent/40 transition-all duration-300 text-sm font-medium text-accent focus-ring"
					aria-label="Share via native share"
				>
					<Share2 className="size-4" />
					<span>Share</span>
				</button>
			)}

			{/* Twitter */}
			<a
				href={shareLinks.twitter}
				target="_blank"
				rel="noopener noreferrer"
				className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-br from-accent/25 to-accent/15 dark:from-accent/20 dark:to-accent/10 border border-accent/40 dark:border-accent/30 hover:from-accent/35 hover:to-accent/25 dark:hover:from-accent/25 dark:hover:to-accent/15 hover:border-accent/50 dark:hover:border-accent/40 transition-all duration-300 text-sm font-medium text-accent focus-ring"
				aria-label="Share on Twitter"
			>
				<Twitter className="size-4" />
				<span>Twitter</span>
			</a>

			{/* LinkedIn */}
			<a
				href={shareLinks.linkedin}
				target="_blank"
				rel="noopener noreferrer"
				className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-br from-accent/25 to-accent/15 dark:from-accent/20 dark:to-accent/10 border border-accent/40 dark:border-accent/30 hover:from-accent/35 hover:to-accent/25 dark:hover:from-accent/25 dark:hover:to-accent/15 hover:border-accent/50 dark:hover:border-accent/40 transition-all duration-300 text-sm font-medium text-accent focus-ring"
				aria-label="Share on LinkedIn"
			>
				<Linkedin className="size-4" />
				<span>LinkedIn</span>
			</a>

			{/* Copy Link */}
			<button
				type="button"
				onClick={handleCopy}
				className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-br from-accent/25 to-accent/15 dark:from-accent/20 dark:to-accent/10 border border-accent/40 dark:border-accent/30 hover:from-accent/35 hover:to-accent/25 dark:hover:from-accent/25 dark:hover:to-accent/15 hover:border-accent/50 dark:hover:border-accent/40 transition-all duration-300 text-sm font-medium text-accent focus-ring"
				aria-label="Copy link"
			>
				{copied ? (
					<>
						<Check className="size-4" />
						<span>Copied!</span>
					</>
				) : (
					<>
						<Copy className="size-4" />
						<span>Copy Link</span>
					</>
				)}
			</button>
		</div>
	);
}
