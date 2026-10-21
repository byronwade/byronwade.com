import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Sheet } from "@/components/layout/sheet";
import { measureClass, SiteShell } from "@/components/layout/site-shell";
import { FigmaInteractiveViewer } from "@/components/portfolio/figma-viewer";
import { Link } from "@/components/ui/link";
import { ArrowLeft, ArrowUpRight } from "@/lib/icons";
import { safeFormatDate } from "@/lib/markdown-utils";
import { getFigmaFile, isFigmaFileKey } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

interface FigmaDetailPageProps {
	params: Promise<{ key: string }>;
}

/** Components shown inline; the rest are counted, not hidden. */
const COMPONENT_PREVIEW = 6;

export async function generateMetadata({ params }: FigmaDetailPageProps): Promise<Metadata> {
	const { key } = await params;
	const file = await getFigmaFile(key)();

	if (!file) {
		return {
			title: "Design file unavailable",
			description: "This Figma file could not be loaded.",
			robots: { index: false },
		};
	}

	return {
		title: `${file.name} - Figma Design`,
		description: `View the ${file.name} design file from Figma.`,
		openGraph: {
			title: `${file.name} - Figma Design`,
			description: `View the ${file.name} design file from Figma.`,
			type: "website",
			url: `https://byronwade.com/portfolio/figma/${key}`,
			images: file.thumbnailUrl
				? [{ url: file.thumbnailUrl, width: 800, height: 600, alt: file.name }]
				: undefined,
		},
		twitter: {
			card: "summary_large_image",
			title: `${file.name} - Figma Design`,
			description: `View the ${file.name} design file from Figma.`,
			images: file.thumbnailUrl ? [file.thumbnailUrl] : undefined,
		},
	};
}

/**
 * The page's own trail, for widths where the site's floating breadcrumb is
 * hidden. At xl that trail is visible, so this one steps aside: one trail per
 * viewport, never two.
 */
function DesignFileBreadcrumb({ current }: { current: string }) {
	return (
		<nav
			aria-label="Design file breadcrumb"
			className="text-copy-13 text-muted-foreground xl:hidden"
		>
			<ol className="flex flex-wrap items-center gap-x-2">
				<li>
					<Link
						className="inline-flex min-h-11 items-center hover:text-foreground"
						href="/portfolio"
					>
						Portfolio
					</Link>
				</li>
				<li className="flex min-w-0 items-center gap-2">
					<span aria-hidden="true">/</span>
					<span aria-current="page" className="wrap-anywhere text-foreground">
						{current}
					</span>
				</li>
			</ol>
		</nav>
	);
}

function OpenInFigma({ fileKey, children }: { fileKey: string; children: ReactNode }) {
	return (
		<a
			className="link-action"
			href={`https://www.figma.com/file/${fileKey}`}
			rel="noopener noreferrer"
			target="_blank"
		>
			{children}
			<ArrowUpRight aria-hidden="true" className="size-3.5" />
			<span className="sr-only"> (opens in a new tab)</span>
		</a>
	);
}

/**
 * Honest failure. A well-formed key that Figma did not return may be private,
 * removed, or unreachable right now (no token, timeout, outage); the server
 * cannot tell those apart, so the page says so and offers both ways out
 * rather than claiming the file does not exist.
 */
function UnavailableFile({ fileKey }: { fileKey: string }) {
	return (
		<SiteShell profile="evidence">
			<div className="flex flex-col gap-3">
				<DesignFileBreadcrumb current="Design file" />
				<h1 className="text-balance font-medium text-heading-32 tracking-tight">
					Design file unavailable
				</h1>
				<p className="text-body text-copy-16 leading-relaxed">
					Figma didn’t return this file. It may be private or removed, or Figma may be unreachable
					right now. The file itself is unchanged; try it on Figma, or browse the rest of the work.
				</p>
				<p className="flex flex-wrap items-center gap-x-6">
					<OpenInFigma fileKey={fileKey}>Try it on Figma</OpenInFigma>
					<Link className="link-action" href="/portfolio">
						Back to portfolio
					</Link>
				</p>
			</div>
		</SiteShell>
	);
}

/**
 * Figma file detail, Evidence profile (DESIGN.md §3.2).
 *
 * The file is the dominant object, so it gets the wide measure on a sheet with
 * a caption, and the identity and counts sit above it as plain type. The old
 * page wrapped every number and every section in hover-lifting cards with
 * icon tiles, and drew placeholder thumbnails for components it had no images
 * for; the counts are now a definition list and components are named, not
 * illustrated.
 */
export default async function FigmaDetailPage({ params }: FigmaDetailPageProps) {
	const { key } = await params;
	if (!isFigmaFileKey(key)) {
		notFound();
	}
	const file = await getFigmaFile(key)();
	if (!file) {
		return <UnavailableFile fileKey={key} />;
	}

	const componentsCount = file.components.length;
	const facts = [
		{ label: "Pages", value: file.pageCount },
		{ label: "Components", value: componentsCount },
		{ label: "Styles", value: file.styleCount },
	];
	// Figma timestamps are instants; numeric input avoids authored calendar-date normalization.
	const modifiedDate = safeFormatDate(Date.parse(file.lastModified));

	return (
		// Only the file spans the wide shell; its identity and details keep the
		// header's 42rem measure so the page shares one edge with the chrome.
		<SiteShell profile="evidence" width="wide">
			<header className={cn(measureClass, "flex flex-col gap-3")}>
				<DesignFileBreadcrumb current={file.name} />
				<h1 className="wrap-anywhere text-balance font-medium text-heading-32 tracking-tight">
					{file.name}
				</h1>
				<p className="text-body text-copy-16 leading-relaxed">
					A Figma file, last updated <time dateTime={file.lastModified}>{modifiedDate}</time>.
				</p>
				<dl className="flex flex-wrap gap-x-10 gap-y-3 pt-3">
					{facts.map(({ label, value }) => (
						<div className="flex flex-col gap-0.5" key={label}>
							<dt className="text-copy-12 text-muted-foreground">{label}</dt>
							<dd className="order-first font-medium text-heading-20 tabular-nums">{value}</dd>
						</div>
					))}
				</dl>
				<p>
					<OpenInFigma fileKey={key}>Open in Figma</OpenInFigma>
				</p>
			</header>

			<section aria-labelledby="design-file" className="flex flex-col gap-4">
				<h2
					className={cn(measureClass, "font-medium text-heading-20 tracking-tight")}
					id="design-file"
				>
					Design file
				</h2>
				<Sheet caption="Served by Figma. Large files can take a few seconds to draw.">
					<FigmaInteractiveViewer fileKey={key} fileName={file.name} imageUrl={file.thumbnailUrl} />
				</Sheet>
			</section>

			{componentsCount > 0 && (
				<section aria-labelledby="components" className={cn(measureClass, "flex flex-col gap-4")}>
					<h2 className="font-medium text-heading-20 tracking-tight" id="components">
						Components <span className="text-muted-foreground tabular-nums">{componentsCount}</span>
					</h2>
					<ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
						{file.components.slice(0, COMPONENT_PREVIEW).map((component) => (
							<li className="flex min-w-0 flex-col gap-0.5" key={component.id}>
								<h3 className="wrap-anywhere font-medium text-copy-14 text-foreground">
									{component.name || "Unnamed component"}
								</h3>
								<p className="text-copy-13 text-muted-foreground">
									{component.description || "No description in Figma."}
								</p>
							</li>
						))}
					</ul>
					{componentsCount > COMPONENT_PREVIEW && (
						<p className="text-copy-13 text-muted-foreground">
							{componentsCount - COMPONENT_PREVIEW} more in the file.
						</p>
					)}
				</section>
			)}

			<section
				aria-labelledby="file-information"
				className={cn(measureClass, "flex flex-col gap-4")}
			>
				<h2 className="font-medium text-heading-20 tracking-tight" id="file-information">
					File information
				</h2>
				<dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-copy-14">
					<dt className="text-muted-foreground">Last modified</dt>
					<dd className="text-foreground">
						<time dateTime={file.lastModified}>{modifiedDate}</time>
					</dd>
					{file.version && (
						<>
							<dt className="text-muted-foreground">Version</dt>
							<dd className="wrap-anywhere font-mono text-foreground tabular-nums">
								{file.version}
							</dd>
						</>
					)}
				</dl>
			</section>

			{/* The same foot as a case study: the way back to the collection. */}
			<p className={measureClass}>
				<Link className="link-action" href="/portfolio">
					<ArrowLeft aria-hidden="true" className="size-4" />
					Back to portfolio
				</Link>
			</p>
		</SiteShell>
	);
}
