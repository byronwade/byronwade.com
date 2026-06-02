import { cn } from "@/lib/utils";

/**
 * A titled content block (Resend-style): a small section heading + helper text
 * on the left margin, with a bordered card body. Use for settings/config areas.
 */
export function Section({
	title,
	description,
	action,
	children,
	className,
}: {
	title?: string;
	description?: string;
	action?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}) {
	const hasHeader = Boolean(title || description || action);

	return (
		<section className={cn("space-y-4", className)}>
			{hasHeader && (
				<div className="flex items-end justify-between gap-4">
					<div className="space-y-1">
						{title && <h2 className="text-sm font-semibold tracking-tight">{title}</h2>}
						{description && <p className="text-sm text-muted-foreground">{description}</p>}
					</div>
					{action && <div className="shrink-0">{action}</div>}
				</div>
			)}
			<div className="rounded-2xl border border-border bg-card shadow-card">{children}</div>
		</section>
	);
}

/** A vertically divided list of SettingRows inside a Section's card body. */
export function SettingsList({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <div className={cn("divide-y", className)}>{children}</div>;
}

/**
 * One setting: label + explanatory copy on the left, a control on the right.
 * This is the core Resend "explain everything" pattern.
 */
export function SettingRow({
	title,
	description,
	control,
	children,
	className,
}: {
	title: string;
	description?: React.ReactNode;
	control?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-start sm:justify-between",
				className
			)}
		>
			<div className="space-y-1.5 sm:max-w-xl">
				<div className="text-sm font-medium">{title}</div>
				{description && (
					<p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
				)}
				{children}
			</div>
			{control && <div className="shrink-0 sm:pt-0.5">{control}</div>}
		</div>
	);
}
