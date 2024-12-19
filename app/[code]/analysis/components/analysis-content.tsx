"use client";

import { Suspense } from "react";
import { QueryClient, HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
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
const NavigationButton = dynamic(() => import("@/components/navigation-button"));

interface AnalysisContentProps {
	analyticsData: any;
	technicalData: any;
	clientData: any;
	investmentData: any;
	seo: string;
	seoMetrics: any;
	transformedPerformanceData: any[];
	transformedConversionData: any[];
}

export default function AnalysisContent({ analyticsData, technicalData, clientData, investmentData, seo, seoMetrics, transformedPerformanceData, transformedConversionData }: AnalysisContentProps) {
	const queryClient = new QueryClient();

	// Prefetch queries
	queryClient.prefetchQuery({
		queryKey: ["analytics"],
		queryFn: () => analyticsData,
	});
	queryClient.prefetchQuery({
		queryKey: ["technical"],
		queryFn: () => technicalData,
	});
	queryClient.prefetchQuery({
		queryKey: ["client"],
		queryFn: () => clientData,
	});
	queryClient.prefetchQuery({
		queryKey: ["investment"],
		queryFn: () => investmentData,
	});

	const { benchmarks, stats } = analyticsData;

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Suspense fallback={<div>Loading...</div>}>
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
									<Investment data={investmentData} />
									<Conclusion benchmarks={benchmarks} />
								</main>
							</div>
						</div>
					</div>
				</TooltipProvider>
			</Suspense>
		</HydrationBoundary>
	);
}
