"use client";

import { type ReactNode, useEffect, useState } from "react";
import { pillLinkClass } from "@/components/ui/pill";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface ShareControlsProps {
	/** The server-rendered share links, placed between native share and copy. */
	children: ReactNode;
	description?: string;
	/** Rendered by the server parent so glyph definitions stay out of the post's JavaScript. */
	icons: { share: ReactNode; copy: ReactNode; copied: ReactNode };
	title: string;
	url: string;
}

/** The two share actions that need the browser: the native share sheet and copying the link. */
export function ShareControls({ children, description, icons, title, url }: ShareControlsProps) {
	const { status: copyStatus, copy } = useCopyToClipboard();
	const copied = copyStatus === "copied";
	const [canShare, setCanShare] = useState(false);

	useEffect(() => {
		// Check for native share support on mount
		setCanShare(typeof navigator !== "undefined" && !!navigator.share);
	}, []);

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
				if (!(err instanceof Error && err.name === "AbortError")) {
					console.error("Share failed:", err);
				}
			}
		}
	};

	return (
		<>
			{/* Native Share (mobile) */}
			{canShare && (
				<button
					type="button"
					onClick={handleNativeShare}
					className={pillLinkClass}
					aria-label="Share via native share"
				>
					{icons.share}
					<span>Share</span>
				</button>
			)}

			{children}

			{/* Copy link. Both words share one grid cell so the chip never changes
			    width when the label swaps (Thorbis "nothing shifts"); the result is
			    announced from a sibling live region, not by renaming the button. */}
			<button
				type="button"
				onClick={() => copy(url)}
				className={pillLinkClass}
				aria-label="Copy link"
				aria-busy={copyStatus === "copying"}
				aria-disabled={copyStatus === "copying"}
			>
				{copied ? icons.copied : icons.copy}
				<span className="grid">
					<span className={cn("col-start-1 row-start-1", copied && "invisible")}>Copy link</span>
					<span className={cn("col-start-1 row-start-1", !copied && "invisible")}>Copied</span>
				</span>
			</button>
			<span
				className={copyStatus === "failed" ? "basis-full text-copy-13 text-destructive" : "sr-only"}
				role="status"
			>
				{copied && "Link copied"}
				{copyStatus === "failed" &&
					"Couldn’t copy the link. Copy the address from your browser instead."}
			</span>
		</>
	);
}
