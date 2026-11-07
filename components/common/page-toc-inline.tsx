import { CaretDown } from "@/lib/icons";
import type { TocItem } from "@/lib/markdown";
import { cn } from "@/lib/utils";

/** Fewer headings than this and an outline adds nothing to the page. */
export const PAGE_TOC_MIN_ITEMS = 3;

interface PageTocInlineProps {
	items: TocItem[];
}

/**
 * The same outline as `PageToc` for screens too narrow to dock it in the
 * gutter (below `xl`), so a long write-up can still be navigated from a phone
 * or a tablet. A native disclosure, closed by default, sits above the prose:
 * it costs one row until it is opened and needs no script, and each link is a
 * plain hash jump that the headings' scroll margin clears the header for.
 */
export function PageTocInline({ items }: PageTocInlineProps) {
	if (items.length < PAGE_TOC_MIN_ITEMS) {
		return null;
	}
	// Subsections sit under a section, so the count names the top level only.
	const sections = items.filter((item) => item.depth === 2).length || items.length;

	return (
		<details className="group mb-8 rounded-xl border border-border xl:hidden print:hidden">
			<summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-xl px-3 text-copy-14 [&::-webkit-details-marker]:hidden">
				<span className="font-medium text-foreground">On this page</span>
				<span className="text-muted-foreground">
					{sections} {sections === 1 ? "section" : "sections"}
				</span>
				<CaretDown
					aria-hidden="true"
					className="ml-auto size-4 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none"
				/>
			</summary>
			<nav aria-label="On this page" className="border-border border-t p-1">
				<ul className="flex flex-col">
					{items.map((item) => (
						<li key={item.id}>
							<a
								className={cn(
									"flex min-h-11 pointer-fine:min-h-8 items-center rounded-lg py-1 pr-3 text-copy-14 text-muted-foreground leading-snug transition-colors hover:text-foreground",
									item.depth === 3 ? "pl-6" : "pl-2"
								)}
								href={`#${item.id}`}
							>
								{item.text}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</details>
	);
}
