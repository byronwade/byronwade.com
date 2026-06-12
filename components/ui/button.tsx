"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type ButtonStatus = "idle" | "loading" | "success" | "error";

/** The click event Base UI's Button passes to onClick (a BaseUIEvent superset). */
type ButtonClickEvent = Parameters<NonNullable<ButtonPrimitive.Props["onClick"]>>[0];

/* Dependency-free state icons — button stays self-contained (no Phosphor import). */
function StatusSpinner() {
	return (
		<span
			aria-hidden="true"
			data-slot="button-spinner"
			className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
		/>
	);
}

function StatusCheck() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);
}

function StatusAlert() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 8v4" />
			<path d="M12 16h.01" />
		</svg>
	);
}

type ButtonProps = ButtonPrimitive.Props &
	VariantProps<typeof buttonVariants> & {
		/**
		 * Async click handler that drives a self-managing state machine:
		 * idle → loading → success | error → (after `resetDelay`) idle.
		 * While loading the button is disabled and `aria-busy`; on error it sets
		 * `aria-invalid` (reusing the destructive ring).
		 */
		onClickAsync?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
		/** Controlled loading — forces the loading state regardless of onClickAsync. */
		loading?: boolean;
		/** Optional label swaps per state; each falls back to `children`. */
		loadingText?: React.ReactNode;
		successText?: React.ReactNode;
		errorText?: React.ReactNode;
		/** Milliseconds to show success/error before reverting to idle. Default 1500. */
		resetDelay?: number;
	};

function Button({
	className,
	variant = "default",
	size = "default",
	render,
	nativeButton,
	onClick,
	onClickAsync,
	loading,
	loadingText,
	successText,
	errorText,
	resetDelay = 1500,
	disabled,
	children,
	...props
}: ButtonProps) {
	const [status, setStatus] = React.useState<ButtonStatus>("idle");
	const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
	const mounted = React.useRef(true);

	React.useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
			if (timer.current) clearTimeout(timer.current);
		};
	}, []);

	// A button is "stateful" when it opts into either prop.
	const isStateful = onClickAsync != null || loading != null;
	const effectiveStatus: ButtonStatus = loading ? "loading" : status;
	const isBusy = effectiveStatus === "loading";

	async function runAsync(event: ButtonClickEvent) {
		if (!onClickAsync || isBusy || event.defaultPrevented) return;
		if (timer.current) {
			clearTimeout(timer.current);
			timer.current = null;
		}
		setStatus("loading");
		try {
			await onClickAsync(event);
			if (mounted.current) setStatus("success");
		} catch {
			if (mounted.current) setStatus("error");
		}
		timer.current = setTimeout(() => {
			if (mounted.current) setStatus("idle");
		}, resetDelay);
	}

	function handleClick(event: ButtonClickEvent) {
		onClick?.(event);
		if (onClickAsync) void runAsync(event);
	}

	// When `render` swaps the underlying element for a non-<button>, Base UI needs
	// nativeButton={false} to keep correct semantics. Infer unless set explicitly.
	const resolvedNativeButton =
		nativeButton ??
		(render != null && !(React.isValidElement(render) && render.type === "button")
			? false
			: undefined);

	const stateIcon =
		effectiveStatus === "loading" ? (
			<StatusSpinner />
		) : effectiveStatus === "success" ? (
			<StatusCheck />
		) : effectiveStatus === "error" ? (
			<StatusAlert />
		) : null;

	const stateText =
		effectiveStatus === "loading"
			? loadingText
			: effectiveStatus === "success"
				? successText
				: effectiveStatus === "error"
					? errorText
					: undefined;

	const content = isStateful ? (
		<>
			{stateIcon}
			{stateText ?? children}
		</>
	) : (
		children
	);

	return (
		<ButtonPrimitive
			data-slot="button"
			data-status={isStateful ? effectiveStatus : undefined}
			className={cn(
				buttonVariants({ variant, size }),
				effectiveStatus === "success" && "text-success",
				className
			)}
			render={render}
			nativeButton={resolvedNativeButton}
			disabled={disabled || isBusy}
			aria-busy={isBusy || undefined}
			aria-invalid={effectiveStatus === "error" || undefined}
			onClick={handleClick}
			{...props}
		>
			{content}
		</ButtonPrimitive>
	);
}

export type { ButtonProps, ButtonStatus };
export { Button, buttonVariants };
