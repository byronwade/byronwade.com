import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { customFont } from "@/lib/fonts";
import { Twitter, Youtube, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
	return (
		<>
			<section className="relative bg-black overflow-hidden">
				{/* Main content */}
				<div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="space-y-8">
							<h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">Design and publish a site today.</h2>
							<p className="text-lg text-neutral-300 max-w-2xl">Get started with our website builder today. For seamless site migration and tailored support, explore enterprise.</p>
							<div className="flex flex-wrap gap-4">
								<Button asChild size="lg" className="bg-white text-black hover:bg-yellow-400 transition-colors duration-300">
									<Link prefetch={true} href="/launch">
										Launch Your Site
									</Link>
								</Button>
								<Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-colors duration-300">
									<Link prefetch={true} href="/enterprise">
										Explore Enterprise
									</Link>
								</Button>
							</div>
						</div>

						<div className="relative lg:block">
							<Image loading="eager" decoding="sync" quality={65} src="https://placehold.co/600x800" width={800} height={600} alt="Interface preview" className="w-full h-auto rounded-lg shadow-2xl" priority />
						</div>
					</div>
				</div>

				{/* Bottom gradient */}
				<div
					className="absolute inset-x-0 bottom-0 z-0"
					style={{
						height: "50%",
						background: "linear-gradient(to top, #FFB800 10%, rgba(255, 184, 0, 0) 100%)",
						opacity: "0.15",
					}}
					aria-hidden="true"
				/>

				{/* Foreground glow effect */}
				<div
					className="absolute inset-x-0 bottom-0 z-20 pointer-events-none"
					style={{
						height: "50%",
						background: "linear-gradient(to top, rgba(255, 184, 0, 0.3) 10%, rgba(255, 184, 0, 0) 100%)",
						mixBlendMode: "screen",
					}}
					aria-hidden="true"
				/>
			</section>
			<footer className="bg-black text-white py-16">
				<div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Logo and Tagline */}
					<div className="mb-16">
						<Link prefetch={true} href="/" className="flex items-center space-x-3">
							<span className={`text-3xl font-bold ${customFont.className} hover:text-yellow-400 hover:underline`}>Byron Wade</span>
						</Link>
						<p className="mt-2 text-sm text-neutral-400">Building the fastest websites on the internet</p>
					</div>

					{/* Navigation Grid */}
					<div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
						<div className="space-y-4">
							<h3 className="text-neutral-400 uppercase text-xs font-medium tracking-wider">Resources</h3>
							<ul className="space-y-3">
								<li>
									<Link prefetch={true} href="/academy" className="text-neutral-300 hover:text-white transition-colors">
										Academy
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/marketplace" className="text-neutral-300 hover:text-white transition-colors">
										Marketplace
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/app" className="text-neutral-300 hover:text-white transition-colors">
										Desktop App
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/brand" className="text-neutral-300 hover:text-white transition-colors">
										Brand
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/resources" className="text-neutral-300 hover:text-white transition-colors">
										Resources
									</Link>
								</li>
							</ul>
						</div>

						<div className="space-y-4">
							<h3 className="text-neutral-400 uppercase text-xs font-medium tracking-wider">Tools</h3>
							<ul className="space-y-3">
								<li>
									<Link prefetch={true} href="/next" className="text-neutral-300 hover:text-white transition-colors">
										Next.js Tools
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/sveltekit" className="text-neutral-300 hover:text-white transition-colors">
										SvelteKit Tools
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/developers" className="text-neutral-300 hover:text-white transition-colors">
										Developers
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/starter" className="text-neutral-300 hover:text-white transition-colors">
										Starter Kit
									</Link>
								</li>
							</ul>
						</div>

						<div className="space-y-4">
							<h3 className="text-neutral-400 uppercase text-xs font-medium tracking-wider">Company</h3>
							<ul className="space-y-3">
								<li>
									<Link prefetch={true} href="/careers" className="text-neutral-300 hover:text-white transition-colors">
										Careers
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/events" className="text-neutral-300 hover:text-white transition-colors">
										Events
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/status" className="text-neutral-300 hover:text-white transition-colors">
										Status
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/security" className="text-neutral-300 hover:text-white transition-colors">
										Security
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/privacy" className="text-neutral-300 hover:text-white transition-colors">
										Privacy
									</Link>
								</li>
							</ul>
						</div>

						<div className="space-y-4">
							<h3 className="text-neutral-400 uppercase text-xs font-medium tracking-wider">Compare</h3>
							<ul className="space-y-3">
								<li>
									<Link prefetch={true} href="/webflow" className="text-neutral-300 hover:text-white transition-colors">
										Webflow
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/wordpress" className="text-neutral-300 hover:text-white transition-colors">
										WordPress
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/contentful" className="text-neutral-300 hover:text-white transition-colors">
										Contentful
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/shopify" className="text-neutral-300 hover:text-white transition-colors">
										Shopify
									</Link>
								</li>
							</ul>
						</div>

						<div className="space-y-4">
							<h3 className="text-neutral-400 uppercase text-xs font-medium tracking-wider">Legal</h3>
							<ul className="space-y-3">
								<li>
									<Link prefetch={true} href="/abuse" className="text-neutral-300 hover:text-white transition-colors">
										Abuse
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/charges" className="text-neutral-300 hover:text-white transition-colors">
										Charges
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/cookies" className="text-neutral-300 hover:text-white transition-colors">
										Cookies
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/terms" className="text-neutral-300 hover:text-white transition-colors">
										Terms
									</Link>
								</li>
							</ul>
						</div>
					</div>

					{/* Social Links */}
					<div className="mt-16 flex justify-end space-x-6">
						<a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
							<span className="sr-only">Twitter</span>
							<Twitter className="h-6 w-6" />
						</a>
						<a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
							<span className="sr-only">YouTube</span>
							<Youtube className="h-6 w-6" />
						</a>
						<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
							<span className="sr-only">LinkedIn</span>
							<Linkedin className="h-6 w-6" />
						</a>
						<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors">
							<span className="sr-only">Instagram</span>
							<Instagram className="h-6 w-6" />
						</a>
					</div>
				</div>
			</footer>
		</>
	);
}
