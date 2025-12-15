import { HomeBlog } from "@/components/home-blog";
import { HomeInteractive } from "@/components/home-interactive";
import { HomeProjects } from "@/components/home-projects";
import { generatePersonStructuredData } from "@/lib/seo";
import Image from "next/image";
import { Suspense } from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com";

// Homepage-specific structured data
const homePageStructuredData = {
	"@context": "https://schema.org",
	"@type": "WebPage",
	"@id": `${baseUrl}/#webpage`,
	name: "Byron Wade - Full Stack Developer & Web Performance Expert",
	description:
		"Expert full-stack developer specializing in high-performance web applications, modern JavaScript frameworks, React, Next.js, and scalable solutions.",
	url: baseUrl,
	isPartOf: {
		"@type": "WebSite",
		"@id": `${baseUrl}/#website`,
		name: "Byron Wade",
		url: baseUrl,
	},
	about: generatePersonStructuredData(),
	mainEntity: generatePersonStructuredData(),
};

export default function HomePage() {
	return (
		<>
			{/* Homepage Structured Data */}
			<script
				type="application/ld+json"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe and necessary for SEO
				dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageStructuredData) }}
			/>
			<div className="relative min-h-screen w-full bg-[var(--background)]">
				{/* Cursor.com retro painted landscape wallpaper */}
				<div className="fixed inset-0 retro-wallpaper pointer-events-none" />
				<div className="fixed inset-0 retro-wallpaper-overlay pointer-events-none" />

				{/* Main content */}
				<div className="relative flex justify-center py-8 px-4 sm:py-12 md:py-16 lg:py-20 safe-top safe-bottom">
					<div className="flex flex-col gap-8 sm:gap-12 md:gap-16 lg:gap-20 items-start w-full max-w-2xl">
						<HomeInteractive />

						{/* Projects Section */}
						<Suspense
							fallback={<div className="animate-pulse w-full h-24 bg-[var(--muted)] rounded" />}
						>
							<HomeProjects />
						</Suspense>

						{/* Subtle section divider */}
						<div className="section-divider my-2" aria-hidden="true" />

						{/* Blog Section */}
						<Suspense
							fallback={<div className="animate-pulse w-full h-24 bg-[var(--muted)] rounded" />}
						>
							<HomeBlog />
						</Suspense>

						{/* Subtle section divider */}
						<div className="section-divider my-2" aria-hidden="true" />

						{/* Footer - enhanced */}
						<div className="animate-in animate-delay-8 w-full">
							<div className="flex flex-col gap-4 items-center justify-center py-8">
								<div className="h-8 relative shrink-0 w-[120px] opacity-80 hover:opacity-100 transition-opacity">
									<Image
										alt="byronwade.com"
										className="object-contain size-full"
										src="/logo.avif"
										width={120}
										height={32}
									/>
								</div>
								<p className="text-xs sm:text-sm text-center text-[var(--muted-foreground)] flex items-center gap-1.5 flex-wrap justify-center">
									<span>Built with</span>{" "}
									<a
										href="https://nextjs.org"
										target="_blank"
										rel="noopener noreferrer"
										className="font-medium text-accent hover:text-accent/90 transition-colors"
									>
										Next.js
									</a>{" "}
									<span>and</span>{" "}
									<a
										href="https://tailwindcss.com"
										target="_blank"
										rel="noopener noreferrer"
										className="font-medium text-accent hover:text-accent/90 transition-colors"
									>
										Tailwind CSS
									</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
