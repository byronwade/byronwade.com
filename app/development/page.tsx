import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/components/ui/link";
import { Code, Zap, Database, ShieldCheck, Search, PenTool, Milestone, Users, ArrowRight, CheckCircle, Star, Handshake, Network, Settings, FileCode } from "lucide-react";
import HeroPages from "@/components/sections/hero-pages";
import PageHeader from "@/components/page-header";
import CodedText from "@/components/ui/coded-text";
import TextStroke from "@/components/ui/text-stroke";

const devServices = [
	{
		icon: Handshake,
		title: "Development Partnership",
		description: "I connect you with trusted, vetted developers who specialize in modern technologies like Next.js, React, and Node.js. Quality partnerships, reliable results.",
	},
	{
		icon: Search,
		title: "Technical Consultation",
		description: "Need guidance on your development project? I provide technical consultation to help you make informed decisions about architecture, technology stack, and project planning.",
	},
	{
		icon: FileCode,
		title: "Design-to-Code Handoff",
		description: "I ensure seamless handoffs from design to development, providing detailed specifications, assets, and working closely with developers to maintain design integrity.",
	},
	{
		icon: Network,
		title: "Project Management",
		description: "I coordinate between design and development teams, managing timelines, ensuring quality standards, and keeping your project on track from concept to launch.",
	},
	{
		icon: Settings,
		title: "Quality Assurance",
		description: "Working with my development partners, I ensure your project meets high standards for performance, functionality, and user experience before launch.",
	},
	{
		icon: ShieldCheck,
		title: "Ongoing Support Coordination",
		description: "After launch, I help coordinate ongoing maintenance and updates through my trusted development network, ensuring your project stays current and secure.",
	},
];

const whyChooseMe = [
	{
		icon: Handshake,
		title: "Trusted Developer Network",
		description: "I&apos;ve built relationships with skilled developers over 8+ years. You get access to vetted professionals who deliver quality work on time.",
	},
	{
		icon: PenTool,
		title: "Design-First Approach",
		description: "As a designer who understands development, I ensure the development team has everything they need to build exactly what was designed.",
	},
	{
		icon: Users,
		title: "Single Point of Contact",
		description: "Instead of managing multiple vendors, you work with me as your single point of contact who coordinates the entire project from design to deployment.",
	},
];

const processSteps = [
	{
		icon: Search,
		title: "Project Planning & Strategy",
		description: "We define your project requirements, technical needs, and select the best development partner from my trusted network.",
		step: "01",
	},
	{
		icon: PenTool,
		title: "Design & Development Planning",
		description: "I create the designs while coordinating with developers to ensure technical feasibility and smooth implementation planning.",
		step: "02",
	},
	{
		icon: Code,
		title: "Development Coordination",
		description: "I manage the relationship with developers, ensure design integrity, and keep you updated throughout the development process.",
		step: "03",
	},
	{
		icon: Milestone,
		title: "Launch & Handoff",
		description: "We test, launch, and provide you with everything you need to maintain your project, plus ongoing support coordination as needed.",
		step: "04",
	},
];

const stats = [
	{ number: "50+", label: "Projects Coordinated", icon: Handshake },
	{ number: "10+", label: "Developer Partners", icon: Network },
	{ number: "8+", label: "Years Experience", icon: Star },
	{ number: "100%", label: "Client Satisfaction", icon: CheckCircle },
];

const faqItems = [
	{
		question: "Do you actually code/develop websites yourself?",
		answer: "I focus on design and prefer to partner with trusted developers for coding/implementation. This allows me to concentrate on creating exceptional designs while ensuring you get expert development work from specialists.",
	},
	{
		question: "How do you choose development partners?",
		answer: "I work with a carefully vetted network of developers I&apos;ve built relationships with over 8+ years. I match you with the right developer based on your project&apos;s specific technical requirements and timeline.",
	},
	{
		question: "What&apos;s your role during development?",
		answer: "I serve as your project coordinator and design advocate, ensuring the development team has detailed specifications, maintaining design integrity throughout development, and keeping you informed of progress.",
	},
	{
		question: "What if there are issues with the development work?",
		answer: "I maintain quality standards throughout the process and coordinate with developers to resolve any issues. My ongoing relationships with these developers ensure accountability and quality results.",
	},
	{
		question: "Can you work with my existing development team?",
		answer: "Absolutely! I can work with your internal developers or existing development partners, providing designs, specifications, and coordination to ensure a successful project outcome.",
	},
];

const caseStudies = [
	{
		title: "E-commerce Platform Development",
		client: "RetailTech Solutions",
		challenge: "Complex product catalog with custom functionality",
		solution: "Next.js with headless CMS and custom API integration",
		results: [
			{ metric: "Page Load Speed", improvement: "+85%" },
			{ metric: "Development Time", improvement: "-40%" },
			{ metric: "User Experience", improvement: "+95%" },
		],
		duration: "8 weeks",
		testimonial: "Byron coordinated everything perfectly. The handoff from design to development was seamless.",
	},
	{
		title: "SaaS Dashboard Development",
		client: "DataFlow Analytics",
		challenge: "Real-time data visualization with complex UI",
		solution: "React with TypeScript and custom component library",
		results: [
			{ metric: "Component Reusability", improvement: "+200%" },
			{ metric: "Development Speed", improvement: "+150%" },
			{ metric: "Code Quality", improvement: "+90%" },
		],
		duration: "12 weeks",
		testimonial: "The design system Byron created made development incredibly efficient. Outstanding coordination.",
	},
	{
		title: "Mobile App Development",
		client: "HealthTech Innovations",
		challenge: "Cross-platform mobile app with offline capabilities",
		solution: "React Native with custom backend integration",
		results: [
			{ metric: "Cross-platform Compatibility", improvement: "+100%" },
			{ metric: "Development Cost", improvement: "-35%" },
			{ metric: "Time to Market", improvement: "-50%" },
		],
		duration: "16 weeks",
		testimonial: "Byron's partnership approach delivered exactly what we needed. Highly recommend.",
	},
];

const pricingTiers = [
	{
		name: "Design + Coordination",
		price: "$3,500",
		description: "Design with development coordination",
		features: ["Complete UI/UX design", "Developer matching", "Project coordination", "Design handoff", "Quality assurance", "Launch support"],
		popular: false,
		cta: "Get Started",
	},
	{
		name: "Full Partnership",
		price: "$7,500",
		description: "Complete design-to-development solution",
		features: ["Everything in Design + Coordination", "Dedicated project manager", "Advanced prototyping", "User testing", "Performance optimization", "3 months support", "Priority developer access"],
		popular: true,
		cta: "Most Popular",
	},
	{
		name: "Enterprise",
		price: "Custom",
		description: "Large-scale project management",
		features: ["Multiple developer teams", "Complex system architecture", "Advanced integrations", "Team training", "Ongoing maintenance", "24/7 support", "12-month partnership"],
		popular: false,
		cta: "Contact Us",
	},
];

const testimonials = [
	{
		name: "Alex Rodriguez",
		role: "CTO",
		company: "RetailTech Solutions",
		content: "Byron's coordination between design and development was flawless. The project delivered exactly as designed.",
		rating: 5,
		image: "/api/placeholder/60/60",
	},
	{
		name: "Maria Chen",
		role: "Product Manager",
		company: "DataFlow Analytics",
		content: "Working with Byron meant we got both exceptional design and expert development. Perfect partnership model.",
		rating: 5,
		image: "/api/placeholder/60/60",
	},
	{
		name: "James Wilson",
		role: "Founder",
		company: "HealthTech Innovations",
		content: "Byron's developer network is top-notch. The quality and coordination exceeded our expectations completely.",
		rating: 5,
		image: "/api/placeholder/60/60",
	},
];

export default function DevelopmentPage() {
	return (
		<>
			<PageHeader title="Development">
				<Link prefetch={true} href="https://reactjs.org" className="text-[#61dafb] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">React</CodedText>
				</Link>
				<Link prefetch={true} href="https://nodejs.org" className="text-[#339933] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Node.js</CodedText>
				</Link>
				<Link prefetch={true} href="https://www.typescriptlang.org" className="text-[#007acc] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">TypeScript</CodedText>
				</Link>
				<Link prefetch={true} href="https://wordpress.org" className="text-[#21759b] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">WordPress</CodedText>
				</Link>
				<Link prefetch={true} href="https://ghost.org" className="text-[#15171A] text-5xl font-bold hover:text-yellow-400">
					<TextStroke strokeColor="white" textColor="black" strokeWidth={1} className="text-black text-5xl font-bold">
						<CodedText className="hover:underline">Ghost</CodedText>
					</TextStroke>
				</Link>
				<Link prefetch={true} href="https://www.shopify.com" className="text-[#95BF47] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Shopify</CodedText>
				</Link>
				<Link prefetch={true} href="https://webflow.com" className="text-[#4353FF] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Webflow</CodedText>
				</Link>
				<Link prefetch={true} href="https://wix.com" className="text-white text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Wix</CodedText>
				</Link>
				<Link prefetch={true} href="https://squarespace.com" className="text-[#000000] text-5xl font-bold hover:text-yellow-400">
					<TextStroke strokeColor="white" textColor="black" strokeWidth={1} className="text-black text-5xl font-bold">
						<CodedText className="hover:underline">Squarespace</CodedText>
					</TextStroke>
				</Link>
				<Link prefetch={true} href="https://www.framer.com" className="text-[#0055FF] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Framer</CodedText>
				</Link>
				<Link prefetch={true} href="https://tailwindcss.com" className="text-[#38b2ac] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Tailwind CSS</CodedText>
				</Link>
				<Link prefetch={true} href="https://graphql.org" className="text-[#e10098] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">GraphQL</CodedText>
				</Link>
				<Link prefetch={true} href="https://payloadcms.com" className="text-[#1A1A1A] text-5xl font-bold hover:text-yellow-400">
					<TextStroke strokeColor="white" textColor="black" strokeWidth={1} className="text-black text-5xl font-bold">
						<CodedText className="hover:underline">Payload</CodedText>
					</TextStroke>
				</Link>
				<Link prefetch={true} href="https://www.docker.com" className="text-[#2496ed] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Docker</CodedText>
				</Link>
				<Link prefetch={true} href="https://github.com" className="text-[#181717] text-5xl font-bold hover:text-yellow-400">
					<TextStroke strokeColor="white" textColor="black" strokeWidth={1} className="text-black text-5xl font-bold">
						<CodedText className="hover:underline">GitHub</CodedText>
					</TextStroke>
				</Link>
			</PageHeader>

			{/* Hero Section */}
			<section className="relative flex items-center justify-center min-h-[60vh] text-center px-4 py-24">
				<div className="container mx-auto max-w-5xl">
					<div className="mb-8">
						<span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-secondary/50 text-foreground border border-border/30">
							<Handshake className="w-4 h-4 mr-2 text-yellow-600" />
							Development Partnership
						</span>
					</div>
					<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-8 leading-tight">
						Connecting You with <span className="text-yellow-600">Expert Developers</span>
					</h1>
					<p className="text-lg text-muted-foreground md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">I focus on design and partner with trusted developers to bring your projects to life. Get the best of both worlds - exceptional design and expert development through my vetted network.</p>
					<div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Network className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Trusted Partners</span>
						</div>
						<div className="flex items-center gap-2">
							<ShieldCheck className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Quality Assured</span>
						</div>
						<div className="flex items-center gap-2">
							<Users className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Single Point of Contact</span>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
						{stats.map((stat, index) => (
							<div key={index} className="text-center">
								<div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-600/10 rounded-lg">
									<stat.icon className="w-6 h-6 text-yellow-600" />
								</div>
								<div className="text-3xl font-bold mb-2">{stat.number}</div>
								<div className="text-muted-foreground font-medium text-sm">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section id="services" className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Development Services</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Comprehensive project coordination from design to deployment through my trusted developer network.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{devServices.map((service, index) => (
							<Card key={service.title} className="group bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
								<CardHeader>
									<div className="flex items-center gap-4 mb-2">
										<div className="bg-yellow-600/10 p-3 rounded-lg group-hover:bg-yellow-600/20 transition-colors">
											<service.icon className="w-6 h-6 text-yellow-600" />
										</div>
										<CardTitle className="text-xl">{service.title}</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground leading-relaxed">{service.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Why Choose Me Section */}
			<section className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Why Partner with Me</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">I bridge the gap between design and development, ensuring your project gets both exceptional design and expert implementation.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						{whyChooseMe.map((reason, index) => (
							<div key={reason.title} className="text-center">
								<div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-yellow-600/10 rounded-full">
									<reason.icon className="w-8 h-8 text-yellow-600" />
								</div>
								<h3 className="text-xl font-bold mb-4">{reason.title}</h3>
								<p className="text-muted-foreground leading-relaxed">{reason.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* My Process Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">My Process</h2>
						<p className="text-lg text-muted-foreground">From design to deployment, I coordinate every step to ensure exceptional results.</p>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
						<div className="space-y-8">
							{processSteps.map((step, index) => (
								<div key={step.title} className="flex gap-6">
									<div className="flex flex-col items-center">
										<div className="bg-yellow-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">{step.step}</div>
										{index < processSteps.length - 1 && <div className="w-0.5 h-16 bg-yellow-600/20 mt-4" />}
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
									<Network className="w-8 h-8 text-yellow-600" />
								</div>
								<h3 className="text-2xl font-bold mb-4">Partnership Approach</h3>
								<p className="text-muted-foreground">I focus on design excellence while coordinating with expert developers, giving you the best of both specialized skillsets.</p>
							</div>
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Vetted developer network</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Design integrity maintained</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Single point of contact</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Quality assurance throughout</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Case Studies Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Project Success Stories</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Real projects delivered through my development partnership network with exceptional results.</p>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{caseStudies.map((study, index) => (
							<Card key={index} className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
								<CardHeader>
									<div className="flex items-center justify-between mb-4">
										<Badge variant="outline" className="text-xs">
											{study.client}
										</Badge>
										<Badge className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30">{study.duration}</Badge>
									</div>
									<CardTitle className="text-xl">{study.title}</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<div>
										<h4 className="font-semibold text-sm text-foreground mb-2">Challenge:</h4>
										<p className="text-sm text-muted-foreground">{study.challenge}</p>
									</div>
									<div>
										<h4 className="font-semibold text-sm text-foreground mb-2">Solution:</h4>
										<p className="text-sm text-muted-foreground">{study.solution}</p>
									</div>
									<div>
										<h4 className="font-semibold text-sm text-foreground mb-3">Results:</h4>
										<div className="space-y-3">
											{study.results.map((result, idx) => (
												<div key={idx} className="flex items-center justify-between">
													<span className="text-sm text-muted-foreground">{result.metric}</span>
													<Badge className="bg-green-500/10 text-green-600 border-green-500/30 text-xs">{result.improvement}</Badge>
												</div>
											))}
										</div>
									</div>
									<blockquote className="text-sm italic text-muted-foreground border-l-2 border-yellow-600/30 pl-4">&ldquo;{study.testimonial}&rdquo;</blockquote>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Partnership Packages</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Transparent pricing for design and development coordination services.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{pricingTiers.map((tier, index) => (
							<Card key={tier.name} className={`relative bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 ${tier.popular ? "border-yellow-600/50 scale-105" : ""}`}>
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
									<div className="space-y-3">
										{tier.features.map((feature, idx) => (
											<div key={idx} className="flex items-center text-sm">
												<CheckCircle className="w-4 h-4 mr-3 text-yellow-600 flex-shrink-0" />
												<span>{feature}</span>
											</div>
										))}
									</div>
									<Button className={`w-full ${tier.popular ? "bg-yellow-600 hover:bg-yellow-700 text-black" : "border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600"}`} variant={tier.popular ? "default" : "outline"}>
										{tier.cta}
									</Button>
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
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Client Testimonials</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">What clients say about working with me and my development partners.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{testimonials.map((testimonial, index) => (
							<Card key={index} className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
								<CardContent className="p-8">
									<div className="flex items-center mb-4">
										{[...Array(testimonial.rating)].map((_, i) => (
											<Star key={i} className="w-5 h-5 text-yellow-600 fill-current" />
										))}
									</div>
									<blockquote className="text-foreground mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</blockquote>
									<div className="flex items-center">
										<div className="w-12 h-12 bg-yellow-600/10 rounded-full flex items-center justify-center mr-4">
											<Users className="w-6 h-6 text-yellow-600" />
										</div>
										<div>
											<div className="font-semibold text-foreground">{testimonial.name}</div>
											<div className="text-sm text-muted-foreground">
												{testimonial.role}, {testimonial.company}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section id="faq" className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Frequently Asked Questions</h2>
						<p className="text-lg text-muted-foreground">Common questions about my development partnership approach.</p>
					</div>
					<Accordion type="single" collapsible className="w-full">
						{faqItems.map((item, index) => (
							<AccordionItem key={index} value={item.question} className="border border-border/30 rounded-lg mb-4 px-6 bg-background/50">
								<AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">{item.question}</AccordionTrigger>
								<AccordionContent className="text-base text-muted-foreground pb-6">{item.answer}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</section>
		</>
	);
}
