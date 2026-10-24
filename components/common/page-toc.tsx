"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/lib/markdown";
import { cn } from "@/lib/utils";

interface PageTocProps {
	items: TocItem[];
}

/**
 * Sticky table of contents with scroll-spy for a long write-up (case studies
 * and posts). Highlights the heading currently in view and supports keyboard +
 * smooth-scroll navigation. It docks in the right gutter of its `relative`
 * parent on wide screens, so it never moves the text's edge, and renders
 * nothing when there are too few headings to be useful.
 */
export function PageToc({ items }: PageTocProps) {
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
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
			return;
		}
		event.preventDefault();
		const el = document.getElementById(id);
		if (!el) {
			return;
		}
		setActiveId(id);
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		el.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth", block: "start" });
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
		<aside className="absolute inset-y-0 left-full ml-10 hidden w-60 xl:block">
			<nav aria-label="On this page" className="sticky top-24 flex flex-col gap-2 text-copy-13">
				<p className="px-3 text-copy-12 text-muted-foreground">On this page</p>
				<ul className="flex flex-col">
					{items.map((item) => {
						const isActive = activeId === item.id;
						return (
							<li key={item.id}>
								<a
									href={`#${item.id}`}
									onClick={(event) => handleClick(event, item.id)}
									aria-current={isActive ? "location" : undefined}
									className={cn(
										"flex min-h-11 items-center gap-2.5 rounded-lg pr-3 leading-snug transition-colors",
										item.depth === 3 ? "pl-6" : "pl-3",
										isActive
											? "bg-muted font-medium text-foreground"
											: "text-muted-foreground hover:text-foreground"
									)}
								>
									{/* The place mark (Thorbis header menu): an accent dot, never a rule on the edge. */}
									<span
										aria-hidden="true"
										className={cn(
											"size-1.5 shrink-0 rounded-full",
											isActive ? "bg-brand" : "bg-transparent"
										)}
									/>
									{item.text}
								</a>
							</li>
						);
					})}
				</ul>
			</nav>
		</aside>
	);
}
