import CodedText from "@/components/ui/coded-text";
import Background from "@/components/sections/background";
import Marquee from "@/components/ui/marquee";
import TextStroke from "@/components/ui/text-stroke";
import Link from "next/link";

export default function LocalWebDesign() {
	return (
		<>
			<div className="relative">
				<Background />
				<div className="relative pb-20">
					<Marquee pauseOnHover className="[--duration:20s]">
						<h1 className="text-white text-9xl font-bold mr-20 hover:text-yellow-400 hover:underline">
							<CodedText>Design</CodedText>
						</h1>
					</Marquee>
					<Marquee pauseOnHover className="[--duration:20s] -mt-4">
						<Link href="https://www.figma.com" className="text-[#f24e1e] text-5xl font-bold hover:text-yellow-400">
							<CodedText className="hover:underline">Figma</CodedText>
						</Link>
						<Link href="https://www.shopify.com" className="text-[#96bf48] text-5xl font-bold hover:text-yellow-400">
							<CodedText className="hover:underline">Shopify</CodedText>
						</Link>
						<Link href="https://www.svelte.dev" className="text-[#aa1e1e] text-5xl font-bold hover:text-yellow-400">
							<CodedText className="hover:underline">Svelte</CodedText>
						</Link>
						<Link href="https://wordpress.org" className="text-[#21759b] text-5xl font-bold hover:text-yellow-400">
							<CodedText className="hover:underline">WordPress</CodedText>
						</Link>
						<Link href="https://nextjs.org" className="text-[#21759b] text-5xl font-bold hover:text-yellow-400 hover:underline">
							<TextStroke strokeColor="white" textColor="black" strokeWidth={1} className="text-black text-5xl font-bold">
								<CodedText className="hover:underline">Next.js</CodedText>
							</TextStroke>
						</Link>
					</Marquee>
				</div>
			</div>
			<div className="relative h-screen bg-black overflow-hidden">test</div>
		</>
	);
}
