import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/components/ui/link";
import { PenTool, Palette, Smartphone, Milestone, Search, Code, ShieldCheck, Users, ArrowRight, CheckCircle, Star, Figma, Monitor, Layers, Lightbulb, Zap, Target, Award, TrendingUp, Clock, DollarSign, Eye, Heart, MessageCircle, Download, Play, ExternalLink, Sparkles, Globe, Brush, Layout, MousePointer, Tablet, Calendar } from "lucide-react";
import HeroPages from "@/components/sections/hero-pages";
import PageHeader from "@/components/page-header";
import CodedText from "@/components/ui/coded-text";
import Image from "next/image";

const designServices = [
	{
		icon: Figma,
		title: "Figma Design Systems",
		description: "Comprehensive design systems that scale with your business. Component libraries, design tokens, and documentation.",
		features: ["Component Libraries", "Design Tokens", "Auto-Layout Systems", "Documentation"],
		price: "From $2,500",
		duration: "2-4 weeks",
	},
	{
		icon: Palette,
		title: "UI/UX Design",
		description: "Beautiful, intuitive interfaces that drive engagement and conversions across all platforms.",
		features: ["User Research", "Wireframing", "Visual Design", "Usability Testing"],
		price: "From $1,800",
		duration: "3-5 weeks",
	},
	{
		icon: Smartphone,
		title: "Responsive Web Design",
		description: "Pixel-perfect designs that adapt seamlessly across desktop, tablet, and mobile devices.",
		features: ["Mobile-First Design", "Breakpoint Planning", "Touch Interactions", "Performance Optimization"],
		price: "From $1,500",
		duration: "2-3 weeks",
	},
	{
		icon: PenTool,
		title: "Branding & Identity",
		description: "Complete brand identity systems that communicate your values and connect with your audience.",
		features: ["Logo Design", "Brand Guidelines", "Color Systems", "Typography"],
		price: "From $3,000",
		duration: "3-6 weeks",
	},
	{
		icon: Layers,
		title: "Prototyping & Animation",
		description: "Interactive prototypes with micro-animations that bring your designs to life.",
		features: ["Interactive Prototypes", "Micro-animations", "User Flow Testing", "Stakeholder Demos"],
		price: "From $1,200",
		duration: "1-2 weeks",
	},
	{
		icon: Monitor,
		title: "Design Consultation",
		description: "Strategic design guidance and expert consultation for your existing projects.",
		features: ["Design Audits", "Strategy Sessions", "Team Training", "Best Practices"],
		price: "From $150/hr",
		duration: "Flexible",
	},
];

const caseStudies = [
	{
		title: "E-commerce Platform Redesign",
		client: "TechStart Inc.",
		challenge: "Low conversion rates and poor mobile experience",
		solution: "Complete UX overhaul with mobile-first approach",
		results: [
			{ metric: "Conversion Rate", improvement: "+340%" },
			{ metric: "Mobile Usage", improvement: "+180%" },
			{ metric: "User Satisfaction", improvement: "+95%" },
		],
		image: "/api/placeholder/600/400",
		tags: ["E-commerce", "Mobile Design", "UX Research"],
		duration: "6 weeks",
		testimonial: "Byron transformed our entire user experience. The results speak for themselves.",
	},
	{
		title: "SaaS Dashboard Design System",
		client: "DataFlow Pro",
		challenge: "Inconsistent UI across multiple products",
		solution: "Comprehensive design system in Figma",
		results: [
			{ metric: "Development Speed", improvement: "+250%" },
			{ metric: "Design Consistency", improvement: "+100%" },
			{ metric: "User Onboarding", improvement: "+160%" },
		],
		image: "/api/placeholder/600/400",
		tags: ["Design Systems", "SaaS", "Figma"],
		duration: "8 weeks",
		testimonial: "The design system revolutionized how our team works. Incredible attention to detail.",
	},
	{
		title: "Mobile App UI/UX",
		client: "HealthTech Solutions",
		challenge: "Complex medical data visualization",
		solution: "Intuitive mobile interface with clear data hierarchy",
		results: [
			{ metric: "User Engagement", improvement: "+220%" },
			{ metric: "Task Completion", improvement: "+190%" },
			{ metric: "App Store Rating", improvement: "+85%" },
		],
		image: "/api/placeholder/600/400",
		tags: ["Mobile App", "Healthcare", "Data Visualization"],
		duration: "10 weeks",
		testimonial: "Byron made complex medical data accessible and beautiful. Outstanding work.",
	},
];

const pricingTiers = [
	{
		name: "Essential",
		price: "$1,500",
		description: "Perfect for small projects and startups",
		features: ["UI/UX Design (up to 5 screens)", "Mobile-responsive layouts", "Basic prototyping", "2 revision rounds", "Figma file delivery", "Email support"],
		popular: false,
		cta: "Get Started",
	},
	{
		name: "Professional",
		price: "$3,500",
		description: "Ideal for growing businesses",
		features: ["Complete design system", "UI/UX Design (up to 15 screens)", "Advanced prototyping", "User research & testing", "4 revision rounds", "Developer handoff", "Priority support", "3 months of updates"],
		popular: true,
		cta: "Most Popular",
	},
	{
		name: "Enterprise",
		price: "Custom",
		description: "For large-scale projects",
		features: ["Unlimited screens & components", "Complete brand identity", "Advanced design system", "User research & strategy", "Unlimited revisions", "Team training", "Dedicated support", "12 months of updates", "Development partnership"],
		popular: false,
		cta: "Contact Us",
	},
];

const testimonials = [
	{
		name: "Sarah Chen",
		role: "Product Manager",
		company: "TechStart Inc.",
		content: "Byron's design work transformed our product completely. The attention to detail and user experience expertise is unmatched.",
		rating: 5,
		image: "/api/placeholder/60/60",
	},
	{
		name: "Michael Rodriguez",
		role: "CEO",
		company: "DataFlow Pro",
		content: "The design system Byron created saved us months of development time. Incredible ROI and beautiful results.",
		rating: 5,
		image: "/api/placeholder/60/60",
	},
	{
		name: "Emily Johnson",
		role: "Founder",
		company: "HealthTech Solutions",
		content: "Working with Byron was seamless. He understood our complex requirements and delivered beyond expectations.",
		rating: 5,
		image: "/api/placeholder/60/60",
	},
];

const whyChooseMe = [
	{
		icon: Figma,
		title: "Figma Expert",
		description: "Advanced Figma skills with auto-layout, components, variables, and design systems that scale.",
		stat: "500+ Figma projects",
	},
	{
		icon: Users,
		title: "User-Centered Design",
		description: "Research-driven design process focused on user needs, behaviors, and business goals.",
		stat: "98% user satisfaction",
	},
	{
		icon: ShieldCheck,
		title: "Development-Ready",
		description: "Designs optimized for development with detailed specs and seamless handoff process.",
		stat: "100% implementation accuracy",
	},
	{
		icon: Zap,
		title: "Fast Delivery",
		description: "Efficient workflow and proven processes ensure quick turnaround without compromising quality.",
		stat: "2-week average delivery",
	},
];

const designProcess = [
	{
		icon: Search,
		title: "Discovery & Research",
		description: "Deep dive into your brand, users, and goals. Competitive analysis and user research.",
		deliverables: ["User Personas", "Competitive Analysis", "Project Brief"],
		duration: "3-5 days",
		step: "01",
	},
	{
		icon: PenTool,
		title: "Strategy & Planning",
		description: "Information architecture, user flows, and wireframing to establish the foundation.",
		deliverables: ["Site Map", "User Flows", "Wireframes"],
		duration: "5-7 days",
		step: "02",
	},
	{
		icon: Palette,
		title: "Visual Design",
		description: "High-fidelity designs with your brand identity, creating stunning visual experiences.",
		deliverables: ["Visual Designs", "Style Guide", "Component Library"],
		duration: "7-10 days",
		step: "03",
	},
	{
		icon: Play,
		title: "Prototyping",
		description: "Interactive prototypes to test user flows and demonstrate the final experience.",
		deliverables: ["Interactive Prototype", "Animation Specs", "User Testing"],
		duration: "3-5 days",
		step: "04",
	},
	{
		icon: Milestone,
		title: "Handoff & Support",
		description: "Developer-ready assets, documentation, and ongoing support for implementation.",
		deliverables: ["Design Specs", "Asset Export", "Developer Support"],
		duration: "2-3 days",
		step: "05",
	},
];

const stats = [
	{ number: "200+", label: "Projects Completed", icon: Award, trend: "+25%" },
	{ number: "50+", label: "Design Systems", icon: Layers, trend: "+40%" },
	{ number: "8+", label: "Years Experience", icon: Star, trend: "Growing" },
	{ number: "100%", label: "Client Satisfaction", icon: CheckCircle, trend: "Maintained" },
];

const tools = [
	{ name: "Figma", proficiency: 95, color: "#f24e1e" },
	{ name: "Sketch", proficiency: 85, color: "#fdad00" },
	{ name: "Adobe XD", proficiency: 80, color: "#ff61f6" },
	{ name: "Framer", proficiency: 75, color: "#0055ff" },
	{ name: "Principle", proficiency: 70, color: "#6200ee" },
	{ name: "InVision", proficiency: 85, color: "#ff3366" },
];

const faqItems = [
	{
		question: "What's included in a design system?",
		answer: "A comprehensive design system includes component libraries, design tokens (colors, typography, spacing), documentation, usage guidelines, and templates. Everything your team needs for consistent, scalable design.",
	},
	{
		question: "Do you handle development/coding?",
		answer: "I focus on design excellence and partner with trusted developers for implementation. I provide detailed specs and can connect you with reliable development partners who bring designs to life perfectly.",
	},
	{
		question: "How long does a typical project take?",
		answer: "Project timelines vary based on scope. Simple UI designs take 2-3 weeks, while comprehensive design systems take 6-8 weeks. I provide detailed timelines during our initial consultation.",
	},
	{
		question: "What's your design process like?",
		answer: "My process is collaborative and iterative: Discovery → Strategy → Design → Prototyping → Handoff. You're involved at every stage with regular check-ins and feedback sessions.",
	},
	{
		question: "Do you provide revisions?",
		answer: "Yes! All packages include multiple revision rounds. Essential includes 2 rounds, Professional includes 4 rounds, and Enterprise includes unlimited revisions to ensure perfect results.",
	},
	{
		question: "Can you work with existing brand guidelines?",
		answer: "Absolutely! I can work within your existing brand guidelines or help evolve and enhance them. I'm experienced in both creating new brand identities and working within established systems.",
	},
];

export default function DesignPage() {
	return (
		<>
			<PageHeader title="Design">
				<Link prefetch={true} href="https://www.figma.com" className="text-[#f24e1e] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Figma</CodedText>
				</Link>
				<Link prefetch={true} href="https://www.sketch.com" className="text-[#fdad00] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Sketch</CodedText>
				</Link>
				<Link prefetch={true} href="https://www.adobe.com/products/xd.html" className="text-[#ff61f6] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Adobe XD</CodedText>
				</Link>
				<Link prefetch={true} href="https://www.framer.com" className="text-[#05f] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Framer</CodedText>
				</Link>
				<Link prefetch={true} href="https://www.protopie.io" className="text-[#6200ee] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">ProtoPie</CodedText>
				</Link>
			</PageHeader>

			{/* Enhanced Hero Section */}
			<section className="relative min-h-[80vh] flex items-center justify-center">
				<div className="container mx-auto px-4">
					<div className="max-w-5xl mx-auto text-center">
						<div className="mb-8">
							<Badge variant="secondary" className="bg-yellow-600/10 border border-yellow-600/30 text-yellow-600 px-6 py-2 text-sm font-medium">
								<Figma className="w-4 h-4 mr-2" />
								Figma Design Specialist
							</Badge>
						</div>

						<h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
							Design Systems &<br />
							<span className="text-yellow-600 relative">
								User Experiences
								<div className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-600/30 rounded-full" />
							</span>
						</h1>

						<p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">I create beautiful, functional designs in Figma that drive results. From comprehensive design systems to stunning user interfaces, I focus on design excellence while partnering with trusted developers for seamless implementation.</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
							<Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-8 py-4 text-lg">
								<Sparkles className="w-5 h-5 mr-2" />
								Start Your Project
							</Button>
							<Button variant="outline" size="lg" className="border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600 px-8 py-4 text-lg">
								<Play className="w-5 h-5 mr-2" />
								View Portfolio
							</Button>
						</div>

						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
							<div className="text-center">
								<div className="text-3xl font-bold text-foreground mb-1">200+</div>
								<div className="text-sm text-muted-foreground">Projects</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-foreground mb-1">8+</div>
								<div className="text-sm text-muted-foreground">Years</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-foreground mb-1">50+</div>
								<div className="text-sm text-muted-foreground">Systems</div>
							</div>
							<div className="text-center">
								<div className="text-3xl font-bold text-foreground mb-1">100%</div>
								<div className="text-sm text-muted-foreground">Satisfaction</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Enhanced Stats Section */}
			<section className="py-20 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
						{stats.map((stat, index) => (
							<Card key={index} className="bg-background/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30 text-center p-6">
								<div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-600/10 rounded-lg">
									<stat.icon className="w-6 h-6 text-yellow-600" />
								</div>
								<div className="text-3xl font-bold mb-2 text-foreground">{stat.number}</div>
								<div className="text-muted-foreground font-medium text-sm mb-2">{stat.label}</div>
								<div className="flex items-center justify-center gap-1 text-xs text-yellow-600">
									<TrendingUp className="w-3 h-3" />
									<span>{stat.trend}</span>
								</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Enhanced Services Section */}
			<section id="services" className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">Design Services</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">Comprehensive design solutions that drive results and create exceptional user experiences.</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{designServices.map((service, index) => (
							<Card key={service.title} className="group bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30 overflow-hidden">
								<CardHeader className="pb-4">
									<div className="flex items-center gap-4 mb-4">
										<div className="bg-yellow-600/10 p-3 rounded-lg group-hover:bg-yellow-600/20 transition-colors">
											<service.icon className="w-6 h-6 text-yellow-600" />
										</div>
										<div className="flex-1">
											<CardTitle className="text-xl mb-1">{service.title}</CardTitle>
											<div className="flex items-center gap-4 text-sm text-muted-foreground">
												<div className="flex items-center gap-1">
													<DollarSign className="w-3 h-3" />
													<span>{service.price}</span>
												</div>
												<div className="flex items-center gap-1">
													<Clock className="w-3 h-3" />
													<span>{service.duration}</span>
												</div>
											</div>
										</div>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-muted-foreground leading-relaxed">{service.description}</p>
									<div className="space-y-2">
										<div className="text-sm font-medium text-foreground">What&apos;s included:</div>
										<ul className="space-y-1">
											{service.features.map((feature, idx) => (
												<li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
													<CheckCircle className="w-3 h-3 text-yellow-600 flex-shrink-0" />
													<span>{feature}</span>
												</li>
											))}
										</ul>
									</div>
									<Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold mt-4">
										Get Started
										<ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Case Studies Section */}
			<section className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">Case Studies</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">Real projects, real results. See how design transforms businesses.</p>
					</div>

					<div className="space-y-16 max-w-7xl mx-auto">
						{caseStudies.map((study, index) => (
							<Card key={study.title} className="bg-background/50 border-border/30 hover:shadow-xl transition-all duration-300 overflow-hidden">
								<div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 ${index % 2 === 1 ? "lg:grid-flow-col-dense" : ""}`}>
									<div className={`relative aspect-[4/3] bg-secondary ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
										<Image src={study.image} alt={study.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
									</div>
									<div className="p-8 flex flex-col justify-center">
										<div className="mb-4">
											<div className="flex flex-wrap gap-2 mb-3">
												{study.tags.map((tag) => (
													<Badge key={tag} variant="secondary" className="bg-yellow-600/10 border border-yellow-600/30 text-yellow-600">
														{tag}
													</Badge>
												))}
											</div>
											<h3 className="text-2xl font-bold mb-2">{study.title}</h3>
											<p className="text-muted-foreground mb-1">{study.client}</p>
											<div className="flex items-center gap-1 text-sm text-muted-foreground">
												<Clock className="w-3 h-3" />
												<span>{study.duration}</span>
											</div>
										</div>

										<div className="space-y-4 mb-6">
											<div>
												<h4 className="font-semibold mb-2 text-foreground">Challenge</h4>
												<p className="text-muted-foreground text-sm">{study.challenge}</p>
											</div>
											<div>
												<h4 className="font-semibold mb-2 text-foreground">Solution</h4>
												<p className="text-muted-foreground text-sm">{study.solution}</p>
											</div>
										</div>

										<div className="grid grid-cols-3 gap-4 mb-6">
											{study.results.map((result, idx) => (
												<div key={idx} className="text-center">
													<div className="text-2xl font-bold text-yellow-600 mb-1">{result.improvement}</div>
													<div className="text-xs text-muted-foreground">{result.metric}</div>
												</div>
											))}
										</div>

										<blockquote className="border-l-4 border-yellow-600 pl-4 italic text-muted-foreground mb-4">&quot;{study.testimonial}&quot;</blockquote>

										<Button variant="outline" className="border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600 self-start">
											<ExternalLink className="w-4 h-4 mr-2" />
											View Full Case Study
										</Button>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Tools & Skills Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">Tools & Expertise</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">Mastery of industry-leading design tools and technologies.</p>
					</div>

					<div className="max-w-4xl mx-auto">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{tools.map((tool) => (
								<div key={tool.name} className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="font-medium text-foreground">{tool.name}</span>
										<span className="text-sm text-muted-foreground">{tool.proficiency}%</span>
									</div>
									<div className="w-full bg-secondary rounded-full h-2">
										<div
											className="h-2 rounded-full transition-all duration-1000 ease-out"
											style={{
												width: `${tool.proficiency}%`,
												backgroundColor: tool.color,
											}}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Why Choose Me Section */}
			<section className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Me</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">Experience, expertise, and results that speak for themselves.</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
						{whyChooseMe.map((reason, index) => (
							<Card key={reason.title} className="bg-background/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30 text-center p-6">
								<div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-yellow-600/10 rounded-full">
									<reason.icon className="w-8 h-8 text-yellow-600" />
								</div>
								<h3 className="text-xl font-bold mb-3 text-foreground">{reason.title}</h3>
								<p className="text-muted-foreground text-sm leading-relaxed mb-4">{reason.description}</p>
								<div className="text-yellow-600 font-semibold text-sm">{reason.stat}</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* My Process Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">My Design Process</h2>
						<p className="text-lg text-muted-foreground">A collaborative journey from concept to creation in Figma.</p>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
						<div className="space-y-8">
							{designProcess.map((step, index) => (
								<div key={step.title} className="flex gap-6">
									<div className="flex flex-col items-center">
										<div className="bg-yellow-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">{step.step}</div>
										{index < designProcess.length - 1 && <div className="w-0.5 h-16 bg-yellow-600/20 mt-4" />}
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
						<div className="bg-gradient-to-br from-secondary/20 to-yellow-50/20 rounded-3xl p-8 border border-yellow-600/10">
							<div className="text-center mb-8">
								<div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600/10 rounded-full mb-4">
									<Figma className="w-8 h-8 text-yellow-600" />
								</div>
								<h3 className="text-2xl font-bold mb-4">Design-Focused Approach</h3>
								<p className="text-muted-foreground">I focus on what I do best - creating exceptional designs in Figma - while partnering with trusted developers for implementation.</p>
							</div>
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Expert-level Figma skills</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Comprehensive design systems</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Development partner network</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Seamless design handoffs</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">Pricing Plans</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">Transparent pricing for every project size and budget.</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{pricingTiers.map((tier, index) => (
							<Card key={tier.name} className={`relative bg-background/50 border-border/30 hover:shadow-xl transition-all duration-300 ${tier.popular ? "border-yellow-600 shadow-lg scale-105" : "hover:border-yellow-600/30"}`}>
								{tier.popular && (
									<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
										<Badge className="bg-yellow-600 text-black font-semibold px-4 py-1">Most Popular</Badge>
									</div>
								)}

								<CardHeader className="text-center pb-8">
									<CardTitle className="text-2xl font-bold mb-2">{tier.name}</CardTitle>
									<div className="text-4xl font-bold text-yellow-600 mb-2">{tier.price}</div>
									<p className="text-muted-foreground">{tier.description}</p>
								</CardHeader>

								<CardContent className="space-y-6">
									<ul className="space-y-3">
										{tier.features.map((feature, idx) => (
											<li key={idx} className="flex items-center gap-3">
												<CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
												<span className="text-sm text-muted-foreground">{feature}</span>
											</li>
										))}
									</ul>

									<Button className={`w-full font-semibold ${tier.popular ? "bg-yellow-600 hover:bg-yellow-700 text-black" : "bg-secondary hover:bg-yellow-600 hover:text-black text-foreground"}`}>{tier.cta}</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">Client Testimonials</h2>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto">Don&apos;t just take my word for it. Here&apos;s what clients say about working with me.</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{testimonials.map((testimonial, index) => (
							<Card key={testimonial.name} className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30 p-6">
								<div className="flex items-center gap-4 mb-4">
									<Image src={testimonial.image} alt={testimonial.name} width={48} height={48} className="rounded-full" />
									<div>
										<div className="font-semibold text-foreground">{testimonial.name}</div>
										<div className="text-sm text-muted-foreground">{testimonial.role}</div>
										<div className="text-sm text-muted-foreground">{testimonial.company}</div>
									</div>
								</div>

								<div className="flex items-center gap-1 mb-4">
									{[...Array(testimonial.rating)].map((_, i) => (
										<Star key={i} className="w-4 h-4 fill-yellow-600 text-yellow-600" />
									))}
								</div>

								<blockquote className="text-muted-foreground italic leading-relaxed">&quot;{testimonial.content}&quot;</blockquote>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Enhanced FAQ Section */}
			<section id="faq" className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="text-center mb-16">
						<h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
						<p className="text-xl text-muted-foreground">Everything you need to know about working with me.</p>
					</div>

					<Accordion type="single" collapsible className="w-full space-y-4">
						{faqItems.map((item, index) => (
							<AccordionItem key={index} value={item.question} className="border border-border/30 rounded-lg px-6 bg-background/50">
								<AccordionTrigger className="text-lg font-semibold hover:no-underline py-6 text-left">{item.question}</AccordionTrigger>
								<AccordionContent className="text-base text-muted-foreground pb-6 leading-relaxed">{item.answer}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</section>
		</>
	);
}
