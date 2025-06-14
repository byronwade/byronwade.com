"use client";

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Wrench, Code, Zap, Shield, Users, CheckCircle, Star, Award, TrendingUp, Smartphone, Globe, Database, Palette, Search, Settings, Droplets, Home, Phone, Calendar, MapPin, BadgeCheck, ExternalLink, Github, Linkedin, Twitter } from "lucide-react";
import { OptimizedImage } from "@/components/optimized-image";

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
		role: "Property Manager, Jasper",
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
	{ location: "Jasper, GA", services: "Full Plumbing & Digital Services", icon: MapPin },
	{ location: "Worldwide", services: "Digital Services & Virtual Consultations", icon: Globe },
];

const HomePage = () => {
	return (
		<div className="min-h-screen">
			{/* Modern Hero Section with Bento Grid */}
			<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
					{/* Main Hero Content */}
					<div className="text-center mb-16">
						<div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-400/10 text-yellow-600 border border-yellow-400/20 mb-8">
							<Zap className="w-4 h-4 mr-2" />
							Available for Projects
						</div>

						<h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
							<span className="block text-foreground">From Code to</span>
							<span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">Copper</span>
						</h1>

						<p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">Expert craftsmanship for your digital presence and home infrastructure. Delivering high-performance web solutions and reliable plumbing services.</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
							<Button asChild size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-8 py-4 text-lg">
								<Link href="/contact">
									Start Your Project
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg" className="border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600 px-8 py-4 text-lg">
								<Link href="/portfolio">
									View My Work
									<ExternalLink className="ml-2 h-5 w-5" />
								</Link>
							</Button>
						</div>
					</div>

					{/* Enhanced Bento Grid Layout */}
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto">
						{/* Hero Feature Card - Digital Services */}
						<Card className="md:col-span-2 lg:col-span-3 lg:row-span-3 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/30 border-blue-200/50 dark:border-blue-800/50 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
							{/* Subtle background pattern */}
							<div className="absolute inset-0 opacity-5 dark:opacity-10">
								<div className="absolute top-4 right-4 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
								<div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-600 rounded-full blur-2xl"></div>
							</div>
							<CardHeader className="pb-4 relative z-10">
								<div className="flex items-center gap-3 mb-6">
									<div className="p-4 bg-blue-600/10 rounded-2xl group-hover:bg-blue-600/20 transition-all duration-300 group-hover:scale-110">
										<Code className="w-8 h-8 text-blue-600" />
									</div>
									<div>
										<CardTitle className="text-2xl font-bold">Digital Solutions</CardTitle>
										<p className="text-sm text-muted-foreground">Modern Web Development</p>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-6 relative z-10">
								<p className="text-muted-foreground leading-relaxed">Crafting high-performance web applications, e-commerce platforms, and digital experiences that convert visitors into customers and drive measurable business growth.</p>

								{/* Tech Stack Icons */}
								<div className="flex flex-wrap gap-2 mb-4">
									<span className="px-3 py-1 bg-blue-600/10 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">Next.js</span>
									<span className="px-3 py-1 bg-purple-600/10 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">React</span>
									<span className="px-3 py-1 bg-green-600/10 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">TypeScript</span>
									<span className="px-3 py-1 bg-yellow-600/10 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">Tailwind</span>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div className="flex items-center gap-2 text-sm">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<span>E-commerce Solutions</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<span>SEO Optimization</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<span>Performance Audits</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<span>UI/UX Design</span>
									</div>
								</div>

								<div className="flex gap-3 pt-4">
									<Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
										<Link href="/development">
											View Projects
											<ArrowRight className="ml-2 h-4 w-4" />
										</Link>
									</Button>
									<Button asChild variant="outline" size="sm" className="border-blue-600/50 hover:bg-blue-50 dark:hover:bg-blue-950/20">
										<Link href="/portfolio">
											<ExternalLink className="h-4 w-4" />
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>

						{/* Stats Cards Row */}
						<Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-950/20 border-green-200/50 dark:border-green-800/50 hover:shadow-xl transition-all duration-300 group">
							<CardContent className="p-6 text-center relative overflow-hidden">
								<div className="absolute top-0 right-0 w-16 h-16 bg-green-400/10 rounded-full blur-xl"></div>
								<div className="relative z-10">
									<div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">150+</div>
									<div className="text-sm text-muted-foreground font-medium">Projects</div>
									<div className="text-xs text-green-600 mt-1">Completed</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/30 dark:to-violet-950/20 border-purple-200/50 dark:border-purple-800/50 hover:shadow-xl transition-all duration-300 group">
							<CardContent className="p-6 text-center relative overflow-hidden">
								<div className="absolute top-0 right-0 w-16 h-16 bg-purple-400/10 rounded-full blur-xl"></div>
								<div className="relative z-10">
									<div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">8+</div>
									<div className="text-sm text-muted-foreground font-medium">Years</div>
									<div className="text-xs text-purple-600 mt-1">Experience</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950/30 dark:to-amber-950/20 border-yellow-200/50 dark:border-yellow-800/50 hover:shadow-xl transition-all duration-300 group">
							<CardContent className="p-6 text-center relative overflow-hidden">
								<div className="absolute top-0 right-0 w-16 h-16 bg-yellow-400/10 rounded-full blur-xl"></div>
								<div className="relative z-10">
									<div className="text-4xl font-bold text-yellow-600 mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
									<div className="text-sm text-muted-foreground font-medium">Support</div>
									<div className="text-xs text-yellow-600 mt-1">Available</div>
								</div>
							</CardContent>
						</Card>

						{/* Plumbing Services Card */}
						<Card className="md:col-span-2 lg:col-span-3 lg:row-span-2 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/30 dark:via-red-950/20 dark:to-pink-950/30 border-orange-200/50 dark:border-orange-800/50 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
							{/* Subtle background pattern */}
							<div className="absolute inset-0 opacity-5 dark:opacity-10">
								<div className="absolute top-4 left-4 w-28 h-28 bg-orange-600 rounded-full blur-3xl"></div>
								<div className="absolute bottom-4 right-4 w-20 h-20 bg-red-600 rounded-full blur-2xl"></div>
							</div>
							<CardHeader className="pb-4 relative z-10">
								<div className="flex items-center gap-3 mb-4">
									<div className="p-4 bg-orange-600/10 rounded-2xl group-hover:bg-orange-600/20 transition-all duration-300 group-hover:scale-110">
										<Wrench className="w-8 h-8 text-orange-600" />
									</div>
									<div>
										<CardTitle className="text-2xl font-bold">Plumbing Services</CardTitle>
										<p className="text-sm text-muted-foreground">Professional & Reliable</p>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4 relative z-10">
								<p className="text-muted-foreground leading-relaxed">Expert plumbing and septic services across Santa Cruz, CA and Jasper, GA. From emergency repairs to complete system installations.</p>

								{/* Service Areas */}
								<div className="flex flex-wrap gap-2 mb-4">
									<span className="px-3 py-1 bg-orange-600/10 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">Santa Cruz, CA</span>
									<span className="px-3 py-1 bg-red-600/10 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">Jasper, GA</span>
									<span className="px-3 py-1 bg-pink-600/10 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium">Emergency Service</span>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div className="flex items-center gap-2 text-sm">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<span>Septic Systems</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<span>Licensed & Insured</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<span>Virtual Consultations</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<div className="w-2 h-2 bg-green-500 rounded-full"></div>
										<span>Upfront Pricing</span>
									</div>
								</div>

								<Button asChild className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-4">
									<Link href="/plumbing-santa-cruz">
										View Services
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</CardContent>
						</Card>

						{/* Enhanced Portfolio Showcase */}
						<Card className="md:col-span-1 lg:col-span-2 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-cyan-950/30 border-emerald-200/50 dark:border-emerald-800/50 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
							{/* Animated background elements */}
							<div className="absolute inset-0 opacity-20 dark:opacity-10">
								<div className="absolute top-2 right-2 w-16 h-16 bg-emerald-500 rounded-full blur-2xl animate-pulse"></div>
								<div className="absolute bottom-2 left-2 w-12 h-12 bg-teal-500 rounded-full blur-xl animate-pulse delay-1000"></div>
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-cyan-500/30 rounded-full blur-3xl animate-pulse delay-500"></div>
							</div>

							<CardContent className="p-6 text-center relative z-10">
								{/* Header with icon and title */}
								<div className="flex items-center justify-center mb-6">
									<div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
										<Palette className="w-7 h-7 text-white" />
									</div>
								</div>

								<div className="text-center mb-6">
									<h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">My Portfolio</h3>
									<p className="text-sm text-muted-foreground">Explore my latest creative work</p>
								</div>

								{/* Portfolio stats/features */}
								<div className="grid grid-cols-2 gap-3 mb-6">
									<div className="flex items-center gap-2 text-xs">
										<div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
										<span className="text-muted-foreground">Web Apps</span>
									</div>
									<div className="flex items-center gap-2 text-xs">
										<div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse delay-300"></div>
										<span className="text-muted-foreground">UI/UX Design</span>
									</div>
									<div className="flex items-center gap-2 text-xs">
										<div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-600"></div>
										<span className="text-muted-foreground">Mobile Apps</span>
									</div>
									<div className="flex items-center gap-2 text-xs">
										<div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-900"></div>
										<span className="text-muted-foreground">Branding</span>
									</div>
								</div>

								<Button asChild size="sm" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 group-hover:scale-105 transition-all duration-300 shadow-lg">
									<Link href="/portfolio">
										<ExternalLink className="w-4 h-4 mr-2 group-hover:animate-bounce" />
										View Portfolio
									</Link>
								</Button>
							</CardContent>
						</Card>

						{/* Enhanced Contact/Get Started Card */}
						<Card className="md:col-span-1 lg:col-span-2 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/30 border-amber-200/50 dark:border-amber-800/50 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
							{/* Animated background elements */}
							<div className="absolute inset-0 opacity-20 dark:opacity-10">
								<div className="absolute top-2 right-2 w-16 h-16 bg-amber-500 rounded-full blur-2xl animate-pulse"></div>
								<div className="absolute bottom-2 left-2 w-12 h-12 bg-yellow-500 rounded-full blur-xl animate-pulse delay-1000"></div>
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-orange-500/30 rounded-full blur-3xl animate-pulse delay-500"></div>
							</div>

							<CardContent className="p-6 text-center relative z-10">
								{/* Header with icon and title */}
								<div className="flex items-center justify-center mb-6">
									<div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
										<Phone className="w-7 h-7 text-white" />
									</div>
								</div>

								<div className="text-center mb-6">
									<h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">Let's Get Started</h3>
									<p className="text-sm text-muted-foreground">Ready to bring your vision to life?</p>
								</div>

								{/* Contact features */}
								<div className="grid grid-cols-2 gap-3 mb-6">
									<div className="flex items-center gap-2 text-xs">
										<div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
										<span className="text-muted-foreground">Free Consultation</span>
									</div>
									<div className="flex items-center gap-2 text-xs">
										<div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-300"></div>
										<span className="text-muted-foreground">Quick Response</span>
									</div>
									<div className="flex items-center gap-2 text-xs">
										<div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-600"></div>
										<span className="text-muted-foreground">Custom Solutions</span>
									</div>
									<div className="flex items-center gap-2 text-xs">
										<div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-900"></div>
										<span className="text-muted-foreground">Fair Pricing</span>
									</div>
								</div>

								<Button asChild size="sm" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0 group-hover:scale-105 transition-all duration-300 shadow-lg">
									<Link href="/contact">
										<ArrowRight className="w-4 h-4 mr-2 group-hover:animate-bounce" />
										Start Project
									</Link>
								</Button>
							</CardContent>
						</Card>

						{/* Enhanced Social Links/Connect Card */}
						<Card className="md:col-span-1 lg:col-span-2 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/30 border-indigo-200/50 dark:border-indigo-800/50 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
							{/* Animated background elements */}
							<div className="absolute inset-0 opacity-20 dark:opacity-10">
								<div className="absolute top-2 right-2 w-16 h-16 bg-indigo-500 rounded-full blur-2xl animate-pulse"></div>
								<div className="absolute bottom-2 left-2 w-12 h-12 bg-purple-500 rounded-full blur-xl animate-pulse delay-1000"></div>
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-500"></div>
							</div>

							<CardContent className="p-6 relative z-10">
								{/* Header with icon and title */}
								<div className="flex items-center justify-center mb-6">
									<div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
										<Users className="w-7 h-7 text-white" />
									</div>
								</div>

								<div className="text-center mb-6">
									<h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Let's Connect</h3>
									<p className="text-sm text-muted-foreground">Follow my journey & connect with me</p>
								</div>

								{/* Social links with enhanced styling */}
								<div className="grid grid-cols-3 gap-3 mb-4">
									<Button size="sm" variant="outline" asChild className="group/btn p-3 h-auto flex-col gap-2 hover:bg-gradient-to-br hover:from-gray-900 hover:to-black hover:text-white dark:hover:from-gray-100 dark:hover:to-white dark:hover:text-black border-gray-200 dark:border-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
										<Link href="https://github.com/byronwade" target="_blank">
											<Github className="w-5 h-5 group-hover/btn:animate-bounce" />
											<span className="text-xs font-medium">GitHub</span>
										</Link>
									</Button>
									<Button size="sm" variant="outline" asChild className="group/btn p-3 h-auto flex-col gap-2 hover:bg-gradient-to-br hover:from-blue-600 hover:to-blue-700 hover:text-white border-blue-200 dark:border-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
										<Link href="https://linkedin.com/in/byronwade" target="_blank">
											<Linkedin className="w-5 h-5 group-hover/btn:animate-bounce" />
											<span className="text-xs font-medium">LinkedIn</span>
										</Link>
									</Button>
									<Button size="sm" variant="outline" asChild className="group/btn p-3 h-auto flex-col gap-2 hover:bg-gradient-to-br hover:from-sky-400 hover:to-blue-500 hover:text-white border-sky-200 dark:border-sky-700 transition-all duration-300 hover:scale-105 hover:shadow-lg">
										<Link href="https://twitter.com/byronwade" target="_blank">
											<Twitter className="w-5 h-5 group-hover/btn:animate-bounce" />
											<span className="text-xs font-medium">Twitter</span>
										</Link>
									</Button>
								</div>

								{/* Additional engagement elements */}
								<div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
									<div className="flex items-center gap-1">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<span>Available for projects</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Rest of existing content with improved spacing and modern cards */}
			<section className="py-24 bg-secondary/10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
							Why Choose <span className="text-yellow-600">Byron Wade</span>?
						</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Combining technical expertise with hands-on craftsmanship to deliver solutions that work.</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{stats.map((stat, index) => (
							<Card key={index} className="text-center bg-background/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
								<CardContent className="p-8">
									<div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-yellow-600/10 rounded-full">
										<stat.icon className="w-8 h-8 text-yellow-600" />
									</div>
									<div className="text-4xl font-bold mb-2 text-foreground">{stat.number}</div>
									<div className="text-muted-foreground font-medium">{stat.label}</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Services Overview */}
			<section id="services" className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-20">
						<h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">Two Paths. One Standard of Excellence.</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">Whether your project involves pixels or pipes, I bring the same meticulous attention to detail and commitment to lasting solutions. Every project is approached with professional expertise, clear communication, and a focus on exceeding expectations.</p>
					</div>

					{/* Digital Services */}
					<div className="mb-24">
						<div className="text-center mb-16">
							<div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-600/10 rounded-full mb-6">
								<Code className="w-10 h-10 text-yellow-600" />
							</div>
							<h3 className="text-3xl font-bold mb-4">Digital Craftsmanship</h3>
							<p className="text-muted-foreground max-w-2xl mx-auto text-lg">Cutting-edge web development and digital marketing solutions that drive business growth, enhance user experience, and deliver measurable results for your bottom line.</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
							{digitalServices.map((service, index) => (
								<Card key={index} className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30 group">
									<CardHeader>
										<div className="flex items-center gap-4 mb-2">
											<div className="bg-yellow-600/10 p-3 rounded-lg group-hover:bg-yellow-600/20 transition-colors">
												<service.icon className="w-6 h-6 text-yellow-600" />
											</div>
											<CardTitle className="text-xl">{service.title}</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
										<ul className="space-y-3">
											{service.features.map((feature, idx) => (
												<li key={idx} className="flex items-center text-sm">
													<CheckCircle className="w-4 h-4 text-yellow-600 mr-3 flex-shrink-0" />
													<span className="text-muted-foreground">{feature}</span>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							))}
						</div>
						<div className="text-center mt-12">
							<Button asChild size="lg">
								<Link href="/portfolio">Explore Digital Services</Link>
							</Button>
						</div>
					</div>

					{/* Plumbing Services */}
					<div className="bg-gradient-to-br from-secondary/20 to-yellow-50/20 rounded-3xl p-12 border border-yellow-600/10">
						<div className="text-center mb-16">
							<div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-600/10 rounded-full mb-6">
								<Wrench className="w-10 h-10 text-yellow-600" />
							</div>
							<h3 className="text-3xl font-bold mb-4">Reliable Home Services</h3>
							<p className="text-muted-foreground max-w-2xl mx-auto text-lg">Licensed and insured plumbing and septic services for Santa Cruz, CA and Jasper, GA. Professional solutions that protect your home and provide lasting peace of mind.</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
							{plumbingServices.map((service, index) => (
								<Card key={index} className="bg-background/80 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30 group backdrop-blur-sm">
									<CardHeader>
										<div className="flex items-center gap-4 mb-2">
											<div className="bg-yellow-600/10 p-3 rounded-lg group-hover:bg-yellow-600/20 transition-colors">
												<service.icon className="w-6 h-6 text-yellow-600" />
											</div>
											<CardTitle className="text-xl">{service.title}</CardTitle>
										</div>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
										<ul className="space-y-3">
											{service.features.map((feature, idx) => (
												<li key={idx} className="flex items-center text-sm">
													<CheckCircle className="w-4 h-4 text-yellow-600 mr-3 flex-shrink-0" />
													<span className="text-muted-foreground">{feature}</span>
												</li>
											))}
										</ul>
									</CardContent>
								</Card>
							))}
						</div>
						<div className="text-center mt-12">
							<Button asChild size="lg" variant="outline">
								<Link href="/our-work">Explore Plumbing Services</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* How I Work Section */}
			<section className="py-24 bg-gradient-to-br from-background to-secondary/20">
				<div className="container mx-auto px-4">
					<div className="text-center mb-20">
						<h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">How I Work</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Whether it&apos;s a digital project or plumbing service, I follow a proven process that ensures quality results, clear communication, and complete satisfaction.</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
						{/* Digital Process */}
						<div>
							<div className="text-center mb-12">
								<div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600/10 rounded-full mb-4">
									<Code className="w-8 h-8 text-yellow-600" />
								</div>
								<h3 className="text-2xl font-bold mb-2">Digital Development Process</h3>
								<p className="text-muted-foreground">Strategic approach to web development and digital solutions</p>
							</div>
							<div className="space-y-8">
								{digitalProcess.map((step, index) => (
									<div key={index} className="flex gap-6">
										<div className="flex flex-col items-center">
											<div className="bg-yellow-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">{step.step}</div>
											{index < digitalProcess.length - 1 && <div className="w-0.5 h-16 bg-yellow-600/20 mt-4" />}
										</div>
										<div className="flex-1 pb-8">
											<div className="flex items-center gap-3 mb-3">
												<step.icon className="w-5 h-5 text-yellow-600" />
												<h4 className="text-xl font-semibold">{step.title}</h4>
											</div>
											<p className="text-muted-foreground leading-relaxed">{step.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Plumbing Process */}
						<div>
							<div className="text-center mb-12">
								<div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600/10 rounded-full mb-4">
									<Wrench className="w-8 h-8 text-yellow-600" />
								</div>
								<h3 className="text-2xl font-bold mb-2">Plumbing Service Process</h3>
								<p className="text-muted-foreground">Professional approach to plumbing and septic services</p>
							</div>
							<div className="space-y-8">
								{plumbingProcess.map((step, index) => (
									<div key={index} className="flex gap-6">
										<div className="flex flex-col items-center">
											<div className="bg-yellow-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">{step.step}</div>
											{index < plumbingProcess.length - 1 && <div className="w-0.5 h-16 bg-yellow-600/20 mt-4" />}
										</div>
										<div className="flex-1 pb-8">
											<div className="flex items-center gap-3 mb-3">
												<step.icon className="w-5 h-5 text-yellow-600" />
												<h4 className="text-xl font-semibold">{step.title}</h4>
											</div>
											<p className="text-muted-foreground leading-relaxed">{step.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Philosophy Section */}
			<section className="py-24 bg-gradient-to-br from-secondary/20 to-background">
				<div className="container mx-auto px-4 text-center max-w-4xl">
					<h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-8">A Philosophy of Quality</h2>
					<div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground mb-12">
						<p className="text-xl leading-relaxed">You might wonder what a web developer and a plumber have in common. For me, the answer is simple: an unwavering commitment to quality and a passion for solving complex problems. Whether I&apos;m architecting a scalable web application or designing a durable plumbing system, my focus is on building things that last.</p>
						<p className="text-lg">I believe in meticulous planning, transparent communication, and leaving every client with a solution they can trust for years to come. That&apos;s the standard I bring to every project, from code to copper.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="bg-yellow-600/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<Shield className="w-8 h-8 text-yellow-600" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Quality First</h3>
							<p className="text-muted-foreground">Every project meets the highest standards of craftsmanship and reliability.</p>
						</div>
						<div className="text-center">
							<div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<Users className="w-8 h-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Client Partnership</h3>
							<p className="text-muted-foreground">Transparent communication and collaboration throughout every project.</p>
						</div>
						<div className="text-center">
							<div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<Zap className="w-8 h-8 text-primary" />
							</div>
							<h3 className="text-xl font-semibold mb-2">Built to Last</h3>
							<p className="text-muted-foreground">Solutions designed for longevity, scalability, and future growth.</p>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">What Clients Say</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">Real feedback from real clients across both digital and plumbing projects. See the impact of quality work and professional service.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{testimonials.map((testimonial, index) => (
							<Card key={index} className="bg-secondary/50 border-border/30 hover:shadow-lg transition-shadow">
								<CardHeader>
									<div className="flex items-center space-x-1 mb-3">
										{[...Array(testimonial.rating)].map((_, i) => (
											<Star key={i} className="w-4 h-4 fill-yellow-600 text-yellow-600" />
										))}
									</div>
									<CardTitle className="text-lg">{testimonial.name}</CardTitle>
									<div className="text-sm text-muted-foreground">
										<p>{testimonial.role}</p>
										<p className="text-yellow-600 font-medium mt-1">{testimonial.project}</p>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground italic mb-4">&ldquo;{testimonial.content}&rdquo;</p>
									<div className="bg-yellow-50 dark:bg-yellow-600/10 p-3 rounded-lg border-l-4 border-yellow-600">
										<p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{testimonial.result}</p>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Service Areas */}
			<section className="py-24 bg-secondary/30">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">Where I Work</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">Serving clients locally and globally with tailored solutions for every need.</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						{serviceAreas.map((area, index) => (
							<Card key={index} className="bg-background border-border/30 hover:shadow-lg transition-shadow text-center">
								<CardHeader>
									<div className="bg-yellow-600/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
										<area.icon className="w-8 h-8 text-yellow-600" />
									</div>
									<CardTitle className="text-xl">{area.location}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground">{area.services}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>
		</div>
	);
};

export default HomePage;
