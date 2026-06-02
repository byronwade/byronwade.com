import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface BreadcrumbNavProps {
	items: BreadcrumbItem[];
	className?: string;
}

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
	return (
		<nav
			aria-label="Breadcrumb"
			className={cn("flex flex-wrap items-center gap-1 text-sm text-muted-foreground", className)}
		>
			<Link
				href="/"
				className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
			>
				<Home className="h-3.5 w-3.5" aria-hidden="true" />
				<span className="sr-only">Home</span>
			</Link>
			{items.map((item) => (
				<span
					key={`${item.label}-${item.href ?? "current"}`}
					className="inline-flex items-center gap-1"
				>
					<ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden="true" />
					{item.href ? (
						<Link href={item.href} className="hover:text-foreground transition-colors">
							{item.label}
						</Link>
					) : (
						<span className="text-foreground font-medium">{item.label}</span>
					)}
				</span>
			))}
		</nav>
	);
}
