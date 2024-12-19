"use client";

import { QueryClient, QueryClientProvider, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Link } from "@/components/ui/link";
import PageHeader from "@/components/page-header";
import CodedText from "@/components/ui/coded-text";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { investmentData } from "@/lib/investment-data";

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
const Investment = dynamic(() => import("@/components/analysis/investment"), {
	ssr: false,
	loading: () => <div>Loading investment details...</div>,
});

// Create a client-side component for the navigation button
const NavigationButton = dynamic(() => import("@/components/navigation-button"));

// Create a new QueryClient instance
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 60 * 1000, // 1 minute
			cacheTime: 5 * 60 * 1000, // 5 minutes
		},
	},
});

async function getAnalyticsData() {
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

	const data = {
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
	return data;
}

async function getTechnicalData() {
	const data = {
		performanceOptimizations: ["Advanced caching strategies implementation", "Image optimization with WebP format and lazy loading", "Code splitting and bundle optimization", "CDN integration for global content delivery"],
		securityEnhancements: ["SSL/TLS implementation with A+ rating", "Advanced firewall protection", "Regular security audits and monitoring", "Automated backup systems"],
	};
	return data;
}

async function getClientData() {
	const data = {
		name: "Impact Marine Group",
		industry: "Marine Industry",
		duration: "8 weeks",
		completionDate: "Q4 2023",
		goals: ["Increase conversions", "Reduce bounce rates", "Improve user experience"],
	};
	return data;
}

function AnalysisDetailContent() {
	const [data, setData] = useState<{
		analyticsData: Awaited<ReturnType<typeof getAnalyticsData>>;
		technicalData: Awaited<ReturnType<typeof getTechnicalData>>;
		clientData: Awaited<ReturnType<typeof getClientData>>;
	} | null>(null);

	useEffect(() => {
		async function fetchData() {
			const [analyticsData, technicalData, clientData] = await Promise.all([getAnalyticsData(), getTechnicalData(), getClientData()]);

			await queryClient.prefetchQuery({
				queryKey: ["analytics"],
				queryFn: () => analyticsData,
			});
			await queryClient.prefetchQuery({
				queryKey: ["technical"],
				queryFn: () => technicalData,
			});
			await queryClient.prefetchQuery({
				queryKey: ["client"],
				queryFn: () => clientData,
			});

			setData({ analyticsData, technicalData, clientData });
		}

		fetchData();
	}, []);

	if (!data) return <div>Loading...</div>;

	const { analyticsData, technicalData, clientData } = data;
	const { benchmarks, stats, performanceData, conversionData } = analyticsData;
	const seo = `${calculateImprovement(benchmarks.seoScore.industry, benchmarks.seoScore.optimized)} increase in SEO score`;

	const seoMetrics = {
		keyOptimizations: [{ title: "Strategic optimization of meta titles and descriptions", improvement: "25% CTR" }, { title: "Implementation of semantic HTML structure", improvement: "40% clarity" }, { title: "Enhancement of internal linking architecture" }, { title: "Mobile responsiveness optimization" }, { title: "Implementation of schema markup for rich snippets" }, { title: "URL structure refinement for maximum SEO impact" }],
	};

	type PerformanceDataPoint = {
		date: string;
		value: number;
		category: string;
	};

	type ConversionDataPoint = {
		date: string;
		value: number;
		type: string;
	};

	const transformedPerformanceData: PerformanceDataPoint[] = performanceData
		.map((point) => ({
			date: point.month,
			value: point.optimized,
			category: "Optimized",
		}))
		.concat(
			performanceData.map((point) => ({
				date: point.month,
				value: point.industry,
				category: "Industry",
			}))
		);

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
		<QueryClientProvider client={queryClient}>
			<HydrationBoundary state={dehydrate(queryClient)}>
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
									<Investment />
								</main>
							</div>
						</div>
					</div>
				</TooltipProvider>
			</HydrationBoundary>
		</QueryClientProvider>
	);
}

// Helper function
function calculateImprovement(industry: number, optimized: number): string {
	const improvement = ((optimized - industry) / industry) * 100;
	return `${improvement.toFixed(1)}%`;
}

export default AnalysisDetailContent;
