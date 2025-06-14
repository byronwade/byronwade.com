"use cache";

import { Clock, Zap, Search, LayoutGrid, Smartphone } from "lucide-react";
import { Benchmarks, Stat } from "@/types/analysis";

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

export async function getAnalytics(): Promise<AnalyticsData> {
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
}

export async function getBenchmarks(): Promise<Benchmarks> {
	const analytics = await getAnalytics();
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
}

function calculateImprovement(industry: number, optimized: number): string {
	const improvement = Math.round(((optimized - industry) / industry) * 100);
	return `${improvement}%`;
}

export async function getStats(): Promise<Stat[]> {
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
}

export async function getSections() {
	return [
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
	];
}

export async function getPerformanceData() {
	return [
		{ month: "Jan", industry: 50, optimized: 90 },
		{ month: "Feb", industry: 52, optimized: 91 },
		{ month: "Mar", industry: 51, optimized: 92 },
		{ month: "Apr", industry: 53, optimized: 93 },
		{ month: "May", industry: 52, optimized: 94 },
		{ month: "Jun", industry: 54, optimized: 95 },
	];
}

export async function getConversionData() {
	return [
		{ category: "E-commerce", industry: 2.3, optimized: 3.9 },
		{ category: "Marine", industry: 2.5, optimized: 4.5 },
		{ category: "B2B", industry: 2.7, optimized: 4.8 },
	];
}
