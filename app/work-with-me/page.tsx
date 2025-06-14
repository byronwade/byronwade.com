"use client";

import { motion } from "framer-motion";
import { Check, Lightbulb, TrendingUp, Users, Code, Wrench, Rocket, Star, Clock, Shield, Award, ArrowRight, Calendar, MessageCircle, Zap, Globe, Smartphone, Database, Cloud, CheckCircle, DollarSign, Target, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HeroPages from "@/components/sections/hero-pages";

const services = [
	{
		icon: Code,
		title: "Web Development",
		description: "Custom websites and web applications built with modern technologies",
		features: ["Next.js & React", "TypeScript", "Responsive Design", "SEO Optimization"],
		color: "from-blue-500 to-cyan-500",
	},
	{
		icon: Smartphone,
		title: "Mobile Development",
		description: "Cross-platform mobile apps that work seamlessly on iOS and Android",
		features: ["React Native", "Native Performance", "App Store Deployment", "Push Notifications"],
		color: "from-purple-500 to-pink-500",
	},
	{
		icon: Wrench,
		title: "Plumbing Services",
		description: "Professional plumbing solutions for residential and commercial properties",
		features: ["Emergency Repairs", "Installation", "Maintenance", "Licensed & Insured"],
		color: "from-orange-500 to-red-500",
	},
	{
		icon: Cloud,
		title: "Cloud Solutions",
		description: "Scalable cloud infrastructure and deployment solutions",
		features: ["AWS & Vercel", "CI/CD Pipelines", "Performance Monitoring", "Auto-scaling"],
		color: "from-green-500 to-emerald-500",
	},
];

const pricingTiers = [
	{
		name: "Starter",
		price: "$2,500",
		description: "Perfect for small businesses and personal projects",
		features: ["5-page responsive website", "Mobile-first design", "Basic SEO optimization", "Contact form integration", "1 month support", "Google Analytics setup"],
		popular: false,
		cta: "Get Started",
	},
	{
		name: "Professional",
		price: "$5,000",
		description: "Ideal for growing businesses and e-commerce",
		features: ["10-page responsive website", "Custom design & branding", "Advanced SEO optimization", "E-commerce integration", "3 months support", "Performance optimization", "Content management system", "Social media integration"],
		popular: true,
		cta: "Most Popular",
	},
	{
		name: "Enterprise",
		price: "Custom",
		description: "Comprehensive solutions for large organizations",
		features: ["Unlimited pages", "Custom web application", "Advanced integrations", "Multi-language support", "6 months support", "Dedicated project manager", "Training & documentation", "Priority support"],
		popular: false,
		cta: "Contact Us",
	},
];

const testimonials = [
	{
		name: "Sarah Johnson",
		role: "CEO, TechStart Inc.",
		content: "Byron delivered an exceptional website that exceeded our expectations. The attention to detail and modern design really set us apart from competitors.",
		rating: 5,
	},
	{
		name: "Mike Rodriguez",
		role: "Restaurant Owner",
		content: "Not only did Byron fix our plumbing emergency quickly, but he also built us a beautiful website that increased our online orders by 300%.",
		rating: 5,
	},
	{
		name: "Emily Chen",
		role: "Marketing Director",
		content: "Working with Byron was a game-changer. His technical expertise and business understanding helped us launch our product successfully.",
		rating: 5,
	},
];

const processSteps = [
	{
		title: "Discovery & Strategy",
		description: "We start with a comprehensive consultation to understand your goals, target audience, and project requirements.",
		icon: Target,
		duration: "1-2 weeks",
	},
	{
		title: "Design & Planning",
		description: "I create detailed wireframes, mockups, and project timelines to visualize your solution before development begins.",
		icon: Lightbulb,
		duration: "2-3 weeks",
	},
	{
		title: "Development & Testing",
		description: "Your project is built using modern technologies with rigorous testing to ensure quality and performance.",
		icon: Code,
		duration: "4-8 weeks",
	},
	{
		title: "Launch & Support",
		description: "We deploy your solution and provide ongoing support to ensure everything runs smoothly.",
		icon: Rocket,
		duration: "Ongoing",
	},
];

const whyChooseMe = [
	{
		icon: Award,
		title: "8+ Years Experience",
		description: "Proven track record with 150+ successful projects across various industries.",
	},
	{
		icon: Zap,
		title: "Lightning Fast Delivery",
		description: "Efficient workflows and modern tools ensure your project is delivered on time.",
	},
	{
		icon: Shield,
		title: "Quality Guaranteed",
		description: "Every project comes with comprehensive testing and quality assurance.",
	},
	{
		icon: Users,
		title: "Collaborative Approach",
		description: "You're involved in every step of the process with regular updates and feedback sessions.",
	},
	{
		icon: TrendingUp,
		title: "Results-Driven",
		description: "Focus on measurable outcomes that drive real business growth and success.",
	},
	{
		icon: Clock,
		title: "24/7 Support",
		description: "Emergency support available for critical issues, with regular support during business hours.",
	},
];

export default function WorkWithMePage() {
	return (
		<>
			<HeroPages title="Work With Me" subtitle="Let's Build Something Amazing Together" />
			<div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
				{/* Hero Section */}
				<section className="py-20">
					<div className="container mx-auto px-4 text-center">
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
							<div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-secondary/50 text-foreground border border-border/30 mb-8">
								<Briefcase className="w-4 h-4 mr-2 text-yellow-600" />
								Professional Services
							</div>
							<h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
								Your Vision, <span className="text-yellow-600">My Expertise</span>
							</h1>
							<p className="text-xl text-muted-foreground mb-12 leading-relaxed">From cutting-edge web applications to reliable plumbing solutions, I bring technical excellence and craftsmanship to every project. Let&apos;s turn your ideas into reality.</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button asChild size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-8 py-4">
									<Link href="/contact">
										<Calendar className="mr-2 h-5 w-5" />
										Schedule Consultation
										<ArrowRight className="ml-2 h-5 w-5" />
									</Link>
								</Button>
								<Button asChild variant="outline" size="lg" className="border-yellow-600/50 text-yellow-600 hover:bg-yellow-600 hover:text-black px-8 py-4">
									<Link href="/portfolio">
										<Star className="mr-2 h-5 w-5" />
										View My Work
									</Link>
								</Button>
							</div>
						</motion.div>
					</div>
				</section>

				{/* Services Section */}
				<section className="py-20 bg-secondary/10">
					<div className="container mx-auto px-4">
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold mb-6">Services I Offer</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Comprehensive solutions spanning digital innovation and essential home services</p>
						</motion.div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
							{services.map((service, index) => {
								const Icon = service.icon;
								return (
									<motion.div key={service.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
										<Card className="h-full bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30 group">
											<CardHeader className="pb-4">
												<div className={`p-3 rounded-lg bg-gradient-to-br ${service.color} bg-opacity-10 w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
													<Icon className="h-6 w-6 text-yellow-600" />
												</div>
												<CardTitle className="text-xl font-bold group-hover:text-yellow-600 transition-colors">{service.title}</CardTitle>
											</CardHeader>
											<CardContent className="space-y-4">
												<p className="text-muted-foreground leading-relaxed">{service.description}</p>
												<div className="space-y-2">
													{service.features.map((feature) => (
														<div key={feature} className="flex items-center gap-2">
															<CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
															<span className="text-sm text-muted-foreground">{feature}</span>
														</div>
													))}
												</div>
											</CardContent>
										</Card>
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>

				{/* Why Choose Me Section */}
				<section className="py-20">
					<div className="container mx-auto px-4">
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Me?</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto">I&apos;m more than just a service provider—I&apos;m your partner in success</p>
						</motion.div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{whyChooseMe.map((benefit, index) => {
								const Icon = benefit.icon;
								return (
									<motion.div key={benefit.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
										<Card className="h-full bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30 group">
											<CardContent className="p-6 text-center">
												<div className="bg-yellow-600/10 p-4 rounded-lg inline-flex mb-4 group-hover:bg-yellow-600/20 transition-colors">
													<Icon className="h-6 w-6 text-yellow-600" />
												</div>
												<h3 className="text-xl font-bold mb-3 group-hover:text-yellow-600 transition-colors">{benefit.title}</h3>
												<p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
											</CardContent>
										</Card>
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>

				{/* Pricing Section */}
				<section className="py-20 bg-secondary/10">
					<div className="container mx-auto px-4">
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold mb-6">Transparent Pricing</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Choose the package that fits your needs. All prices include consultation and planning.</p>
						</motion.div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
							{pricingTiers.map((tier, index) => (
								<motion.div key={tier.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
									<Card className={`h-full relative ${tier.popular ? "border-yellow-600 shadow-xl scale-105" : "bg-secondary/50 border-border/30"} hover:shadow-xl transition-all duration-300`}>
										{tier.popular && (
											<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
												<Badge className="bg-yellow-600 text-black font-semibold px-4 py-1">Most Popular</Badge>
											</div>
										)}
										<CardHeader className="text-center pb-4">
											<CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
											<div className="text-3xl font-bold text-yellow-600 mb-2">{tier.price}</div>
											<p className="text-muted-foreground">{tier.description}</p>
										</CardHeader>
										<CardContent className="space-y-4">
											<ul className="space-y-3">
												{tier.features.map((feature) => (
													<li key={feature} className="flex items-center gap-2">
														<Check className="w-4 h-4 text-green-600 flex-shrink-0" />
														<span className="text-sm">{feature}</span>
													</li>
												))}
											</ul>
											<Button asChild className={`w-full mt-6 ${tier.popular ? "bg-yellow-600 hover:bg-yellow-700 text-black" : ""}`}>
												<Link href="/contact">
													{tier.cta}
													<ArrowRight className="ml-2 h-4 w-4" />
												</Link>
											</Button>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* Process Section */}
				<section className="py-20">
					<div className="container mx-auto px-4">
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold mb-6">My Process</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto">A proven methodology that ensures your project&apos;s success from concept to completion</p>
						</motion.div>

						<div className="max-w-4xl mx-auto">
							{processSteps.map((step, index) => {
								const Icon = step.icon;
								return (
									<motion.div key={step.title} initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.2 }} className={`flex items-center gap-8 mb-12 ${index % 2 === 1 ? "flex-row-reverse" : ""}`}>
										<div className="flex-1">
											<Card className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
												<CardContent className="p-6">
													<div className="flex items-center gap-4 mb-4">
														<div className="bg-yellow-600/10 p-3 rounded-lg">
															<Icon className="h-6 w-6 text-yellow-600" />
														</div>
														<div>
															<h3 className="text-xl font-bold">{step.title}</h3>
															<Badge variant="outline" className="border-yellow-600/30 text-yellow-600">
																{step.duration}
															</Badge>
														</div>
													</div>
													<p className="text-muted-foreground leading-relaxed">{step.description}</p>
												</CardContent>
											</Card>
										</div>
										<div className="flex-shrink-0">
											<div className="w-12 h-12 bg-yellow-600 text-black rounded-full flex items-center justify-center font-bold text-lg">{index + 1}</div>
										</div>
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>

				{/* Testimonials Section */}
				<section className="py-20 bg-secondary/10">
					<div className="container mx-auto px-4">
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold mb-6">What Clients Say</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Don&apos;t just take my word for it—here&apos;s what my clients have to say</p>
						</motion.div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
							{testimonials.map((testimonial, index) => (
								<motion.div key={testimonial.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
									<Card className="h-full bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
										<CardContent className="p-6">
											<div className="flex items-center gap-1 mb-4">
												{[...Array(testimonial.rating)].map((_, i) => (
													<Star key={i} className="w-4 h-4 fill-yellow-600 text-yellow-600" />
												))}
											</div>
											<p className="text-muted-foreground mb-4 leading-relaxed italic">&quot;{testimonial.content}&quot;</p>
											<div>
												<div className="font-semibold text-foreground">{testimonial.name}</div>
												<div className="text-sm text-muted-foreground">{testimonial.role}</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-20">
					<div className="container mx-auto px-4">
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
							<Card className="bg-gradient-to-br from-yellow-600 to-amber-500 border-0 text-black max-w-4xl mx-auto">
								<CardContent className="p-12">
									<h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
									<p className="text-xl mb-8 opacity-90 leading-relaxed">Let&apos;s discuss your vision and create something extraordinary together. Get a free consultation and project estimate.</p>
									<div className="flex flex-col sm:flex-row gap-4 justify-center">
										<Button asChild size="lg" className="bg-black text-yellow-400 hover:bg-gray-900 font-semibold px-8 py-4">
											<Link href="/contact">
												<MessageCircle className="mr-2 h-5 w-5" />
												Get Free Consultation
												<ArrowRight className="ml-2 h-5 w-5" />
											</Link>
										</Button>
										<Button asChild variant="outline" size="lg" className="border-black/20 bg-white/10 backdrop-blur-sm text-black hover:bg-white/20 font-semibold px-8 py-4">
											<Link href="/portfolio">
												<Globe className="mr-2 h-5 w-5" />
												View Portfolio
											</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</section>
			</div>
		</>
	);
}
