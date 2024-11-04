import { Clock, Zap, Search, LayoutGrid, Smartphone } from "lucide-react";
import { Benchmarks, Stat } from "@/types/analysis";

export const benchmarks: Benchmarks = {
	loadTime: { industry: 8.2, optimized: 2.1 },
	performanceScore: { industry: 50, optimized: 90 },
	seoScore: { industry: 60, optimized: 95 },
	bestPractices: { industry: 70, optimized: 95 },
	mobileScore: { industry: 65, optimized: 95 },
	bounceRate: { industry: 55, optimized: 35 },
	averageTimeOnPage: { industry: 120, optimized: 180 },
	organicTrafficIncrease: 250,
	conversionRate: { industry: 2.5, optimized: 4.5 },
};

export const calculateImprovement = (oldValue: number, newValue: number) => {
	const improvement = ((newValue - oldValue) / oldValue) * 100;
	return improvement.toFixed(1) + "%";
};

export const stats: Stat[] = [
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

export const sections = [
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

export const performanceData = [
	{ month: "Jan", industry: 50, optimized: 90 },
	{ month: "Feb", industry: 52, optimized: 91 },
	{ month: "Mar", industry: 51, optimized: 92 },
	{ month: "Apr", industry: 53, optimized: 93 },
	{ month: "May", industry: 52, optimized: 94 },
	{ month: "Jun", industry: 54, optimized: 95 },
];

export const conversionData = [
	{ category: "E-commerce", industry: 2.3, optimized: 3.9 },
	{ category: "Marine", industry: 2.5, optimized: 4.5 },
	{ category: "B2B", industry: 2.7, optimized: 4.8 },
];
