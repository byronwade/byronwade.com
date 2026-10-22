import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagListProps {
	className?: string;
	limit?: number;
	tags: string[];
}

/**
 * Tags on home, the blog index and post headers, as Thorbis neutral badges. The
 * badge's rim keeps each tag an object on the light page, where the muted fill
 * alone matches the canvas and left the labels looking indented.
 */
export function TagList({ tags, limit, className }: TagListProps) {
	const visible = typeof limit === "number" ? tags.slice(0, limit) : tags;
	if (visible.length === 0) {
		return null;
	}

	return (
		<ul className={cn("flex flex-wrap gap-1.5", className)}>
			{visible.map((tag) => (
				<li key={tag}>
					<Badge variant="muted">{tag}</Badge>
				</li>
			))}
		</ul>
	);
}
