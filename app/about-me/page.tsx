"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Twitter, Github, Youtube, ExternalLink, TrendingUp, Book, Briefcase, ArrowRight } from "lucide-react";

export default function AccessibleVIPAboutMePage() {
	const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("animate-fade-in-up");
					}
				});
			},
			{ threshold: 0.1 }
		);

		sectionRefs.current.forEach((ref) => {
			if (ref) observer.observe(ref);
		});

		return () => observer.disconnect();
	}, []);

	return (
		<div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
			{/* Hero Section */}
			<section className="pt-20 pb-32 bg-gradient-to-br from-stone-100 to-stone-200 relative overflow-hidden">
				<div className="container mx-auto px-4 relative z-10">
					<div className="flex flex-col md:flex-row items-center">
						<div className="md:w-1/2 mb-12 md:mb-0 pr-0 md:pr-8">
							<h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-stone-700 to-stone-900">Byron Wade</h1>
							<p className="text-2xl mb-8 text-stone-600">CEO and Co-Owner of Wade&apos;s Inc | Entrepreneur | Innovator</p>
							<div className="flex flex-wrap gap-3 mb-8">
								<Badge variant="secondary" className="text-lg py-2 px-4 bg-white/50 backdrop-blur-sm">
									<Briefcase className="w-5 h-5 mr-2 inline" /> Entrepreneur
								</Badge>
								<Badge variant="secondary" className="text-lg py-2 px-4 bg-white/50 backdrop-blur-sm">
									<Book className="w-5 h-5 mr-2 inline" /> CS Student
								</Badge>
								<Badge variant="secondary" className="text-lg py-2 px-4 bg-white/50 backdrop-blur-sm">
									<TrendingUp className="w-5 h-5 mr-2 inline" /> Innovator
								</Badge>
							</div>
						</div>
						<div className="md:w-1/2 flex justify-center">
							<div className="relative">
								<div className="absolute inset-0 bg-gradient-to-br from-stone-400 to-stone-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
								<Image loading="eager" decoding="sync" quality={65} src="https://placehold.co/600x400" width={400} height={400} alt="Byron Wade" className="rounded-full shadow-2xl border-4 border-white relative z-10" />
							</div>
						</div>
					</div>
				</div>
				<div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-stone-50 to-transparent"></div>
			</section>

			{/* Main Content */}
			<section className="py-20 -mt-20">
				<div className="container mx-auto px-4 space-y-20">
					{/* About Me Section */}
					<Card
						className="bg-white shadow-xl rounded-3xl overflow-hidden"
						ref={(el) => {
							if (el) sectionRefs.current[0] = el;
						}}
					>
						<CardContent className="p-8">
							<h2 className="text-3xl font-serif font-bold mb-6">About Me</h2>
							<div className="space-y-4 text-xl text-stone-600">
								<p>Hello, I&apos;m Byron, an entrepreneur always seeking new opportunities to expand my company and create innovative solutions. I&apos;m excited to share my story and vision with you.</p>
								<p>I&apos;m studying Computer Science at Cabrillo College and plan to transfer to San Jose State. I&apos;m also considering degrees in Civil Engineering, Aerospace Engineering, and Criminal Justice to broaden my knowledge and expertise further.</p>
							</div>
						</CardContent>
					</Card>

					{/* Wade&apos;s Inc Section */}
					<Card
						className="bg-white shadow-xl rounded-3xl overflow-hidden"
						ref={(el) => {
							if (el) sectionRefs.current[0] = el;
						}}
					>
						<CardContent className="p-8">
							<h2 className="text-3xl font-serif font-bold mb-6">Wade&apos;s Inc.</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
								<Card className="bg-gradient-to-br from-green-50 to-green-100">
									<CardContent className="p-6">
										<h3 className="text-2xl font-bold mb-4 text-green-800">First Year Revenue</h3>
										<p className="text-4xl font-bold text-green-600">$1.2 million</p>
									</CardContent>
								</Card>
								<Card className="bg-gradient-to-br from-blue-50 to-blue-100">
									<CardContent className="p-6">
										<h3 className="text-2xl font-bold mb-4 text-blue-800">Projected Next Year</h3>
										<p className="text-4xl font-bold text-blue-600">$2.3 million</p>
									</CardContent>
								</Card>
							</div>
							<h3 className="text-2xl font-bold mb-4">Our Companies</h3>
							<ul className="space-y-4">
								<li>
									<a href="https://wadesplumbingandseptic.com/" className="text-blue-600 hover:underline text-lg flex items-center">
										Wade&apos;s Plumbing and Septic <ArrowRight className="ml-2 w-4 h-4" />
									</a>
								</li>
								<li>
									<a href="https://clogmonsterssepticpumping.com/" className="text-blue-600 hover:underline text-lg flex items-center">
										Clog Monsters Septic Pumping <ArrowRight className="ml-2 w-4 h-4" />
									</a>
								</li>
							</ul>
						</CardContent>
					</Card>

					{/* Projects Section */}
					<Card
						className="bg-white shadow-xl rounded-3xl overflow-hidden"
						ref={(el) => {
							if (el) sectionRefs.current[0] = el;
						}}
					>
						<CardContent className="p-8">
							<h2 className="text-3xl font-serif font-bold mb-6">Current Projects</h2>
							<Card className="bg-gradient-to-br from-stone-50 to-stone-100 mb-6">
								<CardContent className="p-6">
									<h3 className="text-2xl font-bold mb-4">Wade&apos;s Academy</h3>
									<p className="text-xl text-stone-600 mb-4">An innovative online learning platform for the construction industry.</p>
									<a href="https://github.com/byronwade/wadesacademy.com" className="text-blue-600 hover:underline text-lg flex items-center">
										View Project <ArrowRight className="ml-2 w-4 h-4" />
									</a>
								</CardContent>
							</Card>
							<p className="text-xl text-stone-600">I&apos;m currently working on three innovative technology websites, with Wade&apos;s Academy being the flagship project that has the potential to revolutionize online learning in the construction industry.</p>
						</CardContent>
					</Card>

					{/* Connect Section */}
					<Card
						className="bg-white shadow-xl rounded-3xl overflow-hidden"
						ref={(el) => {
							if (el) sectionRefs.current[0] = el;
						}}
					>
						<CardContent className="p-8">
							<h2 className="text-3xl font-serif font-bold mb-6">Connect with Me</h2>
							<p className="text-xl text-stone-600 mb-8">I&apos;m open to exploring collaboration and investment opportunities. Feel free to reach out!</p>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
								<Button asChild variant="outline" className="w-full">
									<a href="https://twitter.com/leeerob" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
										<Twitter className="w-5 h-5 mr-2" /> Twitter
									</a>
								</Button>
								<Button asChild variant="outline" className="w-full">
									<a href="https://github.com/leerob" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
										<Github className="w-5 h-5 mr-2" /> GitHub
									</a>
								</Button>
								<Button asChild variant="outline" className="w-full">
									<a href="https://www.youtube.com/@leerob" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
										<Youtube className="w-5 h-5 mr-2" /> YouTube
									</a>
								</Button>
							</div>
							<div className="text-center">
								<Button asChild className="bg-stone-800 hover:bg-stone-700 text-white text-lg px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105">
									<a href="/contact">Contact Me</a>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-stone-100 py-8 mt-20">
				<div className="container mx-auto px-4 text-center text-stone-600">
					<p>&copy; {new Date().getFullYear()} Byron Wade. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}
