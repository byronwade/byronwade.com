import Image from "next/image";
import Background from "./background";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
	return (
		<>
			<section className="relative overflow-hidden z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div className="space-y-8">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
								Forge Your Digital Success with <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">Golden</span> Web Solutions
							</h1>
							<p className="text-xl md:text-2xl text-gray-300">Empowering Jasper, Georgia businesses with high-performance websites that dominate search rankings and captivate users.</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-500 transition duration-150 ease-in-out">
									Start Your Project
									<ArrowRight className="ml-2 -mr-1 h-5 w-5" />
								</Link>
								<Link href="/projects" className="inline-flex items-center justify-center px-6 py-3 border border-yellow-400 text-base font-medium rounded-md text-yellow-400 hover:bg-yellow-400 hover:text-black transition duration-150 ease-in-out">
									View My Work
								</Link>
							</div>
						</div>
						<div className="relative">
							<Image src="/astronaut.svg" className="invert" alt="astronaut" width={500} height={500} />
						</div>
					</div>
				</div>
			</section>
			<Background />
		</>
	);
}
