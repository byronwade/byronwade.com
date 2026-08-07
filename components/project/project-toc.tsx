"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/lib/markdown-utils";
import { cn } from "@/lib/utils";

interface ProjectTocProps {
	items: TocItem[];
}

/**
 * Sticky table of contents with scroll-spy. Highlights the heading currently
 * in view and supports keyboard + smooth-scroll navigation. Renders nothing
 * when there are too few headings to be useful.
 */
export function ProjectToc({ items }: ProjectTocProps) {
	const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		if (items.length === 0 || typeof IntersectionObserver === "undefined") {
			return;
		}

		const visible = new Map<string, number>();

		observerRef.current = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						visible.set(entry.target.id, entry.intersectionRatio);
					} else {
						visible.delete(entry.target.id);
					}
				}
				// Pick the heading nearest the top of the viewport that is visible.
				let bestId = "";
				let bestTop = Number.POSITIVE_INFINITY;
				for (const id of visible.keys()) {
					const el = document.getElementById(id);
					if (!el) {
						continue;
					}
					const top = Math.abs(el.getBoundingClientRect().top);
					if (top < bestTop) {
						bestTop = top;
						bestId = id;
					}
				}
				if (bestId) {
					setActiveId(bestId);
				}
			},
			{ rootMargin: "-88px 0px -70% 0px", threshold: [0, 1] }
		);

		const observer = observerRef.current;
		for (const item of items) {
			const el = document.getElementById(item.id);
			if (el) {
				observer.observe(el);
			}
		}

		return () => observer.disconnect();
	}, [items]);

	const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
		event.preventDefault();
		const el = document.getElementById(id);
		if (!el) {
			return;
		}
		setActiveId(id);
		el.scrollIntoView({ behavior: "smooth", block: "start" });
		// Update the hash without jumping (smooth scroll handles position).
		if (typeof history !== "undefined") {
			history.replaceState(null, "", `#${id}`);
		}
		el.setAttribute("tabindex", "-1");
		el.focus({ preventScroll: true });
	};

	if (items.length < 3) {
		return null;
	}

	return (
		<nav aria-label="On this page" className="flex flex-col gap-3 text-sm">
			<p className="text-muted-foreground text-xs">On this page</p>
			<ul className="flex flex-col gap-0.5 border-border border-l">
				{items.map((item) => {
					const isActive = activeId === item.id;
					return (
						<li key={item.id}>
							<a
								href={`#${item.id}`}
								onClick={(event) => handleClick(event, item.id)}
								aria-current={isActive ? "location" : undefined}
								className={cn(
									"-ml-px block border-l-2 py-1 leading-snug transition-colors",
									item.depth === 3 ? "pl-6" : "pl-4",
									isActive
										? "border-brand font-medium text-foreground"
										: "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
								)}
							>
								{item.text}
							</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
