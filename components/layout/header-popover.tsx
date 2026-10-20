"use client";

import { cloneElement, lazy, Suspense, useEffect, useRef, useState } from "react";
import type { HeaderPopoverProps } from "@/components/layout/header-popover-content";

const Content = lazy(() => import("@/components/layout/header-popover-content"));

/** Keep modal positioning and focus machinery off the closed header's initial path. */
export function HeaderPopover(props: HeaderPopoverProps & { closedLabel: string }) {
	const [activated, setActivated] = useState(false);
	const returnAfterCancel = useRef(false);
	useEffect(() => {
		if (props.open) {
			setActivated(true);
		}
	}, [props.open]);
	const fallback = cloneElement(props.trigger, {
		id: `${props.id}-trigger`,
		"aria-controls": props.id,
		"aria-haspopup": "dialog",
		"aria-expanded": false,
		"aria-busy": props.open || undefined,
		"aria-label": props.closedLabel,
		onClick: () => {
			returnAfterCancel.current = props.open;
			setActivated(true);
			props.onOpenChange(!props.open);
		},
		onKeyDown: (event) => {
			if (event.key === "Escape" && props.open) {
				event.preventDefault();
				returnAfterCancel.current = true;
				props.onOpenChange(false);
			}
		},
	});
	return activated || props.open ? (
		<Suspense fallback={fallback}>
			<Content
				{...props}
				onReady={() => {
					// A cancelled first open can replace the focused fallback trigger.
					if (
						returnAfterCancel.current &&
						!props.open &&
						document.activeElement === document.body
					) {
						props.finalFocus.current?.focus({ preventScroll: true });
					}
					returnAfterCancel.current = false;
				}}
			/>
		</Suspense>
	) : (
		fallback
	);
}
