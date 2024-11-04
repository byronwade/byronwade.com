"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import CodedText from "@/components/ui/coded-text";
import { benchmarks, calculateImprovement, stats, performanceData, conversionData } from "@/actions/analysis/get-analytics";

import dynamic from "next/dynamic";

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

export default function PerformanceCaseStudy() {
	const [isVisible, setIsVisible] = useState(false);
	const [activeSection, setActiveSection] = useState("overview");
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

	const fadeIn = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	const seo = `${calculateImprovement(benchmarks.seoScore.industry, benchmarks.seoScore.optimized)} increase in SEO score, from ${benchmarks.seoScore.industry} to ${benchmarks.seoScore.optimized}`;

	const seoMetrics = {
		ctrImprovement: 25,
		clarityImprovement: 40,
		keyOptimizations: [{ title: "Strategic optimization of meta titles and descriptions", improvement: "25% CTR" }, { title: "Implementation of semantic HTML structure", improvement: "40% clarity" }, { title: "Enhancement of internal linking architecture" }, { title: "Mobile responsiveness optimization" }, { title: "Implementation of schema markup for rich snippets" }, { title: "URL structure refinement for maximum SEO impact" }],
	};

	const memoizedData = useMemo(
		() => ({
			performanceData,
			conversionData,
		}),
		[]
	);

	return (
		<>
			<PageHeader title="Impact Marine Group">
				<Link href="https://www.figma.com" className="text-[#f24e1e] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Figma</CodedText>
				</Link>
				<Link href="https://www.sketch.com" className="text-[#fdad00] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Sketch</CodedText>
				</Link>
				<Link href="https://www.adobe.com/products/xd.html" className="text-[#ff61f6] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Adobe XD</CodedText>
				</Link>
				<Link href="https://www.invisionapp.com" className="text-[#ff3366] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">InVision</CodedText>
				</Link>
				<Link href="https://www.framer.com" className="text-[#05f] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Framer</CodedText>
				</Link>
				<Link href="https://www.axure.com" className="text-[#008d7d] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Axure</CodedText>
				</Link>
				<Link href="https://www.flinto.com" className="text-[#00d6bf] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Flinto</CodedText>
				</Link>
				<Link href="https://www.protopie.io" className="text-[#6200ee] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">ProtoPie</CodedText>
				</Link>
			</PageHeader>
			<TooltipProvider>
				<div className="min-h-screen bg-gradient-to-b bg-white dark:bg-black">
					<div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-y">
						<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
							<header className="py-4">
								<div className="flex items-center justify-between">
									<div className="flex flex-col">
										<h3 className="text-sm text-muted-foreground">Analysis #346</h3>
										<h1 className="text-2xl font-bold">Impact Marine Group</h1>
									</div>
									<Button variant="outline" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
										<Menu className="h-4 w-4" />
										<span className="sr-only">Toggle navigation menu</span>
									</Button>
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
								<motion.div initial="hidden" animate={isVisible ? "visible" : "hidden"} variants={fadeIn} transition={{ duration: 0.5 }} style={{ display: "grid", gap: "3rem" }}>
									{/* @ts-ignore */}
									<Overview stats={stats} />
									<Client />
									<Performance />
									<SEO seo={seo} benchmarks={benchmarks} seoMetrics={seoMetrics} />
									<Design />
									<Market performanceData={memoizedData.performanceData} conversionData={memoizedData.conversionData} />
									<Impact />
									<Technical />
									<Conclusion />
									<Investment mainFeatures={mainFeatures} monthlyServices={monthlyServices} addOns={addOns} />

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
		</>
	);
}


