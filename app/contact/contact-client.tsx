"use client";

import { useRef, useState, useEffect } from "react";
import { Send, Loader2, Phone, Mail, MapPin, Clock, MessageCircle, Code, Wrench, CheckCircle, Star, ArrowRight, Monitor, Laptop, Building, Globe, User, Briefcase, DollarSign, FileText, Coffee, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { sendEmail } from "@/app/actions/send-email";
import { useSearchParams } from "next/navigation";
import { ObfuscatedEmail, ObfuscatedPhone } from "@/components/ui/obfuscated-contact";

export default function ContactClient() {
	const { toast } = useToast();
	const searchParams = useSearchParams();
	const formRef = useRef<HTMLFormElement>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		company: "",
		message: "",
		projectType: [] as string[],
		budget: "",
		timeline: "",
		monthlyBudget: "",
		websiteUrl: "",
		hearAboutUs: "",
		inspiration: "",
	});

	// Pre-fill service if coming from specific page
	useEffect(() => {
		const service = searchParams.get("service");
		if (service) {
			setFormData((prev) => ({
				...prev,
				projectType: [service],
			}));
		}
	}, [searchParams]);

	const handleInputChange = (field: string, value: string | string[]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleProjectTypeChange = (type: string) => {
		setFormData((prev) => ({
			...prev,
			projectType: prev.projectType.includes(type) ? prev.projectType.filter((t) => t !== type) : [...prev.projectType, type],
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isSubmitting) return;

		setIsSubmitting(true);

		try {
			const result = await sendEmail(formData);

			if (result.success) {
				toast({
					title: "Message sent successfully!",
					description: "I'll get back to you as soon as possible.",
				});
				setFormData({
					name: "",
					email: "",
					phone: "",
					company: "",
					message: "",
					projectType: [],
					budget: "",
					timeline: "",
					monthlyBudget: "",
					websiteUrl: "",
					hearAboutUs: "",
					inspiration: "",
				});
				formRef.current?.reset();
			} else {
				toast({
					title: "Failed to send message",
					description: result.error || "Please try again later.",
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "An error occurred",
				description: "Please try again later.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const scrollToForm = () => {
		document.getElementById("contact-form")?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	};

	const projectTypes = [
		{ id: "web-development", label: "Web Development", icon: Monitor, description: "Custom websites & web apps" },
		{ id: "e-commerce", label: "E-commerce", icon: Star, description: "Online stores & marketplaces" },
		{ id: "mobile-app", label: "Mobile App", icon: Laptop, description: "iOS & Android applications" },
		{ id: "plumbing-residential", label: "Residential Plumbing", icon: Wrench, description: "Home plumbing services" },
		{ id: "plumbing-commercial", label: "Commercial Plumbing", icon: Building, description: "Business plumbing solutions" },
		{ id: "septic-systems", label: "Septic Systems", icon: Code, description: "Septic installation & repair" },
		{ id: "consultation", label: "Consultation", icon: MessageCircle, description: "Expert advice & planning" },
		{ id: "other", label: "Other", icon: Globe, description: "Custom solutions" },
	];

	const budgetRanges = ["Under $5,000", "$5,000 - $15,000", "$15,000 - $50,000", "$50,000 - $100,000", "Over $100,000", "Let's discuss"];
	const timelineOptions = ["ASAP", "Within 1 month", "1-3 months", "3-6 months", "6+ months", "Flexible"];
	const monthlyBudgetOptions = ["Under $500/month", "$500 - $1,500/month", "$1,500 - $5,000/month", "$5,000+ /month", "Not needed"];

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative flex items-center justify-center min-h-[60vh] text-center px-4 py-24">
				<div className="container mx-auto max-w-5xl">
					<div className="mb-8">
						<span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-secondary/50 text-foreground border border-border/30">
							<Mail className="w-4 h-4 mr-2 text-yellow-600" />
							Let&apos;s Build Something Amazing
						</span>
					</div>
					<h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-8 leading-tight">
						Ready to Start Your <span className="text-yellow-600">Next Project?</span>
					</h1>
					<p className="text-lg text-muted-foreground md:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">Whether you need cutting-edge web development or reliable plumbing services, I&apos;m here to help. Let&apos;s discuss your project and turn your vision into reality.</p>
					<div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Shield className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Licensed & Insured</span>
						</div>
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">24hr Response</span>
						</div>
						<div className="flex items-center gap-2">
							<MapPin className="w-4 h-4 text-yellow-600" />
							<span className="font-medium">Georgia • Worldwide</span>
						</div>
					</div>
				</div>
			</section>

			{/* Quick Contact Options */}
			<section className="py-16 bg-secondary/10">
				<div className="container mx-auto px-4">
					<div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						{/* Email Card */}
						<Card className="group bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
							<CardContent className="p-8 text-center">
								<div className="bg-yellow-600/10 p-4 rounded-lg inline-flex mb-6 group-hover:bg-yellow-600/20 transition-colors">
									<Mail className="w-8 h-8 text-yellow-600" />
								</div>
								<h3 className="text-xl font-bold mb-3">Email First</h3>
								<Badge className="mb-4 bg-yellow-600 text-white border-0">Preferred Method</Badge>
								<div className="mb-4">
									<ObfuscatedEmail className="text-sm text-muted-foreground font-medium" />
								</div>
								<p className="text-muted-foreground mb-6 text-sm leading-relaxed">Get detailed responses within 24 hours. Perfect for project discussions.</p>
								<Button size="lg" className="w-full">
									<Mail className="w-4 h-4 mr-2" />
									Send Email
								</Button>
							</CardContent>
						</Card>

						{/* Form Card */}
						<Card className="group bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
							<CardContent className="p-8 text-center">
								<div className="bg-yellow-600/10 p-4 rounded-lg inline-flex mb-6 group-hover:bg-yellow-600/20 transition-colors">
									<FileText className="w-8 h-8 text-yellow-600" />
								</div>
								<h3 className="text-xl font-bold mb-3">Project Form</h3>
								<Badge variant="outline" className="mb-4 border-yellow-600/50 text-yellow-600">
									Comprehensive
								</Badge>
								<p className="text-muted-foreground mb-6 text-sm leading-relaxed">Share detailed project requirements for accurate estimates and planning.</p>
								<Button size="lg" variant="outline" className="w-full border-yellow-600/50 text-yellow-600 hover:bg-yellow-600 hover:text-white" onClick={scrollToForm}>
									<ArrowRight className="w-4 h-4 mr-2" />
									Start Project Form
								</Button>
							</CardContent>
						</Card>

						{/* Phone Card */}
						<Card className="group bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30">
							<CardContent className="p-8 text-center">
								<div className="bg-yellow-600/10 p-4 rounded-lg inline-flex mb-6 group-hover:bg-yellow-600/20 transition-colors">
									<Phone className="w-8 h-8 text-yellow-600" />
								</div>
								<h3 className="text-xl font-bold mb-3">Emergency Call</h3>
								<Badge variant="outline" className="mb-4 border-orange-500/50 text-orange-600">
									Urgent Only
								</Badge>
								<div className="mb-4">
									<ObfuscatedPhone className="text-sm text-muted-foreground font-medium" />
								</div>
								<p className="text-muted-foreground mb-6 text-sm leading-relaxed">For urgent plumbing emergencies only. Email preferred for all other inquiries.</p>
								<Button size="lg" variant="outline" className="w-full">
									<Phone className="w-4 h-4 mr-2" />
									Emergency Call
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Main Form Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="max-w-5xl mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Tell Me About Your Project</h2>
							<p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">The more details you provide, the better I can understand your vision and deliver exceptional results.</p>
						</div>

						<Card id="contact-form" className="bg-secondary/50 border-border/30">
							<CardHeader className="bg-secondary/30 border-b border-border/30 p-8">
								<CardTitle className="text-2xl flex items-center">
									<div className="bg-yellow-600/10 p-3 rounded-lg mr-4">
										<Coffee className="w-6 h-6 text-yellow-600" />
									</div>
									Let&apos;s Get Started
								</CardTitle>
								<p className="text-muted-foreground mt-3">Fill out the form below and I&apos;ll get back to you within 24 hours with a detailed response.</p>
							</CardHeader>

							<CardContent className="p-8">
								<form ref={formRef} onSubmit={handleSubmit} className="space-y-12">
									{/* Personal Information */}
									<div className="space-y-8">
										<div className="flex items-center gap-4 mb-6">
											<div className="bg-yellow-600/10 p-3 rounded-lg">
												<User className="w-5 h-5 text-yellow-600" />
											</div>
											<h3 className="text-xl font-bold">Your Information</h3>
										</div>

										<div className="grid md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="name" className="text-sm font-medium">
													Full Name *
												</Label>
												<Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required placeholder="John Doe" className="h-12" />
											</div>
											<div className="space-y-2">
												<Label htmlFor="email" className="text-sm font-medium">
													Email Address *
												</Label>
												<Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required placeholder="john@company.com" className="h-12" />
											</div>
										</div>

										<div className="grid md:grid-cols-2 gap-6">
											<div className="space-y-2">
												<Label htmlFor="company" className="text-sm font-medium">
													Company/Organization
												</Label>
												<Input id="company" value={formData.company} onChange={(e) => handleInputChange("company", e.target.value)} placeholder="Your Company Inc." className="h-12" />
											</div>
											<div className="space-y-2">
												<Label htmlFor="phone" className="text-sm font-medium">
													Phone Number
												</Label>
												<Input id="phone" type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="(555) 123-4567" className="h-12" />
											</div>
										</div>
									</div>

									{/* Services */}
									<div className="space-y-8">
										<div className="flex items-center gap-4 mb-6">
											<div className="bg-yellow-600/10 p-3 rounded-lg">
												<Briefcase className="w-5 h-5 text-yellow-600" />
											</div>
											<h3 className="text-xl font-bold">Services Needed *</h3>
										</div>

										<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
											{projectTypes.map((type) => {
												const Icon = type.icon;
												const isSelected = formData.projectType.includes(type.id);

												return (
													<div key={type.id} onClick={() => handleProjectTypeChange(type.id)} className={`group relative border rounded-lg p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${isSelected ? "border-yellow-600 bg-yellow-600/5" : "border-border hover:border-yellow-600/50 bg-secondary/30"}`}>
														<div className="flex items-center justify-between mb-3">
															<Icon className={`w-5 h-5 transition-colors ${isSelected ? "text-yellow-600" : "text-muted-foreground group-hover:text-yellow-600"}`} />
															<div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "border-yellow-600 bg-yellow-600" : "border-border bg-background"}`}>{isSelected && <CheckCircle className="w-2.5 h-2.5 text-white" />}</div>
														</div>
														<h4 className={`font-semibold text-sm mb-2 transition-colors ${isSelected ? "text-foreground" : "text-foreground"}`}>{type.label}</h4>
														<p className={`text-xs transition-colors ${isSelected ? "text-muted-foreground" : "text-muted-foreground"}`}>{type.description}</p>
													</div>
												);
											})}
										</div>
									</div>

									{/* Budget & Timeline */}
									<div className="space-y-8">
										<div className="flex items-center gap-4 mb-6">
											<div className="bg-yellow-600/10 p-3 rounded-lg">
												<DollarSign className="w-5 h-5 text-yellow-600" />
											</div>
											<h3 className="text-xl font-bold">Budget & Timeline</h3>
										</div>

										<div className="grid lg:grid-cols-2 gap-8">
											<div className="space-y-4">
												<Label className="text-sm font-medium">Project Budget Range</Label>
												<div className="space-y-2">
													{budgetRanges.map((range) => (
														<label key={range} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors group">
															<input type="radio" name="budget" value={range} checked={formData.budget === range} onChange={(e) => handleInputChange("budget", e.target.value)} className="w-4 h-4 text-yellow-600 border-border focus:ring-yellow-600" />
															<span className="text-sm font-medium group-hover:text-yellow-600 transition-colors">{range}</span>
														</label>
													))}
												</div>
											</div>

											<div className="space-y-4">
												<Label className="text-sm font-medium">Project Timeline</Label>
												<div className="space-y-2">
													{timelineOptions.map((option) => (
														<label key={option} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors group">
															<input type="radio" name="timeline" value={option} checked={formData.timeline === option} onChange={(e) => handleInputChange("timeline", e.target.value)} className="w-4 h-4 text-yellow-600 border-border focus:ring-yellow-600" />
															<span className="text-sm font-medium group-hover:text-yellow-600 transition-colors">{option}</span>
														</label>
													))}
												</div>
											</div>
										</div>

										{/* Monthly Budget */}
										<div className="space-y-4">
											<Label className="text-sm font-medium">Ongoing Monthly Budget (maintenance, hosting, etc.)</Label>
											<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
												{monthlyBudgetOptions.map((option) => (
													<label key={option} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition-colors group">
														<input type="radio" name="monthlyBudget" value={option} checked={formData.monthlyBudget === option} onChange={(e) => handleInputChange("monthlyBudget", e.target.value)} className="w-4 h-4 text-yellow-600 border-border focus:ring-yellow-600" />
														<span className="text-xs font-medium group-hover:text-yellow-600 transition-colors">{option}</span>
													</label>
												))}
											</div>
										</div>
									</div>

									{/* Project Details */}
									<div className="space-y-8">
										<div className="flex items-center gap-4 mb-6">
											<div className="bg-yellow-600/10 p-3 rounded-lg">
												<FileText className="w-5 h-5 text-yellow-600" />
											</div>
											<h3 className="text-xl font-bold">Project Details</h3>
										</div>

										<div className="space-y-6">
											<div className="space-y-2">
												<Label htmlFor="message" className="text-sm font-medium">
													Tell me about your project *
												</Label>
												<Textarea id="message" value={formData.message} onChange={(e) => handleInputChange("message", e.target.value)} required placeholder="Describe your project goals, key features, requirements, target audience, and what success looks like for you..." rows={6} className="resize-none" />
											</div>

											<div className="grid md:grid-cols-2 gap-6">
												<div className="space-y-2">
													<Label htmlFor="websiteUrl" className="text-sm font-medium">
														Current Website
													</Label>
													<Input id="websiteUrl" type="url" value={formData.websiteUrl} onChange={(e) => handleInputChange("websiteUrl", e.target.value)} placeholder="https://yourwebsite.com" className="h-12" />
												</div>
												<div className="space-y-2">
													<Label htmlFor="hearAboutUs" className="text-sm font-medium">
														How did you find me?
													</Label>
													<Input id="hearAboutUs" value={formData.hearAboutUs} onChange={(e) => handleInputChange("hearAboutUs", e.target.value)} placeholder="Google, referral, social media, etc." className="h-12" />
												</div>
											</div>

											<div className="space-y-2">
												<Label htmlFor="inspiration" className="text-sm font-medium">
													Project Inspiration & Examples
												</Label>
												<Textarea id="inspiration" value={formData.inspiration} onChange={(e) => handleInputChange("inspiration", e.target.value)} placeholder="Share any websites, apps, designs, or examples that inspire your project. Include URLs if possible..." rows={4} className="resize-none" />
											</div>
										</div>
									</div>

									{/* Submit Button */}
									<div className="pt-8">
										<Button type="submit" size="lg" className="w-full h-14 text-lg font-semibold" disabled={isSubmitting}>
											{isSubmitting ? (
												<>
													<Loader2 className="w-5 h-5 mr-2 animate-spin" />
													Sending Your Message...
												</>
											) : (
												<>
													<Send className="w-5 h-5 mr-2" />
													Send Project Details
												</>
											)}
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Footer CTA */}
			<section className="py-16 bg-secondary/10">
				<div className="container mx-auto px-4 text-center">
					<div className="max-w-4xl mx-auto">
						<h3 className="text-2xl md:text-3xl font-bold mb-6">Ready to Transform Your Ideas Into Reality?</h3>
						<div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground mb-8">
							<div className="flex items-center bg-secondary/50 px-4 py-2 rounded-lg">
								<MapPin className="w-4 h-4 mr-2 text-yellow-600" />
								<span className="font-medium">Georgia • Serving Worldwide</span>
							</div>
							<div className="flex items-center bg-secondary/50 px-4 py-2 rounded-lg">
								<Clock className="w-4 h-4 mr-2 text-yellow-600" />
								<span className="font-medium">24hr Response Guarantee</span>
							</div>
							<div className="flex items-center bg-secondary/50 px-4 py-2 rounded-lg">
								<Shield className="w-4 h-4 mr-2 text-yellow-600" />
								<span className="font-medium">Licensed & Insured</span>
							</div>
						</div>
						<p className="text-lg text-muted-foreground leading-relaxed">Every extraordinary project starts with a conversation. Let&apos;s discuss your vision and create something amazing together.</p>
					</div>
				</div>
			</section>
		</div>
	);
}
