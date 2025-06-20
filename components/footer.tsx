import { Link } from "@/components/ui/link";
import { customFont } from "@/lib/fonts";
import { Twitter, Github, Linkedin, Mail, ArrowRight, Code, Wrench, MapPin, Phone, Calendar, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Footer() {
	return (
		<>
			{/* Enhanced CTA Section */}
			<section className="relative bg-gradient-to-br from-yellow-600 via-yellow-500 to-amber-500 overflow-hidden">
				<div className="absolute inset-0 bg-black/10" aria-hidden="true" />
				<div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px]" aria-hidden="true" />

				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
					<div className="max-w-4xl mx-auto">
						<h2 className={`text-4xl md:text-6xl font-bold text-black mb-6 ${customFont.className}`}>Ready to Build Something Amazing?</h2>
						<p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto leading-relaxed">From cutting-edge web applications to reliable plumbing solutions, I bring expertise and passion to every project.</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
							<Button asChild size="lg" className="bg-black text-yellow-400 hover:bg-gray-900 font-semibold px-8 py-4 text-lg shadow-xl">
								<Link prefetch={true} href="/contact">
									<Calendar className="mr-2 h-5 w-5" />
									Start Your Project
									<ArrowRight className="ml-2 h-5 w-5" />
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg" className="border-black/20 bg-white/10 backdrop-blur-sm text-black hover:bg-white/20 font-semibold px-8 py-4 text-lg">
								<Link prefetch={true} href="/portfolio">
									<Star className="mr-2 h-5 w-5" />
									View My Work
								</Link>
							</Button>
						</div>

						{/* Quick Stats */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
							<Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
								<CardContent className="p-4 text-center">
									<div className="text-2xl font-bold text-black mb-1">150+</div>
									<div className="text-sm text-black/70">Projects Completed</div>
								</CardContent>
							</Card>
							<Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
								<CardContent className="p-4 text-center">
									<div className="text-2xl font-bold text-black mb-1">8+</div>
									<div className="text-sm text-black/70">Years Experience</div>
								</CardContent>
							</Card>
							<Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
								<CardContent className="p-4 text-center">
									<div className="text-2xl font-bold text-black mb-1">100%</div>
									<div className="text-sm text-black/70">Client Satisfaction</div>
								</CardContent>
							</Card>
							<Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
								<CardContent className="p-4 text-center">
									<div className="text-2xl font-bold text-black mb-1">5★</div>
									<div className="text-sm text-black/70">Average Rating</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Modern Footer */}
			<footer className="bg-background border-t border-border/50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
					{/* Main Footer Content */}
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
						{/* Brand Section */}
						<div className="lg:col-span-1 space-y-6">
							<Link prefetch={true} href="/" className="flex items-center space-x-3 group">
								<span className={`text-3xl font-bold ${customFont.className} hover:text-yellow-600 transition-colors duration-300`}>Byron Wade</span>
							</Link>
							<p className="text-muted-foreground leading-relaxed">Expert craftsmanship for your digital presence and home infrastructure. From code to copper, delivering solutions that work.</p>

							{/* Contact Info */}
							<div className="space-y-3">
								<div className="flex items-center gap-3 text-sm text-muted-foreground">
									<MapPin className="w-4 h-4 text-yellow-600" />
									<span>Santa Cruz, CA</span>
								</div>
								<div className="flex items-center gap-3 text-sm text-muted-foreground">
									<Mail className="w-4 h-4 text-yellow-600" />
									<span>byron@byronwade.com</span>
								</div>
								<div className="flex items-center gap-3 text-sm text-muted-foreground">
									<Phone className="w-4 h-4 text-yellow-600" />
									<span>Available for consultations</span>
								</div>
							</div>
						</div>

						{/* Digital Services */}
						<div className="space-y-6">
							<h3 className="text-foreground font-semibold text-lg flex items-center gap-2">
								<Code className="w-5 h-5 text-yellow-600" />
								Digital Services
							</h3>
							<ul className="space-y-3">
								<li>
									<Link prefetch={true} href="/portfolio" className="text-muted-foreground hover:text-yellow-600 transition-colors duration-200 text-sm">
										Portfolio & Projects
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/design" className="text-muted-foreground hover:text-yellow-600 transition-colors duration-200 text-sm">
										UI/UX Design
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/development" className="text-muted-foreground hover:text-yellow-600 transition-colors duration-200 text-sm">
										Web Development
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/marketing" className="text-muted-foreground hover:text-yellow-600 transition-colors duration-200 text-sm">
										Digital Marketing
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/tools" className="text-muted-foreground hover:text-yellow-600 transition-colors duration-200 text-sm">
										Developer Tools
									</Link>
								</li>
							</ul>
						</div>

						{/* Plumbing Services */}
						<div className="space-y-6">
							<h3 className="text-foreground font-semibold text-lg flex items-center gap-2">
								<Wrench className="w-5 h-5 text-yellow-600" />
								Plumbing Services
							</h3>
							<ul className="space-y-3">
								<li>
									<Link prefetch={true} href="/plumbing-santa-cruz" className="text-muted-foreground hover:text-yellow-600 transition-colors duration-200 text-sm">
										Santa Cruz, CA
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/virtual-plumbing" className="text-muted-foreground hover:text-yellow-600 transition-colors duration-200 text-sm">
										Virtual Consultations
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/our-work" className="text-muted-foreground hover:text-yellow-600 transition-colors duration-200 text-sm">
										Our Work
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/contact" className="text-muted-foreground hover:text-yellow-600 transition-colors duration-200 text-sm">
										Get a Quote
									</Link>
								</li>
							</ul>
						</div>

						{/* Resources & Connect */}
						<div className="space-y-6">
							<h3 className="text-foreground font-semibold text-lg">Resources</h3>
							<ul className="space-y-3">
								<li>
									<Link prefetch={true} href="/resume" className="text-muted-foreground hover:text-yellow-600 transition-colors duration-200 text-sm">
										My Resume
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/contact" className="text-muted-foreground hover:text-yellow-600 transition-colors duration-200 text-sm">
										Contact Me
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/work-with-me" className="text-muted-foreground hover:text-yellow-600 transition-colors duration-200 text-sm">
										Work With Me
									</Link>
								</li>
							</ul>

							{/* Social Links */}
							<div className="space-y-4">
								<h4 className="text-foreground font-medium">Connect</h4>
								<div className="flex gap-4">
									<a href="https://github.com/byronwade" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-yellow-600 hover:bg-yellow-600/10 transition-all duration-200">
										<Github className="h-5 w-5" />
										<span className="sr-only">GitHub</span>
									</a>
									<a href="https://linkedin.com/in/byronwade" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-yellow-600 hover:bg-yellow-600/10 transition-all duration-200">
										<Linkedin className="h-5 w-5" />
										<span className="sr-only">LinkedIn</span>
									</a>
									<a href="https://twitter.com/byronwade" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-yellow-600 hover:bg-yellow-600/10 transition-all duration-200">
										<Twitter className="h-5 w-5" />
										<span className="sr-only">Twitter</span>
									</a>
									<a href="mailto:byron@byronwade.com" className="p-2 bg-secondary/50 rounded-lg text-muted-foreground hover:text-yellow-600 hover:bg-yellow-600/10 transition-all duration-200">
										<Mail className="h-5 w-5" />
										<span className="sr-only">Email</span>
									</a>
								</div>
							</div>
						</div>
					</div>

					{/* Footer Bottom */}
					<div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<span>© {new Date().getFullYear()} Byron Wade.</span>
							<span>Made with</span>
							<Heart className="w-4 h-4 text-red-500 fill-current" />
							<span>in California & Georgia</span>
						</div>

						<div className="flex items-center gap-6 text-sm">
							<Link prefetch={true} href="/privacy" className="text-muted-foreground hover:text-yellow-600 transition-colors duration-200">
								Privacy Policy
							</Link>
							<Link prefetch={true} href="/terms" className="text-muted-foreground hover:text-yellow-600 transition-colors duration-200">
								Terms of Service
							</Link>
							<div className="flex items-center gap-2 text-muted-foreground">
								<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
								<span className="text-xs">All systems operational</span>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
}
