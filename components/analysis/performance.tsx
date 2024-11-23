"use client";

import { Activity, BarChart, Clock, Globe, LayoutGrid, LineChart, MousePointer, PieChart, Search, Share2, Shield, Smartphone, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Metrics } from "@/types/analysis";

export default function PerformanceAnalysis() {
	const currentMetrics: Metrics = {
		loadTime: {
			value: 8.3,
			unit: "s",
			improvement: 85.5,
			icon: Clock,
			description: "Time until page becomes fully interactive",
			impact: "A 1-second delay in load time can result in a 7% reduction in conversions",
			fact: "Google research shows 53% of mobile users abandon sites that take longer than 3 seconds to load",
		},
		firstContentfulPaint: {
			value: 3.8,
			unit: "s",
			improvement: 78.9,
			icon: Activity,
			description: "Time until first meaningful content appears",
			impact: "FCP strongly correlates with user perception of site speed",
			fact: "Sites with FCP under 1.8s rank in the top 75th percentile for user experience",
		},
		performanceScore: {
			value: 45,
			unit: "",
			improvement: 111.1,
			icon: Zap,
			description: "Overall performance assessment",
			impact: "Higher performance scores directly impact search rankings",
			fact: "Websites with performance scores over 90 see 23% higher conversion rates on average",
		},
		bounceRate: {
			value: 65,
			unit: "%",
			improvement: 46.2,
			icon: MousePointer,
			description: "Percentage of single-page sessions",
			impact: "Lower bounce rates indicate better user engagement",
			fact: "The average bounce rate for manufacturing websites is 55%. Every 1% reduction can increase conversions by 2%",
		},
		conversionRate: {
			value: 2.1,
			unit: "%",
			improvement: 114.3,
			icon: LineChart,
			description: "Percentage of converting visitors",
			impact: "Direct correlation with business revenue",
			fact: "Top-performing manufacturing websites achieve conversion rates of 4.5% or higher",
		},
		sessionDuration: {
			value: 120,
			unit: "s",
			improvement: 133.3,
			icon: Clock,
			description: "Average time spent on site",
			impact: "Longer sessions indicate higher user engagement",
			fact: "Users who spend more than 3 minutes on site are 4x more likely to convert",
		},
		securityScore: {
			value: 60,
			unit: "",
			improvement: 58.3,
			icon: Shield,
			description: "Overall security assessment",
			impact: "Critical for user trust and data protection",
			fact: "88% of users are less likely to return after a negative security experience",
		},
		bestPractices: {
			value: 60,
			unit: "",
			improvement: 58.3,
			icon: LayoutGrid,
			description: "Adherence to web standards",
			impact: "Ensures maintainability and future compatibility",
			fact: "Sites following best practices see 32% lower maintenance costs on average",
		},
		mobileScore: {
			value: 58,
			unit: "",
			improvement: 63.8,
			icon: Smartphone,
			description: "Mobile optimization level",
			impact: "Critical for mobile user experience",
			fact: "Mobile devices account for over 60% of web traffic in the manufacturing sector",
		},
		seoScore: {
			value: 55,
			unit: "",
			improvement: 72.7,
			icon: Search,
			description: "Search engine optimization level",
			impact: "Determines organic search visibility",
			fact: "Websites ranking on the first page of Google have an average SEO score of 85+",
		},
		crawlability: {
			value: 70,
			unit: "%",
			improvement: 40.0,
			icon: Globe,
			description: "Search engine accessibility",
			impact: "Affects content indexing efficiency",
			fact: "Improved crawlability can increase organic traffic by up to 50%",
		},
		socialEngagement: {
			value: 45,
			unit: "",
			improvement: 88.9,
			icon: Share2,
			description: "Social media interaction score",
			impact: "Influences brand visibility and reach",
			fact: "B2B companies with high social engagement see 45% more web traffic",
		},
	};

	return (
		<div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-6">
			{Object.entries(currentMetrics).map(([key, data], index) => (
				<div key={key} className="opacity-0 animate-in fade-in-0 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
					<Card className="h-full">
						<CardHeader className="pb-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-md bg-muted">
										<data.icon className="h-5 w-5 text-muted-foreground" />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<CardTitle className="text-lg font-semibold capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</CardTitle>
											<span className="text-sm font-medium text-green-600">+{data.improvement}% improved</span>
										</div>
										<CardDescription className="text-sm">{data.description}</CardDescription>
									</div>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="grid grid-cols-3 gap-2 pt-2">
									<div className="space-y-1">
										<p className="text-xs text-muted-foreground font-medium">Current</p>
										<p className="text-2xl font-semibold tabular-nums">
											{data.value}
											{data.unit}
										</p>
									</div>
									<div className="space-y-1">
										<p className="text-xs text-muted-foreground font-medium">Industry</p>
										<p className="text-2xl font-semibold text-muted-foreground tabular-nums">
											{Math.round(data.value * 1.2)}
											{data.unit}
										</p>
									</div>
									<div className="space-y-1">
										<p className="text-xs text-muted-foreground font-medium">Target</p>
										<div className="flex items-baseline gap-1.5">
											<p className="text-2xl font-semibold text-primary tabular-nums">
												{Math.round(data.value * 0.4)}
												{data.unit}
											</p>
										</div>
									</div>
								</div>
								<div className="pt-4 border-t space-y-3">
									<p className="text-sm text-muted-foreground">
										<span className="font-medium text-foreground">Impact: </span>
										{data.impact}
									</p>
									<div className="bg-muted/50 rounded-lg p-3">
										<p className="text-sm text-muted-foreground">
											<span className="font-medium text-foreground">Did you know? </span>
											{data.fact}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			))}
		</div>
	);
}
