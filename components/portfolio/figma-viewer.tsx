import { Image as ImageIcon, Monitor } from "@/lib/icons";
import { FigmaInteractiveViewerClient } from "./figma-viewer-client";

interface FigmaInteractiveViewerProps {
	fileKey: string;
	fileName: string;
	imageUrl: string | null;
}

/** Server-rendered slots avoid shipping glyph definitions with the viewer. */
export function FigmaInteractiveViewer({
	fileKey,
	fileName,
	imageUrl,
}: FigmaInteractiveViewerProps) {
	return (
		<FigmaInteractiveViewerClient
			fileKey={fileKey}
			fileName={fileName}
			icons={{
				interactive: <Monitor aria-hidden="true" className="size-4" />,
				missing: <ImageIcon aria-hidden="true" className="size-6 text-muted-foreground" />,
				preview: <ImageIcon aria-hidden="true" className="size-4" />,
			}}
			imageUrl={imageUrl}
		/>
	);
}
