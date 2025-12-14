import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
	name: string;
	url: string;
}

interface BreadcrumbNavProps {
	items: BreadcrumbItem[];
	className?: string;
}

/**
 * Breadcrumb Navigation Component
 * Visual breadcrumb navigation with proper ARIA labels
 */
export function BreadcrumbNav({ items, className = "" }: BreadcrumbNavProps) {
	return (
		<nav aria-label="Breadcrumb" className={className}>
			<ol className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--muted-foreground)]">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;
					return (
						<li key={item.url} className="flex items-center gap-1.5">
							{index === 0 ? (
								<Link
									href={item.url}
									className="hover:text-[var(--foreground)] transition-colors focus-ring rounded"
									aria-label="Home"
								>
									<Home className="size-4" />
									<span className="sr-only">{item.name}</span>
								</Link>
							) : (
								<>
									<ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
									{isLast ? (
										<span className="text-[var(--foreground)] font-medium" aria-current="page">
											{item.name}
										</span>
									) : (
										<Link
											href={item.url}
											className="hover:text-[var(--foreground)] transition-colors focus-ring rounded"
										>
											{item.name}
										</Link>
									)}
								</>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
