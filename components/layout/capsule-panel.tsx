"use client";

import { Dialog } from "@base-ui/react/dialog";
import {
	type ReactNode,
	type Ref,
	type RefObject,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { cn } from "@/lib/utils";

/** Retain the morph's measurable panel while Base UI owns focus and dismissal. */
export function CapsulePanel({
	children,
	className,
	finalFocus,
	id,
	label,
	morphRef,
	onOpenChange,
	open,
	panelRef,
}: {
	children: (Close: typeof Dialog.Close) => ReactNode;
	className: string;
	finalFocus: RefObject<HTMLElement | null>;
	id: string;
	label: string;
	morphRef: RefObject<HTMLDivElement | null>;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	panelRef: Ref<HTMLDivElement>;
}) {
	const [container, setContainer] = useState<HTMLDivElement | null>(null);
	const actionsRef = useRef<Dialog.Root.Actions | null>(null);
	useEffect(() => {
		// A ref is still empty during child layout effects. Passing that ref to
		// Base UI would choose body permanently, detaching the retained morph.
		setContainer(morphRef.current);
	}, [morphRef]);
	useLayoutEffect(() => {
		if (!open) {
			// Release focus guards immediately; keepMounted retains only the box
			// while the independent capsule finishes its closing transition.
			actionsRef.current?.unmount();
		}
	}, [open]);
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange} modal="trap-focus" actionsRef={actionsRef}>
			<Dialog.Portal container={container} keepMounted>
				<Dialog.Popup
					ref={panelRef}
					id={id}
					aria-label={label}
					aria-hidden={!open}
					inert={!open}
					// The morph measures this box; closed content remains inert instead.
					hidden={false}
					// The morph owns initial focus once its delayed panel is measurable.
					initialFocus={false}
					finalFocus={finalFocus}
					className={cn(
						"absolute top-0 opacity-0 outline-none transition-opacity duration-(--motion-fast)",
						open ? "pointer-events-auto" : "pointer-events-none",
						className
					)}
				>
					{children(Dialog.Close)}
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
