"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Info, CheckCircle, Clock, LayoutGrid, Menu, Search, Smartphone, Zap } from "lucide-react";
import { Bar, CartesianGrid, Legend, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import dynamic from "next/dynamic";

const DynamicLineChart = dynamic<any>(() => import("recharts").then((mod) => mod.LineChart), {
	ssr: false,
	loading: () => <div className="h-[300px] animate-pulse bg-muted" />,
});

const DynamicBarChart = dynamic<any>(() => import("recharts").then((mod) => mod.BarChart), {
	ssr: false,
	loading: () => <div className="h-[300px] animate-pulse bg-muted" />,
});

// Industry benchmarks and calculations
const benchmarks = {
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

const calculateImprovement = (oldValue: number, newValue: number) => {
	const improvement = ((newValue - oldValue) / oldValue) * 100;
	return improvement.toFixed(1) + "%";
};

export default function PerformanceCaseStudy() {
	const [isVisible, setIsVisible] = useState(false);
	const [activeSection, setActiveSection] = useState("overview");
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const stats = useMemo(
		() => [
			{
				icon: Clock,
				industryValue: benchmarks.loadTime.industry + "s",
				optimizedValue: benchmarks.loadTime.optimized + "s",
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
		],
		[]
	);

	const sections = useMemo(
		() => [
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
		[]
	);

	const performanceData = useMemo(
		() => [
			{ month: "Jan", industry: 50, optimized: 90 },
			{ month: "Feb", industry: 52, optimized: 91 },
			{ month: "Mar", industry: 51, optimized: 92 },
			{ month: "Apr", industry: 53, optimized: 93 },
			{ month: "May", industry: 52, optimized: 94 },
			{ month: "Jun", industry: 54, optimized: 95 },
		],
		[]
	);

	const conversionData = useMemo(
		() => [
			{ category: "E-commerce", industry: 2.3, optimized: 3.9 },
			{ category: "Marine", industry: 2.5, optimized: 4.5 },
			{ category: "B2B", industry: 2.7, optimized: 4.8 },
		],
		[]
	);

	useEffect(() => {
		setIsVisible(true);
		const handleScroll = () => {
			const sections = document.querySelectorAll("section");
			const scrollPosition = window.scrollY;

			sections.forEach((section) => {
				if (section instanceof HTMLElement && section.offsetTop <= scrollPosition + 150) {
					setActiveSection(section.id);
				}
			});
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const fadeIn = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

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

	const performanceMetrics = useMemo(() => {
		return stats.map((stat) => ({
			...stat,
			improvement: calculateImprovement(typeof stat.industryValue === "string" ? parseFloat(stat.industryValue) : stat.industryValue, typeof stat.optimizedValue === "string" ? parseFloat(stat.optimizedValue) : stat.optimizedValue),
		}));
	}, [stats]);

	return (
		<TooltipProvider>
			<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
				<div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<header className="py-4">
							<div className="flex items-center justify-between">
								<h1 className="text-2xl font-bold">Impact Marine Group Case Study</h1>
								<Button variant="outline" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
									<Menu className="h-4 w-4" />
									<span className="sr-only">Toggle navigation menu</span>
								</Button>
								<Button size="lg" className="hidden sm:flex">
									Get Your Analysis
								</Button>
							</div>
						</header>
					</div>
				</div>

				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="lg:grid lg:gap-8">
						<main className="space-y-12 lg:space-y-16">
							<motion.div initial="hidden" animate={isVisible ? "visible" : "hidden"} variants={fadeIn} transition={{ duration: 0.5 }} style={{ display: "grid", gap: "3rem" }}>
								<section id="overview" className="scroll-mt-28">
									<Card>
										<CardHeader>
											<CardTitle className="text-2xl">Project Overview</CardTitle>
											<CardDescription>A comprehensive analysis of website transformation</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="grid gap-6">
												{stats.map((stat, index) => (
													<motion.div
														key={stat.label}
														initial="hidden"
														animate="visible"
														variants={fadeIn}
														transition={{ duration: 0.5, delay: index * 0.1 }}
														style={{
															display: "grid",
															gridTemplateColumns: "1fr auto 1fr",
															gap: "1rem",
															alignItems: "center",
														}}
													>
														<div className="flex items-center gap-2">
															<stat.icon className="h-5 w-5 text-muted-foreground" />
															<div>
																<p className="font-medium">{stat.label}</p>
																<p className="text-2xl font-bold">{stat.industryValue}</p>
																<p className="text-sm text-muted-foreground">Industry Average</p>
															</div>
														</div>
														<div className="hidden sm:block">
															<ArrowRight className="h-5 w-5 text-muted-foreground" />
														</div>
														<div className="text-right">
															<p className="font-medium">Optimized</p>
															<p className="text-2xl font-bold text-primary">{stat.optimizedValue}</p>
															<p className="text-sm text-green-600">+{stat.improvement} improvement</p>
														</div>
													</motion.div>
												))}
											</div>
										</CardContent>
									</Card>
								</section>

								<section id="client" className="scroll-mt-28">
									<Card>
										<CardHeader>
											<CardTitle className="text-2xl">Client Overview</CardTitle>
											<CardDescription>Impact Marine Group&apos;s digital transformation journey</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="grid sm:grid-cols-3 gap-6">
												<div className="space-y-2">
													<h3 className="font-semibold">Client</h3>
													<p className="text-sm text-muted-foreground">Impact Marine Group</p>
													<p className="text-sm text-muted-foreground">Marine Industry</p>
												</div>
												<div className="space-y-2">
													<h3 className="font-semibold">Timeline</h3>
													<p className="text-sm text-muted-foreground">Project Duration: 8 weeks</p>
													<p className="text-sm text-muted-foreground">Completed: Q4 2023</p>
												</div>
												<div className="space-y-2">
													<h3 className="font-semibold">Goals</h3>
													<ul className="text-sm text-muted-foreground space-y-1">
														<li>Increase conversions</li>
														<li>Reduce bounce rates</li>
														<li>Improve user experience</li>
													</ul>
												</div>
											</div>
										</CardContent>
									</Card>
								</section>

								<section id="performance" className="scroll-mt-28">
									<Card>
										<CardHeader>
											<CardTitle className="text-2xl">Performance Metrics</CardTitle>
											<CardDescription>Detailed analysis of key performance indicators</CardDescription>
										</CardHeader>
										<CardContent>
											<Tabs defaultValue="scores" className="space-y-4">
												<TabsList>
													<TabsTrigger value="scores">Performance Scores</TabsTrigger>
													<TabsTrigger value="metrics">Key Metrics</TabsTrigger>
												</TabsList>
												<TabsContent value="scores">
													<div className="grid md:grid-cols-2 gap-8">
														<div>
															<h3 className="text-lg font-semibold mb-4">Before Optimization</h3>
															<div className="space-y-4">
																{stats.map((stat) => (
																	<ScoreItem key={stat.label} title={stat.label} score={typeof stat.industryValue === "string" ? parseFloat(stat.industryValue) : stat.industryValue} isOptimized={false} />
																))}
															</div>
														</div>
														<div>
															<h3 className="text-lg font-semibold mb-4">After Optimization</h3>
															<div className="space-y-4">
																{stats.map((stat) => (
																	<ScoreItem key={stat.label} title={stat.label} score={typeof stat.optimizedValue === "string" ? parseFloat(stat.optimizedValue) : stat.optimizedValue} isOptimized={true} />
																))}
															</div>
														</div>
													</div>
												</TabsContent>
												<TabsContent value="metrics">
													<div className="h-[300px]">
														<ResponsiveContainer width="100%" height="100%">
															<DynamicLineChart data={performanceData}>
																<CartesianGrid strokeDasharray="3 3" />
																<XAxis dataKey="month" />
																<YAxis />
																<Tooltip />
																<Legend />
																<Line type="monotone" dataKey="industry" name="Industry Average" stroke="hsl(var(--muted-foreground))" />
																<Line type="monotone" dataKey="optimized" name="Optimized Website" stroke="hsl(var(--primary))" />
															</DynamicLineChart>
														</ResponsiveContainer>
													</div>
												</TabsContent>
											</Tabs>
										</CardContent>
									</Card>
								</section>

								<section id="seo" className="scroll-mt-28">
									<Card>
										<CardHeader>
											<CardTitle className="text-2xl">SEO Improvements</CardTitle>
											<CardDescription>Comprehensive search engine optimization analysis</CardDescription>
										</CardHeader>
										<CardContent className="space-y-6">
											<div className="grid gap-6">
												<div className="space-y-2">
													<h3 className="font-semibold">SEO Score Improvement</h3>
													<p className="text-sm text-muted-foreground">
														{calculateImprovement(benchmarks.seoScore.industry, benchmarks.seoScore.optimized)} increase in SEO score, from {benchmarks.seoScore.industry} to {benchmarks.seoScore.optimized}
													</p>
												</div>
												<div className="grid gap-4">
													<div className="grid gap-2">
														<div className="font-semibold">Key Optimizations</div>
														<ul className="grid gap-2">
															<TechItem text="Strategic optimization of meta titles and descriptions (25% CTR improvement)" />
															<TechItem text="Implementation of semantic HTML structure (40% clarity improvement)" />
															<TechItem text="Enhancement of internal linking architecture" />
															<TechItem text="Mobile responsiveness optimization" />
															<TechItem text="Implementation of schema markup for rich snippets" />
															<TechItem text="URL structure refinement for maximum SEO impact" />
														</ul>
													</div>
												</div>
											</div>
											<div className="bg-muted rounded-lg p-4">
												<p className="font-semibold mb-2">Industry Insight:</p>
												<p className="text-sm text-muted-foreground">Websites on the first page of Google search results have an average SEO score of 80-100. Our optimized score of {benchmarks.seoScore.optimized} puts Impact Marine Group at the top of this range.</p>
											</div>
										</CardContent>
									</Card>
								</section>

								<section id="design" className="scroll-mt-28">
									<Card>
										<CardHeader>
											<CardTitle className="text-2xl">Design Excellence</CardTitle>
											<CardDescription>User interface and experience improvements</CardDescription>
										</CardHeader>
										<CardContent className="space-y-6">
											<div className="grid gap-6">
												<div className="space-y-2">
													<h3 className="font-semibold">User Interface Refinements</h3>
													<ul className="grid gap-2">
														<TechItem text="Implementation of intuitive navigation structure" />
														<TechItem text="Responsive grid layout for optimal content presentation" />
														<TechItem text="Enhanced typography for superior readability" />
														<TechItem text="Refined color contrast for accessibility excellence" />
														<TechItem text="Integration of subtle, elegant animations" />
													</ul>
												</div>
												<div className="grid sm:grid-cols-2 gap-4">
													<MetricCard title="Bounce Rate Reduction" value={`${100 - benchmarks.bounceRate.optimized}%`} trend="decrease" />
													<MetricCard title="Session Duration Increase" value={calculateImprovement(benchmarks.averageTimeOnPage.industry, benchmarks.averageTimeOnPage.optimized)} trend="increase" />
												</div>
											</div>
										</CardContent>
									</Card>
								</section>

								<section id="market-research" className="scroll-mt-28">
									<Card>
										<CardHeader>
											<CardTitle className="text-2xl">Market Research Insights</CardTitle>
											<CardDescription>Industry performance analysis and benchmarks</CardDescription>
										</CardHeader>
										<CardContent className="space-y-8">
											<div>
												<h3 className="font-semibold mb-4">Performance Trends</h3>
												<div className="h-[300px]">
													<ResponsiveContainer width="100%" height="100%">
														<DynamicLineChart data={performanceData}>
															<CartesianGrid strokeDasharray="3 3" />
															<XAxis dataKey="month" />
															<YAxis />
															<Tooltip />
															<Legend />
															<Line type="monotone" dataKey="industry" name="Industry Average" stroke="hsl(var(--muted-foreground))" />
															<Line type="monotone" dataKey="optimized" name="Optimized Website" stroke="hsl(var(--primary))" />
														</DynamicLineChart>
													</ResponsiveContainer>
												</div>
											</div>
											<div>
												<h3 className="font-semibold mb-4">Conversion Rate Comparison</h3>
												<div className="h-[300px]">
													<ResponsiveContainer width="100%" height="100%">
														<DynamicBarChart data={conversionData}>
															<CartesianGrid strokeDasharray="3 3" />
															<XAxis dataKey="category" />
															<YAxis />
															<Tooltip />
															<Legend />
															<Bar dataKey="industry" name="Industry Average" fill="hsl(var(--muted-foreground))" />
															<Bar dataKey="optimized" name="Optimized Website" fill="hsl(var(--primary))" />
														</DynamicBarChart>
													</ResponsiveContainer>
												</div>
											</div>
										</CardContent>
									</Card>
								</section>

								<section id="impact" className="scroll-mt-28">
									<Card>
										<CardHeader>
											<CardTitle className="text-2xl">Business Impact</CardTitle>
											<CardDescription>Measurable improvements in key business metrics</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
												<MetricCard title="Bounce Rate" value={`-${benchmarks.bounceRate.industry - benchmarks.bounceRate.optimized}%`} trend="decrease" />
												<MetricCard title="Conversion Rate" value={`+${calculateImprovement(benchmarks.conversionRate.industry, benchmarks.conversionRate.optimized)}`} trend="increase" />
												<MetricCard title="Organic Traffic" value={`+${benchmarks.organicTrafficIncrease}%`} trend="increase" />
												<MetricCard title="Mobile Score" value={`+${calculateImprovement(benchmarks.mobileScore.industry, benchmarks.mobileScore.optimized)}`} trend="increase" />
											</div>
										</CardContent>
									</Card>
								</section>

								<section id="technical" className="scroll-mt-28">
									<Card>
										<CardHeader>
											<CardTitle className="text-2xl">Technical Details</CardTitle>
											<CardDescription>Implementation specifics and optimizations</CardDescription>
										</CardHeader>
										<CardContent className="space-y-6">
											<div>
												<h3 className="font-semibold mb-2">Performance Optimizations</h3>
												<ul className="grid gap-2">
													<TechItem text="Advanced caching strategies implementation" />
													<TechItem text="Image optimization with WebP format and lazy loading" />
													<TechItem text="Code splitting and bundle optimization" />
													<TechItem text="CDN integration for global content delivery" />
												</ul>
											</div>
											<div>
												<h3 className="font-semibold mb-2">Security Enhancements</h3>
												<ul className="grid gap-2">
													<TechItem text="SSL/TLS implementation with A+ rating" />
													<TechItem text="Advanced firewall protection" />
													<TechItem text="Regular security audits and monitoring" />
													<TechItem text="Automated backup systems" />
												</ul>
											</div>
										</CardContent>
									</Card>
								</section>

								<section id="conclusion" className="scroll-mt-28">
									<Card>
										<CardHeader>
											<CardTitle className="text-2xl">Conclusion</CardTitle>
											<CardDescription>Summary of improvements and future potential</CardDescription>
										</CardHeader>
										<CardContent className="space-y-6">
											<div className="space-y-4">
												<p className="text-muted-foreground">Our premium redesign offers exceptional improvements across all key performance indicators:</p>
												<ul className="grid gap-2">
													<TechItem text={`${calculateImprovement(benchmarks.loadTime.industry, benchmarks.loadTime.optimized)} reduction in load time`} />
													<TechItem text={`${calculateImprovement(benchmarks.performanceScore.industry, benchmarks.performanceScore.optimized)} increase in performance score`} />
													<TechItem text={`${calculateImprovement(benchmarks.seoScore.industry, benchmarks.seoScore.optimized)} improvement in SEO score`} />
													<TechItem text={`${calculateImprovement(benchmarks.mobileScore.industry, benchmarks.mobileScore.optimized)} boost in mobile responsiveness`} />
												</ul>
											</div>
											<div className="bg-muted rounded-lg p-4">
												<p className="font-semibold mb-2">Potential ROI:</p>
												<ul className="space-y-2 text-sm text-muted-foreground">
													<li>• {benchmarks.organicTrafficIncrease}% potential growth in organic traffic</li>
													<li>• Estimated 20-30% increase in customer satisfaction</li>
													<li>• Significant revenue increase potential from higher conversion rates</li>
												</ul>
											</div>
										</CardContent>
									</Card>
								</section>

								<section id="investment" className="max-w-6xl mx-auto px-4 py-12 space-y-16">
									<div className="text-center space-y-4">
										<h1 className="text-4xl font-bold">Investment Options</h1>
										<p className="text-xl text-muted-foreground">Choose the perfect plan for your business</p>
									</div>

									<section className="space-y-8">
										<h2 className="text-3xl font-bold">Complete Website Package</h2>
										<Card className="border-2 border-primary">
											<CardHeader>
												<div className="flex items-baseline justify-between">
													<div>
														<CardTitle className="text-2xl">Premium Website Solution</CardTitle>
														<CardDescription>Everything you need to get started</CardDescription>
													</div>
													<div className="text-right">
														<div className="text-4xl font-bold">$4,999</div>
														<div className="text-sm text-muted-foreground">one-time payment</div>
													</div>
												</div>
											</CardHeader>
											<CardContent className="space-y-6">
												<div className="space-y-4">
													<h3 className="font-semibold">Included Features:</h3>
													<ul className="grid gap-3 sm:grid-cols-2">
														{mainFeatures.map((feature) => (
															<li key={feature} className="flex items-center gap-2">
																<Check className="h-4 w-4 text-primary" />
																<span className="text-sm">{feature}</span>
															</li>
														))}
													</ul>
												</div>
												<Button className="w-full" size="lg">
													Get Started
												</Button>
											</CardContent>
										</Card>
									</section>

									<section className="space-y-8">
										<h2 className="text-3xl font-bold">Monthly Maintenance & Hosting</h2>
										<Card>
											<CardHeader>
												<div className="flex items-baseline justify-between">
													<div>
														<CardTitle className="text-2xl">Essential Care Package</CardTitle>
														<CardDescription>Keep your website running smoothly</CardDescription>
													</div>
													<div className="text-right">
														<div className="text-4xl font-bold">$199</div>
														<div className="text-sm text-muted-foreground">per month</div>
													</div>
												</div>
											</CardHeader>
											<CardContent className="space-y-6">
												<div className="space-y-4">
													<h3 className="font-semibold">Services Included:</h3>
													<ul className="grid gap-3 sm:grid-cols-2">
														{monthlyServices.map((service) => (
															<li key={service.feature} className="flex items-center gap-2">
																<Check className="h-4 w-4 text-primary" />
																<span className="text-sm">{service.feature}</span>
															</li>
														))}
													</ul>
												</div>
												<Button className="w-full" size="lg">
													Subscribe Now
												</Button>
											</CardContent>
										</Card>
									</section>

									<section className="space-y-8">
										<h2 className="text-3xl font-bold">Additional Features & Services</h2>
										<div className="grid gap-8 md:grid-cols-3">
											{addOns.map((addon) => (
												<Card key={addon.title}>
													<CardHeader>
														<div className="flex items-center justify-between">
															<CardTitle className="flex items-center gap-2">
																{addon.title}
																<TooltipProvider>
																	<Tooltip>
																		<TooltipTrigger>
																			<Info className="h-4 w-4 text-muted-foreground" />
																		</TooltipTrigger>
																		<TooltipContent>
																			<p className="max-w-xs">{addon.description}</p>
																		</TooltipContent>
																	</Tooltip>
																</TooltipProvider>
															</CardTitle>
														</div>
														<CardDescription>
															<span className="text-2xl font-bold">{addon.price}</span>
														</CardDescription>
													</CardHeader>
													<CardContent>
														<ul className="space-y-2">
															{addon.features.map((feature) => (
																<li key={feature} className="flex items-center gap-2">
																	<Check className="h-4 w-4 text-primary" />
																	<span className="text-sm">{feature}</span>
																</li>
															))}
														</ul>
													</CardContent>
												</Card>
											))}
										</div>
									</section>

									<section className="space-y-8">
										<h2 className="text-3xl font-bold">Custom Development</h2>
										<Card>
											<CardHeader>
												<CardTitle>Need Something Specific?</CardTitle>
												<CardDescription>Let&apos;s build the perfect solution for your business</CardDescription>
											</CardHeader>
											<CardContent className="space-y-8">
												<div className="grid gap-8 md:grid-cols-2">
													<div className="space-y-4">
														<h3 className="font-semibold">Custom Feature Development</h3>
														<ul className="space-y-2">
															<li className="flex items-center gap-2">
																<Check className="h-4 w-4 text-primary" />
																<span className="text-sm">Custom API integrations from $1,499</span>
															</li>
															<li className="flex items-center gap-2">
																<Check className="h-4 w-4 text-primary" />
																<span className="text-sm">Advanced search functionality from $999</span>
															</li>
															<li className="flex items-center gap-2">
																<Check className="h-4 w-4 text-primary" />
																<span className="text-sm">Custom database solutions from $2,499</span>
															</li>
														</ul>
													</div>
													<div className="space-y-4">
														<h3 className="font-semibold">Additional Support Options</h3>
														<ul className="space-y-2">
															<li className="flex items-center gap-2">
																<Check className="h-4 w-4 text-primary" />
																<span className="text-sm">Priority support: +$99/month</span>
															</li>
															<li className="flex items-center gap-2">
																<Check className="h-4 w-4 text-primary" />
																<span className="text-sm">24/7 emergency support: +$199/month</span>
															</li>
															<li className="flex items-center gap-2">
																<Check className="h-4 w-4 text-primary" />
																<span className="text-sm">Additional content updates: +$149/month</span>
															</li>
														</ul>
													</div>
												</div>
												<div className="bg-muted rounded-lg p-4">
													<p className="text-sm text-muted-foreground">All prices are in USD. Custom development projects are quoted based on specific requirements and complexity. Contact us for a detailed quote tailored to your needs.</p>
												</div>
											</CardContent>
										</Card>
									</section>
								</section>

								<section className="text-center space-y-6">
									<h2 className="text-3xl font-bold">Ready to Get Started?</h2>
									<p className="text-xl text-muted-foreground">Let&apos;s discuss how we can help transform your online presence</p>
									<Button size="lg" className="bg-primary hover:bg-primary/90">
										Schedule a Consultation
									</Button>
								</section>
							</motion.div>
						</main>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}

function ScoreItem({ title, score, isOptimized }: { title: string; score: number; isOptimized: boolean }) {
	return (
		<div>
			<div className="flex justify-between mb-1">
				<span className="text-sm font-medium">{title}</span>
				<span className={`text-sm font-medium ${isOptimized ? "text-primary" : ""}`}>{score}</span>
			</div>
			<Progress value={score} className="h-2" />
		</div>
	);
}

function TechItem({ text }: { text: string }) {
	return (
		<li className="flex items-center gap-2">
			<CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
			<span className="text-sm text-muted-foreground">{text}</span>
		</li>
	);
}

function MetricCard({ title, value, trend }: { title: string; value: string; trend: "increase" | "decrease" }) {
	return (
		<div className="p-4 border rounded-lg">
			<div className="text-sm text-muted-foreground mb-1">{title}</div>
			<div className="text-2xl font-bold">{value}</div>
			<div className={trend === "increase" ? "text-green-600" : "text-red-600"}>{trend === "increase" ? "Increase" : "Decrease"}</div>
		</div>
	);
}
