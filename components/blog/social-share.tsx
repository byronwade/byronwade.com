"use client";

import { useEffect, useState } from "react";
import { pillLinkClass } from "@/components/ui/pill";
import { Check, Copy, Linkedin, Share2, Twitter } from "@/lib/icons";
import { xHandle } from "@/lib/site";
import { cn } from "@/lib/utils";

interface SocialShareProps {
	className?: string;
	description?: string;
	title: string;
	url: string;
}

/**
 * Social Share Component
 * Provides sharing buttons for blog posts and projects
 */
export function SocialShare({ url, title, description, className }: SocialShareProps) {
	const [copied, setCopied] = useState(false);
	const [canShare, setCanShare] = useState(false);
	const encodedUrl = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);

	useEffect(() => {
		// Check for native share support on mount
		setCanShare(typeof navigator !== "undefined" && !!navigator.share);
	}, []);

	const shareLinks = {
		twitter: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=${xHandle}`,
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
		<div className={cn("flex flex-wrap items-center gap-3", className)}>
			{/* Native Share (mobile) */}
			{canShare && (
				<button
					type="button"
					onClick={handleNativeShare}
					className={pillLinkClass}
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
				className={pillLinkClass}
				aria-label="Share on X"
			>
				<Twitter className="size-4" />
				<span>X</span>
			</a>

			{/* LinkedIn */}
			<a
				href={shareLinks.linkedin}
				target="_blank"
				rel="noopener noreferrer"
				className={pillLinkClass}
				aria-label="Share on LinkedIn"
			>
				<Linkedin className="size-4" />
				<span>LinkedIn</span>
			</a>

			{/* Copy link. Both words share one grid cell so the chip never changes
			    width when the label swaps (Thorbis "nothing shifts"); the result is
			    announced from a sibling live region, not by renaming the button. */}
			<button type="button" onClick={handleCopy} className={pillLinkClass} aria-label="Copy link">
				{copied ? (
					<Check aria-hidden="true" className="size-4" />
				) : (
					<Copy aria-hidden="true" className="size-4" />
				)}
				<span className="grid">
					<span className={cn("col-start-1 row-start-1", copied && "invisible")}>Copy link</span>
					<span className={cn("col-start-1 row-start-1", !copied && "invisible")}>Copied</span>
				</span>
			</button>
			<span className="sr-only" role="status">
				{copied ? "Link copied" : ""}
			</span>
		</div>
	);
}
