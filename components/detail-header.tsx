import { cn } from "@/lib/utils";

/**
 * Resource detail header (Resend "Domain" page style): a title row plus a
 * metadata strip of label-over-value columns.
 */
export function DetailHeader({
	title,
	badge,
	actions,
	meta,
	className,
}: {
	title: React.ReactNode;
	badge?: React.ReactNode;
	actions?: React.ReactNode;
	meta?: { label: string; value: React.ReactNode }[];
	className?: string;
}) {
	return (
		<div data-slot="detail-header" className={cn("space-y-6", className)}>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-center gap-3">
					<h1 className="font-mono text-xl font-medium tracking-tight">{title}</h1>
					{badge}
				</div>
				{actions && <div className="flex items-center gap-2">{actions}</div>}
			</div>
			{meta && meta.length > 0 && <MetaGrid items={meta} />}
		</div>
	);
}

export function MetaGrid({
	items,
	className,
}: {
	items: { label: string; value: React.ReactNode }[];
	className?: string;
}) {
	return (
		<div
			className={cn("grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-3 lg:grid-cols-4", className)}
		>
			{items.map((it, i) => (
				<div key={i} className="space-y-1">
					<div className="text-xs font-medium text-muted-foreground">{it.label}</div>
					<div className="text-sm">{it.value}</div>
				</div>
			))}
		</div>
	);
}
