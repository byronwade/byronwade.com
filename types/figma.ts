/** A node in a Figma document tree. Only the fields the app walks are modelled. */
interface FigmaNode {
	children?: FigmaNode[];
	id: string;
	name: string;
	type: string;
}

/**
 * A Figma file as this app consumes it. `components` and `styles` come back from
 * the REST API keyed by node id, so they are read with `Object.keys`, not indexed.
 */
export interface FigmaFile {
	components?: Record<string, { key: string; name: string; description?: string }>;
	document?: FigmaNode;
	key: string;
	last_modified: string;
	name: string;
	styles?: Record<string, { key: string; name: string; styleType?: string }>;
	thumbnail_url: string;
	version?: string;
}
