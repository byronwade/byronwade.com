"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Code, Database, Globe, Palette, Server, Zap, Cloud, Lock, Smartphone, Cpu, ExternalLink, Check } from "lucide-react";
import { useRef, useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, RefObject } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
// Define the case study data type
type CaseStudyItem = {
	name: string;
	icon: any;
	description: string;
	tags: string[];
	keyFeatures: string[];
	url: string;
	businessMetrics?: string[];
	businessImpact?: string[];
	improvements?: string[];
	infrastructure?: string[];
	businessResults?: string[];
	marketingResults?: string[];
	satisfactionMetrics?: string[];
	financialMetrics?: string[];
	image?: string;
};

const caseStudyData: CaseStudyItem[] = [
	{
		name: "Company Overview",
		icon: Globe,
		description: "Impact Marine Group is a leading marine services provider specializing in boat sales, repairs, and marina operations.",
		tags: ["Marine Industry", "B2C", "Service-Based", "Local Business", "Established 1985"],
		keyFeatures: ["Multiple Locations", "Full-Service Marina", "Sales & Service", "Expert Staff", "Premium Brands"],
		businessMetrics: ["$12M Annual Revenue", "4 Locations", "45+ Employees", "2000+ Customers", "85% Customer Retention"],
		url: "https://impactmarinegroup.com",
		image: "/images/impact-marine.jpg",
	},
	{
		name: "Website Challenges",
		icon: Code,
		description: "The original website faced several critical issues affecting business performance and customer experience.",
		tags: ["Outdated Design", "Poor Mobile Experience", "Slow Loading", "Low Conversion", "Limited Functionality"],
		keyFeatures: ["5+ Second Load Time", "15% Bounce Rate", "2% Conversion Rate", "No Online Booking", "Limited Inventory Search"],
		businessImpact: ["Lost Sales Opportunities", "Poor Customer Experience", "Reduced Market Reach", "Inefficient Operations"],
		url: "/original-site-metrics",
	},
	{
		name: "Solution Implementation",
		icon: Palette,
		description: "Complete digital transformation with modern technology stack and user-centered design approach.",
		tags: ["Modern Design", "Mobile-First", "Performance Optimized", "SEO Enhanced", "Custom Features"],
		keyFeatures: ["Responsive Design", "Inventory Management", "Online Booking System", "Customer Portal", "Real-time Updates"],
		improvements: ["Fast page loads", "Intuitive navigation", "Streamlined booking", "Enhanced inventory display", "Integrated CRM"],
		url: "/implementation-details",
	},
	{
		name: "Technical Architecture",
		icon: Server,
		description: "Enterprise-grade infrastructure ensuring reliability, security, and scalability.",
		tags: ["Cloud Hosting", "API Integration", "Database Design", "Security", "Performance"],
		keyFeatures: ["99.9% Uptime", "SSL Security", "Data Encryption", "API-First Design", "Automated Backups"],
		infrastructure: ["AWS Cloud", "CDN Integration", "Load Balancing", "Database Clustering", "Monitoring Tools"],
		url: "/technical-specs",
	},
	{
		name: "Performance Metrics",
		icon: Database,
		description: "Quantifiable improvements in key performance indicators after website redesign.",
		tags: ["Analytics", "Conversion Rate", "Page Speed", "User Engagement", "SEO Rankings"],
		keyFeatures: ["Sub-2s Load Time", "45% Bounce Rate Reduction", "3x Conversion Rate", "Mobile Traffic +85%", "Search Rankings +40%"],
		businessResults: ["Online Bookings +150%", "Lead Generation +200%", "Customer Satisfaction +60%", "Operational Efficiency +40%"],
		url: "/performance-data",
	},
	{
		name: "Marketing Integration",
		icon: Zap,
		description: "Comprehensive digital marketing strategy leveraging the new website capabilities.",
		tags: ["SEO", "Content Marketing", "Social Media", "Email Campaigns", "PPC"],
		keyFeatures: ["Local SEO Optimization", "Content Strategy", "Social Integration", "Email Automation", "Analytics Dashboard"],
		marketingResults: ["Organic Traffic +120%", "Social Engagement +85%", "Email Subscribers +200%", "PPC Conversion +65%"],
		url: "/marketing-metrics",
	},
	{
		name: "Customer Experience",
		icon: Cloud,
		description: "Enhanced user journey and customer satisfaction through digital touchpoints.",
		tags: ["UX Design", "Customer Service", "Feedback System", "Support Portal", "Personalization"],
		keyFeatures: ["Intuitive Navigation", "24/7 Support Access", "Customer Dashboard", "Feedback Integration", "Personalized Content"],
		satisfactionMetrics: ["Customer Satisfaction +45%", "Support Tickets -30%", "Self-Service Usage +80%", "Repeat Visits +60%"],
		url: "/customer-experience",
	},
	{
		name: "Business Impact",
		icon: Lock,
		description: "Overall business improvements and ROI from the digital transformation project.",
		tags: ["Revenue Growth", "Cost Reduction", "Market Share", "Operational Efficiency", "Customer Retention"],
		keyFeatures: ["Revenue Increase +35%", "Operating Costs -25%", "Market Share +15%", "Customer Base +40%", "Staff Productivity +30%"],
		financialMetrics: ["ROI 285%", "Revenue Growth $4.2M", "Cost Savings $850K", "Marketing Efficiency +65%"],
		url: "/business-impact",
	},
];

interface ToolProps {
	tool: CaseStudyItem;
	index: number;
	setActiveToolIndex: (index: number) => void;
}

function Tool({ tool, index, setActiveToolIndex }: ToolProps) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref as RefObject<HTMLElement>,
		offset: ["start end", "end start"],
	});
	const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
	const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

	useEffect(() => {
		const unsubscribe = scrollYProgress.onChange((v) => {
			if (v > 0.3 && v < 0.7) {
				setActiveToolIndex(index);
			}
		});
		return () => unsubscribe();
	}, [scrollYProgress, index, setActiveToolIndex]);

	return (
		// @ts-ignore
		<motion.div ref={ref} style={{ opacity, scale }} className="min-h-[calc(100vh-64px)] md:-ml-32 flex items-center justify-center px-4">
			<Card className="w-full mx-auto max-w-5xl bg-black border border-zinc-800 rounded-xl overflow-hidden z-10">
				<CardHeader className="flex justify-between items-center py-10 border-b border-zinc-800">
					<div className="h-8 w-8 flex items-center justify-center">
						<svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-zinc-500">
							<path d="M12 2L2 19.7778H22L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</div>
				</CardHeader>
				<CardContent className="space-y-4 p-6">
					<h2 className="text-2xl font-semibold tracking-tight text-white">{tool.name}</h2>
					<p className="text-zinc-400 text-sm">{tool.description}</p>
					<div className="flex flex-wrap gap-2">
						{tool.tags.map((tag, tagIndex) => (
							<Badge key={tagIndex} variant="secondary" className="bg-zinc-800 text-zinc-400">
								{tag}
							</Badge>
						))}
					</div>
					<Separator className="bg-zinc-800" />
					<div className="space-y-2">
						<h3 className="text-sm font-medium text-white">Key Features:</h3>
						<ul className="space-y-1">
							{tool.keyFeatures.map((feature, featureIndex) => (
								<li key={featureIndex} className="flex items-center text-zinc-400 text-sm">
									<Check className="h-4 w-4 mr-2 text-green-500" />
									{feature}
								</li>
							))}
						</ul>
					</div>
				</CardContent>
				<CardFooter className="border-t border-zinc-800 p-6">
					<a href="#" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
						View Template
						<ExternalLink className="h-4 w-4" />
					</a>
				</CardFooter>
			</Card>
		</motion.div>
	);
}

export default function ToolsShowcase() {
	const [activeToolIndex, setActiveToolIndex] = useState(0);

	return (
		<>
			<div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] z-10">
				{/* Left side - Title, Description, and Overview */}
				<div className="w-full lg:w-1/4 flex flex-col justify-between p-6 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)]">
					<div className="max-w-xs mx-auto lg:mx-0">
						<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
							<Image src="/Impact-Logo.webp" alt="Impact Marine Group" width={1000} height={1000} className="w-full bg-white p-4 rounded-md mb-4" />
						</motion.div>
						{/* @ts-ignore */}
						<motion.h1 className="text-3xl font-bold mb-4 " initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
							Impact Marine Group
						</motion.h1>
						{/* @ts-ignore */}
						<motion.p className="text-base text-gray-400 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
							Impact Marine Group is a leading provider of marine services in Georgia, California. Case Study on website redesign and SEO optimization.
						</motion.p>
					</div>
					<div className="mt-6 lg:mt-0">
						<h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Overview</h3>
						<ul className="space-y-2">
							{caseStudyData.map((tool, index) => (
								<li key={tool.name} className={`transition-all duration-300 text-sm ${index === activeToolIndex ? "text-yellow-400 translate-x-1" : "text-gray-500 hover:text-yellow-400"}`}>
									<tool.icon className="w-3 h-3 inline-block mr-1" />
									{tool.name}
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Right side - Scrolling Tools */}
				<div className="w-full lg:w-3/4">
					{caseStudyData.map((tool, index) => (
						<Tool key={tool.name} tool={tool} index={index} setActiveToolIndex={setActiveToolIndex} />
					))}
				</div>
			</div>
		</>
	);
}
