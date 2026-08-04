import { cn } from "@/lib/utils";

interface TagListProps {
	tags: string[];
	limit?: number;
	className?: string;
	itemClassName?: string;
}

/** Compact tag chips reused on home, blog index, and post headers. */
export function TagList({ tags, limit, className, itemClassName }: TagListProps) {
	const visible = typeof limit === "number" ? tags.slice(0, limit) : tags;
	if (visible.length === 0) return null;

	return (
		<ul className={cn("flex flex-wrap gap-1.5", className)}>
			{visible.map((tag) => (
				<li
					key={tag}
					className={cn(
						"rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground",
						itemClassName
					)}
				>
					{tag}
				</li>
			))}
		</ul>
	);
}
