"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ArrowRight,
	Wrench,
	Code,
	Zap,
	Shield,
	Users,
	CheckCircle,
	Star,
	Award,
	TrendingUp,
	Smartphone,
	Globe,
	Database,
	Palette,
	Search,
	Settings,
	Droplets,
	Home,
	Phone,
	Calendar,
	MapPin,
	BadgeCheck,
	ExternalLink,
	Github,
	Linkedin,
	Twitter,
	GitFork,
	Eye,
	Heart,
	Dribbble,
	Figma,
	Lightbulb,
	Rocket,
	Brain,
	Target,
	Hammer,
	Cpu,
	MonitorSpeaker,
	MessageSquare,
	Mail,
	FileText,
	BarChart3,
	ShoppingCart,
	MapPinIcon,
	Briefcase,
	Zap as Lightning,
	AlertCircle,
	GitBranch,
	MessageCircle,
	Layers,
} from "lucide-react";
import { OptimizedImage } from "@/components/optimized-image";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { customFont } from "@/lib/fonts";
import CodedText from "@/components/ui/coded-text";
import { ClientImage } from "@/components/ui/client-image";

// Temporarily disable ISR to fix streaming issue
// export const revalidate = 21600; // 6 hours

// Metadata moved to layout since this is now a client component

const digitalServices = [
	{
		title: "Custom Web Development",
		description: "Modern, scalable web applications built with cutting-edge technologies like Next.js, React, and TypeScript.",
		features: ["High Performance", "SEO Optimized", "Mobile First", "Scalable Architecture"],
		icon: Code,
	},
	{
		title: "E-commerce Solutions",
		description: "Complete online stores with secure payment processing, inventory management, and customer analytics.",
		features: ["Secure Payments", "Inventory Tracking", "Customer Analytics", "Mobile Commerce"],
		icon: Smartphone,
	},
	{
		title: "Digital Marketing",
		description: "Comprehensive digital strategies including SEO, performance optimization, and conversion rate improvement.",
		features: ["SEO Strategy", "Performance Optimization", "Analytics Setup", "Conversion Tracking"],
		icon: TrendingUp,
	},
	{
		title: "UI/UX Design",
		description: "Beautiful, intuitive interfaces that convert visitors into customers with modern design principles.",
		features: ["User Research", "Wireframing", "Prototyping", "Brand Design"],
		icon: Palette,
	},
	{
		title: "Database Solutions",
		description: "Robust data architecture and database optimization for scalable, high-performance applications.",
		features: ["Database Design", "Query Optimization", "Data Migration", "Performance Tuning"],
		icon: Database,
	},
	{
		title: "Web Performance",
		description: "Speed optimization and performance auditing to ensure lightning-fast load times and better SEO.",
		features: ["Speed Optimization", "Core Web Vitals", "Performance Audits", "Caching Strategies"],
		icon: Zap,
	},
];

const plumbingServices = [
	{
		title: "Emergency Plumbing",
		description: "24/7 emergency plumbing services for urgent repairs, leaks, and system failures.",
		features: ["24/7 Emergency Service", "Rapid Response", "Licensed & Insured", "Upfront Pricing"],
		icon: Phone,
	},
	{
		title: "Residential Plumbing",
		description: "Complete plumbing services for homes including repairs, installations, and maintenance.",
		features: ["Pipe Repair", "Fixture Installation", "Water Heater Service", "Drain Cleaning"],
		icon: Home,
	},
	{
		title: "Septic Systems",
		description: "Professional septic installation, repair, and maintenance services for residential properties.",
		features: ["System Design", "Installation", "Pumping Service", "Regular Maintenance"],
		icon: Settings,
	},
	{
		title: "Water Line Services",
		description: "Main water line installation, repair, and replacement with modern materials and techniques.",
		features: ["Line Location", "Trenchless Repair", "New Installations", "Pressure Testing"],
		icon: Droplets,
	},
	{
		title: "Plumbing Consultations",
		description: "Expert virtual consultations for DIY guidance, project planning, and professional recommendations.",
		features: ["Virtual Sessions", "Expert Guidance", "Cost Estimates", "Project Planning"],
		icon: Calendar,
	},
	{
		title: "Preventive Maintenance",
		description: "Regular maintenance programs to prevent costly repairs and extend system lifespan.",
		features: ["Annual Inspections", "Preventive Care", "System Optimization", "Maintenance Plans"],
		icon: BadgeCheck,
	},
];

const stats = [
	{ number: "150+", label: "Projects Completed", icon: Award },
	{ number: "100%", label: "Client Satisfaction", icon: Star },
	{ number: "8+", label: "Years Experience", icon: TrendingUp },
	{ number: "24/7", label: "Emergency Support", icon: Shield },
];

const digitalProcess = [
	{
		title: "Discovery & Strategy",
		description: "We start with understanding your business goals, target audience, and technical requirements to create a strategic roadmap.",
		icon: Search,
		step: "01",
	},
	{
		title: "Design & Planning",
		description: "Creating wireframes, mockups, and detailed project plans that align with your vision and user needs.",
		icon: Palette,
		step: "02",
	},
	{
		title: "Development & Testing",
		description: "Building your solution with clean, efficient code and rigorous testing to ensure quality and performance.",
		icon: Code,
		step: "03",
	},
	{
		title: "Launch & Support",
		description: "Deploying your project and providing ongoing support, maintenance, and optimization as your business grows.",
		icon: Zap,
		step: "04",
	},
];

const plumbingProcess = [
	{
		title: "Assessment & Diagnosis",
		description: "Thorough inspection and diagnosis of your plumbing system to identify issues and recommend solutions.",
		icon: Search,
		step: "01",
	},
	{
		title: "Planning & Preparation",
		description: "Detailed planning of the work, materials needed, and timeline with transparent pricing and no surprises.",
		icon: Calendar,
		step: "02",
	},
	{
		title: "Professional Installation",
		description: "Expert installation or repair using quality materials and proven techniques for lasting results.",
		icon: Wrench,
		step: "03",
	},
	{
		title: "Testing & Guarantee",
		description: "Comprehensive testing of the work and providing warranties on both parts and labor for your peace of mind.",
		icon: BadgeCheck,
		step: "04",
	},
];

const testimonials = [
	{
		name: "Sarah Johnson",
		role: "E-commerce Business Owner",
		content: "Byron transformed our online store completely. The new site loads 3x faster and our conversion rate increased by 45%. His attention to detail is incredible.",
		rating: 5,
		project: "E-commerce Platform",
		result: "45% increase in conversions",
	},
	{
		name: "Mike Rodriguez",
		role: "Homeowner, Santa Cruz",
		content: "Had a major septic emergency on a weekend. Byron responded immediately and had us back to normal by Sunday evening. Professional, honest, and fairly priced.",
		rating: 5,
		project: "Emergency Septic Repair",
		result: "Same-day emergency service",
	},
	{
		name: "Jennifer Kim",
		role: "Tech Startup Founder",
		content: "We needed a scalable platform that could grow with our startup. Byron delivered exactly that - clean code, great performance, and built to scale.",
		rating: 5,
		project: "SaaS Platform Development",
		result: "Built for scale from day one",
	},
	{
		name: "Tom Wilson",
		role: "Property Manager",
		content: "Byron has handled plumbing for three of our rental properties. Always reliable, communicates well with tenants, and his work lasts. Highly recommend.",
		rating: 5,
		project: "Multi-Property Maintenance",
		result: "Ongoing maintenance partnership",
	},
	{
		name: "Lisa Chen",
		role: "Restaurant Owner",
		content: "Our website was driving zero business. Byron redesigned it with local SEO optimization and now we're booked weeks in advance. ROI has been amazing.",
		rating: 5,
		project: "Restaurant Website Redesign",
		result: "Fully booked calendar",
	},
	{
		name: "David Thompson",
		role: "Homeowner, CA",
		content: "Byron saved us thousands. Instead of a full remodel, he suggested targeted upgrades that solved our water pressure issues perfectly.",
		rating: 5,
		project: "Water Pressure Optimization",
		result: "Saved thousands vs full remodel",
	},
];

const serviceAreas = [
	{ location: "Santa Cruz, CA", services: "Full Plumbing & Digital Services", icon: MapPin },
	{ location: "Worldwide", services: "Digital Services & Virtual Consultations", icon: Globe },
];

// Icon mapping for portfolio stats
const iconMap: { [key: string]: any } = {
	Award,
	Github,
	Figma,
	Users,
};

// Remove all mock data - using real API data only

// Business concepts showcasing "From Code To Copper" philosophy
const businessConcepts = [
	{
		id: 1,
		title: "CMS Platform",
		subtitle: "cms.byronwade.com",
		description: "Modern headless content management system built with Next.js, showcasing how content creation can be simplified for businesses.",
		progress: 75,
		status: "Design Concept",
		category: "Digital Solutions",
		icon: FileText,
		features: ["Drag & Drop Editor", "API-First Architecture", "Multi-site Management", "Real-time Collaboration"],
		demoUrl: "https://cms.byronwade.com",
		concept: "Exploring how modern CMS architecture can empower content creators without technical barriers.",
		color: "from-blue-500 to-cyan-500",
		figmaKey: "cms-design-system",
		dribbbleId: "cms-dashboard",
		githubRepo: "cms.byronwade.com",
		stats: { views: 2847, likes: 234, stars: 8, forks: 2 },
		tags: ["CMS", "Next.js", "TypeScript", "Design System"],
		lastUpdated: "2024-01-15",
	},
	{
		id: 2,
		title: "Local Business Directory",
		subtitle: "local.byronwade.com",
		description: "Location-based business discovery platform connecting local services with customers in their area.",
		progress: 60,
		status: "Design Concept",
		category: "Local Commerce",
		icon: MapPinIcon,
		features: ["Geolocation Search", "Business Profiles", "Review System", "Service Booking"],
		demoUrl: "https://local.byronwade.com",
		concept: "Bridging the gap between digital discovery and local service businesses.",
		color: "from-green-500 to-emerald-500",
		figmaKey: "local-business-flow",
		dribbbleId: "local-directory",
		githubRepo: "local.byronwade.com",
		stats: { views: 1923, likes: 187, stars: 5, forks: 1 },
		tags: ["Local Business", "Maps", "React", "Geolocation"],
		lastUpdated: "2024-01-12",
	},
	{
		id: 3,
		title: "Real-time Chat Platform",
		subtitle: "chat.byronwade.com",
		description: "WebSocket-powered communication platform exploring modern real-time messaging patterns and user experience.",
		progress: 45,
		status: "Design Concept",
		category: "Communication",
		icon: MessageSquare,
		features: ["Real-time Messaging", "File Sharing", "Group Channels", "Voice Messages"],
		demoUrl: "https://chat.byronwade.com",
		concept: "Investigating how real-time communication can enhance business collaboration.",
		color: "from-purple-500 to-pink-500",
		figmaKey: "chat-interface-system",
		dribbbleId: "chat-app-ui",
		githubRepo: "chat.byronwade.com",
		stats: { views: 3456, likes: 298, stars: 12, forks: 3 },
		tags: ["Chat", "WebSocket", "Real-time", "Communication"],
		lastUpdated: "2024-01-10",
	},
	{
		id: 4,
		title: "Modern Blogging Platform",
		subtitle: "reactpress.byronwade.com",
		description: "React-based WordPress alternative focusing on performance, modern editing experience, and developer-friendly architecture.",
		progress: 30,
		status: "Design Concept",
		category: "Content Publishing",
		icon: Briefcase,
		features: ["Block Editor", "SEO Optimization", "Performance First", "Plugin Architecture"],
		demoUrl: "https://reactpress.byronwade.com",
		concept: "Reimagining content publishing with modern web technologies.",
		color: "from-orange-500 to-red-500",
		figmaKey: "reactpress-editor",
		dribbbleId: "blog-platform",
		githubRepo: "reactpress.byronwade.com",
		stats: { views: 1678, likes: 145, stars: 7, forks: 1 },
		tags: ["Blogging", "CMS", "React", "Publishing"],
		lastUpdated: "2024-01-08",
	},
	{
		id: 5,
		title: "Social Content Aggregator",
		subtitle: "rebuzzle.byronwade.com",
		description: "Social media reblog platform exploring content curation, sharing mechanisms, and community building features.",
		progress: 55,
		status: "Design Concept",
		category: "Social Media",
		icon: Rocket,
		features: ["Content Curation", "Social Sharing", "Community Features", "Trending Topics"],
		demoUrl: "https://rebuzzle.byronwade.com",
		concept: "Exploring how content aggregation can create meaningful social connections.",
		color: "from-indigo-500 to-purple-500",
		figmaKey: "social-aggregator",
		dribbbleId: "rebuzzle-social",
		githubRepo: "rebuzzle.byronwade.com",
		stats: { views: 2234, likes: 189, stars: 9, forks: 2 },
		tags: ["Social Media", "Aggregation", "Community", "Content"],
		lastUpdated: "2024-01-05",
	},
	{
		id: 6,
		title: "Email Marketing Suite",
		subtitle: "emailmework.com",
		description: "Comprehensive email marketing automation tool demonstrating campaign management, analytics, and user engagement strategies.",
		progress: 40,
		status: "Design Concept",
		category: "Marketing Automation",
		icon: Mail,
		features: ["Campaign Builder", "Automation Workflows", "Analytics Dashboard", "A/B Testing"],
		demoUrl: "https://emailmework.com",
		concept: "Researching how email marketing can be more intuitive and effective for small businesses.",
		color: "from-teal-500 to-cyan-500",
		figmaKey: "email-marketing-dashboard",
		dribbbleId: "email-automation",
		githubRepo: "emailmework.com",
		stats: { views: 4123, likes: 367, stars: 11, forks: 4 },
		tags: ["Email Marketing", "Automation", "Analytics", "SaaS"],
		lastUpdated: "2024-01-02",
	},
	{
		id: 7,
		title: "Field Data Collection",
		subtitle: "feildra.byronwade.com",
		description: "Mobile-first data capture application researching offline sync patterns and field service management workflows.",
		progress: 25,
		status: "Design Concept",
		category: "Field Services",
		icon: BarChart3,
		features: ["Offline Sync", "Mobile Forms", "GPS Tracking", "Data Visualization"],
		demoUrl: "https://feildra.byronwade.com",
		concept: "Investigating how mobile apps can bridge the gap between field work and digital data.",
		color: "from-yellow-500 to-orange-500",
		figmaKey: "field-data-mobile",
		dribbbleId: "field-collection",
		githubRepo: "feildra.byronwade.com",
		stats: { views: 1456, likes: 123, stars: 6, forks: 1 },
		tags: ["Mobile", "Data Collection", "Offline", "Field Work"],
		lastUpdated: "2023-12-28",
	},
];

const philosophyPoints = [
	{
		title: "Code to Concept",
		description: "Every line of code serves a purpose - solving real problems for real people.",
		icon: Code,
	},
	{
		title: "Design to Delivery",
		description: "Beautiful interfaces mean nothing without thoughtful user experiences.",
		icon: Palette,
	},
	{
		title: "Digital to Physical",
		description: "Technology should enhance real-world interactions, not replace them.",
		icon: Lightning,
	},
	{
		title: "Ideas to Impact",
		description: "The best solutions come from understanding the problem deeply.",
		icon: Lightbulb,
	},
];

const conceptStats = [
	{ number: "15+", label: "Active Projects", icon: Lightbulb },
	{ number: "100%", label: "Design Focused", icon: Palette },
	{ number: "8+", label: "Years Experience", icon: TrendingUp },
	{ number: "∞", label: "Ideas Brewing", icon: Brain },
];

// Helper function to strip HTML tags from text
const stripHtml = (html: string) => {
	if (typeof window !== "undefined") {
		const doc = new DOMParser().parseFromString(html, "text/html");
		return doc.body.textContent || "";
	}
	// Fallback for server-side rendering
	return html.replace(/<[^>]*>/g, "");
};

export default function HomePage() {
	const [repos, setRepos] = useState<any[]>([]);
	const [shots, setShots] = useState<any[]>([]);
	const [figmaFiles, setFigmaFiles] = useState<any[]>([]);
	const [conceptStats, setConceptStats] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				// Fetch data from API route
				const response = await fetch("/api/portfolio");
				if (!response.ok) {
					throw new Error("Failed to fetch portfolio data");
				}

				const data = await response.json();

				// Use only real API data
				setRepos(data.repos || []);
				setShots(data.shots || []);
				setFigmaFiles(data.figmaFiles || []);

				// Set dynamic stats based on actual data
				setConceptStats([
					{ number: `${(data.repos || []).length}`, label: "GitHub Projects", icon: Github },
					{ number: `${(data.shots || []).length}`, label: "Design Shots", icon: Dribbble },
					{ number: `${(data.figmaFiles || []).length}`, label: "Figma Files", icon: Figma },
					{ number: "100%", label: "Concept Focus", icon: Lightbulb },
				]);
			} catch (error) {
				console.error("Error loading portfolio data:", error);
				// Set empty arrays on error - no mock data fallback
				setRepos([]);
				setShots([]);
				setFigmaFiles([]);
				setConceptStats([
					{ number: "0", label: "GitHub Projects", icon: Github },
					{ number: "0", label: "Design Shots", icon: Dribbble },
					{ number: "0", label: "Figma Files", icon: Figma },
					{ number: "100%", label: "Concept Focus", icon: Lightbulb },
				]);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	return (
		<div className="min-h-screen">
			{/* Hero Section - From Code To Copper */}
			<section className="relative min-h-[90vh] flex items-center justify-center px-4 py-24">
				<div className="container mx-auto max-w-7xl">
					{/* Hero Content */}
					<div className="text-center mb-16">
						<div className="flex items-center justify-center gap-4 mb-8">
							<div className="p-3 bg-yellow-600/10 rounded-full">
								<Code className="w-8 h-8 text-yellow-600" />
							</div>
							<ArrowRight className="w-6 h-6 text-muted-foreground" />
							<div className="p-3 bg-yellow-600/10 rounded-full">
								<Hammer className="w-8 h-8 text-yellow-600" />
							</div>
						</div>
						<h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">From Code To Copper</h1>
						<div className="w-24 h-1 bg-yellow-600 mx-auto mb-8"></div>
						<p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">Where digital innovation meets real-world solutions. I explore business ideas through design and development, creating concepts that bridge the gap between technology and practical application.</p>
					</div>

					{/* Bento Grid Layout */}
					<div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 mb-16">
						{/* Main Philosophy Card */}
						<div className="md:col-span-6 lg:col-span-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-8 text-black">
							<div className="flex items-center gap-3 mb-4">
								<div className="p-2 bg-black/10 rounded-lg">
									<Brain className="w-6 h-6" />
								</div>
								<h3 className="text-2xl font-bold">Design Thinking</h3>
							</div>
							<p className="text-lg leading-relaxed mb-6">I transform abstract business ideas into tangible design concepts, focusing on user experience and practical implementation. Each project represents a journey from concept to prototype.</p>
							<div className="flex flex-wrap gap-2">
								<span className="px-3 py-1 bg-black/10 rounded-full text-sm font-medium">Frontend Development</span>
								<span className="px-3 py-1 bg-black/10 rounded-full text-sm font-medium">UI/UX Design</span>
								<span className="px-3 py-1 bg-black/10 rounded-full text-sm font-medium">Prototyping</span>
							</div>
						</div>

						{/* Stats Cards */}
						<div className="md:col-span-3 lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
							<div className="text-center">
								<div className="w-12 h-12 mx-auto mb-4 bg-blue-500/10 rounded-lg flex items-center justify-center">
									<Code className="w-6 h-6 text-blue-500" />
								</div>
								<div className="text-3xl font-bold text-foreground mb-1">8+</div>
								<div className="text-sm text-muted-foreground">Years Experience</div>
							</div>
						</div>

						<div className="md:col-span-3 lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
							<div className="text-center">
								<div className="w-12 h-12 mx-auto mb-4 bg-purple-500/10 rounded-lg flex items-center justify-center">
									<Lightbulb className="w-6 h-6 text-purple-500" />
								</div>
								<div className="text-3xl font-bold text-foreground mb-1">7+</div>
								<div className="text-sm text-muted-foreground">Business Concepts</div>
							</div>
						</div>

						{/* Process Cards */}
						<div className="md:col-span-3 lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3 mb-3">
								<div className="p-2 bg-green-500/10 rounded-lg">
									<Target className="w-5 h-5 text-green-500" />
								</div>
								<h4 className="font-semibold text-foreground">Code to Concept</h4>
							</div>
							<p className="text-sm text-muted-foreground">Transforming technical possibilities into business opportunities through thoughtful design.</p>
						</div>

						<div className="md:col-span-3 lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3 mb-3">
								<div className="p-2 bg-orange-500/10 rounded-lg">
									<Rocket className="w-5 h-5 text-orange-500" />
								</div>
								<h4 className="font-semibold text-foreground">Design to Delivery</h4>
							</div>
							<p className="text-sm text-muted-foreground">From wireframes to working prototypes, bringing ideas to life with modern tools.</p>
						</div>

						<div className="md:col-span-3 lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3 mb-3">
								<div className="p-2 bg-red-500/10 rounded-lg">
									<Lightning className="w-5 h-5 text-red-500" />
								</div>
								<h4 className="font-semibold text-foreground">Digital to Physical</h4>
							</div>
							<p className="text-sm text-muted-foreground">Bridging the gap between digital experiences and real-world applications.</p>
						</div>

						<div className="md:col-span-3 lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
							<div className="flex items-center gap-3 mb-3">
								<div className="p-2 bg-pink-500/10 rounded-lg">
									<Heart className="w-5 h-5 text-pink-500" />
								</div>
								<h4 className="font-semibold text-foreground">Ideas to Impact</h4>
							</div>
							<p className="text-sm text-muted-foreground">Creating meaningful solutions that solve real problems for real people.</p>
						</div>
					</div>

					{/* Important Disclaimer */}
					<div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-xl p-6 mb-16">
						<div className="flex items-start gap-3">
							<div className="p-2 bg-yellow-600/20 rounded-lg mt-0.5">
								<Lightbulb className="w-5 h-5 text-yellow-600" />
							</div>
							<div>
								<h3 className="font-semibold text-foreground mb-2">Design Concepts & Prototypes</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									The projects below are <strong>design concepts and prototypes</strong> - not fully functional applications. They represent my exploration of business ideas, user experience patterns, and technical architectures. While I excel at frontend development and design, I'm not a backend developer, so these demos focus on showcasing the user interface and concept rather than complete functionality.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 bg-gray-50 dark:bg-gray-900/50">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
						{conceptStats.map((stat, index) => (
							<div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 text-center">
								<div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-600/10 rounded-lg">
									<stat.icon className="w-6 h-6 text-yellow-600" />
								</div>
								<div className="text-3xl font-bold mb-2 text-foreground">{stat.number}</div>
								<div className="text-muted-foreground font-medium text-sm">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Portfolio Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Featured Work</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">A collection of development projects, design explorations, and creative concepts across multiple platforms.</p>
					</div>

					{loading ? (
						<div className="text-center py-16">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
							<p className="text-muted-foreground">Loading portfolio...</p>
						</div>
					) : (
						<div className="space-y-16">
							{/* GitHub Projects */}
							<div>
								<div className="flex items-center gap-3 mb-8">
									<div className="p-2 bg-gray-900 dark:bg-white rounded-lg">
										<Github className="w-5 h-5 text-white dark:text-black" />
									</div>
									<div>
										<h3 className="text-2xl font-bold">Development Projects</h3>
										<p className="text-muted-foreground">Open source projects and concept applications</p>
									</div>
								</div>
								{repos.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
										{repos.map((repo) => (
											<div key={repo.id} className="relative flex flex-col gap-3 p-4 leading-5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
												{/* Main content */}
												<div className="flex flex-row items-center gap-4">
													<div className="flex min-w-0 flex-1 flex-col justify-between gap-0.5">
														<Link href={repo.homepage || repo.html_url} target="_blank" className="min-w-0 no-underline hover:underline font-medium text-gray-900 dark:text-gray-100 h-5 truncate w-fit max-w-full">
															{repo.name.replace(".byronwade.com", "")}
														</Link>
														<Link href={repo.homepage || repo.html_url} target="_blank" className="min-w-0 no-underline hover:underline text-gray-600 dark:text-gray-400 h-5 truncate leading-5 max-w-full flex items-center gap-1">
															{repo.homepage ? new URL(repo.homepage).hostname : "github.com"}
															<ExternalLink className="w-3 h-3" />
														</Link>
													</div>
												</div>

												{/* Repository info */}
												<div className="flex h-5 w-fit items-center">
													<Link href={repo.html_url} target="_blank" className="flex min-w-0 flex-none flex-row items-center gap-0.5 rounded-full bg-gray-200 dark:bg-gray-800 p-0.5 pr-1.5 w-fit hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
														<Github className="w-3 h-3 m-0.5 shrink-0" />
														<span className="text-xs truncate font-medium">{repo.full_name || `byronwade/${repo.name}`}</span>
													</Link>
												</div>

												{/* Description */}
												<p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-5">{repo.description}</p>

												{/* Demo Button */}
												{repo.homepage && (
													<div className="flex gap-2">
														<Button size="sm" variant="outline" asChild className="text-xs hover:bg-yellow-600/10 hover:border-yellow-600/30">
															<Link href={repo.homepage} target="_blank">
																<ExternalLink className="w-3 h-3 mr-1" />
																Demo
															</Link>
														</Button>
													</div>
												)}

												{/* Stats */}
												<div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
													<div className="flex items-center gap-1">
														<Star className="w-3 h-3" />
														<span>{repo.stargazers_count}</span>
													</div>
													<div className="flex items-center gap-1">
														<GitFork className="w-3 h-3" />
														<span>{repo.forks_count}</span>
													</div>
													{repo.language && (
														<div className="flex items-center gap-1">
															<div className="w-2 h-2 rounded-full bg-blue-500"></div>
															<span>{repo.language}</span>
														</div>
													)}
													<div className="flex items-center gap-1">
														<Calendar className="w-3 h-3" />
														<span>{new Date(repo.updated_at).toLocaleDateString()}</span>
													</div>
												</div>

												{/* Additional GitHub info */}
												{(repo.open_issues_count !== undefined || repo.size !== undefined) && (
													<div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-800">
														{repo.open_issues_count !== undefined && (
															<div className="flex items-center gap-1">
																<AlertCircle className="w-3 h-3" />
																<span>{repo.open_issues_count} issues</span>
															</div>
														)}
														{repo.size !== undefined && (
															<div className="flex items-center gap-1">
																<Database className="w-3 h-3" />
																<span>{Math.round(repo.size / 1024)} MB</span>
															</div>
														)}
														{repo.default_branch && (
															<div className="flex items-center gap-1">
																<GitBranch className="w-3 h-3" />
																<span>{repo.default_branch}</span>
															</div>
														)}
													</div>
												)}
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-12">
										<Github className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
										<p className="text-muted-foreground">No GitHub projects available. Please check your API configuration.</p>
									</div>
								)}
							</div>

							{/* Dribbble Shots */}
							<div>
								<div className="flex items-center gap-3 mb-8">
									<div className="p-2 bg-pink-500 rounded-lg">
										<Dribbble className="w-5 h-5 text-white" />
									</div>
									<div>
										<h3 className="text-2xl font-bold">Design Explorations</h3>
										<p className="text-muted-foreground">Visual design concepts and UI explorations</p>
									</div>
								</div>
								{shots.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
										{shots.map((shot) => (
											<div key={shot.id} className="relative flex flex-col gap-3 p-4 leading-5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
												{/* Shot Image */}
												<div className="aspect-video w-full bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-md overflow-hidden relative">
													{shot.images?.hidpi ? (
														<OptimizedImage src={shot.images.hidpi} alt={shot.title} width={400} height={300} className="w-full h-full object-cover" />
													) : (
														<div className="absolute inset-0 flex items-center justify-center">
															<div className="w-8 h-8 rounded bg-pink-200 dark:bg-pink-800 flex items-center justify-center">
																<Dribbble className="w-4 h-4 text-pink-600 dark:text-pink-400" />
															</div>
														</div>
													)}
												</div>

												{/* Main content */}
												<div className="flex flex-row items-center gap-4">
													<div className="flex min-w-0 flex-1 flex-col justify-between gap-0.5">
														<Link href={shot.html_url} target="_blank" className="min-w-0 no-underline hover:underline font-medium text-gray-900 dark:text-gray-100 h-5 truncate w-fit max-w-full">
															{shot.title}
														</Link>
														<Link href={shot.html_url} target="_blank" className="min-w-0 no-underline hover:underline text-gray-600 dark:text-gray-400 h-5 truncate leading-5 max-w-full flex items-center gap-1">
															dribbble.com
															<ExternalLink className="w-3 h-3" />
														</Link>
													</div>
												</div>

												{/* Dribbble info */}
												<div className="flex h-5 w-fit items-center">
													<Link href={shot.html_url} target="_blank" className="flex min-w-0 flex-none flex-row items-center gap-0.5 rounded-full bg-pink-100 dark:bg-pink-900/30 p-0.5 pr-1.5 w-fit hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors">
														<Dribbble className="w-3 h-3 m-0.5 shrink-0 text-pink-600" />
														<span className="text-xs truncate font-medium text-pink-700 dark:text-pink-400">Dribbble Shot</span>
													</Link>
												</div>

												{/* Description */}
												<p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-5">{stripHtml(shot.description || "")}</p>

												{/* Stats */}
												<div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
													<div className="flex items-center gap-1">
														<Eye className="w-3 h-3" />
														<span>{shot.views_count?.toLocaleString() || 0}</span>
													</div>
													<div className="flex items-center gap-1">
														<Heart className="w-3 h-3" />
														<span>{shot.likes_count?.toLocaleString() || 0}</span>
													</div>
													{shot.comments_count !== undefined && (
														<div className="flex items-center gap-1">
															<MessageCircle className="w-3 h-3" />
															<span>{shot.comments_count}</span>
														</div>
													)}
													<div className="flex items-center gap-1">
														<Calendar className="w-3 h-3" />
														<span>{new Date(shot.published_at || shot.created_at).toLocaleDateString()}</span>
													</div>
												</div>

												{/* Tags */}
												{shot.tags && shot.tags.length > 0 && (
													<div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100 dark:border-gray-800">
														{shot.tags.slice(0, 4).map((tag: string) => (
															<span key={tag} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
																{tag}
															</span>
														))}
														{shot.tags.length > 4 && <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">+{shot.tags.length - 4}</span>}
													</div>
												)}
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-12">
										<Dribbble className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
										<p className="text-muted-foreground">No Dribbble shots available. Please check your API configuration.</p>
									</div>
								)}
							</div>

							{/* Figma Files */}
							<div>
								<div className="flex items-center gap-3 mb-8">
									<div className="p-2 bg-purple-500 rounded-lg">
										<Figma className="w-5 h-5 text-white" />
									</div>
									<div>
										<h3 className="text-2xl font-bold">Design Systems</h3>
										<p className="text-muted-foreground">Component libraries and design system documentation</p>
									</div>
								</div>
								{figmaFiles.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
										{figmaFiles.map((file) => (
											<div key={file.key} className="relative flex flex-col gap-3 p-4 leading-5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-950 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
												{/* File Image */}
												<div className="aspect-video w-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-md overflow-hidden relative">
													{file.thumbnail_url ? (
														<OptimizedImage src={file.thumbnail_url} alt={file.name} width={400} height={300} className="w-full h-full object-cover" />
													) : (
														<div className="absolute inset-0 flex items-center justify-center">
															<div className="w-8 h-8 rounded bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
																<Figma className="w-4 h-4 text-purple-600 dark:text-purple-400" />
															</div>
														</div>
													)}
													{/* Status indicator */}
													{file.status && (
														<div className="absolute top-2 right-2">
															<div className={`w-3 h-3 rounded-full ${file.status === "Active" ? "bg-green-500" : file.status === "Published" ? "bg-blue-500" : "bg-gray-500"}`}></div>
														</div>
													)}
												</div>

												{/* Main content */}
												<div className="flex flex-row items-center gap-4">
													<div className="flex min-w-0 flex-1 flex-col justify-between gap-0.5">
														<Link href={`https://www.figma.com/file/${file.key}`} target="_blank" className="min-w-0 no-underline hover:underline font-medium text-gray-900 dark:text-gray-100 h-5 truncate w-fit max-w-full">
															{file.name}
														</Link>
														<Link href={`https://www.figma.com/file/${file.key}`} target="_blank" className="min-w-0 no-underline hover:underline text-gray-600 dark:text-gray-400 h-5 truncate leading-5 max-w-full flex items-center gap-1">
															figma.com
															<ExternalLink className="w-3 h-3" />
														</Link>
													</div>
												</div>

												{/* Figma info */}
												<div className="flex h-5 w-fit items-center">
													<Link href={`https://www.figma.com/file/${file.key}`} target="_blank" className="flex min-w-0 flex-none flex-row items-center gap-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 p-0.5 pr-1.5 w-fit hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
														<Figma className="w-3 h-3 m-0.5 shrink-0 text-purple-600" />
														<span className="text-xs truncate font-medium text-purple-700 dark:text-purple-400">Figma File</span>
													</Link>
												</div>

												{/* Description */}
												<p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-5">{file.description}</p>

												{/* Stats */}
												<div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
													{file.components && (
														<div className="flex items-center gap-1">
															<Layers className="w-3 h-3" />
															<span>{file.components} components</span>
														</div>
													)}
													{file.collaborators && (
														<div className="flex items-center gap-1">
															<Users className="w-3 h-3" />
															<span>{file.collaborators}</span>
														</div>
													)}
													<div className="flex items-center gap-1">
														<Calendar className="w-3 h-3" />
														<span>{new Date(file.last_modified).toLocaleDateString()}</span>
													</div>
												</div>

												{/* Version and status */}
												{(file.version || file.status) && (
													<div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
														{file.version && <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">v{file.version}</span>}
														{file.status && <span className={`text-xs px-2 py-1 rounded text-white ${file.status === "Active" ? "bg-green-600" : file.status === "Published" ? "bg-blue-600" : "bg-gray-600"}`}>{file.status}</span>}
													</div>
												)}
											</div>
										))}
									</div>
								) : (
									<div className="text-center py-12">
										<Figma className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
										<p className="text-muted-foreground">No Figma files available. Please check your API configuration.</p>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</section>

			{/* Call to Action */}
			<section className="py-24 bg-gray-50 dark:bg-gray-900/50">
				<div className="container mx-auto px-4 text-center">
					<div className="max-w-3xl mx-auto">
						<h2 className="text-3xl font-bold mb-6">Ready to Turn Your Idea Into Reality?</h2>
						<p className="text-lg text-muted-foreground mb-8">These concepts represent just the beginning. If you have a business idea that needs design exploration, user experience research, or frontend development, let's collaborate to bring it to life.</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button asChild size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold shadow-lg">
								<Link href="/work-with-me">
									<Calendar className="w-4 h-4 mr-2" />
									Work With Me
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline" className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
								<Link href="/contact">
									<Mail className="w-4 h-4 mr-2" />
									Get In Touch
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
