import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FigmaInteractiveViewer } from "@/components/portfolio/figma-viewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import {
	Calendar,
	ChevronRight,
	ExternalLink,
	FileText,
	GitBranch,
	Layers,
	Palette,
	Zap,
} from "@/lib/icons";
import { safeFormatDate } from "@/lib/markdown-utils";
import { getFigmaFile } from "@/lib/portfolio-data";

interface FigmaDetailPageProps {
	params: Promise<{ key: string }>;
}

export async function generateMetadata({ params }: FigmaDetailPageProps): Promise<Metadata> {
	const { key } = await params;
	const file = await getFigmaFile(key)();

	if (!file) {
		return {
			title: "Design File Not Found",
			description: "The requested Figma file could not be found.",
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

export default async function FigmaDetailPage({ params }: FigmaDetailPageProps) {
	const { key } = await params;
	const file = await getFigmaFile(key)();

	if (!file) {
		notFound();
	}

	const fileData = file;

	// Counted from the validated file response (no expensive API calls)
	const componentsCount = fileData.components.length;
	const metrics = [
		{ label: "Pages", value: fileData.pageCount, icon: FileText },
		{ label: "Components", value: componentsCount, icon: Palette },
		{ label: "Styles", value: fileData.styleCount, icon: Zap },
	];
	// Figma timestamps are instants; numeric input avoids authored calendar-date normalization.
	const modifiedDate = safeFormatDate(Date.parse(fileData.lastModified));

	return (
		<div className="min-h-screen py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<nav aria-label="Breadcrumb" className="mb-4 text-muted-foreground text-sm">
						<ol className="flex flex-wrap items-center gap-x-2">
							<li>
								<Link
									href="/portfolio"
									className="inline-flex min-h-11 min-w-11 items-center px-1 transition-colors hover:text-brand focus-visible:text-brand"
								>
									Portfolio
								</Link>
							</li>
							<li className="flex min-w-0 items-center gap-2">
								<ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" />
								<span aria-current="page" className="wrap-anywhere text-foreground">
									{fileData.name}
								</span>
							</li>
						</ol>
					</nav>

					<div className="mb-6">
						<h1 className="wrap-anywhere mb-4 font-bold text-4xl text-foreground">
							{fileData.name}
						</h1>
						<div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
							<div className="flex items-center gap-1">
								<Calendar className="h-4 w-4 text-brand" />
								<span>
									Updated <time dateTime={fileData.lastModified}>{modifiedDate}</time>
								</span>
							</div>
						</div>
					</div>

					{/* Counts from the validated Figma response. */}
					<div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
						{metrics.map(({ label, value, icon: Icon }) => (
							<Card
								key={label}
								className="border-border/30 bg-secondary/50 transition-[box-shadow,border-color] duration-150 hover:border-brand/30 hover:shadow-xl"
							>
								<CardContent className="flex flex-wrap items-center gap-4 p-6">
									<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand/10">
										<Icon className="h-6 w-6 text-brand" />
									</div>
									<div className="wrap-anywhere min-w-0 max-w-full">
										<p className="font-bold text-2xl text-foreground">{value}</p>
										<p className="text-muted-foreground text-sm">{label}</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Main Content */}
					<div className="space-y-8 lg:col-span-2">
						{/* Interactive Figma Viewer */}
						<div className="space-y-4">
							<h2 className="font-semibold text-foreground text-xl">Design File</h2>
							<FigmaInteractiveViewer
								fileKey={key}
								fileName={fileData.name}
								imageUrl={fileData.thumbnailUrl}
							/>
						</div>

						{/* Components Library */}
						{componentsCount > 0 && (
							<Card className="border-border/30 bg-secondary/50 transition-[box-shadow,border-color] duration-150 hover:border-brand/30 hover:shadow-xl">
								<CardHeader>
									<CardTitle className="text-foreground">
										<h2 className="flex items-center gap-2">
											<Palette className="h-5 w-5 text-brand" />
											Components ({componentsCount})
										</h2>
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
										{fileData.components.slice(0, 6).map((component) => (
											<Card
												key={component.id}
												className="border-border/30 bg-background/80 transition-shadow duration-150 hover:shadow-lg"
											>
												<CardContent className="p-4">
													<div className="mb-3 flex items-center gap-3">
														<div className="flex h-10 w-10 items-center justify-center rounded border border-brand/30 bg-brand/10 font-medium text-brand text-xs">
															{component.name?.charAt(0)?.toUpperCase() || "C"}
														</div>
														<div className="min-w-0 flex-1">
															<h3 className="truncate font-medium text-foreground">
																{component.name || "Unnamed Component"}
															</h3>
															<p className="text-muted-foreground text-xs">
																{component.description || "No description"}
															</p>
														</div>
													</div>
													<div className="flex aspect-[4/3] items-center justify-center rounded bg-secondary">
														<Layers className="h-8 w-8 text-muted-foreground" />
													</div>
												</CardContent>
											</Card>
										))}
									</div>
									{componentsCount > 6 && (
										<div className="mt-4 text-center">
											<p className="text-muted-foreground text-sm">
												And {componentsCount - 6} more components...
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						)}

						{/* Action Buttons */}
						<div className="flex flex-wrap gap-3">
							<Button
								render={
									<a
										href={`https://www.figma.com/file/${key}`}
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Open in Figma"
									/>
								}
								size="lg"
							>
								<ExternalLink className="mr-2 h-4 w-4" />
								Open in Figma
							</Button>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* File Information */}
						<Card className="border-border/30 bg-secondary/50 transition-[box-shadow,border-color] duration-150 hover:border-brand/30 hover:shadow-xl">
							<CardHeader>
								<CardTitle className="text-foreground">
									<h2>File Information</h2>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-2 text-muted-foreground">
									<Calendar className="h-4 w-4 text-brand" />
									<span className="text-sm">Last Modified</span>
								</div>
								<p className="font-medium text-foreground">
									<time dateTime={fileData.lastModified}>{modifiedDate}</time>
								</p>

								{fileData.version && (
									<div>
										<div className="mb-1 flex items-center gap-2 text-muted-foreground">
											<GitBranch className="h-4 w-4 text-brand" />
											<span className="text-sm">Version</span>
										</div>
										<p className="font-medium text-foreground">{fileData.version}</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
