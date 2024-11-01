"use client";

import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Phone, Layout, Search, PenTool, BarChart } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
			{/* Header */}
			<header className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}>
				<div className="container mx-auto px-4 flex justify-between items-center">
					<div className="text-2xl font-serif font-bold">Byron Wade</div>
					<Button className="bg-stone-800 hover:bg-stone-700 text-white transition-colors duration-300">
						<Phone className="mr-2 h-4 w-4" />
						831-430-6011
					</Button>
				</div>
			</header>

			{/* Hero Section with Contact Form */}
			<section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-stone-100 to-stone-200">
				<div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
					<div className="md:w-1/2 mb-12 md:mb-0 pr-0 md:pr-8">
						<h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">Elevate Your Online Presence with Custom Web Design</h1>
						<p className="text-xl mb-8 text-stone-600">Hi, I&apos;m Byron Wade. I specialize in crafting bespoke websites that not only look stunning but also drive real results for your business.</p>
						<div className="md:hidden">
							<Image src="/placeholder.svg?height=300&width=300" width={300} height={300} alt="Byron Wade" className="rounded-full shadow-2xl border-4 border-white mx-auto mb-8" />
						</div>
					</div>
					<div className="md:w-1/2 bg-white p-8 rounded-lg shadow-xl">
						<h2 className="text-2xl font-serif font-bold mb-6 text-center">Start Your Free Web Design Consultation</h2>
						<form className="space-y-4">
							<Input placeholder="Your Name" className="bg-stone-50" />
							<Input type="email" placeholder="Your Email" className="bg-stone-50" />
							<Input placeholder="Your Current Website (if you have one)" className="bg-stone-50" />
							<Textarea placeholder="Tell me about your web design project" className="bg-stone-50" rows={4} />
							<Button className="w-full bg-stone-800 hover:bg-stone-700 text-white text-lg py-3 rounded-full transition-all duration-300 transform hover:scale-105">Request Your Free Consultation</Button>
						</form>
						<p className="mt-4 text-center text-stone-600 text-sm">I&apos;ll get back to you within 24 hours to discuss your web design needs.</p>
					</div>
				</div>
			</section>

			{/* Testimonial */}
			<section className="py-16 bg-white">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center">
						<p className="text-2xl font-serif italic mb-4">&quot;Byron&apos;s web design approach is refreshing. He truly listens and delivers a website that exceeds expectations, perfectly capturing our brand essence.&quot;</p>
						<p className="font-semibold">- Sarah Johnson, E-commerce Entrepreneur</p>
					</div>
				</div>
			</section>

			{/* Services Section (Web Design Focused) */}
			<section className="py-20 bg-stone-100">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl md:text-4xl font-serif font-bold mb-16 text-center">How I Can Elevate Your Web Presence</h2>
					<div className="space-y-24">
						{[
							{ title: "Responsive Web Design", description: "Creating stunning, mobile-friendly websites that adapt seamlessly to all devices, ensuring a consistent user experience for your audience.", icon: Layout, image: "/placeholder.svg?height=400&width=600", align: "left" },
							{ title: "SEO-Optimized Websites", description: "Building websites with search engine optimization in mind, improving your visibility and attracting more potential customers to your site.", icon: Search, image: "/placeholder.svg?height=400&width=600", align: "right" },
							{ title: "Custom UI/UX Design", description: "Crafting intuitive user interfaces and experiences that engage your visitors, reduce bounce rates, and increase conversions.", icon: PenTool, image: "/placeholder.svg?height=400&width=600", align: "left" },
							{ title: "Performance Optimization", description: "Enhancing your website's speed and efficiency, ensuring fast load times and smooth interactions to keep your visitors engaged.", icon: BarChart, image: "/placeholder.svg?height=400&width=600", align: "right" },
						].map((service, index) => (
							<div key={index} className={`flex flex-col ${service.align === "right" ? "md:flex-row-reverse" : "md:flex-row"} items-center`}>
								<div className="md:w-1/2 mb-8 md:mb-0">
									<Image src={service.image} width={600} height={400} alt={service.title} className="rounded-lg shadow-lg object-cover w-full h-64 md:h-auto" />
								</div>
								<div className={`md:w-1/2 ${service.align === "right" ? "md:pr-12" : "md:pl-12"}`}>
									<div className="flex items-center mb-4">
										<service.icon className="h-8 w-8 text-stone-600 mr-4" />
										<h3 className="text-2xl font-bold">{service.title}</h3>
									</div>
									<p className="text-lg text-stone-600">{service.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Case Study */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">Web Design Success Story</h2>
					<div className="bg-stone-100 p-8 rounded-lg shadow-lg">
						<div className="flex flex-col md:flex-row items-center">
							<div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
								<h3 className="text-2xl font-semibold mb-4">E-commerce Site Boosts Sales by 200%</h3>
								<p className="mb-4">
									<strong>Challenge:</strong> An artisanal soap company struggled with an outdated website that wasn&apos;t mobile-friendly and had poor conversion rates.
								</p>
								<p className="mb-4">
									<strong>Solution:</strong> We redesigned their website with a responsive, user-friendly interface, optimized product pages, and a streamlined checkout process.
								</p>
								<p className="mb-4">
									<strong>Result:</strong> Within 3 months, mobile traffic increased by 150%, and overall sales saw a 200% boost.
								</p>
							</div>
							<div className="md:w-1/2 flex justify-center">
								<Image src="/placeholder.svg?height=300&width=500" width={500} height={300} alt="E-commerce Website Transformation" className="rounded-lg shadow-md" />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonial */}
			<section className="py-16 bg-stone-800 text-white">
				<div className="container mx-auto px-4">
					<div className="max-w-3xl mx-auto text-center">
						<p className="text-2xl font-serif italic mb-4">&quot;Byron doesn&apos;t just design websites, he creates digital experiences. His attention to detail and focus on user experience transformed our online presence.&quot;</p>
						<p className="font-semibold">- Michael Chen, Tech Startup Founder</p>
					</div>
				</div>
			</section>

			{/* About Byron */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row items-center">
						<div className="md:w-1/3 mb-8 md:mb-0">
							<Image src="/placeholder.svg?height=400&width=400" width={400} height={400} alt="Byron Wade" className="rounded-full shadow-2xl border-4 border-stone-200" />
						</div>
						<div className="md:w-2/3 md:pl-12">
							<h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Meet Byron Wade</h2>
							<p className="text-xl mb-6 text-stone-600">With over a decade of experience in web design and development, I&apos;ve helped businesses of all sizes establish a strong online presence and achieve their digital goals.</p>
							<p className="text-xl mb-6 text-stone-600">My approach is simple: I listen to your needs, understand your audience, and create a website that not only looks great but also delivers tangible results for your business.</p>
							<Button className="bg-stone-800 hover:bg-stone-700 text-white text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105">Let&apos;s Design Your Dream Website</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="py-20 bg-gradient-to-br from-stone-800 to-stone-900 text-white">
				<div className="container mx-auto px-4 text-center">
					<h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to Transform Your Online Presence?</h2>
					<p className="text-xl mb-8 max-w-2xl mx-auto">Whether you&apos;re starting from scratch or looking to revamp your existing website, I&apos;m here to help you create a stunning and effective web presence.</p>
					<Button className="bg-white text-stone-800 hover:bg-stone-200 text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105">Start Your Free Web Design Consultation</Button>
					<p className="mt-6 text-lg">
						Or call me directly at <strong>831-430-6011</strong>
					</p>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-stone-100 py-8">
				<div className="container mx-auto px-4 text-center text-stone-600">
					<p>&copy; {new Date().getFullYear()} Byron Wade Web Design. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
