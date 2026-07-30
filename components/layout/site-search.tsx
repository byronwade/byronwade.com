"use client";

import type { LucideIcon } from "lucide-react";
import { Box, CornerDownLeft, Hash, PenLine, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { onOpenSiteSearch } from "@/lib/search-events";
import type { SearchEntry, SearchKind } from "@/lib/search-types";
import { cn } from "@/lib/utils";

const KIND_ORDER: SearchKind[] = ["Page", "Project", "Writing"];
const KIND_LABEL: Record<SearchKind, string> = {
	Page: "Pages",
	Project: "Projects",
	Writing: "Writing",
};
const KIND_ICON: Record<SearchKind, LucideIcon> = {
	Page: Hash,
	Project: Box,
	Writing: PenLine,
};

function score(entry: SearchEntry, q: string): boolean {
	if (!q) return true;
	const hay = `${entry.label} ${entry.meta ?? ""} ${entry.keywords ?? ""}`.toLowerCase();
	return q
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean)
		.every((tok) => hay.includes(tok));
}

export function SiteSearch({ entries }: { entries: SearchEntry[] }) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [active, setActive] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);

	const results = useMemo(() => entries.filter((e) => score(e, query)), [entries, query]);
	const groups = useMemo(
		() =>
			KIND_ORDER.map((kind) => ({
				kind,
				items: results.filter((e) => e.kind === kind),
			})).filter((g) => g.items.length > 0),
		[results]
	);
	const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((v) => !v);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	useEffect(() => onOpenSiteSearch(() => setOpen(true)), []);

	useEffect(() => {
		if (!open) {
			setQuery("");
			setActive(0);
			return;
		}
		const id = requestAnimationFrame(() => inputRef.current?.focus());
		return () => cancelAnimationFrame(id);
	}, [open]);

	const go = (href: string) => {
		setOpen(false);
		router.push(href);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent
				className="top-[12%] max-w-lg translate-y-0 gap-0 overflow-hidden p-0 sm:max-w-xl"
				showCloseButton={false}
			>
				<DialogHeader className="sr-only">
					<DialogTitle>Search</DialogTitle>
					<DialogDescription>Jump to a page, project, or article.</DialogDescription>
				</DialogHeader>

				<div className="flex items-center gap-3 border-b border-border px-4 py-3">
					<Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
					<input
						ref={inputRef}
						value={query}
						onChange={(e) => {
							setQuery(e.target.value);
							setActive(0);
						}}
						onKeyDown={(e) => {
							if (e.key === "ArrowDown") {
								e.preventDefault();
								setActive((i) => Math.min(i + 1, Math.max(flat.length - 1, 0)));
							} else if (e.key === "ArrowUp") {
								e.preventDefault();
								setActive((i) => Math.max(i - 1, 0));
							} else if (e.key === "Enter" && flat[active]) {
								e.preventDefault();
								go(flat[active].href);
							}
						}}
						placeholder="Search pages, projects, writing…"
						className="h-9 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
						aria-label="Search"
					/>
					<kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[0.6875rem] text-muted-foreground sm:inline">
						esc
					</kbd>
				</div>

				<div className="max-h-[min(60vh,24rem)] overflow-y-auto p-2" role="listbox">
					{flat.length === 0 ? (
						<p className="px-3 py-8 text-center text-sm text-muted-foreground">
							No matches for “{query}”.
						</p>
					) : (
						groups.map((group) => (
							<div key={group.kind} className="mb-2">
								<p className="spec-label mb-1 px-2 py-1.5">{KIND_LABEL[group.kind]}</p>
								<ul>
									{group.items.map((item) => {
										const index = flat.indexOf(item);
										const Icon = KIND_ICON[item.kind];
										const selected = index === active;
										return (
											<li key={item.href}>
												<button
													type="button"
													role="option"
													aria-selected={selected}
													onMouseEnter={() => setActive(index)}
													onClick={() => go(item.href)}
													className={cn(
														"flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
														selected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
													)}
												>
													<Icon
														className={cn(
															"size-4 shrink-0",
															selected ? "opacity-90" : "text-muted-foreground"
														)}
													/>
													<span className="min-w-0 flex-1">
														<span className="block truncate text-sm font-medium tracking-[-0.01em]">
															{item.label}
														</span>
														{item.meta ? (
															<span
																className={cn(
																	"mt-0.5 block truncate text-xs",
																	selected ? "text-primary-foreground/75" : "text-muted-foreground"
																)}
															>
																{item.meta}
															</span>
														) : null}
													</span>
													{selected ? (
														<CornerDownLeft
															className="size-3.5 shrink-0 opacity-80"
															aria-hidden="true"
														/>
													) : null}
												</button>
											</li>
										);
									})}
								</ul>
							</div>
						))
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
