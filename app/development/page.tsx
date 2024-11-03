import PageHeader from "@/components/page-header";
import Link from "next/link";
import CodedText from "@/components/ui/coded-text";
import TextStroke from "@/components/ui/text-stroke";

export default function LocalWebDesign() {
	return (
		<>
			<PageHeader title="Development">
				<Link href="https://reactjs.org" className="text-[#61dafb] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">React</CodedText>
				</Link>
				<Link href="https://nodejs.org" className="text-[#339933] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Node.js</CodedText>
				</Link>
				<Link href="https://www.typescriptlang.org" className="text-[#007acc] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">TypeScript</CodedText>
				</Link>
				<Link href="https://tailwindcss.com" className="text-[#38b2ac] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Tailwind CSS</CodedText>
				</Link>
				<Link href="https://graphql.org" className="text-[#e10098] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">GraphQL</CodedText>
				</Link>
				<Link href="https://www.docker.com" className="text-[#2496ed] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Docker</CodedText>
				</Link>
				<Link href="https://aws.amazon.com" className="text-[#ff9900] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">AWS</CodedText>
				</Link>
				<Link href="https://github.com" className="text-[#181717] text-5xl font-bold hover:text-yellow-400">
					<TextStroke strokeColor="white" textColor="black" strokeWidth={1} className="text-black text-5xl font-bold">
						<CodedText className="hover:underline">GitHub</CodedText>
					</TextStroke>
				</Link>
			</PageHeader>
			{/* Rest of the page content */}
		</>
	);
}
