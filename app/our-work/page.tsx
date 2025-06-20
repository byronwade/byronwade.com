import { type Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, ShieldCheck, Users, HeartHandshake, Droplet, Wind, Camera, Phone, Gauge, Star, MapPin, Clock, CheckCircle, ArrowRight, Trophy, DollarSign, Zap, ThumbsUp, Target, MessageCircle, HomeIcon, AlertTriangle, Calendar, Award, TrendingUp, Eye, Hammer, Filter, Settings } from "lucide-react";
import { Link } from "@/components/ui/link";
import Image from "next/image";
import WorkGallery from "@/components/ui/work-gallery";

export const metadata: Metadata = {
	title: "Our Work | Wade's Plumbing & Septic Portfolio",
	description: "See examples of our quality plumbing and septic work in Santa Cruz County, CA and Pickens County, GA. Professional installations, repairs, and maintenance services.",
	openGraph: {
		title: "Our Work | Wade's Plumbing & Septic",
		description: "Professional plumbing and septic work portfolio showcasing quality installations and repairs.",
		url: "https://byronwade.com/our-work",
		images: [
			{
				url: "/api/og?title=Our%20Work&subtitle=Wade%27s%20Plumbing%20%26%20Septic%20Portfolio",
				width: 1200,
				height: 630,
				alt: "Wade's Plumbing & Septic Work Portfolio",
			},
		],
	},
};

const stats = [
	{ icon: Calendar, number: "2021", label: "In Business Since" },
	{ icon: Trophy, number: "150+", label: "Projects Completed" },
	{ icon: Users, number: "100%", label: "Customer Satisfaction" },
	{ icon: ShieldCheck, number: "Licensed", label: "& Insured" },
];

const serviceTypes = [
	{
		icon: Droplet,
		title: "Leak Detection & Repair",
		description: "Professional leak detection and repair services for residential and commercial properties.",
		projects: "25+ completed projects",
	},
	{
		icon: Wind,
		title: "Water Heater Installation",
		description: "Energy-efficient water heater installations and replacements.",
		projects: "40+ installations",
	},
	{
		icon: Wrench,
		title: "Sewer Line Replacement",
		description: "Trenchless and traditional sewer line repairs and replacements.",
		projects: "30+ replacements",
	},
	{
		icon: Filter,
		title: "Water Filtration Systems",
		description: "Complete water filtration system installations for clean, safe water.",
		projects: "20+ systems installed",
	},
	{
		icon: Gauge,
		title: "Septic Services",
		description: "Septic system installations, pumping, and maintenance services.",
		projects: "35+ septic projects",
	},
	{
		icon: Hammer,
		title: "Commercial Plumbing",
		description: "Professional commercial plumbing services for businesses.",
		projects: "15+ commercial projects",
	},
];

const featuredProjects = [
	{
		title: "Commercial Kitchen Grease Trap Installation",
		location: "Santa Cruz County, CA",
		type: "Commercial Plumbing",
		description: "Complete grease trap installation for a busy restaurant kitchen, ensuring compliance with local regulations and preventing drainage issues.",
		features: ["Code compliant installation", "Minimal business disruption", "Professional cleanup", "Ongoing maintenance plan"],
		image: "/images/projects/grease-trap.jpg",
	},
	{
		title: "Residential Septic System Installation",
		location: "Pickens County, GA",
		type: "Septic Services",
		description: "New septic system installation for a rural mountain home, designed for challenging terrain and environmental conditions.",
		features: ["Custom system design", "Environmental compliance", "Soil testing and analysis", "Long-term warranty"],
		image: "/images/projects/septic-install.jpg",
	},
	{
		title: "Tankless Water Heater Upgrade",
		location: "Santa Cruz County, CA",
		type: "Water Heater Services",
		description: "Energy-efficient tankless water heater installation replacing an old tank system, providing endless hot water and energy savings.",
		features: ["Energy efficiency upgrade", "Space-saving design", "Professional installation", "Manufacturer warranty"],
		image: "/images/projects/tankless-heater.jpg",
	},
];

const whyChooseOurWork = [
	{
		icon: Award,
		title: "Quality Workmanship",
		description: "Every project is completed to the highest standards with attention to detail and professional craftsmanship.",
	},
	{
		icon: ShieldCheck,
		title: "Licensed & Insured",
		description: "All work is performed by licensed professionals with comprehensive insurance coverage for your protection.",
	},
	{
		icon: Clock,
		title: "Timely Completion",
		description: "We respect your time and complete projects efficiently while maintaining our high quality standards.",
	},
	{
		icon: HeartHandshake,
		title: "Customer Satisfaction",
		description: "Our commitment to honest service and quality work has earned us 100% customer satisfaction.",
	},
];

export default function OurWorkPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Wade's Plumbing & Septic",
		description: "Professional plumbing and septic services portfolio showcasing quality work in California and Georgia.",
		url: "https://byronwade.com/our-work",
		telephone: "831-225-4344",
		areaServed: [
			{ "@type": "State", name: "California" },
			{ "@type": "State", name: "Georgia" },
		],
		serviceType: ["Plumbing Services", "Septic Services", "Water Heater Installation", "Commercial Plumbing", "Leak Detection"],
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

			{/* Hero Section */}
			<section className="relative flex items-center justify-center min-h-[60vh] text-center px-4 py-24">
				<div className="container mx-auto max-w-5xl">
					<div className="mb-8">
						<span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-secondary/50 text-foreground border border-border/30">
							<Trophy className="w-4 h-4 mr-2 text-yellow-600" />
							Professional Work Portfolio
						</span>
					</div>
					<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-8 leading-tight">
						Our <span className="text-yellow-600">Quality Work</span> Speaks for Itself
					</h1>
					<p className="text-lg text-muted-foreground md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">See examples of our professional plumbing and septic work across California and Georgia. From residential repairs to commercial installations, we deliver quality results every time.</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
						<Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-8 py-4 text-lg">
							<Phone className="w-5 h-5 mr-2" />
							Call (831) 225-4344
						</Button>
						<Button variant="outline" size="lg" className="border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600 px-8 py-4 text-lg">
							<Link href="/contact" className="flex items-center">
								<MessageCircle className="w-5 h-5 mr-2" />
								Get Free Estimate
							</Link>
						</Button>
					</div>
					<div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<ShieldCheck className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Licensed & Insured</span>
						</div>
						<div className="flex items-center gap-2">
							<Users className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Family Owned</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Since 2021</span>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
						{stats.map((stat, index) => (
							<Card key={index} className="text-center bg-secondary/50 border-border/30 hover:shadow-lg transition-all duration-300">
								<CardContent className="p-6">
									<div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-600/10 rounded-lg">
										<stat.icon className="w-6 h-6 text-yellow-600" />
									</div>
									<div className="text-2xl font-bold mb-2 text-foreground">{stat.number}</div>
									<div className="text-muted-foreground font-medium text-sm">{stat.label}</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Service Types Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Our Service Areas</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">We provide comprehensive plumbing and septic services across multiple specialties, delivering quality results in every project.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{serviceTypes.map((service, index) => (
							<Card key={index} className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
								<CardHeader>
									<div className="flex items-center gap-4 mb-4">
										<div className="flex items-center justify-center w-12 h-12 bg-yellow-600/10 rounded-lg">
											<service.icon className="w-6 h-6 text-yellow-600" />
										</div>
										<CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
									</div>
									<p className="text-muted-foreground">{service.description}</p>
								</CardHeader>
								<CardContent>
									<div className="flex items-center gap-2">
										<Badge variant="secondary" className="bg-yellow-600/10 text-yellow-600 border-yellow-600/30">
											{service.projects}
										</Badge>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Featured Projects Section */}
			<section className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Featured Projects</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Examples of our recent work showcasing the quality and professionalism we bring to every project.</p>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{featuredProjects.map((project, index) => (
							<Card key={index} className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
								<div className="relative aspect-[4/3] bg-secondary/20 rounded-t-lg overflow-hidden">
									<div className="absolute inset-0 flex items-center justify-center">
										<Camera className="w-12 h-12 text-muted-foreground/50" />
									</div>
									<div className="absolute top-4 left-4">
										<Badge className="bg-yellow-600 text-black">{project.type}</Badge>
									</div>
								</div>
								<CardHeader>
									<CardTitle className="text-xl text-foreground">{project.title}</CardTitle>
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<MapPin className="w-4 h-4 text-yellow-600" />
										{project.location}
									</div>
									<p className="text-muted-foreground">{project.description}</p>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2">
										{project.features.map((feature, idx) => (
											<li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
												<CheckCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
												{feature}
											</li>
										))}
									</ul>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Project Gallery Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Project Gallery</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Browse through our extensive portfolio of completed projects. Filter by service type to see specific examples of our work.</p>
					</div>
					<WorkGallery />
				</div>
			</section>

			{/* Why Choose Our Work Section */}
			<section className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Why Choose Our Work</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Our commitment to quality, professionalism, and customer satisfaction sets us apart in every project we complete.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
						{whyChooseOurWork.map((reason, index) => (
							<Card key={index} className="text-center bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
								<CardContent className="p-8">
									<div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-yellow-600/10 rounded-full">
										<reason.icon className="w-8 h-8 text-yellow-600" />
									</div>
									<h3 className="text-xl font-bold mb-4 text-foreground">{reason.title}</h3>
									<p className="text-muted-foreground leading-relaxed">{reason.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Service Areas */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Service Areas</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">We proudly serve customers in California with professional plumbing and septic services.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
						<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
							<CardHeader>
								<CardTitle className="text-2xl text-foreground flex items-center gap-3">
									<MapPin className="w-6 h-6 text-yellow-600" />
									California
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground mb-4">Serving Santa Cruz County and surrounding areas</p>
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li className="flex items-center gap-2">
										<CheckCircle className="w-4 h-4 text-yellow-600" />
										Santa Cruz County
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="w-4 h-4 text-yellow-600" />
										Santa Cruz, Scotts Valley, Capitola
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="w-4 h-4 text-yellow-600" />
										Soquel, Aptos, Watsonville
									</li>
									<li className="flex items-center gap-2">
										<CheckCircle className="w-4 h-4 text-yellow-600" />
										Ben Lomond, Felton
									</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>
		</>
	);
}
