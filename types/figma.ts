/** A node in a Figma document tree. Only the fields the app walks are modelled. */
interface FigmaNode {
	id: string;
	name: string;
	type: string;
	children?: FigmaNode[];
}

/**
 * A Figma file as this app consumes it. `components` and `styles` come back from
 * the REST API keyed by node id, so they are read with `Object.keys`, not indexed.
 */
export interface FigmaFile {
	key: string;
	name: string;
	thumbnail_url: string;
	last_modified: string;
	version?: string;
	document?: FigmaNode;
	components?: Record<string, { key: string; name: string; description?: string }>;
	styles?: Record<string, { key: string; name: string; styleType?: string }>;
}
