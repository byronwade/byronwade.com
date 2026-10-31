"use client";

import { useEffect, useRef, useState } from "react";
import type { TocItem } from "@/lib/markdown";
import { cn } from "@/lib/utils";

/** Fewer headings than this and an outline adds nothing to the page. */
const MIN_ITEMS = 3;

/** Fraction of the viewport, from the top, where a heading counts as being read. */
const READING_LINE = 0.3;

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
	const listRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		if (items.length < MIN_ITEMS) {
			return;
		}

		const headings = items.flatMap((item) => {
			const el = document.getElementById(item.id);
			return el ? [{ id: item.id, el }] : [];
		});
		const first = headings[0];
		if (!first) {
			return;
		}

		// The section being read is the last heading above the reading line. An
		// observer only sees headings crossing a band, so a jump (End, a long
		// fling, a restored scroll position) could leave a stale section lit.
		// Measuring on scroll answers from position, whatever the path there.
		let frame = 0;
		const update = () => {
			frame = 0;
			const root = document.documentElement;
			// At the foot of the page the last sections can never reach the line,
			// so anything on screen counts.
			const atBottom = window.scrollY + window.innerHeight >= root.scrollHeight - 2;
			const line = window.innerHeight * (atBottom ? 1 : READING_LINE);
			let current = first.id;
			for (const { id, el } of headings) {
				if (el.getBoundingClientRect().top > line) {
					break;
				}
				current = id;
			}
			setActiveId(current);
		};
		const schedule = () => {
			if (frame === 0) {
				frame = window.requestAnimationFrame(update);
			}
		};

		update();
		window.addEventListener("scroll", schedule, { passive: true });
		window.addEventListener("resize", schedule, { passive: true });
		return () => {
			window.cancelAnimationFrame(frame);
			window.removeEventListener("scroll", schedule);
			window.removeEventListener("resize", schedule);
		};
	}, [items]);

	// A long outline scrolls inside its own box (it can be taller than a laptop
	// screen), so keep the lit section in that box as the reader moves through.
	// Only the list moves; the page's scroll is left alone.
	useEffect(() => {
		const list = listRef.current;
		const link = list?.querySelector(`a[href="#${CSS.escape(activeId)}"]`);
		if (!(list && link) || list.scrollHeight <= list.clientHeight) {
			return;
		}
		const box = list.getBoundingClientRect();
		const row = link.getBoundingClientRect();
		if (row.top < box.top) {
			list.scrollTop -= box.top - row.top;
		} else if (row.bottom > box.bottom) {
			list.scrollTop += row.bottom - box.bottom;
		}
	}, [activeId]);

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

	if (items.length < MIN_ITEMS) {
		return null;
	}

	return (
		<aside className="absolute inset-y-0 left-full ml-10 hidden w-60 xl:block">
			<nav aria-label="On this page" className="sticky top-24 flex flex-col gap-2 text-copy-13">
				<p className="px-3 text-copy-12 text-muted-foreground">On this page</p>
				{/* Capped to the screen below the sticky offset; the 4px inset keeps the
				    links' focus rings inside the scroll box's clip. */}
				<ul
					className="-m-1 flex max-h-[calc(100dvh-10rem)] flex-col overflow-y-auto overscroll-contain p-1"
					ref={listRef}
				>
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
