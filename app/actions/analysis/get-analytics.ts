import { Clock, Zap, Search, LayoutGrid, Smartphone } from "lucide-react";
import { Benchmarks, Stat } from "@/types/analysis";
import { unstable_cache } from "@/lib/unstable-cache";

interface AnalyticsData {
	loadTime: { industry: number; optimized: number };
	performanceScore: { industry: number; optimized: number };
	seoScore: { industry: number; optimized: number };
	bestPractices: { industry: number; optimized: number };
	mobileScore: { industry: number; optimized: number };
	bounceRate: { industry: number; optimized: number };
	averageTimeOnPage: { industry: number; optimized: number };
	organicTrafficIncrease: number;
	conversionRate: { industry: number; optimized: number };
}

export const getAnalytics = () =>
	unstable_cache(
		async (): Promise<AnalyticsData> => {
			return {
				loadTime: { industry: 3.2, optimized: 1.8 },
				performanceScore: { industry: 75, optimized: 95 },
				seoScore: { industry: 72, optimized: 98 },
				bestPractices: { industry: 85, optimized: 100 },
				mobileScore: { industry: 68, optimized: 95 },
				bounceRate: { industry: 55, optimized: 25 },
				averageTimeOnPage: { industry: 2.1, optimized: 4.5 },
				organicTrafficIncrease: 285,
				conversionRate: { industry: 2.35, optimized: 4.8 },
			};
		},
		["analytics"],
		{ revalidate: 86400 } // 24 hours
	);

export const getBenchmarks = async (): Promise<Benchmarks> => {
	const analytics = await getAnalytics()();
	return {
		loadTime: analytics.loadTime,
		performanceScore: analytics.performanceScore,
		seoScore: analytics.seoScore,
		bestPractices: analytics.bestPractices,
		mobileScore: analytics.mobileScore,
		bounceRate: analytics.bounceRate,
		averageTimeOnPage: analytics.averageTimeOnPage,
		organicTrafficIncrease: analytics.organicTrafficIncrease,
		conversionRate: analytics.conversionRate,
	};
};

export const calculateImprovement = (oldValue: number, newValue: number) => {
	const improvement = ((newValue - oldValue) / oldValue) * 100;
	return improvement.toFixed(1) + "%";
};

export const getStats = () =>
	unstable_cache(
		async (): Promise<Stat[]> => {
			const benchmarks = await getBenchmarks();
			return [
				{
					icon: Clock,
					industryValue: benchmarks.loadTime.industry,
					optimizedValue: benchmarks.loadTime.optimized,
					label: "Load Time",
					improvement: calculateImprovement(benchmarks.loadTime.industry, benchmarks.loadTime.optimized),
				},
				{
					icon: Zap,
					industryValue: benchmarks.performanceScore.industry,
					optimizedValue: benchmarks.performanceScore.optimized,
					label: "Performance Score",
					improvement: calculateImprovement(benchmarks.performanceScore.industry, benchmarks.performanceScore.optimized),
				},
				{
					icon: Search,
					industryValue: benchmarks.seoScore.industry,
					optimizedValue: benchmarks.seoScore.optimized,
					label: "SEO Score",
					improvement: calculateImprovement(benchmarks.seoScore.industry, benchmarks.seoScore.optimized),
				},
				{
					icon: LayoutGrid,
					industryValue: benchmarks.bestPractices.industry,
					optimizedValue: benchmarks.bestPractices.optimized,
					label: "Best Practices",
					improvement: calculateImprovement(benchmarks.bestPractices.industry, benchmarks.bestPractices.optimized),
				},
				{
					icon: Smartphone,
					industryValue: benchmarks.mobileScore.industry,
					optimizedValue: benchmarks.mobileScore.optimized,
					label: "Mobile Score",
					improvement: calculateImprovement(benchmarks.mobileScore.industry, benchmarks.mobileScore.optimized),
				},
			];
		},
		["analytics-stats"],
		{ revalidate: 7200 } // 2 hours
	);

export const getSections = () =>
	unstable_cache(
		async () => [
			{ id: "overview", title: "Overview" },
			{ id: "client", title: "Client Overview" },
			{ id: "performance", title: "Performance" },
			{ id: "seo", title: "SEO" },
			{ id: "design", title: "Design" },
			{ id: "market-research", title: "Market Research" },
			{ id: "impact", title: "Business Impact" },
			{ id: "technical", title: "Technical Details" },
			{ id: "conclusion", title: "Conclusion" },
			{ id: "investment", title: "Investment" },
		],
		["analytics-sections"],
		{ revalidate: 7200 } // 2 hours
	);

export const getPerformanceData = () =>
	unstable_cache(
		async () => [
			{ month: "Jan", industry: 50, optimized: 90 },
			{ month: "Feb", industry: 52, optimized: 91 },
			{ month: "Mar", industry: 51, optimized: 92 },
			{ month: "Apr", industry: 53, optimized: 93 },
			{ month: "May", industry: 52, optimized: 94 },
			{ month: "Jun", industry: 54, optimized: 95 },
		],
		["analytics-performance"],
		{ revalidate: 7200 } // 2 hours
	);

export const getConversionData = () =>
	unstable_cache(
		async () => [
			{ category: "E-commerce", industry: 2.3, optimized: 3.9 },
			{ category: "Marine", industry: 2.5, optimized: 4.5 },
			{ category: "B2B", industry: 2.7, optimized: 4.8 },
		],
		["analytics-conversion"],
		{ revalidate: 7200 } // 2 hours
	);
