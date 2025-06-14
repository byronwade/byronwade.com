import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Wrench, ShieldCheck, Users, HeartHandshake, Droplet, Wind, Camera, Phone, Gauge, Star, MapPin, Clock, CheckCircle, ArrowRight, Trophy, DollarSign, Zap, ThumbsUp, Target, MessageCircle, HomeIcon, AlertTriangle, Waves, Sun, TreePine, Anchor, Filter, Hammer, Settings, Calendar } from "lucide-react";
import type { Metadata } from "next";
import { Link } from "@/components/ui/link";
import Image from "next/image";

export const metadata: Metadata = {
	title: "Wade's Plumbing & Septic | Professional Plumbing Services in Santa Cruz County, CA",
	description: "Professional plumbing and septic services in Santa Cruz County, CA. Licensed, insured, and family-owned since 2021. Honest recommendations, quality workmanship, and fair pricing.",
	openGraph: {
		title: "Wade's Plumbing & Septic | Santa Cruz County, CA",
		description: "Professional plumbing and septic services with honest recommendations and quality workmanship.",
		url: "https://byronwade.com/plumbing-santa-cruz",
		images: [
			{
				url: "/api/og?title=Wade%27s%20Plumbing%20%26%20Septic&subtitle=Santa%20Cruz%20County%2C%20CA",
				width: 1200,
				height: 630,
				alt: "Wade's Plumbing & Septic in Santa Cruz County",
			},
		],
	},
};

const services = [
	{
		icon: Droplet,
		title: "Leak Detection & Repair",
		description: "Professional leak detection and repair services for residential and commercial properties.",
		features: ["Advanced leak detection technology", "Pipe repairs and replacement", "Fixture repairs", "Preventative maintenance"],
	},
	{
		icon: Wind,
		title: "Tankless Water Heater Installation",
		description: "Energy-efficient tankless water heater installation and maintenance services.",
		features: ["Professional installation", "Energy efficiency consultation", "Maintenance programs", "Warranty service"],
	},
	{
		icon: Wrench,
		title: "Trenchless Sewer Line Replacement",
		description: "Modern trenchless technology for sewer line replacement with minimal property disruption.",
		features: ["Minimal excavation", "Advanced technology", "Property protection", "Efficient completion"],
	},
	{
		icon: Filter,
		title: "Water Filtration System Installation",
		description: "Complete water filtration system installation for clean, safe drinking water.",
		features: ["System design consultation", "Professional installation", "Filter maintenance", "Water quality testing"],
	},
	{
		icon: Gauge,
		title: "Septic System Services",
		description: "Comprehensive septic services including pumping, inspections, and system installations.",
		features: ["Septic system pumping", "Inspections and certifications", "New system installation", "Maintenance programs"],
	},
	{
		icon: Hammer,
		title: "Commercial Plumbing",
		description: "Professional commercial plumbing services for businesses of all sizes.",
		features: ["Commercial drain cleaning", "Grease trap services", "Maintenance programs", "Code compliance"],
	},
];

const stats = [
	{ icon: Calendar, number: "2021", label: "In Business Since" },
	{ icon: Users, number: "100%", label: "Customer Satisfaction" },
	{ icon: ShieldCheck, number: "Licensed", label: "& Insured" },
	{ icon: Clock, number: "Mon-Fri", label: "9AM - 5PM" },
];

const whyChooseUs = [
	{
		icon: HeartHandshake,
		title: "Honest Recommendations",
		description: "We&apos;ll never push unnecessary services or upsell you. We provide honest recommendations based on what you actually need, not what makes us the most money.",
	},
	{
		icon: Users,
		title: "Real People, Real Service",
		description: "We're casual, approachable plumbers who treat you like a neighbor, not a number. No corporate scripts or high-pressure tactics—just genuine service from real people.",
	},
	{
		icon: DollarSign,
		title: "Fair, Transparent Pricing",
		description: "We offer upfront flat-rate pricing based on industry standards. You'll know exactly what you're paying before work begins—no surprises, no hidden fees.",
	},
	{
		icon: Wrench,
		title: "Quality Workmanship",
		description: "We may be casual in our approach, but we're serious about quality. Our experienced team delivers reliable, long-lasting solutions to your plumbing and septic needs.",
	},
];

const serviceAreas = ["Santa Cruz County", "Santa Cruz", "Scotts Valley", "Capitola", "Soquel", "Aptos", "Watsonville", "Ben Lomond", "Felton"];

const faqItems = [
	{
		question: "What areas do you serve in California?",
		answer: "We serve Santa Cruz County, California, including Santa Cruz, Scotts Valley, Capitola, Soquel, Aptos, Watsonville, Ben Lomond, and Felton.",
	},
	{
		question: "Are you licensed and insured?",
		answer: "Yes, Wade's Plumbing & Septic is fully licensed and insured in California. We carry comprehensive liability insurance and workers' compensation coverage for your protection.",
	},
	{
		question: "Do you offer financing options?",
		answer: "Yes, we offer multiple financing options including 0% interest financing for qualified customers, flexible payment plans, and we accept all major credit cards, checks, and cash payments.",
	},
	{
		question: "What makes your approach different?",
		answer: "We focus on honest recommendations without pushy sales tactics. We explain the issue, provide options at different price points, and help you make informed decisions based on your situation and budget.",
	},
	{
		question: "Do you work on septic systems?",
		answer: "Yes, we provide comprehensive septic services including pumping, inspections, repairs, and new installations. We service all types of septic systems throughout Santa Cruz County.",
	},
	{
		question: "What are your business hours?",
		answer: "We provide plumbing and septic services Monday through Friday, 9:00am - 5:00pm. You can schedule appointments by calling our office or using our online contact form.",
	},
];

export default function SantaCruzPlumbingPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Plumber",
		name: "Wade's Plumbing & Septic",
		description: "Professional plumbing and septic services in Santa Cruz County, CA. Family-owned business since 2021.",
		url: "https://byronwade.com/plumbing-santa-cruz",
		telephone: "831-225-4344",
		address: {
			"@type": "PostalAddress",
			addressLocality: "Santa Cruz County",
			addressRegion: "CA",
			addressCountry: "US",
		},
		areaServed: [
			{ "@type": "City", name: "Santa Cruz" },
			{ "@type": "City", name: "Scotts Valley" },
			{ "@type": "City", name: "Capitola" },
			{ "@type": "City", name: "Soquel" },
			{ "@type": "City", name: "Aptos" },
			{ "@type": "City", name: "Watsonville" },
		],
		openingHours: "Mo-Fr 09:00-17:00",
		priceRange: "$$",
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

			{/* Hero Section */}
			<section className="relative flex items-center justify-center min-h-[60vh] text-center px-4 py-24">
				<div className="container mx-auto max-w-5xl">
					<div className="mb-8">
						<span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-secondary/50 text-foreground border border-border/30">
							<MapPin className="w-4 h-4 mr-2 text-yellow-600" />
							Serving Santa Cruz County, CA
						</span>
					</div>
					<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-8 leading-tight">
						Professional <span className="text-yellow-600">Plumbing & Septic</span> Services
					</h1>
					<p className="text-lg text-muted-foreground md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">Honest plumbing and septic services you can trust. No sales pressure, no upselling—just quality workmanship from local professionals who care about doing the job right.</p>
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

			{/* Services Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Our Services</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Comprehensive plumbing and septic solutions for residential and commercial properties throughout Santa Cruz County.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{services.map((service, index) => (
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
									<ul className="space-y-2">
										{service.features.map((feature, idx) => (
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

			{/* Why Choose Us Section */}
			<section className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Why Choose Wade's</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">We're not your typical corporate plumbers. We're your neighbors, offering honest recommendations and quality work at fair prices.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
						{whyChooseUs.map((reason, index) => (
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

			{/* Service Areas Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Service Areas</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">We proudly serve Santa Cruz County and surrounding areas with professional plumbing and septic services.</p>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
						{serviceAreas.map((area, index) => (
							<Card key={index} className="text-center bg-secondary/50 border-border/30 hover:shadow-lg transition-all duration-300">
								<CardContent className="p-4">
									<div className="flex items-center justify-center gap-2">
										<MapPin className="w-4 h-4 text-yellow-600" />
										<span className="font-medium text-foreground">{area}</span>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Frequently Asked Questions</h2>
						<p className="text-lg text-muted-foreground">Common questions about our plumbing and septic services in Santa Cruz County.</p>
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
