import { cn } from "@/lib/utils";

/** Centered-focal / tool archetype: a large centerpiece with one floating card. */
export function CenteredFocal({
	backdrop,
	children,
	className,
}: {
	backdrop?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("relative grid min-h-[60vh] place-items-center", className)}>
			{backdrop && (
				<div className="pointer-events-none absolute inset-0 grid place-items-center opacity-60">
					{backdrop}
				</div>
			)}
			<div className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-card">
				{children}
			</div>
		</div>
	);
}
