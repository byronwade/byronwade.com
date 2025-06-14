import { type Metadata } from "next";
import { Person, WithContext } from "schema-dts";
import { Briefcase, GraduationCap, Mail, Phone, MapPin, Globe, Star, Building, Code, Megaphone, Wrench, Award, Download, ExternalLink, Calendar, TrendingUp, Users, Target, CheckCircle, Lightbulb, Zap, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ObfuscatedEmail, ObfuscatedPhone } from "@/components/ui/obfuscated-contact";

// Enable static generation with ISR for maximum speed
// export const revalidate = 86400; // 24 hours

export const metadata: Metadata = {
	title: "Resume | Byron Wade - Plumbing & Technology Professional",
	description: "Professional resume of Byron Wade: 8+ years managing plumbing operations, web development expertise, and proven track record of scaling businesses from startup to multi-million dollar operations.",
	alternates: {
		canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/resume`,
	},
	openGraph: {
		title: "Resume | Byron Wade - Plumbing & Technology Professional",
		description: "Experienced professional with expertise in plumbing operations, business management, and web development. Proven success scaling businesses and managing multi-million dollar operations.",
		url: `${process.env.NEXT_PUBLIC_BASE_URL}/resume`,
	},
};

// Server-side obfuscated contact info for structured data
const obfuscatedContact = {
	email: "contact" + String.fromCharCode(64) + "byronwade" + ".com",
	telephone: "+1-8xx-xxx-xxxx",
};

const jsonLdData: WithContext<Person> = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: "Byron Wade",
	email: obfuscatedContact.email,
	telephone: obfuscatedContact.telephone,
	url: "https://byronwade.com",
	jobTitle: "General Manager & Technology Professional",
	description: "Experienced professional with 8+ years in plumbing operations, business management, and web development. Proven track record of scaling businesses and managing multi-million dollar operations.",
	address: {
		"@type": "PostalAddress",
		addressLocality: "Talking Rock",
		addressRegion: "GA",
		postalCode: "30175",
	},
	worksFor: [
		{ "@type": "Organization", name: "Lanier Plumbing Services, LLC" },
		{ "@type": "Organization", name: "Wade's Plumbing & Septic" },
		{ "@type": "Organization", name: "Garrison Septic & Plumbing" },
		{ "@type": "Organization", name: "Thorbis LLC" },
	],
	alumniOf: [
		{ "@type": "EducationalOrganization", name: "San Lorenzo Valley High School" },
		{ "@type": "EducationalOrganization", name: "Cherokee High School" },
	],
	knowsAbout: ["Plumbing", "Septic Systems", "Construction Project Management", "Project Estimation", "Business Development", "Web Development", "AI Development", "SEO", "Operations Management", "Team Leadership"],
};

const workExperience = [
	{
		role: "Service Plumber",
		company: "ServiceWise Electric & Plumbing",
		location: "Georgia",
		period: "April 2024 - Present",
		type: "Full-time",
		description: "Providing comprehensive residential and commercial plumbing services with focus on customer satisfaction, diagnostic expertise, and efficient problem resolution. Preparing to officiate business operations with personal plumbing license upon approval.",
		achievements: ["Delivering high-quality service calls with emphasis on first-time fix rates", "Building strong customer relationships through professional service delivery", "Applying extensive plumbing knowledge to complex diagnostic challenges", "Maintaining excellent safety standards and company quality protocols", "Developing business officiation strategy pending license approval"],
		skills: ["Service Plumbing", "Customer Relations", "Diagnostic Skills", "Problem Solving", "Quality Control"],
	},
	{
		role: "General Manager",
		company: "Lanier Plumbing Services, LLC",
		location: "Alpharetta, GA",
		period: "September 2023 - March 2024",
		type: "Full-time",
		description: "Led operations for a growing commercial plumbing contractor with focus on estimation accuracy, service department development, and operational efficiency.",
		achievements: ["Improved project estimation accuracy, reducing change orders and increasing client satisfaction", "Developed and launched new service department, expanding revenue streams by 25%", "Implemented refined estimation practices, improving bid-to-close ratio", "Enhanced operational efficiency and team coordination"],
		skills: ["Project Management", "Business Development", "Team Leadership", "Estimation", "Operations Management"],
	},
	{
		role: "Chief Executive Officer",
		company: "Wade's Plumbing & Septic",
		location: "Los Gatos, CA",
		period: "October 2021 - August 2024",
		type: "Full-time",
		description: "Built and managed a multi-million dollar plumbing and septic service company specializing in enhanced treatment systems for residential and commercial clients.",
		achievements: ["Scaled company from startup to $2M+ annual revenue in under 3 years", "Established specialized expertise in enhanced treatment septic systems", "Achieved 95%+ client satisfaction rate through quality service delivery", "Built and managed team of 8+ technicians and support staff", "Developed comprehensive business processes and quality control systems"],
		skills: ["Executive Leadership", "Business Strategy", "Financial Management", "Regulatory Compliance", "Client Relations"],
	},
	{
		role: "Foreman Plumber & Project Manager",
		company: "Garrison Septic & Plumbing",
		location: "Scotts Valley, CA",
		period: "January 2016 - October 2021",
		type: "Full-time",
		description: "Dual role managing field operations and project oversight for residential and commercial plumbing and septic installations.",
		achievements: ["Successfully managed 100+ projects with 98% on-time completion rate", "Maintained zero safety incidents across 5+ years of field operations", "Trained and mentored 12+ junior technicians and apprentices", "Achieved consistent project completion within budget parameters", "Ensured 100% regulatory compliance on all permitted work"],
		skills: ["Project Management", "Team Leadership", "Quality Control", "Safety Management", "Training & Development"],
	},
	{
		role: "Founder & CTO",
		company: "Thorbis LLC",
		location: "Scotts Valley, CA",
		period: "April 2012 - January 2017",
		type: "Full-time",
		description: "Founded and led technology startup focused on innovative web hosting solutions with proprietary auto-scaling algorithms.",
		achievements: ["Developed proprietary auto-scaling algorithm reducing client hosting costs by 40%+", "Managed infrastructure serving 1M+ page views monthly", "Achieved 99.9% uptime across all hosted applications", "Served 50+ clients including e-commerce and SaaS platforms", "Patent-pending algorithm for predictive server load management"],
		skills: ["Software Development", "Algorithm Design", "System Architecture", "DevOps", "Entrepreneurship"],
	},
	{
		role: "Low Voltage Technician",
		company: "Clarity ITS, LLC",
		location: "Canton, GA",
		period: "April 2015 - January 2016",
		type: "Contract",
		description: "Specialized technician for critical infrastructure installations at Hartsfield-Jackson Atlanta International Airport.",
		achievements: ["Completed 50+ installations in high-security airport environment", "Maintained security clearance and perfect safety record", "Worked on mission-critical systems requiring 24/7 uptime"],
		skills: ["Low Voltage Systems", "Network Infrastructure", "Security Protocols", "Critical Systems"],
	},
	{
		role: "Senior Product Analyst",
		company: "Belnick, Inc.",
		location: "Canton, GA",
		period: "May 2013 - April 2015",
		type: "Full-time",
		description: "Data analyst and e-commerce specialist for furniture and equipment distributor.",
		achievements: ["Managed product catalog of 10,000+ SKUs with 99.5% accuracy", "Improved website conversion rates by 15% through analytics optimization", "Streamlined vendor relationships and product upload processes"],
		skills: ["E-commerce", "Data Analysis", "Vendor Management", "Web Analytics"],
	},
];

const coreSkills = [
	{ name: "Business Management", icon: Building },
	{ name: "Project Management", icon: Target },
	{ name: "Team Leadership", icon: Users },
	{ name: "Plumbing Systems", icon: Wrench },
	{ name: "Web Development", icon: Code },
	{ name: "Strategic Planning", icon: Lightbulb },
];

const technicalSkills = {
	"Plumbing & Construction": {
		icon: Wrench,
		color: "bg-blue-500",
		items: ["Residential & Commercial Plumbing", "Septic System Design & Installation", "Enhanced Treatment Systems", "Regulatory Compliance", "Project Estimation", "Quality Control", "Safety Management"],
	},
	"Business & Management": {
		icon: Building,
		color: "bg-green-500",
		items: ["Operations Management", "Financial Oversight", "Strategic Planning", "Business Development", "Team Leadership", "Client Relations", "Process Optimization", "QuickBooks Pro"],
	},
	"Technology & Development": {
		icon: Code,
		color: "bg-purple-500",
		items: ["Next.js", "React", "Node.js", "JavaScript/TypeScript", "Python", "TensorFlow", "Git", "DevOps", "Algorithm Design", "System Architecture"],
	},
	"Marketing & Analytics": {
		icon: Megaphone,
		color: "bg-orange-500",
		items: ["SEO Optimization", "Web Analytics", "Digital Marketing", "Content Strategy", "Conversion Optimization", "Google Analytics", "Performance Monitoring"],
	},
};

const achievements = [
	{
		icon: TrendingUp,
		title: "Business Growth",
		description: "Scaled Wade's Plumbing from startup to $2M+ annual revenue",
		metric: "$2M+",
	},
	{
		icon: Users,
		title: "Team Leadership",
		description: "Built and managed teams of 8+ professionals across multiple companies",
		metric: "8+ Team Members",
	},
	{
		icon: CheckCircle,
		title: "Safety Record",
		description: "Zero safety incidents across 8+ years of field operations and team management",
		metric: "Zero Incidents",
	},
	{
		icon: Award,
		title: "Client Satisfaction",
		description: "Maintained 95%+ client satisfaction across all business ventures",
		metric: "95%+ Satisfaction",
	},
];

const certifications = [
	{ name: "C-36 Plumbing License (CA)", status: "Active", year: "2018" },
	{ name: "C-42 Sanitation License (CA)", status: "Active", year: "2020" },
	{ name: "Georgia Plumbing License", status: "Pending", year: "2024" },
	{ name: "Florida Plumbing License", status: "Pending", year: "2024" },
	{ name: "Tennessee Plumbing License", status: "Pending", year: "2024" },
	{ name: "Septic System Installer (Santa Cruz County)", status: "Active", year: "2016" },
	{ name: "Septic System Installer (Santa Clara County)", status: "Active", year: "2017" },
	{ name: "Septic System Installer (Georgia)", status: "In Progress", year: "2024" },
	{ name: "Real Estate License", status: "In Progress", year: "2024" },
	{ name: "Project Management", status: "Certified", year: "2019" },
];

export default function ResumePage() {
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} id="person-jsonld" />
			<div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
				<main className="container mx-auto p-4 md:p-8 max-w-7xl">
					{/* Header Section - Mobile Optimized */}
					<div className="text-center mb-8 md:mb-12">
						<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">Byron Wade</h1>
						<p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-4 md:mb-6">General Manager & Technology Professional</p>
						<p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">Results-driven professional with 8+ years of experience scaling businesses from startup to multi-million dollar operations. Expertise in plumbing operations, team leadership, and innovative technology solutions.</p>
						<div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mt-6 md:mt-8">
							<Button size="lg" asChild className="w-full sm:w-auto">
								<Link href="/contact">
									<Mail className="mr-2 h-4 w-4 md:h-5 md:w-5" />
									Get In Touch
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
								<a href="/api/resume-pdf" download="Byron_Wade_Resume.pdf">
									<Download className="mr-2 h-4 w-4 md:h-5 md:w-5" />
									Download PDF Resume
								</a>
							</Button>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
						{/* Left Sidebar */}
						<div className="lg:col-span-1 space-y-4 md:space-y-6">
							{/* Contact Information */}
							<Card>
								<CardHeader className="pb-3 md:pb-4">
									<CardTitle className="flex items-center text-base md:text-lg">
										<Mail className="mr-2 h-4 w-4 md:h-5 md:w-5" />
										Contact Information
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3 md:space-y-4">
									<div className="flex items-center">
										<MapPin className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
										<span className="text-sm md:text-base">Talking Rock, GA</span>
									</div>
									<div className="flex items-center">
										<Mail className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
										<ObfuscatedEmail className="text-sm md:text-base" />
									</div>
									<div className="flex items-center">
										<Phone className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
										<ObfuscatedPhone className="text-sm md:text-base" />
									</div>
									<div className="flex items-center">
										<Globe className="h-4 w-4 mr-3 text-muted-foreground flex-shrink-0" />
										<a href="https://byronwade.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center text-sm md:text-base">
											byronwade.com
											<ExternalLink className="h-3 w-3 ml-1" />
										</a>
									</div>
									<Separator />
									<div className="flex items-center justify-between">
										<span className="text-sm text-muted-foreground">Willing to relocate:</span>
										<Badge variant="secondary">Anywhere</Badge>
									</div>
								</CardContent>
							</Card>

							{/* Key Achievements */}
							<Card>
								<CardHeader className="pb-3 md:pb-4">
									<CardTitle className="flex items-center text-base md:text-lg">
										<Award className="mr-2 h-4 w-4 md:h-5 md:w-5" />
										Key Achievements
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4 md:space-y-6">
									{achievements.map((achievement, index) => (
										<div key={index} className="text-center">
											<div className="bg-primary/10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
												<achievement.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
											</div>
											<div className="text-lg md:text-2xl font-bold text-primary mb-1">{achievement.metric}</div>
											<div className="text-xs md:text-sm font-medium mb-1">{achievement.title}</div>
											<div className="text-xs text-muted-foreground leading-tight">{achievement.description}</div>
										</div>
									))}
								</CardContent>
							</Card>

							{/* Core Skills */}
							<Card>
								<CardHeader className="pb-3 md:pb-4">
									<CardTitle className="flex items-center text-base md:text-lg">
										<Star className="mr-2 h-4 w-4 md:h-5 md:w-5" />
										Core Competencies
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 md:space-y-3">
									{coreSkills.map((skill, index) => (
										<div key={index} className="flex items-center">
											<skill.icon className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
											<span className="text-sm font-medium">{skill.name}</span>
										</div>
									))}
								</CardContent>
							</Card>

							{/* Certifications */}
							<Card>
								<CardHeader className="pb-3 md:pb-4">
									<CardTitle className="flex items-center text-base md:text-lg">
										<GraduationCap className="mr-2 h-4 w-4 md:h-5 md:w-5" />
										Certifications & Licenses
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2 md:space-y-3">
									{certifications.map((cert, index) => (
										<div key={index} className="flex items-center justify-between">
											<div className="flex-1 min-w-0">
												<div className="font-medium text-sm truncate">{cert.name}</div>
												<div className="text-xs text-muted-foreground">{cert.year}</div>
											</div>
											<Badge variant={cert.status === "Active" ? "default" : cert.status === "Pending" ? "secondary" : cert.status === "In Progress" ? "secondary" : cert.status === "Certified" ? "default" : "outline"} className="ml-2 flex-shrink-0 text-xs">
												{cert.status}
											</Badge>
										</div>
									))}
								</CardContent>
							</Card>
						</div>

						{/* Main Content */}
						<div className="lg:col-span-2 space-y-6 md:space-y-8">
							{/* Professional Summary */}
							<Card>
								<CardHeader className="pb-3 md:pb-4">
									<CardTitle className="flex items-center text-base md:text-lg">
										<Lightbulb className="mr-2 h-4 w-4 md:h-5 md:w-5" />
										Professional Summary
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">Dynamic General Manager and Technology Professional with over 8 years of proven success in scaling businesses, managing complex operations, and leading high-performing teams. Demonstrated expertise in transforming startups into multi-million dollar operations while maintaining exceptional quality standards and client satisfaction.</p>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
										<div className="flex items-center gap-2 md:gap-3">
											<div className="bg-green-100 text-green-600 rounded-full p-1.5 md:p-2 flex-shrink-0">
												<CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
											</div>
											<span className="text-xs md:text-sm font-medium">Multi-State Licensed Professional</span>
										</div>
										<div className="flex items-center gap-2 md:gap-3">
											<div className="bg-blue-100 text-blue-600 rounded-full p-1.5 md:p-2 flex-shrink-0">
												<TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
											</div>
											<span className="text-xs md:text-sm font-medium">Proven Business Scaling Expert</span>
										</div>
										<div className="flex items-center gap-2 md:gap-3">
											<div className="bg-purple-100 text-purple-600 rounded-full p-1.5 md:p-2 flex-shrink-0">
												<Code className="w-3 h-3 md:w-4 md:h-4" />
											</div>
											<span className="text-xs md:text-sm font-medium">Full-Stack Technology Skills</span>
										</div>
										<div className="flex items-center gap-2 md:gap-3">
											<div className="bg-orange-100 text-orange-600 rounded-full p-1.5 md:p-2 flex-shrink-0">
												<Shield className="w-3 h-3 md:w-4 md:h-4" />
											</div>
											<span className="text-xs md:text-sm font-medium">Perfect Safety Record</span>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Work Experience */}
							<Card>
								<CardHeader className="pb-3 md:pb-4">
									<CardTitle className="flex items-center text-base md:text-lg">
										<Briefcase className="mr-2 h-4 w-4 md:h-5 md:w-5" />
										Professional Experience
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6 md:space-y-8">
									{workExperience.map((job, index) => (
										<div key={index} className="relative">
											{index < workExperience.length - 1 && <div className="absolute left-3 md:left-4 top-12 md:top-16 w-0.5 h-full bg-border" />}
											<div className="flex gap-3 md:gap-4">
												<div className="bg-primary/10 w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
													<Briefcase className="w-3 h-3 md:w-4 md:h-4 text-primary" />
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
														<h3 className="text-base md:text-xl font-semibold">{job.role}</h3>
														<div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
															<Calendar className="w-3 h-3 md:w-4 md:h-4" />
															{job.period}
														</div>
													</div>
													<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-3">
														<p className="font-medium text-primary text-sm md:text-base">{job.company}</p>
														<span className="hidden sm:inline text-muted-foreground">•</span>
														<p className="text-muted-foreground text-sm md:text-base">{job.location}</p>
														<span className="hidden sm:inline text-muted-foreground">•</span>
														<Badge variant="outline" className="text-xs w-fit">
															{job.type}
														</Badge>
													</div>
													<p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">{job.description}</p>
													<div className="space-y-2 mb-4">
														<h4 className="font-medium text-sm flex items-center">
															<TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
															Key Achievements:
														</h4>
														<ul className="space-y-1">
															{job.achievements.map((achievement, i) => (
																<li key={i} className="text-xs md:text-sm text-muted-foreground flex items-start">
																	<span className="text-primary mr-2 mt-1 flex-shrink-0">•</span>
																	<span className="leading-relaxed">{achievement}</span>
																</li>
															))}
														</ul>
													</div>
													<div className="flex flex-wrap gap-1 md:gap-2">
														{job.skills.map((skill) => (
															<Badge key={skill} variant="secondary" className="text-xs px-2 py-1">
																{skill}
															</Badge>
														))}
													</div>
												</div>
											</div>
										</div>
									))}
								</CardContent>
							</Card>

							{/* Technical Skills */}
							<Card>
								<CardHeader className="pb-3 md:pb-4">
									<CardTitle className="flex items-center text-base md:text-lg">
										<Zap className="mr-2 h-4 w-4 md:h-5 md:w-5" />
										Technical Skills & Expertise
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4 md:space-y-6">
									{Object.entries(technicalSkills).map(([category, { icon: Icon, color, items }]) => (
										<div key={category}>
											<div className="flex items-center mb-3 md:mb-4">
												<div className={`${color} w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center mr-2 md:mr-3`}>
													<Icon className="h-3 w-3 md:h-4 md:w-4 text-white" />
												</div>
												<h4 className="text-sm md:text-lg font-semibold">{category}</h4>
											</div>
											<div className="flex flex-wrap gap-1 md:gap-2">
												{items.map((skill) => (
													<Badge key={skill} variant="outline" className="text-xs px-2 py-1">
														{skill}
													</Badge>
												))}
											</div>
										</div>
									))}
								</CardContent>
							</Card>

							{/* Education */}
							<Card>
								<CardHeader className="pb-3 md:pb-4">
									<CardTitle className="flex items-center text-base md:text-lg">
										<GraduationCap className="mr-2 h-4 w-4 md:h-5 md:w-5" />
										Education
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex items-center gap-3 md:gap-4">
										<div className="bg-primary/10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0">
											<GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
										</div>
										<div>
											<h4 className="font-semibold text-sm md:text-base">High School Diploma</h4>
											<p className="text-muted-foreground text-sm md:text-base">San Lorenzo Valley High School & Cherokee High School</p>
											<p className="text-xs md:text-sm text-muted-foreground">2009 - 2013</p>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Professional References */}
							<Card>
								<CardHeader className="pb-3 md:pb-4">
									<CardTitle className="flex items-center text-base md:text-lg">
										<Users className="mr-2 h-4 w-4 md:h-5 md:w-5" />
										Professional References
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="text-center py-2 md:py-4">
										<div className="bg-primary/10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
											<Users className="w-5 h-5 md:w-6 md:h-6 text-primary" />
										</div>
										<p className="text-muted-foreground text-sm">Professional references available upon request</p>
										<p className="text-xs text-muted-foreground mt-1 md:mt-2">Including former clients, colleagues, and industry partners</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</main>
			</div>
		</>
	);
}
