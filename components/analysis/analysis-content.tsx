"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AnalysisItem from "@/components/analysis-item";

// Create a new QueryClient instance
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000, // 1 minute
			cacheTime: 5 * 60 * 1000, // 5 minutes
		},
	},
});

const analyses = [
	{
		id: 341,
		title: "Santa Cruz Surf School",
		description: "We redesigned and optimized the website for this local surf school, significantly improving user experience and search engine visibility. The new design focuses on fast load times and mobile responsiveness, resulting in increased engagement and bookings.",
		performanceIncrease: "70%",
		seoImprovement: "Page 1",
		mobileScore: "95/100",
		imageUrl: "/placeholder.svg?height=800&width=1200",
		tags: ["Next.js", "Tailwind CSS", "Vercel"],
	},
	{
		id: 342,
		title: "Coastal Cafe Redesign",
		description: "We revamped the website for this popular beachside cafe, with a strong emphasis on mobile responsiveness and seamless online ordering capabilities. The new site significantly improved customer engagement and order volume, leading to a substantial increase in revenue.",
		performanceIncrease: "85%",
		seoImprovement: "50%",
		mobileScore: "98/100",
		imageUrl: "/placeholder.svg?height=800&width=1200",
		tags: ["React", "Styled Components", "Netlify"],
	},
	{
		id: 343,
		title: "Santa Cruz Boardwalk App",
		description: "We developed a cutting-edge progressive web app for the Santa Cruz Boardwalk, enhancing visitor experience with interactive maps, real-time ride wait times, and personalized recommendations. This resulted in increased app usage and improved visitor satisfaction.",
		performanceIncrease: "60%",
		seoImprovement: "40%",
		mobileScore: "97/100",
		imageUrl: "/placeholder.svg?height=800&width=1200",
		tags: ["Vue.js", "PWA", "Firebase"],
	},
];

function AnalysesContent() {
	return (
		<div className="bg-zinc-50 dark:bg-black min-h-screen">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<h1 className="text-4xl font-extrabold text-black dark:text-white mb-2 text-center">High-Performance Web Projects</h1>
				<p className="text-xl text-gray-600 dark:text-gray-400 mb-16 text-center">Showcasing significant improvements in speed, SEO, and user experience</p>
			</div>

			{analyses.map((analysis) => (
				<AnalysisItem key={analysis.id} {...analysis} />
			))}
		</div>
	);
}

export default function AnalysisContent() {
	return (
		<QueryClientProvider client={queryClient}>
			<AnalysesContent />
		</QueryClientProvider>
	);
}
