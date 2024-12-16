import PageHeader from "@/components/page-header";
import { Link } from "@/components/ui/link";
import CodedText from "@/components/ui/coded-text";
import TextStroke from "@/components/ui/text-stroke";
import HeroPages from "@/components/sections/hero-pages";

export default function LocalWebDesign() {
	return (
		<>
			<PageHeader title="Development">
				<Link prefetch={true} href="https://reactjs.org" className="text-[#61dafb] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">React</CodedText>
				</Link>
				<Link prefetch={true} href="https://nodejs.org" className="text-[#339933] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Node.js</CodedText>
				</Link>
				<Link prefetch={true} href="https://www.typescriptlang.org" className="text-[#007acc] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">TypeScript</CodedText>
				</Link>
				<Link prefetch={true} href="https://wordpress.org" className="text-[#21759b] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">WordPress</CodedText>
				</Link>
				<Link prefetch={true} href="https://ghost.org" className="text-[#15171A] text-5xl font-bold hover:text-yellow-400">
					<TextStroke strokeColor="white" textColor="black" strokeWidth={1} className="text-black text-5xl font-bold">
						<CodedText className="hover:underline">Ghost</CodedText>
					</TextStroke>
				</Link>
				<Link prefetch={true} href="https://www.shopify.com" className="text-[#95BF47] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Shopify</CodedText>
				</Link>
				<Link prefetch={true} href="https://webflow.com" className="text-[#4353FF] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Webflow</CodedText>
				</Link>
				<Link prefetch={true} href="https://wix.com" className="text-white text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Wix</CodedText>
				</Link>
				<Link prefetch={true} href="https://squarespace.com" className="text-[#000000] text-5xl font-bold hover:text-yellow-400">
					<TextStroke strokeColor="white" textColor="black" strokeWidth={1} className="text-black text-5xl font-bold">
						<CodedText className="hover:underline">Squarespace</CodedText>
					</TextStroke>
				</Link>
				<Link prefetch={true} href="https://www.framer.com" className="text-[#0055FF] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Framer</CodedText>
				</Link>
				<Link prefetch={true} href="https://tailwindcss.com" className="text-[#38b2ac] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Tailwind CSS</CodedText>
				</Link>
				<Link prefetch={true} href="https://graphql.org" className="text-[#e10098] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">GraphQL</CodedText>
				</Link>
				<Link prefetch={true} href="https://payloadcms.com" className="text-[#1A1A1A] text-5xl font-bold hover:text-yellow-400">
					<TextStroke strokeColor="white" textColor="black" strokeWidth={1} className="text-black text-5xl font-bold">
						<CodedText className="hover:underline">Payload</CodedText>
					</TextStroke>
				</Link>
				<Link prefetch={true} href="https://www.docker.com" className="text-[#2496ed] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Docker</CodedText>
				</Link>
				<Link prefetch={true} href="https://github.com" className="text-[#181717] text-5xl font-bold hover:text-yellow-400">
					<TextStroke strokeColor="white" textColor="black" strokeWidth={1} className="text-black text-5xl font-bold">
						<CodedText className="hover:underline">GitHub</CodedText>
					</TextStroke>
				</Link>
			</PageHeader>

			<HeroPages />
		</>
	);
}
