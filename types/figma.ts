/** A Figma file summary from a project's file list. */
export interface FigmaFile {
	key: string;
	last_modified: string;
	name: string;
	thumbnail_url?: string;
}

/**
 * What the Figma detail page renders, projected from the file response at the
 * server boundary. The document tree itself is counted, never cached.
 */
export interface FigmaFileDetail {
	components: { id: string; name?: string; description?: string }[];
	lastModified: string;
	name: string;
	pageCount: number;
	styleCount: number;
	thumbnailUrl: string | null;
	version?: string;
}
