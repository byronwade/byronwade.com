"use client";

import { ArrowLeft, Check, X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/** A single step in a flow. For a 1-step flow this is just a form. */
export interface BloomStep<S> {
	title: string;
	caption?: string;
	/** Renders the step body; `set` shallow-merges a patch into flow state. */
	body: (state: S, set: (patch: Partial<S>) => void) => React.ReactNode;
	/** Label for the Primary button on this step. */
	primaryLabel: string;
	/** Gate: Primary is disabled until this returns true. */
	canAdvance: (state: S) => boolean;
}

/** Declarative form/wizard definition rendered by `BloomFlow`. */
export interface BloomFlowDef<S, R> {
	id: string;
	initial: S;
	steps: BloomStep<S>[];
	/** Fired when the last step's Primary is pressed. */
	onComplete: (state: S) => Promise<R>;
	/** Success surface derived from the completion result. */
	success: (result: R) => { title: string; actions?: React.ReactNode };
}

type Phase = "steps" | "submitting" | "success";

export interface BloomFlowProps<S, R> {
	flow: BloomFlowDef<S, R>;
	onClose: () => void;
	className?: string;
}

/**
 * The stepped flow body rendered INSIDE a `Bloom`. It owns the steps, the
 * persistent footer (Back/Close · step-dots · Primary), and the success view —
 * but NOT the outer height bloom: Bloom's body-height ResizeObserver picks up
 * this content's size changes, so BloomFlow must not wrap itself in a competing
 * height transition. Step bodies fade/slide in via CSS (`animate-in`); the
 * step-dots and the success check are pure CSS, ported from DockSheet. No Motion.
 */
export function BloomFlow<S, R>({ flow, onClose, className }: BloomFlowProps<S, R>) {
	const [state, setState] = React.useState<S>(flow.initial);
	const [stepIndex, setStepIndex] = React.useState(0);
	const [phase, setPhase] = React.useState<Phase>("steps");
	const [result, setResult] = React.useState<{ value: R } | null>(null);
	const [error, setError] = React.useState<string | null>(null);

	const set = React.useCallback((patch: Partial<S>) => {
		setState((prev) => ({ ...prev, ...patch }));
	}, []);

	const steps = flow.steps;
	const stepCount = steps.length;
	const step = steps[stepIndex];
	const isLast = stepIndex === stepCount - 1;
	const submitting = phase === "submitting";

	const canAdvance = step ? step.canAdvance(state) : false;

	const back = React.useCallback(() => {
		if (submitting) return;
		setError(null);
		if (stepIndex > 0) {
			setStepIndex((i) => i - 1);
		} else {
			onClose();
		}
	}, [submitting, stepIndex, onClose]);

	const advance = React.useCallback(async () => {
		if (submitting || !step || !step.canAdvance(state)) return;
		setError(null);
		if (!isLast) {
			setStepIndex((i) => i + 1);
			return;
		}
		setPhase("submitting");
		try {
			const r = await flow.onComplete(state);
			setResult({ value: r });
			setPhase("success");
		} catch (e) {
			setError(e instanceof Error ? e.message : "Something went wrong.");
			setPhase("steps");
		}
	}, [submitting, step, state, isLast, flow]);

	const successView = phase === "success" && result ? flow.success(result.value) : null;

	return (
		<div className={cn("flex w-full flex-col", className)}>
			{/* ── Body region ── (height owned by the parent Bloom) */}
			<div className="min-w-0 px-5 py-4">
				{phase === "success" && successView ? (
					<div
						key="__success"
						className="animate-in fade-in slide-in-from-bottom-2 flex flex-col items-center gap-4 py-6 text-center duration-300 motion-reduce:animate-none"
					>
						<SuccessRing />
						<h3 className="text-base font-semibold text-foreground">{successView.title}</h3>
						{successView.actions ? (
							<div className="flex flex-wrap items-center justify-center gap-2">
								{successView.actions}
							</div>
						) : null}
					</div>
				) : step ? (
					<div
						key={stepIndex}
						className="animate-in fade-in slide-in-from-bottom-2 duration-300 motion-reduce:animate-none"
					>
						<div className="mb-3">
							<h3 className="text-base font-semibold text-foreground">{step.title}</h3>
							{step.caption ? (
								<p className="mt-0.5 text-sm text-muted-foreground">{step.caption}</p>
							) : null}
						</div>
						<div>{step.body(state, set)}</div>
						{error ? (
							<p role="alert" className="mt-3 text-sm text-destructive">
								{error}
							</p>
						) : null}
					</div>
				) : null}
			</div>

			{/* ── Persistent footer (built once) ── */}
			<div className="flex shrink-0 items-center gap-3 border-t border-border/60 px-5 py-3">
				{phase === "success" ? (
					// Footer collapses to a single Done.
					<button
						type="button"
						onClick={onClose}
						className="ml-auto inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-medium text-white outline-none transition-colors hover:bg-brand/90 focus-visible:ring-2 focus-visible:ring-ring"
					>
						Done
					</button>
				) : (
					<>
						{/* Back / Close — same slot, label swaps with stepIndex. */}
						<button
							type="button"
							onClick={back}
							disabled={submitting}
							className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
						>
							{stepIndex > 0 ? (
								<>
									<ArrowLeft className="size-4" aria-hidden />
									Back
								</>
							) : (
								<>
									<X className="size-4" aria-hidden />
									Close
								</>
							)}
						</button>

						{/* Centered step-dots — one per step; the active dot widens (w-1.5→w-4). */}
						<div className="mx-auto flex items-center gap-1.5" role="presentation" aria-hidden>
							{steps.map((_, i) => (
								<span
									key={i}
									className={cn(
										"h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
										i === stepIndex
											? "w-4 bg-brand"
											: i < stepIndex
												? "w-1.5 bg-brand/40"
												: "w-1.5 bg-border"
									)}
								/>
							))}
						</div>

						{/* Primary — label/disabled swap, slot fixed. */}
						<button
							type="button"
							onClick={advance}
							disabled={!canAdvance || submitting}
							aria-busy={submitting}
							className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white outline-none transition-colors hover:bg-brand/90 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
						>
							{submitting ? (
								<span
									className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
									aria-hidden
								/>
							) : null}
							{step ? step.primaryLabel : ""}
						</button>
					</>
				)}
			</div>
		</div>
	);
}

/** Static `--brand` success check, ported from DockSheet's SuccessView (no path-draw). */
function SuccessRing() {
	return (
		<div className="flex size-14 items-center justify-center rounded-full bg-brand/15">
			<Check className="size-7 text-brand" strokeWidth={2.5} aria-hidden />
		</div>
	);
}

export default BloomFlow;
