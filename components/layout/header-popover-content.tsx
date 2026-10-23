"use client";

import { Popover } from "@base-ui/react/popover";
import {
	type ComponentPropsWithRef,
	type ReactElement,
	type ReactNode,
	type RefObject,
	useEffect,
} from "react";
import { cn } from "@/lib/utils";

export interface HeaderPopoverProps {
	anchor: RefObject<HTMLElement | null> | (() => HTMLElement | null);
	children: ReactNode;
	finalFocus: RefObject<HTMLElement | null>;
	id: string;
	initialFocus: RefObject<HTMLElement | null>;
	kind: "navigation" | "search";
	label: string;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	trigger: ReactElement<ComponentPropsWithRef<"button">>;
}

export default function HeaderPopoverContent({
	anchor,
	children,
	finalFocus,
	id,
	initialFocus,
	kind,
	label,
	onOpenChange,
	onReady,
	open,
	trigger,
}: HeaderPopoverProps & { onReady: () => void }) {
	useEffect(onReady, [onReady]);
	const navigation = kind === "navigation";
	return (
		<Popover.Root modal open={open} onOpenChange={onOpenChange} triggerId={`${id}-trigger`}>
			{/* Base UI owns aria-controls so it follows the popup's mounted lifecycle. */}
			<Popover.Trigger id={`${id}-trigger`} render={trigger} />
			<Popover.Portal>
				<Popover.Positioner
					anchor={anchor}
					side="bottom"
					align={navigation ? "start" : "end"}
					// The source menu measures from inside the header's 1px border.
					sideOffset={navigation ? 8 - 1 : 8}
					alignOffset={navigation ? 1 : 0}
					collisionAvoidance={{ side: "none", align: "none" }}
					collisionPadding={navigation ? 1 : 16}
					// --anchor-width is unset until the first measurement. Without a fallback that
					// frame sized to content, widening a narrow mobile viewport, and the first
					// end-aligned position was computed from the wrong width.
					className={cn(
						"z-(--z-popover)",
						navigation
							? "w-[calc(var(--anchor-width,var(--site-header-width))-2px)]"
							: "w-[min(34rem,var(--anchor-width,var(--site-header-width)))]"
					)}
				>
					<Popover.Popup
						id={id}
						aria-label={label}
						initialFocus={initialFocus}
						finalFocus={finalFocus}
						data-header-menu={navigation ? "" : undefined}
						data-header-search={navigation ? undefined : ""}
						className={cn(
							"max-h-[max(0px,calc(var(--available-height)-env(safe-area-inset-bottom)))] overflow-y-auto overscroll-contain rounded-xl border border-border bg-popover text-popover-foreground shadow-float outline-none [scroll-padding-block:0.5rem]",
							navigation && "p-2"
						)}
					>
						{children}
						{/* Base UI requires its Close part to enable modal focus containment. */}
						<Popover.Close className="sr-only min-h-11 min-w-11 focus:not-sr-only focus:mt-2 focus:w-full focus:rounded-lg focus:bg-muted focus:px-2.5 focus:text-copy-13">
							Close {navigation ? "menu" : "search"}
						</Popover.Close>
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	);
}
