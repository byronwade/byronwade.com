import { LucideIcon } from "lucide-react";

export interface Benchmarks {
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

export interface Stat {
	icon: any;
	industryValue: number;
	optimizedValue: number;
	label: string;
	improvement: string;
}

export interface PerformanceData {
	month: string;
	industry: number;
	optimized: number;
}

export interface ConversionData {
	category: string;
	industry: number;
	optimized: number;
}

export interface MonthlyService {
	feature: string;
	included: boolean;
}

export interface AddOn {
	title: string;
	description: string;
	price: string;
	features: string[];
}

export interface MetricData {
	value: number;
	unit: string;
	improvement: number;
	icon: LucideIcon;
	description: string;
	impact: string;
	fact: string;
}

export interface Metrics {
	[key: string]: MetricData;
}

export interface SEOProps {
	seo: string;
	benchmarks: Benchmarks;
	seoMetrics: {
		ctrImprovement: number;
		clarityImprovement: number;
		keyOptimizations: Array<{
			title: string;
			improvement?: string;
		}>;
	};
}
