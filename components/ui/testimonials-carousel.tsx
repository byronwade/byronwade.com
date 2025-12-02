"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Award,
	Building,
	Calendar,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Heart,
	MapPin,
	Pause,
	Play,
	Quote,
	Star,
	TrendingUp,
	User,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface Testimonial {
	id: string;
	name: string;
	role: string;
	company: string;
	location: string;
	avatar?: string;
	rating: number;
	content: string;
	project: string;
	results?: string[];
	date: string;
	verified: boolean;
	featured?: boolean;
}

interface TestimonialsCarouselProps {
	testimonials?: Testimonial[];
	autoPlay?: boolean;
	autoPlayInterval?: number;
	showControls?: boolean;
	showIndicators?: boolean;
	className?: string;
}

const defaultTestimonials: Testimonial[] = [
	{
		id: "1",
		name: "Sarah Johnson",
		role: "Marketing Director",
		company: "TechFlow Solutions",
		location: "San Francisco, CA",
		rating: 5,
		content:
			"Byron transformed our entire digital presence. The website redesign increased our conversion rate by 340% and the SEO strategy brought us to the top of Google for our key terms. His attention to detail and strategic thinking are exceptional.",
		project: "Website Redesign & SEO",
		results: ["340% conversion increase", "Page 1 Google rankings", "85% faster load times"],
		date: "2024-01-15",
		verified: true,
		featured: true,
	},
	{
		id: "2",
		name: "Michael Chen",
		role: "CEO",
		company: "GreenTech Innovations",
		location: "Austin, TX",
		rating: 5,
		content:
			"Working with Byron was a game-changer for our startup. He didn't just build us a website - he created a complete digital strategy that helped us secure $2M in funding. The design is stunning and the functionality is flawless.",
		project: "Startup Branding & Website",
		results: ["$2M funding secured", "500% traffic increase", "Featured in TechCrunch"],
		date: "2023-12-08",
		verified: true,
	},
	{
		id: "3",
		name: "Emily Rodriguez",
		role: "Operations Manager",
		company: "Coastal Plumbing Co.",
		location: "Santa Cruz, CA",
		rating: 5,
		content:
			"Byron's local SEO work has been incredible for our plumbing business. We went from barely showing up in searches to being the #1 plumber in Santa Cruz. Our phone hasn't stopped ringing since the campaign launched.",
		project: "Local SEO & Google Ads",
		results: ["#1 local rankings", "250% more calls", "180% revenue growth"],
		date: "2024-02-20",
		verified: true,
	},
	{
		id: "4",
		name: "David Park",
		role: "Founder",
		company: "FitLife App",
		location: "Los Angeles, CA",
		rating: 5,
		content:
			"The mobile app design Byron created is absolutely beautiful and intuitive. User engagement increased by 200% after the redesign, and our app store ratings went from 3.2 to 4.8 stars. Couldn't be happier!",
		project: "Mobile App Design",
		results: ["200% engagement boost", "4.8 star rating", "50K+ downloads"],
		date: "2023-11-12",
		verified: true,
		featured: true,
	},
	{
		id: "5",
		name: "Lisa Thompson",
		role: "Brand Manager",
		company: "Artisan Coffee Co.",
		location: "Portland, OR",
		rating: 5,
		content:
			"Byron's e-commerce solution transformed our online sales. The new Shopify store is not only gorgeous but also incredibly functional. Sales increased by 420% in the first quarter after launch.",
		project: "E-commerce Development",
		results: ["420% sales increase", "95% customer satisfaction", "40% repeat customers"],
		date: "2024-01-30",
		verified: true,
	},
	{
		id: "6",
		name: "Robert Kim",
		role: "VP Marketing",
		company: "CloudSync Technologies",
		location: "Seattle, WA",
		rating: 5,
		content:
			"The comprehensive digital marketing campaign Byron developed exceeded all our expectations. Lead quality improved dramatically, and our cost per acquisition dropped by 60% while scaling our growth.",
		project: "Digital Marketing Campaign",
		results: ["60% lower CAC", "300% lead quality", "150% revenue growth"],
		date: "2023-10-25",
		verified: true,
	},
];

export default function TestimonialsCarousel({
	testimonials = defaultTestimonials,
	autoPlay = true,
	autoPlayInterval = 5000,
	showControls = true,
	showIndicators = true,
	className = "",
}: TestimonialsCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(autoPlay);
	const [isPaused, setIsPaused] = useState(false);

	// Auto-play functionality
	useEffect(() => {
		if (!isPlaying || isPaused) return;

		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
		}, autoPlayInterval);

		return () => clearInterval(interval);
	}, [isPlaying, isPaused, testimonials.length, autoPlayInterval]);

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
	};

	const goToPrevious = () => {
		setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
	};

	const goToNext = () => {
		setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
	};

	const togglePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	const currentTestimonial = testimonials[currentIndex];

	const renderStars = (rating: number) => {
		return Array.from({ length: 5 }, (_, i) => (
			<Star
				key={i}
				className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
			/>
		));
	};

	return (
		<div className={`relative max-w-6xl mx-auto ${className}`}>
			{/* Header */}
			<div className="text-center mb-12">
				<h2 className="text-4xl font-bold text-foreground mb-4">What Clients Say</h2>
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
					Real feedback from real clients who&apos;ve experienced exceptional results
				</p>
			</div>

			{/* Main Testimonial Card */}
			<Card
				className="bg-secondary/50 border-border/30 hover:shadow-2xl transition-all duration-500 overflow-hidden"
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
			>
				<CardContent className="p-8 md:p-12">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
						{/* Quote and Content */}
						<div className="lg:col-span-2 space-y-6">
							<div className="flex items-center gap-4 mb-6">
								<Quote className="w-8 h-8 text-yellow-600 opacity-60" />
								<div className="flex items-center gap-2">
									{renderStars(currentTestimonial.rating)}
									<span className="text-sm text-muted-foreground ml-2">
										({currentTestimonial.rating}.0)
									</span>
								</div>
								{currentTestimonial.featured && (
									<Badge className="bg-yellow-600/10 text-yellow-600 border-yellow-600/30">
										<Award className="w-3 h-3 mr-1" />
										Featured
									</Badge>
								)}
							</div>

							<blockquote className="text-lg md:text-xl text-foreground leading-relaxed font-medium">
								&quot;{currentTestimonial.content}&quot;
							</blockquote>

							{/* Results */}
							{currentTestimonial.results && (
								<div className="space-y-3">
									<h4 className="font-semibold text-foreground flex items-center">
										<TrendingUp className="w-4 h-4 mr-2 text-yellow-600" />
										Key Results:
									</h4>
									<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
										{currentTestimonial.results.map((result, index) => (
											<div key={index} className="flex items-center text-sm">
												<CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
												<span className="text-muted-foreground">{result}</span>
											</div>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Client Info */}
						<div className="space-y-6">
							<div className="text-center lg:text-left">
								<div className="w-20 h-20 bg-yellow-600/10 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4">
									<User className="w-10 h-10 text-yellow-600" />
								</div>
								<h4 className="text-xl font-bold text-foreground mb-2">
									{currentTestimonial.name}
									{currentTestimonial.verified && (
										<CheckCircle className="w-5 h-5 text-blue-500 inline ml-2" />
									)}
								</h4>
								<p className="text-muted-foreground mb-1">{currentTestimonial.role}</p>
								<div className="flex items-center justify-center lg:justify-start text-sm text-muted-foreground mb-2">
									<Building className="w-4 h-4 mr-1" />
									{currentTestimonial.company}
								</div>
								<div className="flex items-center justify-center lg:justify-start text-sm text-muted-foreground mb-4">
									<MapPin className="w-4 h-4 mr-1" />
									{currentTestimonial.location}
								</div>
							</div>

							<div className="space-y-3">
								<Badge variant="outline" className="w-full justify-center lg:justify-start">
									<Calendar className="w-3 h-3 mr-2" />
									{new Date(currentTestimonial.date).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
									})}
								</Badge>
								<Badge className="w-full justify-center lg:justify-start bg-blue-500/10 text-blue-600 border-blue-500/30">
									{currentTestimonial.project}
								</Badge>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Controls */}
			{showControls && (
				<div className="flex items-center justify-center gap-4 mt-8">
					<Button
						variant="outline"
						size="sm"
						onClick={goToPrevious}
						className="border-yellow-600/50 text-yellow-600 hover:bg-yellow-600 hover:text-white"
					>
						<ChevronLeft className="w-4 h-4" />
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={togglePlayPause}
						className="border-yellow-600/50 text-yellow-600 hover:bg-yellow-600 hover:text-white"
					>
						{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={goToNext}
						className="border-yellow-600/50 text-yellow-600 hover:bg-yellow-600 hover:text-white"
					>
						<ChevronRight className="w-4 h-4" />
					</Button>
				</div>
			)}

			{/* Indicators */}
			{showIndicators && (
				<div className="flex items-center justify-center gap-2 mt-6">
					{testimonials.map((_, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-yellow-600 scale-125" : "bg-gray-300 hover:bg-gray-400"}`}
							aria-label={`Go to testimonial ${index + 1}`}
						/>
					))}
				</div>
			)}

			{/* Stats Summary */}
			<div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
				<div className="text-center">
					<div className="text-3xl font-bold text-foreground mb-2">{testimonials.length}</div>
					<div className="text-sm text-muted-foreground">Happy Clients</div>
				</div>
				<div className="text-center">
					<div className="text-3xl font-bold text-foreground mb-2">
						{(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)}
					</div>
					<div className="text-sm text-muted-foreground">Average Rating</div>
				</div>
				<div className="text-center">
					<div className="text-3xl font-bold text-foreground mb-2">
						{testimonials.filter((t) => t.verified).length}
					</div>
					<div className="text-sm text-muted-foreground">Verified Reviews</div>
				</div>
				<div className="text-center">
					<div className="text-3xl font-bold text-foreground mb-2">100%</div>
					<div className="text-sm text-muted-foreground">Satisfaction Rate</div>
				</div>
			</div>
		</div>
	);
}
