"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { createCheckout } from "@/lib/actions/create-checkout";
import { ArrowUpRight, Loader2 } from "@/lib/icons";

export function CheckoutForm({
	productId,
	productName,
	requestId,
}: {
	productId: string;
	productName: string;
	requestId: string;
}) {
	const [state, action, pending] = useActionState(createCheckout.bind(null, productId, requestId), {
		error: "",
	});
	const errorRef = useRef<HTMLParagraphElement>(null);
	useEffect(() => {
		if (state.error) {
			errorRef.current?.focus();
		}
	}, [state]);

	return (
		<form action={action} className="flex flex-col items-start gap-3 sm:items-end">
			<Button
				type="submit"
				size="lg"
				className="w-full touch-manipulation scroll-mb-28 sm:w-auto"
				disabled={pending}
				aria-busy={pending}
				aria-label={`Try test checkout for ${productName}`}
				aria-describedby={state.error ? `${productId}-error` : undefined}
			>
				Try test checkout
				{pending ? (
					<Loader2 aria-hidden="true" className="size-4 animate-spin" />
				) : (
					<ArrowUpRight aria-hidden="true" className="size-4" />
				)}
			</Button>
			<p className="sr-only" role="status">
				{pending ? "Opening test checkout…" : ""}
			</p>
			{state.error && (
				<p
					ref={errorRef}
					tabIndex={-1}
					id={`${productId}-error`}
					role="status"
					className="max-w-xs scroll-mb-28 rounded-md text-copy-14 outline-ring focus-visible:outline-2 focus-visible:outline-offset-4"
				>
					{state.error}
				</p>
			)}
		</form>
	);
}
