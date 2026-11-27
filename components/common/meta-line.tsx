import { Children, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A facts line ("July 12 · Updated August 7 · 13 min read") that wraps cleanly.
 * Each dot belongs to the fact after it and sits in the gap before it. The row
 * is pulled left by one gap inside a clipping line, so the dot that would open a
 * wrapped line falls outside and no line starts or ends on a separator.
 */
export function MetaLine({ children, className }: { children: ReactNode; className?: string }) {
	const facts = Children.toArray(children);
	return (
		<p className={cn("overflow-hidden text-copy-13 text-muted-foreground", className)}>
			<span className="-ml-5 flex flex-wrap items-center gap-y-1">
				{facts.map((fact, index) => (
					<span
						// Facts are a fixed, ordered set for one page; the order is the identity.
						// biome-ignore lint/suspicious/noArrayIndexKey: static list, never reordered
						key={index}
						className="relative pl-5"
						data-meta-fact
					>
						<span aria-hidden="true" className="absolute inset-y-0 left-0 w-5 text-center">
							·
						</span>
						{fact}
					</span>
				))}
			</span>
		</p>
	);
}
