import { cn } from "@/lib/utils";

/** Standard page heading for dashboard routes. */
export function PageHeader({
	title,
	description,
	children,
	align = "start",
	className,
}: {
	title: string;
	description?: string;
	children?: React.ReactNode;
	/** "center" matches the Visitors-style centered page title + subtitle. */
	align?: "start" | "center";
	className?: string;
}) {
	if (align === "center") {
		return (
			<div
				data-slot="page-header"
				className={cn("flex flex-col items-center gap-4 text-center", className)}
			>
				<div className="space-y-1.5">
					<h1 className="text-2xl font-medium tracking-tight sm:text-3xl">{title}</h1>
					{description && <p className="text-[15px] text-muted-foreground">{description}</p>}
				</div>
				{children && (
					<div className="flex flex-wrap items-center justify-center gap-2">{children}</div>
				)}
			</div>
		);
	}

	return (
		<div
			data-slot="page-header"
			className={cn(
				"flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				className
			)}
		>
			<div className="space-y-1">
				<h1 className="text-xl font-medium tracking-tight">{title}</h1>
				{description && <p className="text-sm text-muted-foreground">{description}</p>}
			</div>
			{children && <div className="flex items-center gap-2">{children}</div>}
		</div>
	);
}
