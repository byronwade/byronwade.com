"use client";
import { useRouter } from "next/navigation";
import {
	type KeyboardEvent,
	type ReactNode,
	type RefObject,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { groupSearchResults, SEARCH_QUERY_MAX } from "@/lib/search-match";
import type { SearchEntry, SearchKind } from "@/lib/search-types";
import { cn } from "@/lib/utils";

/** Search state lives with the open panel, so closing discards the query and selection. */
export default function HeaderSearchPanel({
	entries,
	icons,
	inputRef,
	onClose,
}: {
	entries: SearchEntry[];
	icons: { close: ReactNode; kinds: Record<SearchKind, ReactNode> };
	inputRef: RefObject<HTMLInputElement | null>;
	onClose: () => void;
}) {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [active, setActive] = useState(0);
	const listRef = useRef<HTMLDivElement>(null);
	const listId = useId();
	const groups = groupSearchResults(entries, query);
	const results = groups.flatMap((group) => group.items);
	const selected = results[active];
	useEffect(() => {
		listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
	}, [active]);
	const run = (href: string) => {
		onClose();
		router.push(href);
	};
	const onInputKey = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			setActive((index) => Math.min(index + 1, Math.max(0, results.length - 1)));
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setActive((index) => Math.max(index - 1, 0));
		} else if (event.key === "Enter" && selected) {
			event.preventDefault();
			run(selected.href);
		}
	};
	let cursor = 0;
	return (
		<>
			<div className="flex items-center gap-2 border-border border-b p-2">
				<Input
					ref={inputRef}
					value={query}
					maxLength={SEARCH_QUERY_MAX}
					onChange={(event) => {
						setQuery(event.target.value);
						setActive(0);
					}}
					onKeyDown={onInputKey}
					placeholder="Search projects, writing, pages…"
					aria-label="Search"
					role="combobox"
					aria-autocomplete="list"
					aria-expanded={true}
					aria-controls={listId}
					aria-activedescendant={selected ? `${listId}-${active}` : undefined}
					className="h-11 min-w-0 flex-1 text-copy-16 sm:h-11 md:text-copy-16"
				/>
				<Button
					type="button"
					onClick={onClose}
					aria-label="Close search"
					variant="ghost"
					size="icon"
					className="shrink-0 rounded-full text-muted-foreground sm:size-11"
				>
					{icons.close}
				</Button>
			</div>
			<div
				ref={listRef}
				id={listId}
				role="listbox"
				aria-label="Search results"
				className="max-h-80 overflow-y-auto p-2"
			>
				{results.length === 0 ? (
					<p className="px-2.5 py-8 text-center text-copy-13 text-muted-foreground">
						No results for “{query}”.
					</p>
				) : (
					groups.map((group) => (
						<fieldset key={group.kind} aria-label={group.label}>
							<div
								aria-hidden="true"
								className="px-2.5 py-1.5 font-mono text-copy-12 text-muted-foreground"
							>
								{group.label}
							</div>
							{group.items.map((entry) => {
								const index = cursor++;
								return (
									<button
										key={entry.href}
										type="button"
										id={`${listId}-${index}`}
										role="option"
										aria-selected={index === active}
										onPointerMove={() => setActive(index)}
										data-idx={index}
										onClick={() => run(entry.href)}
										className={cn(
											"flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-copy-13",
											index === active && "bg-muted"
										)}
									>
										{icons.kinds[entry.kind]}
										<span className="flex-1">{entry.label}</span>
										{entry.meta && (
											<span className="text-copy-12 text-muted-foreground">{entry.meta}</span>
										)}
									</button>
								);
							})}
						</fieldset>
					))
				)}
			</div>
			<p
				role="status"
				className="border-border border-t px-3.5 py-2 text-copy-12 text-muted-foreground"
			>
				{results.length} results · ↑↓ navigate · Enter open · Esc close
			</p>
		</>
	);
}
