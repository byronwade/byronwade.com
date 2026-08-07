"use client";

import { useEffect, useState } from "react";
import { pillLinkClass } from "@/components/ui/pill";
import { Check, Copy, Linkedin, Share2, Twitter } from "@/lib/icons";

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
	const encodedDescription = encodeURIComponent(description || "");

	useEffect(() => {
		// Check for native share support on mount
		setCanShare(typeof navigator !== "undefined" && !!navigator.share);
	}, []);

	const shareLinks = {
		twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${encodedDescription ? "&via=byronwade" : ""}`,
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
				className={pillLinkClass}
				aria-label="Share on LinkedIn"
			>
				<Linkedin className="size-4" />
				<span>LinkedIn</span>
			</a>

			{/* Copy Link */}
			<button type="button" onClick={handleCopy} className={pillLinkClass} aria-label="Copy link">
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
