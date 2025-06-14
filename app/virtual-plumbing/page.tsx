import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Video, HelpCircle, Wrench, Clock, Shield, Star, DollarSign, BookOpen, Users, Lightbulb, Phone, Monitor, FileText, Trophy, Zap, Target, MessageCircle, Hammer } from "lucide-react";
import type { Metadata } from "next";
import { Link } from "@/components/ui/link";

export const metadata: Metadata = {
	title: "Virtual Plumbing Consultations | Expert DIY Guidance with Satisfaction Guarantee",
	description: "Learn plumbing from a master craftsman via video call. Get step-by-step guidance, tool lists, and expert teaching with a 100% satisfaction guarantee. Save thousands on plumbing projects.",
	openGraph: {
		title: "Virtual Plumbing Consultations | Expert DIY Guidance",
		description: "Personal plumbing coaching via video call. Learn from an expert, save money, and gain confidence with a satisfaction guarantee.",
		url: "https://byronwade.com/virtual-plumbing",
		images: [
			{
				url: "/api/og?title=Virtual%20Plumbing%20Consultations&subtitle=Expert%20DIY%20Guidance",
				width: 1200,
				height: 630,
				alt: "Virtual Plumbing Consultations",
			},
		],
	},
};

const consultationServices = [
	{
		icon: Video,
		title: "Live Video Instruction",
		description: "One-on-one video calls where I teach you exactly how to complete your plumbing project step-by-step, in real-time.",
	},
	{
		icon: FileText,
		title: "Custom Project Plans",
		description: "Detailed written guides with diagrams, tool lists, and material specifications tailored to your specific project.",
	},
	{
		icon: Hammer,
		title: "Tool & Material Guidance",
		description: "Expert recommendations for the right tools and parts, including where to buy them and money-saving alternatives.",
	},
	{
		icon: MessageCircle,
		title: "Follow-up Support",
		description: "Text or email support for questions that arise during your project, ensuring you complete it successfully.",
	},
];

const stats = [
	{ icon: Trophy, number: "500+", label: "Successful Projects" },
	{ icon: Users, number: "95%", label: "Success Rate" },
	{ icon: DollarSign, number: "$2,500", label: "Average Savings" },
	{ icon: Shield, number: "100%", label: "Satisfaction Guarantee" },
];

const whyChooseVirtual = [
	{
		icon: DollarSign,
		title: "Save Thousands",
		description: "Avoid expensive service calls and markups. Most consultations pay for themselves in savings on the first project alone.",
	},
	{
		icon: BookOpen,
		title: "Learn Valuable Skills",
		description: "Gain knowledge and confidence for future projects. You'll be able to handle similar repairs independently.",
	},
	{
		icon: Clock,
		title: "Immediate Help",
		description: "Get expert guidance when you need it most, without waiting days or weeks for a plumber's availability.",
	},
];

const processSteps = [
	{
		step: "1",
		icon: Phone,
		title: "Book Your Session",
		description: "Schedule a consultation at your convenience. Choose from various time slots that work with your schedule.",
	},
	{
		step: "2",
		icon: Video,
		title: "Project Assessment",
		description: "Show me your plumbing issue via video call. I'll diagnose the problem and explain exactly what needs to be done.",
	},
	{
		step: "3",
		icon: FileText,
		title: "Custom Action Plan",
		description: "Receive a detailed plan with step-by-step instructions, tool requirements, and material specifications.",
	},
	{
		step: "4",
		icon: Wrench,
		title: "Live Guidance",
		description: "I guide you through each step in real-time, ensuring you understand every aspect of the repair process.",
	},
	{
		step: "5",
		icon: CheckCircle,
		title: "Successful Completion",
		description: "Complete your project with confidence, knowing it's done correctly and up to professional standards.",
	},
];

const projectTypes = [
	{ name: "Faucet Repair & Replacement", difficulty: "Beginner", time: "1-2 hours" },
	{ name: "Toilet Repairs & Installation", difficulty: "Beginner", time: "2-3 hours" },
	{ name: "Garbage Disposal Installation", difficulty: "Intermediate", time: "2-4 hours" },
	{ name: "Sink & Drain Unclogging", difficulty: "Beginner", time: "1-2 hours" },
	{ name: "Water Heater Troubleshooting", difficulty: "Intermediate", time: "1-3 hours" },
	{ name: "Pipe Leak Repairs", difficulty: "Intermediate", time: "2-4 hours" },
	{ name: "Shower Head & Valve Replacement", difficulty: "Beginner", time: "1-2 hours" },
	{ name: "Drain Line Repairs", difficulty: "Advanced", time: "3-6 hours" },
];

const faqItems = [
	{
		question: "What exactly do I get with a virtual consultation?",
		answer: "You get a live, one-on-one video call with me where I teach you step-by-step how to complete your plumbing project. This includes real-time guidance, a custom written plan, tool and material lists, diagrams when needed, and follow-up support via text or email.",
	},
	{
		question: "How does the satisfaction guarantee work?",
		answer: "If you're not completely satisfied with your consultation, I'll provide additional support at no charge until your project is successfully completed. If you're still not satisfied, I'll refund your consultation fee - no questions asked.",
	},
	{
		question: "What if my project is too complex for DIY?",
		answer: "During our assessment, I'll honestly tell you if a project requires professional installation for safety or code compliance reasons. In these cases, I can provide referrals to trusted local plumbers and help you understand what to expect.",
	},
	{
		question: "Do I need any special equipment for the video call?",
		answer: "Just a smartphone, tablet, or computer with a camera and stable internet connection. I'll guide you on how to position your device to get the best view of your plumbing situation.",
	},
	{
		question: "How long do consultations typically take?",
		answer: "Most consultations range from 45 minutes to 1.5 hours, depending on project complexity. Simple repairs might take 30 minutes, while complex installations could take up to 2 hours. You're never rushed.",
	},
	{
		question: "What if I need help after the consultation?",
		answer: "I provide follow-up support via text or email for any questions that arise during your project. Most clients find this invaluable for clarifying steps or troubleshooting unexpected issues.",
	},
	{
		question: "Can you help me understand local plumbing codes?",
		answer: "Absolutely! I'll explain relevant codes and permits for your area and help you understand when professional inspection might be required. Following codes properly is always a priority.",
	},
	{
		question: "What's the cost compared to hiring a plumber?",
		answer: "Virtual consultations are a fraction of the cost of hiring a plumber. Most clients save $1,000-$5,000 on their first project alone, while gaining knowledge for future repairs. The consultation typically pays for itself many times over.",
	},
];

export default function VirtualPlumbingPage() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Service",
		serviceType: "Virtual Plumbing Consultation",
		provider: {
			"@type": "Person",
			name: "Byron Wade",
		},
		name: "Virtual Plumbing Consultation",
		description: "Expert one-on-one video consultations to guide homeowners through DIY plumbing repairs and projects with satisfaction guarantee.",
		url: "https://byronwade.com/virtual-plumbing",
		offers: {
			"@type": "Offer",
			description: "Virtual plumbing consultation with satisfaction guarantee",
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

			{/* Hero Section */}
			<section className="relative flex items-center justify-center min-h-[60vh] text-center px-4 py-24">
				<div className="container mx-auto max-w-5xl">
					<div className="mb-8">
						<span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-secondary/50 text-foreground border border-border/30">
							<Video className="w-4 h-4 mr-2 text-yellow-600" />
							Virtual Plumbing Education
						</span>
					</div>
					<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-8 leading-tight">
						Learn Plumbing from a <span className="text-yellow-600">Master Craftsman</span>
					</h1>
					<p className="text-lg text-muted-foreground md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">Get expert one-on-one plumbing instruction via video call. I&apos;ll teach you step-by-step how to complete your project safely and correctly, with a 100% satisfaction guarantee.</p>
					<div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground mb-8">
						<div className="flex items-center gap-2">
							<Shield className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Satisfaction Guarantee</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Same Day Available</span>
						</div>
						<div className="flex items-center gap-2">
							<DollarSign className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Save Thousands</span>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Button asChild size="lg" className="min-w-[200px]">
							<Link href="/contact?service=Virtual+Plumbing+Consultation">
								Book Your Consultation <ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline" className="min-w-[200px] border-yellow-600/50 text-yellow-600 hover:bg-yellow-600 hover:text-white">
							<Link href="#how-it-works">
								See How It Works <Video className="ml-2 h-4 w-4" />
							</Link>
						</Button>
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
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">What You Get</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Comprehensive virtual plumbing education designed to save you money and build lasting skills.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
						{consultationServices.map((service, index) => (
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

			{/* Why Choose Virtual Section */}
			<section className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Why Choose Virtual Consultation?</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">Smart homeowners are discovering the benefits of learning plumbing skills with expert guidance.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						{whyChooseVirtual.map((reason, index) => (
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

			{/* How It Works Section */}
			<section id="how-it-works" className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">How It Works</h2>
						<p className="text-lg text-muted-foreground">From consultation to completion - here&apos;s your journey to plumbing success.</p>
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
									<Shield className="w-8 h-8 text-yellow-600" />
								</div>
								<h3 className="text-2xl font-bold mb-4">Satisfaction Guarantee</h3>
								<p className="text-muted-foreground">I&apos;m so confident in my teaching method that I guarantee your satisfaction. If you&apos;re not completely happy with your consultation, I&apos;ll make it right or refund your investment.</p>
							</div>
							<div className="space-y-4">
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Step-by-step guidance included</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Written plans and diagrams provided</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">Follow-up support via text/email</span>
								</div>
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
									<span className="text-sm">100% satisfaction guarantee</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Project Types Section */}
			<section className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Projects I Can Teach You</h2>
						<p className="text-lg text-muted-foreground max-w-3xl mx-auto">From simple repairs to complex installations, I&apos;ll guide you through these common plumbing projects.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
						{projectTypes.map((project, index) => (
							<Card key={index} className="bg-secondary/50 border-border/30 hover:shadow-md transition-all duration-300">
								<CardContent className="p-6">
									<h4 className="font-semibold mb-3">{project.name}</h4>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-sm text-muted-foreground">Difficulty:</span>
											<Badge variant="outline" className={`text-xs ${project.difficulty === "Beginner" ? "border-green-500 text-green-600" : project.difficulty === "Intermediate" ? "border-yellow-500 text-yellow-600" : "border-red-500 text-red-600"}`}>
												{project.difficulty}
											</Badge>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm text-muted-foreground">Time:</span>
											<span className="text-sm font-medium">{project.time}</span>
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
						<p className="text-lg text-muted-foreground">Everything you need to know about virtual plumbing consultations.</p>
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

			{/* Final CTA Section */}
			<section className="py-24 bg-secondary/10">
				<div className="container mx-auto px-4 text-center">
					<div className="max-w-4xl mx-auto">
						<h3 className="text-3xl font-bold mb-6">Ready to Master Your Plumbing Project?</h3>
						<p className="text-lg text-muted-foreground mb-12 leading-relaxed">Join hundreds of satisfied homeowners who&apos;ve learned valuable plumbing skills while saving thousands on their projects. Book your virtual consultation today with complete confidence thanks to my satisfaction guarantee.</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Button asChild size="lg" className="min-w-[250px]">
								<Link href="/contact?service=Virtual+Plumbing+Consultation">
									Book Your Consultation Now <ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
						<div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground mt-8">
							<div className="flex items-center bg-secondary/50 px-4 py-2 rounded-lg">
								<Shield className="w-4 h-4 mr-2 text-yellow-600" />
								<span className="font-medium">100% Satisfaction Guarantee</span>
							</div>
							<div className="flex items-center bg-secondary/50 px-4 py-2 rounded-lg">
								<Clock className="w-4 h-4 mr-2 text-yellow-600" />
								<span className="font-medium">Same Day Booking Available</span>
							</div>
							<div className="flex items-center bg-secondary/50 px-4 py-2 rounded-lg">
								<Star className="w-4 h-4 mr-2 text-yellow-600" />
								<span className="font-medium">95% Success Rate</span>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
