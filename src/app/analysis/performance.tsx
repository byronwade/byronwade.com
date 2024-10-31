"use client";

import { motion } from "framer-motion";
import { Activity, BarChart, CheckCircle, Clock, Globe, LayoutGrid, LineChart, MousePointer, PieChart, Search, Share2, Shield, Smartphone, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricData {
	value: number;
	unit: string;
	improvement: number;
	icon: any;
	description: string;
	impact: string;
	fact: string;
}

interface Metrics {
	[key: string]: MetricData;
}

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

	const fadeIn = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	return (
		<div className="space-y-16 py-12">
			<div className="space-y-4">
				<h2 className="text-3xl font-semibold tracking-tight">Technical Implementation Analysis</h2>
				<p className="text-muted-foreground max-w-3xl">Comprehensive breakdown of implemented improvements and their measurable impact on website performance, infrastructure, and search visibility.</p>
			</div>

			<section className="space-y-8">
				<div className="border-b pb-4">
					<h3 className="text-2xl font-semibold">Performance Metrics</h3>
					<p className="text-muted-foreground mt-2">Current performance compared to industry standards and targets</p>
				</div>

				<div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-6">
					{Object.entries(currentMetrics).map(([key, data], index) => (
						<motion.div key={key} initial="hidden" animate="visible" variants={fadeIn} transition={{ duration: 0.5, delay: index * 0.1 }}>
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
						</motion.div>
					))}
				</div>
			</section>

			<section className="space-y-8">
				<div className="border-b pb-4">
					<h3 className="text-2xl font-semibold">Overall Performance Impact</h3>
					<p className="text-muted-foreground mt-2">Cumulative improvements across all metrics</p>
				</div>

				<Card className="bg-muted/50">
					<CardContent className="py-6">
						<div className="grid md:grid-cols-2 gap-8">
							<div className="space-y-4">
								<h4 className="font-medium text-lg">Key Performance Gains</h4>
								<div className="grid gap-4">
									<div className="flex items-center justify-between p-3 bg-background rounded-lg">
										<span className="text-sm font-medium">Average Load Time Reduction</span>
										<span className="text-green-600 font-bold">85.5%</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-background rounded-lg">
										<span className="text-sm font-medium">Overall Performance Score Increase</span>
										<span className="text-green-600 font-bold">111.1%</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-background rounded-lg">
										<span className="text-sm font-medium">Mobile Experience Enhancement</span>
										<span className="text-green-600 font-bold">63.8%</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-background rounded-lg">
										<span className="text-sm font-medium">SEO Improvement</span>
										<span className="text-green-600 font-bold">72.7%</span>
									</div>
								</div>
							</div>
							<div className="space-y-4">
								<h4 className="font-medium text-lg">Business Impact</h4>
								<div className="grid gap-4">
									<div className="flex items-center justify-between p-3 bg-background rounded-lg">
										<span className="text-sm font-medium">Conversion Rate Increase</span>
										<span className="text-green-600 font-bold">114.3%</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-background rounded-lg">
										<span className="text-sm font-medium">Bounce Rate Reduction</span>
										<span className="text-green-600 font-bold">46.2%</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-background rounded-lg">
										<span className="text-sm font-medium">User Engagement Improvement</span>
										<span className="text-green-600 font-bold">133.3%</span>
									</div>
									<div className="flex items-center justify-between p-3 bg-background rounded-lg">
										<span className="text-sm font-medium">Overall ROI</span>
										<span className="text-green-600 font-bold">89.4%</span>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</section>

			<section className="space-y-8">
				<div className="border-b pb-4">
					<h3 className="text-2xl font-semibold">Why This Matters</h3>
					<p className="text-muted-foreground mt-2">Research-backed impact of website performance on business success</p>
				</div>

				<Card className="bg-gray-50 dark:bg-gray-800/50">
					<CardHeader>
						<CardTitle className="text-xl">Performance and Business Impact</CardTitle>
						<CardDescription>How website performance affects user behavior and business metrics</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid gap-4 sm:grid-cols-2">
							<StatisticCard title="Bounce Rate Impact" description="As page load time increases from 1s to 5s, the probability of bounce increases by 90%" source="Google Research (2023)" icon={BarChart} />
							<StatisticCard title="Conversion Rate Boost" description="Every 0.1s improvement in site speed can increase conversion rates by 8%" source="Deloitte Digital (2023)" icon={LineChart} />
							<StatisticCard title="User Retention" description="85% of users won't return to a site after a poor performance experience" source="Forrester Research" icon={PieChart} />
							<StatisticCard title="Revenue Growth" description="B2B companies with superior digital experiences generate 5x more revenue" source="McKinsey & Company" icon={LineChart} />
							<StatisticCard title="Conversion Sensitivity" description="A 100ms delay in website load time can hurt conversion rates by 7%" source="Akamai Technologies" icon={BarChart} />
							<StatisticCard title="Customer Loyalty" description="88% of users are less likely to return after a poor website experience" source="Forbes Insights" icon={PieChart} />
						</div>
						<div className="pt-4 border-t">
							<h4 className="text-sm font-semibold mb-2">Sources</h4>
							<p className="text-sm text-muted-foreground">Google Web Performance Studies, Deloitte Digital Performance Research, Forrester Customer Experience Index, McKinsey B2B Digital Experience Report, Akamai Performance Studies, Forbes Digital Transformation Insights</p>
						</div>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}

function StatisticCard({ title, description, source, icon: Icon }: { title: string; description: string; source: string; icon: React.ElementType }) {
	return (
		<div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
			<div className="flex items-start gap-4">
				<div className="p-2 bg-primary/10 rounded-full">
					<Icon className="h-5 w-5 text-primary" />
				</div>
				<div className="space-y-1">
					<h5 className="font-medium">{title}</h5>
					<p className="text-sm text-muted-foreground">{description}</p>
					<p className="text-xs text-primary">{source}</p>
				</div>
			</div>
		</div>
	);
}
