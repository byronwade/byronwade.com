import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeroVariant = "page" | "index" | "article";

interface PageHeroProps {
	eyebrow?: string;
	title: string;
	description?: string;
	actions?: ReactNode;
	variant?: PageHeroVariant;
	className?: string;
	children?: ReactNode;
}

const variantClass: Record<PageHeroVariant, string> = {
	page: "hero-page",
	index: "hero-index-service",
	article: "hero-article",
};

/**
 * Interior page hero — clean first viewport for non-home routes.
 * One eyebrow, one headline, one lead. No card chrome.
 */
export function PageHero({
	eyebrow,
	title,
	description,
	actions,
	variant = "page",
	className,
	children,
}: PageHeroProps) {
	return (
		<section className={cn(variantClass[variant], "section-y-tight", className)}>
			<div className="container-shell">
				<div className="section-head max-w-3xl">
					{eyebrow ? <p className="spec-label">{eyebrow}</p> : null}
					<h1 className="type-headline text-foreground">{title}</h1>
					{description ? <p className="type-lead measure">{description}</p> : null}
					{actions ? <div className="mt-6 flex flex-wrap items-center gap-3">{actions}</div> : null}
					{children}
				</div>
			</div>
		</section>
	);
}
