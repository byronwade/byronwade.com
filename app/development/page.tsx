import Background from "@/components/sections/background";
import Marquee from "@/components/ui/marquee";

export default function LocalWebDesign() {
	return (
		<>
			<div className="relative">
				<Background />
				<div className="relative pb-20">
					<Marquee pauseOnHover className="[--duration:20s]">
						<h1 className="text-white text-9xl font-bold mr-20">Development</h1>
					</Marquee>
					<Marquee pauseOnHover className="[--duration:20s]">
						<h1 className="text-yellow-400 text-5xl font-bold">Next.js</h1>
						<h1 className="text-green-400 text-5xl font-bold">Shopify</h1>
						<h1 className="text-blue-400 text-5xl font-bold">WordPress</h1>
						<h1 className="text-white text-5xl font-bold">React</h1>
						<h1 className="text-white text-5xl font-bold">Tailwind</h1>
						<h1 className="text-white text-5xl font-bold">Figma</h1>
						<h1 className="text-white text-5xl font-bold">HTML</h1>
						<h1 className="text-white text-5xl font-bold">CSS</h1>
					</Marquee>
				</div>
			</div>
			<div className="relative h-screen bg-black overflow-hidden">test</div>
		</>
	);
}
