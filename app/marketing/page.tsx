import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Search, BarChart3, Users, Globe, Zap, Star, CheckCircle, ArrowRight, Lightbulb, PieChart, LineChart, Activity, Award, Rocket, Eye, MousePointer, DollarSign, Calendar, Mail, MessageCircle, Share2, Smartphone, Monitor, Megaphone, Heart, ThumbsUp, TrendingDown } from "lucide-react";
import HeroPages from "@/components/sections/hero-pages";
import PageHeader from "@/components/page-header";
import CodedText from "@/components/ui/coded-text";
import Image from "next/image";

const marketingServices = [
	{
		icon: Search,
		title: "SEO Optimization",
		description: "Boost your search rankings with comprehensive SEO strategies, keyword research, and technical optimization that drives organic traffic.",
		features: ["Keyword Research", "On-Page SEO", "Technical SEO", "Content Strategy"],
		results: "+150% organic traffic",
	},
	{
		icon: Target,
		title: "PPC Advertising",
		description: "Maximize ROI with targeted Google Ads and social media campaigns designed to convert visitors into customers.",
		features: ["Google Ads", "Facebook Ads", "Campaign Optimization", "A/B Testing"],
		results: "3.2x ROAS average",
	},
	{
		icon: Users,
		title: "Social Media Marketing",
		description: "Build brand awareness and engage your audience across all major social platforms with strategic content and community management.",
		features: ["Content Creation", "Community Management", "Influencer Outreach", "Analytics"],
		results: "+200% engagement",
	},
	{
		icon: Mail,
		title: "Email Marketing",
		description: "Nurture leads and retain customers with personalized email campaigns that deliver measurable results.",
		features: ["Campaign Design", "Automation", "Segmentation", "Performance Tracking"],
		results: "25% open rate avg",
	},
	{
		icon: BarChart3,
		title: "Analytics & Reporting",
		description: "Make data-driven decisions with comprehensive analytics, conversion tracking, and detailed performance reports.",
		features: ["Google Analytics", "Conversion Tracking", "Custom Dashboards", "Monthly Reports"],
		results: "100% data accuracy",
	},
	{
		icon: Lightbulb,
		title: "Content Strategy",
		description: "Create compelling content that resonates with your audience and drives engagement across all marketing channels.",
		features: ["Content Planning", "Blog Writing", "Video Scripts", "Brand Voice"],
		results: "+180% content engagement",
	},
];

const marketingProcess = [
	{
		icon: Target,
		title: "Strategy & Planning",
		description: "We analyze your business, competitors, and target audience to create a comprehensive marketing strategy.",
		step: "01",
		duration: "1-2 weeks",
	},
	{
		icon: Rocket,
		title: "Campaign Launch",
		description: "Execute multi-channel campaigns with precise targeting, compelling creative, and optimized landing pages.",
		step: "02",
		duration: "2-3 weeks",
	},
	{
		icon: Activity,
		title: "Monitor & Optimize",
		description: "Continuously track performance, test variations, and optimize campaigns for maximum ROI.",
		step: "03",
		duration: "Ongoing",
	},
	{
		icon: BarChart3,
		title: "Report & Scale",
		description: "Provide detailed reports and scale successful campaigns while identifying new growth opportunities.",
		step: "04",
		duration: "Monthly",
	},
];

const marketingStats = [
	{ number: "150+", label: "Campaigns Launched", icon: Rocket, trend: "+12%" },
	{ number: "3.2x", label: "Average ROAS", icon: DollarSign, trend: "+8%" },
	{ number: "85%", label: "Client Retention", icon: Heart, trend: "+5%" },
	{ number: "200%", label: "Avg. Traffic Growth", icon: TrendingUp, trend: "+15%" },
];

const caseStudies = [
	{
		title: "E-commerce Growth",
		industry: "Retail",
		challenge: "Low online sales and poor conversion rates",
		solution: "Comprehensive SEO, PPC, and conversion optimization",
		results: [
			{ metric: "Revenue", improvement: "+340%" },
			{ metric: "Traffic", improvement: "+180%" },
			{ metric: "Conversion Rate", improvement: "+85%" },
		],
		duration: "6 months",
	},
	{
		title: "SaaS Lead Generation",
		industry: "Technology",
		challenge: "High customer acquisition costs",
		solution: "Content marketing, LinkedIn ads, and email automation",
		results: [
			{ metric: "Lead Quality", improvement: "+120%" },
			{ metric: "Cost per Lead", improvement: "-45%" },
			{ metric: "Trial Signups", improvement: "+200%" },
		],
		duration: "4 months",
	},
	{
		title: "Local Service Business",
		industry: "Home Services",
		challenge: "Limited local visibility and bookings",
		solution: "Local SEO, Google Ads, and reputation management",
		results: [
			{ metric: "Local Rankings", improvement: "+250%" },
			{ metric: "Phone Calls", improvement: "+160%" },
			{ metric: "Bookings", improvement: "+190%" },
		],
		duration: "3 months",
	},
];

const faqItems = [
	{
		question: "What marketing channels do you specialize in?",
		answer: "I specialize in digital marketing across multiple channels including SEO, PPC advertising (Google Ads, Facebook Ads), social media marketing, email marketing, content marketing, and analytics. I focus on creating integrated campaigns that work together for maximum impact.",
	},
	{
		question: "How do you measure marketing success?",
		answer: "Success is measured through key performance indicators (KPIs) relevant to your business goals, such as ROI, conversion rates, cost per acquisition, organic traffic growth, engagement rates, and revenue attribution. I provide detailed monthly reports with actionable insights.",
	},
	{
		question: "What's your approach to marketing strategy?",
		answer: "I start with a comprehensive analysis of your business, target audience, and competitive landscape. Then I develop a data-driven strategy that aligns with your goals, budget, and timeline. Every campaign is continuously optimized based on performance data.",
	},
	{
		question: "Do you work with businesses of all sizes?",
		answer: "Yes, I work with startups, small businesses, and established companies. My strategies are scalable and can be adapted to different budgets and growth stages. Whether you're just starting or looking to scale, I can help you achieve your marketing goals.",
	},
	{
		question: "How long does it take to see results?",
		answer: "Timeline varies by channel and goals. PPC campaigns can show results within days, while SEO typically takes 3-6 months for significant results. Social media and content marketing usually show engagement improvements within 4-8 weeks. I set realistic expectations based on your specific situation.",
	},
];

const pricingTiers = [
	{
		name: "Starter",
		price: "$2,500",
		description: "Perfect for small businesses getting started",
		features: ["SEO audit & optimization", "Google Ads setup & management", "Social media strategy", "Monthly performance reports", "Email support", "3-month commitment"],
		popular: false,
		cta: "Get Started",
	},
	{
		name: "Growth",
		price: "$5,000",
		description: "Ideal for scaling businesses",
		features: ["Multi-channel campaigns", "Advanced analytics setup", "Content marketing strategy", "Email automation", "Social media management", "Bi-weekly strategy calls", "Priority support", "6-month commitment"],
		popular: true,
		cta: "Most Popular",
	},
	{
		name: "Enterprise",
		price: "Custom",
		description: "For large-scale marketing operations",
		features: ["Full-service marketing", "Dedicated account manager", "Custom reporting dashboards", "Advanced automation", "Team training", "Unlimited revisions", "24/7 support", "12-month partnership"],
		popular: false,
		cta: "Contact Us",
	},
];

const testimonials = [
	{
		name: "Jennifer Martinez",
		role: "Marketing Director",
		company: "TechFlow Solutions",
		content: "Byron&apos;s marketing expertise transformed our lead generation. We saw a 340% increase in qualified leads within 6 months.",
		rating: 5,
		image: "/api/placeholder/60/60",
	},
	{
		name: "David Chen",
		role: "CEO",
		company: "E-commerce Plus",
		content: "The ROI from Byron's campaigns exceeded all expectations. Our revenue grew 180% while reducing customer acquisition costs.",
		rating: 5,
		image: "/api/placeholder/60/60",
	},
	{
		name: "Sarah Thompson",
		role: "Founder",
		company: "Local Services Co",
		content: "Byron&apos;s local SEO and Google Ads strategy doubled our bookings. His data-driven approach delivers real results.",
		rating: 5,
		image: "/api/placeholder/60/60",
	},
];

export default function MarketingPage() {
	return (
		<>
			<PageHeader title="Marketing">
				<Link prefetch={true} href="https://www.google.com/ads" className="text-[#4285f4] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Google Ads</CodedText>
				</Link>
				<Link prefetch={true} href="https://www.facebook.com/business" className="text-[#1877f2] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Facebook</CodedText>
				</Link>
				<Link prefetch={true} href="https://analytics.google.com" className="text-[#e37400] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Analytics</CodedText>
				</Link>
				<Link prefetch={true} href="https://www.hubspot.com" className="text-[#ff7a59] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">HubSpot</CodedText>
				</Link>
				<Link prefetch={true} href="https://mailchimp.com" className="text-[#ffe01b] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Mailchimp</CodedText>
				</Link>
				<Link prefetch={true} href="https://www.semrush.com" className="text-[#ff642d] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">SEMrush</CodedText>
				</Link>
				<Link prefetch={true} href="https://hootsuite.com" className="text-[#1a1a1a] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Hootsuite</CodedText>
				</Link>
				<Link prefetch={true} href="https://www.canva.com" className="text-[#00c4cc] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Canva</CodedText>
				</Link>
			</PageHeader>

			{/* Hero Section */}
			<section className="relative flex items-center justify-center min-h-[60vh] text-center px-4 py-24">
				<div className="container mx-auto max-w-5xl">
					<div className="mb-8">
						<span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-secondary/50 text-foreground border border-border/30">
							<TrendingUp className="w-4 h-4 mr-2 text-yellow-600" />
							Digital Marketing Expert
						</span>
					</div>
					<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-8 leading-tight">
						Grow Your Business with <span className="text-yellow-600">Data-Driven Marketing</span>
					</h1>
					<p className="text-lg text-muted-foreground md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">I help businesses increase revenue through strategic digital marketing campaigns. From SEO and PPC to social media and email marketing, I deliver measurable results that drive growth.</p>
					<div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Target className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">ROI Focused</span>
						</div>
						<div className="flex items-center gap-2">
							<BarChart3 className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Data-Driven</span>
						</div>
						<div className="flex items-center gap-2">
							<Zap className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Results Guaranteed</span>
						</div>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="py-16 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
						{marketingStats.map((stat, index) => (
							<Card key={index} className="text-center bg-secondary/50 border-border/30 hover:shadow-lg transition-all duration-300">
								<CardContent className="p-6">
									<div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-yellow-600/10 rounded-lg">
										<stat.icon className="w-6 h-6 text-yellow-600" />
									</div>
									<div className="text-3xl font-bold mb-2 text-foreground">{stat.number}</div>
									<div className="text-muted-foreground font-medium text-sm mb-2">{stat.label}</div>
									<Badge variant="outline" className="text-xs border-green-500/50 text-green-600">
										<TrendingUp className="w-3 h-3 mr-1" />
										{stat.trend}
									</Badge>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section id="services" className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Marketing Services</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Comprehensive digital marketing solutions designed to drive growth and maximize your return on investment.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{marketingServices.map((service, index) => (
							<Card key={service.title} className="group bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
								<CardHeader>
									<div className="flex items-center justify-between mb-4">
										<div className="bg-yellow-600/10 p-3 rounded-lg group-hover:bg-yellow-600/20 transition-colors">
											<service.icon className="w-6 h-6 text-yellow-600" />
										</div>
										<Badge className="bg-green-500/10 text-green-600 border-green-500/30">{service.results}</Badge>
									</div>
									<CardTitle className="text-xl mb-3">{service.title}</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<p className="text-muted-foreground leading-relaxed">{service.description}</p>
									<div className="space-y-2">
										<h4 className="font-semibold text-sm text-foreground">Key Features:</h4>
										<div className="grid grid-cols-2 gap-2">
											{service.features.map((feature, idx) => (
												<div key={idx} className="flex items-center text-xs text-muted-foreground">
													<CheckCircle className="w-3 h-3 mr-2 text-yellow-600 flex-shrink-0" />
													{feature}
												</div>
											))}
										</div>
									</div>
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
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Success Stories</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Real results from real businesses. See how strategic marketing drives measurable growth.</p>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
						{caseStudies.map((study, index) => (
							<Card key={index} className="bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300">
								<CardHeader>
									<div className="flex items-center justify-between mb-4">
										<Badge variant="outline" className="text-xs">
											{study.industry}
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
													<Badge className="bg-green-500/10 text-green-600 border-green-500/30 text-xs">
														<TrendingUp className="w-3 h-3 mr-1" />
														{result.improvement}
													</Badge>
												</div>
											))}
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Process Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">My Marketing Process</h2>
						<p className="text-lg text-muted-foreground">A proven methodology that delivers consistent results for businesses of all sizes.</p>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
						<div className="space-y-8">
							{marketingProcess.map((step, index) => (
								<div key={step.title} className="flex gap-6">
									<div className="flex flex-col items-center">
										<div className="bg-yellow-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">{step.step}</div>
										{index < marketingProcess.length - 1 && <div className="w-0.5 h-16 bg-yellow-600/20 mt-4" />}
									</div>
									<div className="flex-1 pb-8">
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center gap-3">
												<step.icon className="w-5 h-5 text-yellow-600" />
												<h4 className="text-xl font-semibold">{step.title}</h4>
											</div>
											<Badge variant="outline" className="text-xs">
												{step.duration}
											</Badge>
										</div>
										<p className="text-muted-foreground leading-relaxed">{step.description}</p>
									</div>
								</div>
							))}
						</div>
						<div className="bg-gradient-to-br from-secondary/20 to-yellow-50/20 rounded-3xl p-8 border border-yellow-600/10">
							<div className="text-center mb-8">
								<div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-600/10 rounded-full mb-4">
									<Target className="w-8 h-8 text-yellow-600" />
								</div>
								<h3 className="text-2xl font-bold mb-4">Results-Driven Approach</h3>
								<p className="text-muted-foreground">Every campaign is designed with clear objectives and measurable KPIs to ensure maximum ROI.</p>
							</div>
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Comprehensive market research</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Multi-channel campaign integration</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Continuous optimization and testing</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Detailed performance reporting</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Pricing Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Marketing Packages</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Transparent pricing for marketing services that deliver measurable results and ROI.</p>
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
			<section className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Client Success Stories</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">See what clients say about working with me and the results we've achieved together.</p>
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
										<Image src={testimonial.image} alt={testimonial.name} width={48} height={48} className="rounded-full mr-4" />
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
			<section id="faq" className="py-24">
				<div className="container mx-auto px-4 max-w-4xl">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Frequently Asked Questions</h2>
						<p className="text-lg text-muted-foreground">Common questions about my marketing services and approach.</p>
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
