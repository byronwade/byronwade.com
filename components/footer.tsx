import { Link } from "@/components/ui/link";
import { customFont } from "@/lib/fonts";
import { Twitter, Youtube, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
	return (
		<>
			<section className="relative bg-transparent overflow-hidden h-96 border-t-4 border-yellow-600">
				<div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none h-1/2 bg-gradient-to-t from-yellow-600/60 to-transparent border-b-4 border-yellow-600" aria-hidden="true" />
			</section>

			<footer className="bg-zinc-50 dark:bg-black text-zinc-900 dark:text-white py-16">
				<div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-16">
						<Link prefetch={true} href="/" className="flex items-center space-x-3">
							<span className={`text-3xl font-bold ${customFont.className} hover:text-yellow-600 dark:hover:text-yellow-400 hover:underline`}>Byron Wade</span>
						</Link>
						<p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Building the fastest websites on the planet</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
						<div className="space-y-4">
							<h3 className="text-zinc-500 dark:text-zinc-400 uppercase text-xs font-medium tracking-wider">Services</h3>
							<ul className="space-y-3">
								<li>
									<Link prefetch={true} href="/maintenance" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Maintenance
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/marketplace" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Marketplace
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/app" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Desktop App
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/brand" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Brand
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/resources" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Resources
									</Link>
								</li>
							</ul>
						</div>

						<div className="space-y-4">
							<h3 className="text-zinc-500 dark:text-zinc-400 uppercase text-xs font-medium tracking-wider">Tools</h3>
							<ul className="space-y-3">
								<li>
									<Link prefetch={true} href="/next" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Next.js Tools
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/sveltekit" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										SvelteKit Tools
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/developers" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Developers
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/starter" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Starter Kit
									</Link>
								</li>
							</ul>
						</div>

						<div className="space-y-4">
							<h3 className="text-zinc-500 dark:text-zinc-400 uppercase text-xs font-medium tracking-wider">Company</h3>
							<ul className="space-y-3">
								<li>
									<Link prefetch={true} href="/careers" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Careers
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/events" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Events
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/status" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Status
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/security" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Security
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/privacy" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Privacy
									</Link>
								</li>
							</ul>
						</div>

						<div className="space-y-4">
							<h3 className="text-zinc-500 dark:text-zinc-400 uppercase text-xs font-medium tracking-wider">Compare</h3>
							<ul className="space-y-3">
								<li>
									<Link prefetch={true} href="/webflow" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Webflow
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/wordpress" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										WordPress
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/contentful" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Contentful
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/shopify" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Shopify
									</Link>
								</li>
							</ul>
						</div>

						<div className="space-y-4">
							<h3 className="text-zinc-500 dark:text-zinc-400 uppercase text-xs font-medium tracking-wider">Legal</h3>
							<ul className="space-y-3">
								<li>
									<Link prefetch={true} href="/abuse" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Abuse
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/charges" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Charges
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/cookies" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Cookies
									</Link>
								</li>
								<li>
									<Link prefetch={true} href="/terms" className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors">
										Terms
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<div className="mt-16 flex justify-end space-x-6">
						<a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors">
							<span className="sr-only">Twitter</span>
							<Twitter className="h-6 w-6" />
						</a>
						<a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors">
							<span className="sr-only">YouTube</span>
							<Youtube className="h-6 w-6" />
						</a>
						<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors">
							<span className="sr-only">LinkedIn</span>
							<Linkedin className="h-6 w-6" />
						</a>
						<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors">
							<span className="sr-only">Instagram</span>
							<Instagram className="h-6 w-6" />
						</a>
					</div>
				</div>
			</footer>
		</>
	);
}
