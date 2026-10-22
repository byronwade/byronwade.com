import { pillLinkClass } from "@/components/ui/pill";
import { Check, Copy, Linkedin, Share2, Twitter } from "@/lib/icons";
import { xHandle } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ShareControls } from "./share-controls";

interface SocialShareProps {
	className?: string;
	description?: string;
	title: string;
	url: string;
}

/**
 * Social Share Component
 * Provides sharing buttons for blog posts. The X and LinkedIn links are plain
 * server-rendered anchors; only native share and copy need client code.
 */
export function SocialShare({ url, title, description, className }: SocialShareProps) {
	const encodedUrl = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);

	const shareLinks = {
		twitter: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=${xHandle}`,
		linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
	};

	return (
		<div className={cn("flex flex-wrap items-center gap-3", className)}>
			<ShareControls
				description={description}
				icons={{
					share: <Share2 className="size-4" />,
					copy: <Copy aria-hidden="true" className="size-4" />,
					copied: <Check aria-hidden="true" className="size-4" />,
				}}
				title={title}
				url={url}
			>
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
			</ShareControls>
		</div>
	);
}
