"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	aboutNavLinks,
	midNavLinks,
	type NavLink,
	workMegaHighlights,
	workNavLinks,
} from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

function MobileNavLink({
	href,
	label,
	description,
	compact = false,
	onNavigate,
}: NavLink & { compact?: boolean; onNavigate: () => void }) {
	const router = useRouter();
	const external = href.startsWith("http");

	return (
		<Link
			className={cn(
				"block rounded-xl px-3 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
				compact ? "py-2" : "py-2.5"
			)}
			href={href}
			prefetch={!external}
			{...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
			onClick={(event) => {
				if (external) {
					onNavigate();
					return;
				}
				event.preventDefault();
				onNavigate();
				router.push(href);
			}}
		>
			<span
				className={cn(
					"block font-bold tracking-[-0.02em] text-foreground",
					compact ? "text-[0.9375rem]" : "text-base"
				)}
			>
				{label}
			</span>
			{description && !compact ? (
				<span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
					{description}
				</span>
			) : null}
		</Link>
	);
}

function MobileNavSection({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div>
			<p className="spec-label mb-2 px-3">{label}</p>
			<div className="flex flex-col">{children}</div>
		</div>
	);
}

export function SiteHeaderMobileMenu({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const close = () => onOpenChange(false);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-[min(100%,22rem)] gap-0 bg-card p-0 sm:max-w-sm"
				showCloseButton
			>
				<SheetHeader className="border-b border-border px-4 py-4 text-left">
					<div className="flex items-center gap-3">
						<span className="relative size-10 overflow-hidden rounded-xl">
							<Image
								alt=""
								src="/avatar.avif"
								width={40}
								height={40}
								className="size-full object-cover"
							/>
						</span>
						<div>
							<SheetTitle className="font-display text-base font-extrabold tracking-[-0.03em]">
								{siteConfig.name}
							</SheetTitle>
							<SheetDescription className="text-xs text-muted-foreground">
								{siteConfig.tagline}
							</SheetDescription>
						</div>
					</div>
				</SheetHeader>

				<div className="flex-1 space-y-6 overflow-y-auto px-2 py-5">
					<MobileNavSection label="Main">
						{midNavLinks.map((item) => (
							<MobileNavLink key={item.href} {...item} onNavigate={close} />
						))}
					</MobileNavSection>

					<MobileNavSection label="Featured">
						{workMegaHighlights.map((item) => (
							<MobileNavLink
								key={item.href}
								href={item.href}
								label={item.label}
								description={item.description}
								compact
								onNavigate={close}
							/>
						))}
					</MobileNavSection>

					<MobileNavSection label="Work">
						{workNavLinks.map((item) => (
							<MobileNavLink key={item.href} {...item} compact onNavigate={close} />
						))}
					</MobileNavSection>

					<MobileNavSection label="More">
						{aboutNavLinks.map((item) => (
							<MobileNavLink key={item.href} {...item} compact onNavigate={close} />
						))}
					</MobileNavSection>
				</div>

				<SheetFooter className="border-t border-border bg-card">
					<Link
						href="/contact"
						prefetch
						className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full")}
						onClick={close}
					>
						Get in touch
						<ArrowRight aria-hidden="true" />
					</Link>
					<a
						href={siteConfig.social.github}
						target="_blank"
						rel="noopener noreferrer"
						className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
						onClick={close}
					>
						GitHub
					</a>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
