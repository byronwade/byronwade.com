import { Suspense } from "react";
import { unstable_cache } from "@/lib/unstable-cache";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import CodedText from "@/components/ui/coded-text";
import dynamic from "next/dynamic";

// Dynamic imports for client components
const Overview = dynamic(() => import("@/components/analysis/overview"));
const Client = dynamic(() => import("@/components/analysis/client"));
const Performance = dynamic(() => import("@/components/analysis/performance"));
const SEO = dynamic(() => import("@/components/analysis/seo"));
const Market = dynamic(() => import("@/components/analysis/market"));
const Design = dynamic(() => import("@/components/analysis/design"));
const Impact = dynamic(() => import("@/components/analysis/impact"));
const Technical = dynamic(() => import("@/components/analysis/technical"));
const Conclusion = dynamic(() => import("@/components/analysis/conclusion"));
const Investment = dynamic(() => import("@/components/analysis/investment"));

// Create a client-side component for the navigation button
const NavigationButton = dynamic(() => import("@/components/navigation-button"));

// Cache the analytics data
const getAnalyticsData = unstable_cache(
	async () => {
		const stats = [
			{
				label: "Load Time",
				industryValue: 4.2,
				optimizedValue: 1.8,
				improvement: 57,
				iconName: "clock" as const,
			},
			{
				label: "Performance Score",
				industryValue: 65,
				optimizedValue: 95,
				improvement: 46,
				iconName: "zap" as const,
			},
			{
				label: "SEO Score",
				industryValue: 72,
				optimizedValue: 98,
				improvement: 36,
				iconName: "search" as const,
			},
			{
				label: "Layout Shifts",
				industryValue: 0.25,
				optimizedValue: 0.05,
				improvement: 80,
				iconName: "layout" as const,
			},
			{
				label: "Mobile Score",
				industryValue: 60,
				optimizedValue: 94,
				improvement: 57,
				iconName: "smartphone" as const,
			},
		];

		return {
			benchmarks: {
				loadTime: { industry: 4.2, optimized: 1.8 },
				performanceScore: { industry: 65, optimized: 95 },
				seoScore: { industry: 72, optimized: 98 },
				mobileScore: { industry: 60, optimized: 94 },
				bounceRate: { industry: 55, optimized: 25 },
				conversionRate: { industry: 2.1, optimized: 4.5 },
				averageTimeOnPage: { industry: 120, optimized: 280 },
				bestPractices: { industry: 60, optimized: 95 },
				organicTrafficIncrease: 150,
			},
			stats,
			performanceData: [
				{ month: "Jan", industry: 50, optimized: 90 },
				{ month: "Feb", industry: 52, optimized: 91 },
				{ month: "Mar", industry: 51, optimized: 92 },
				{ month: "Apr", industry: 53, optimized: 93 },
				{ month: "May", industry: 52, optimized: 94 },
				{ month: "Jun", industry: 54, optimized: 95 },
			],
			conversionData: [
				{ category: "E-commerce", industry: 2.3, optimized: 3.9 },
				{ category: "Marine", industry: 2.5, optimized: 4.5 },
				{ category: "B2B", industry: 2.7, optimized: 4.8 },
			],
		};
	},
	["analytics-data"],
	{ revalidate: 3600 }
);

// Cache the technical data
const getTechnicalData = unstable_cache(
	async () => {
		return {
			performanceOptimizations: ["Advanced caching strategies implementation", "Image optimization with WebP format and lazy loading", "Code splitting and bundle optimization", "CDN integration for global content delivery"],
			securityEnhancements: ["SSL/TLS implementation with A+ rating", "Advanced firewall protection", "Regular security audits and monitoring", "Automated backup systems"],
		};
	},
	["technical-data"],
	{ revalidate: 3600 }
);

// Cache the client data
const getClientData = unstable_cache(
	async () => {
		return {
			name: "Impact Marine Group",
			industry: "Marine Industry",
			duration: "8 weeks",
			completionDate: "Q4 2023",
			goals: ["Increase conversions", "Reduce bounce rates", "Improve user experience"],
		};
	},
	["client-data"],
	{ revalidate: 3600 }
);

export default async function PerformanceCaseStudy() {
	const queryClient = new QueryClient();

	// Fetch all data in parallel
	const [analyticsData, technicalData, clientData] = await Promise.all([getAnalyticsData(), getTechnicalData(), getClientData()]);

	// Prefetch queries
	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ["analytics"],
			queryFn: () => analyticsData,
		}),
		queryClient.prefetchQuery({
			queryKey: ["technical"],
			queryFn: () => technicalData,
		}),
		queryClient.prefetchQuery({
			queryKey: ["client"],
			queryFn: () => clientData,
		}),
	]);

	const { benchmarks, stats, performanceData, conversionData } = analyticsData;
	const seo = `${calculateImprovement(benchmarks.seoScore.industry, benchmarks.seoScore.optimized)} increase in SEO score`;

	const seoMetrics = {
		keyOptimizations: [{ title: "Strategic optimization of meta titles and descriptions", improvement: "25% CTR" }, { title: "Implementation of semantic HTML structure", improvement: "40% clarity" }, { title: "Enhancement of internal linking architecture" }, { title: "Mobile responsiveness optimization" }, { title: "Implementation of schema markup for rich snippets" }, { title: "URL structure refinement for maximum SEO impact" }],
	};

	// Add these type definitions
	type PerformanceDataPoint = {
		date: string;
		value: number;
		type: string; // Changed from 'category' to 'type' to match expected type
	};

	type ConversionDataPoint = {
		date: string;
		value: number;
		type: string;
	};

	// Update the data transformation
	const transformedPerformanceData: PerformanceDataPoint[] = performanceData
		.map((point) => ({
			date: point.month,
			value: point.optimized,
			type: "Optimized",
		}))
		.concat(
			performanceData.map((point) => ({
				date: point.month,
				value: point.industry,
				type: "Industry",
			}))
		);

	// Add conversion data transformation
	const transformedConversionData: ConversionDataPoint[] = conversionData.flatMap((point) => [
		{
			date: point.category,
			value: point.optimized,
			type: "Optimized",
		},
		{
			date: point.category,
			value: point.industry,
			type: "Industry",
		},
	]);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<div>Loading...</div>}>
				<PageHeader title="Impact Marine Group">
					<Link prefetch={true} href="https://www.figma.com" className="text-[#f24e1e] text-5xl font-bold hover:text-yellow-400">
						<CodedText className="hover:underline">Figma</CodedText>
					</Link>
					<Link prefetch={true} href="https://www.sketch.com" className="text-[#fdad00] text-5xl font-bold hover:text-yellow-400">
						<CodedText className="hover:underline">Sketch</CodedText>
					</Link>
					<Link prefetch={true} href="https://www.adobe.com/products/xd.html" className="text-[#ff61f6] text-5xl font-bold hover:text-yellow-400">
						<CodedText className="hover:underline">Adobe XD</CodedText>
					</Link>
					<Link prefetch={true} href="https://www.invisionapp.com" className="text-[#ff3366] text-5xl font-bold hover:text-yellow-400">
						<CodedText className="hover:underline">InVision</CodedText>
					</Link>
					<Link prefetch={true} href="https://www.framer.com" className="text-[#05f] text-5xl font-bold hover:text-yellow-400">
						<CodedText className="hover:underline">Framer</CodedText>
					</Link>
					<Link prefetch={true} href="https://www.axure.com" className="text-[#008d7d] text-5xl font-bold hover:text-yellow-400">
						<CodedText className="hover:underline">Axure</CodedText>
					</Link>
					<Link prefetch={true} href="https://www.flinto.com" className="text-[#00d6bf] text-5xl font-bold hover:text-yellow-400">
						<CodedText className="hover:underline">Flinto</CodedText>
					</Link>
					<Link prefetch={true} href="https://www.protopie.io" className="text-[#6200ee] text-5xl font-bold hover:text-yellow-400">
						<CodedText className="hover:underline">ProtoPie</CodedText>
					</Link>
				</PageHeader>
				<TooltipProvider>
					<div className="min-h-screen bg-gradient-to-b bg-zinc-50 dark:bg-black">
						<div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-y">
							<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
								<header className="py-4">
									<div className="flex items-center justify-between">
										<div className="flex flex-col">
											<h3 className="text-sm text-muted-foreground">Analysis #346</h3>
											<h1 className="text-2xl font-bold">Impact Marine Group</h1>
										</div>
										<NavigationButton />
										<Button size="lg" className="hidden sm:flex">
											<CodedText>Get Your Analysis</CodedText>
										</Button>
									</div>
								</header>
							</div>
						</div>

						<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
							<div className="lg:grid lg:gap-8">
								<main className="space-y-12 lg:space-y-16">
									<Overview stats={stats} />
									<Client clientData={clientData} />
									<Performance />
									<SEO seo={seo} benchmarks={benchmarks} seoMetrics={seoMetrics} />
									<Design benchmarks={benchmarks} />
									<Market performanceData={transformedPerformanceData} conversionData={transformedConversionData} />
									<Impact benchmarks={benchmarks} />
									<Technical data={technicalData} />
									<Conclusion benchmarks={benchmarks} />
									<Investment mainFeatures={mainFeatures} monthlyServices={monthlyServices} addOns={addOns} />
								</main>
							</div>
						</div>
					</div>
				</TooltipProvider>
			</Suspense>
		</HydrationBoundary>
	);
}

// Helper function
function calculateImprovement(industry: number, optimized: number): string {
	const improvement = ((optimized - industry) / industry) * 100;
	return `${improvement.toFixed(1)}%`;
}

// Constants
const mainFeatures = ["Fully responsive design", "SEO optimization", "Performance optimization", "Security implementation", "Analytics integration", "Content management system", "Contact forms", "Social media integration", "Basic email setup", "30-day support"];
const monthlyServices = [
	{
		feature: "24/7 monitoring",
		included: true,
	},
	{
		feature: "Security updates",
		included: true,
	},
	{
		feature: "Daily backups",
		included: true,
	},
	{
		feature: "CDN service",
		included: true,
	},
	{
		feature: "SSL certificate",
		included: true,
	},
	{
		feature: "Database management",
		included: true,
	},
	{
		feature: "Performance optimization",
		included: true,
	},
	{
		feature: "Content updates (2/month)",
		included: true,
	},
];
const addOns = [
	{
		title: "Landing Pages",
		description: "Custom designed, high-converting landing pages",
		price: "$799",
		features: ["Conversion-optimized design", "A/B testing setup", "Analytics integration", "Lead capture forms", "Mobile optimization"],
	},
	{
		title: "E-commerce Integration",
		description: "Full e-commerce functionality",
		price: "$2,499",
		features: ["Product catalog", "Shopping cart", "Payment gateway", "Inventory management", "Order processing"],
	},
	{
		title: "Custom Features",
		description: "Tailored functionality for your business",
		price: "From $999",
		features: ["Custom database design", "API integration", "Advanced search", "User authentication", "Custom reporting"],
	},
];
