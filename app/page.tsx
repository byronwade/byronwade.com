import dynamic from "next/dynamic";
import { Suspense, memo } from "react";
import { Metadata } from "next";

// Dynamically import and memoize the Hero component
const Hero = memo(dynamic(() => import("@/components/sections/hero")));

export const metadata: Metadata = {
	title: "Byron Wade - Full Stack Developer & Web Performance Expert",
	description: "Expert full-stack developer delivering high-performance web applications, modern JavaScript solutions, and scalable architectures. Transform your digital presence with cutting-edge development.",
	openGraph: {
		title: "Byron Wade - Full Stack Developer & Web Performance Expert",
		description: "Expert full-stack developer delivering high-performance web applications, modern JavaScript solutions, and scalable architectures.",
		images: [
			{
				url: new URL("/api/og?title=Byron Wade&description=Full Stack Developer %26 Web Performance Expert&type=website", process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com").toString(),
				width: 1200,
				height: 630,
				alt: "Byron Wade - Full Stack Development Services",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Byron Wade - Full Stack Developer & Web Performance Expert",
		description: "Expert full-stack developer delivering high-performance web applications, modern JavaScript solutions, and scalable architectures.",
		images: [new URL("/api/og?title=Byron Wade&description=Full Stack Developer %26 Web Performance Expert&type=website", process.env.NEXT_PUBLIC_BASE_URL || "https://byronwade.com").toString()],
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "WebPage",
	name: "Byron Wade - Full Stack Developer",
	description: "Expert full-stack developer delivering high-performance web applications, modern JavaScript solutions, and scalable architectures.",
	url: "https://byronwade.com",
	mainEntity: {
		"@type": "ProfessionalService",
		name: "Byron Wade Development Services",
		description: "Professional web development services specializing in high-performance applications and modern frameworks.",
		offers: {
			"@type": "Offer",
			serviceType: ["Web Development", "Full Stack Development", "Performance Optimization"],
		},
	},
};

const Home = () => {
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<Suspense fallback={<div>Loading...</div>}>
				<Hero />
			</Suspense>
		</>
	);
};

export default memo(Home);
