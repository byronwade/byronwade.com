import {
	ExternalLink,
	Globe,
	Grip,
	ImageOff,
	Laptop,
	Maximize2,
	Minimize2,
	Monitor,
	RefreshCw,
	RotateCcw,
	Smartphone,
	Tablet,
} from "@/lib/icons";
import { screenshotsConfigured } from "@/lib/screenshot-capture";
import { FullWidthProjectPreviewClient } from "./full-width-project-preview-client";

/**
 * Server-rendered slots avoid shipping glyph definitions with the preview.
 *
 * A deployment without a capture key renders nothing: every capture would answer
 * "off", so the frame would be a large empty box whose only action repeats the
 * page header's Visit site link.
 */
export function FullWidthProjectPreview(props: {
	captionClassName?: string;
	href: string;
	title: string;
	url: string;
}) {
	if (!screenshotsConfigured()) {
		return null;
	}
	return (
		<FullWidthProjectPreviewClient
			{...props}
			icons={{
				address: <Globe className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />,
				enterFullscreen: <Maximize2 className="size-3.5" aria-hidden="true" />,
				exitFullscreen: <Minimize2 className="size-3.5" aria-hidden="true" />,
				grip: <Grip className="size-3" aria-hidden="true" />,
				open: <ExternalLink className="size-3" aria-hidden="true" />,
				presets: {
					desktop: <Monitor className="size-3.5" aria-hidden="true" />,
					laptop: <Laptop className="size-3.5" aria-hidden="true" />,
					tablet: <Tablet className="size-3.5" aria-hidden="true" />,
					mobile: <Smartphone className="size-3.5" aria-hidden="true" />,
				},
				resetWidth: <RotateCcw className="size-3.5" aria-hidden="true" />,
				retry: <RefreshCw className="size-3" aria-hidden="true" />,
				unavailable: <ImageOff className="size-6 text-muted-foreground" aria-hidden="true" />,
			}}
		/>
	);
}
