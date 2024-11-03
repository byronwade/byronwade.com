import PageHeader from "@/components/page-header";
import Link from "next/link";
import CodedText from "@/components/ui/coded-text";
import TextStroke from "@/components/ui/text-stroke";
import HeroPages from "@/components/sections/hero-pages";

export default function LocalWebDesign() {
	return (
		<>
			<PageHeader title="Design">
				<Link href="https://www.figma.com" className="text-[#f24e1e] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Figma</CodedText>
				</Link>
				<Link href="https://www.sketch.com" className="text-[#fdad00] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Sketch</CodedText>
				</Link>
				<Link href="https://www.adobe.com/products/xd.html" className="text-[#ff61f6] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Adobe XD</CodedText>
				</Link>
				<Link href="https://www.invisionapp.com" className="text-[#ff3366] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">InVision</CodedText>
				</Link>
				<Link href="https://www.framer.com" className="text-[#05f] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Framer</CodedText>
				</Link>
				<Link href="https://www.axure.com" className="text-[#008d7d] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Axure</CodedText>
				</Link>
				<Link href="https://www.flinto.com" className="text-[#00d6bf] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Flinto</CodedText>
				</Link>
				<Link href="https://www.protopie.io" className="text-[#6200ee] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">ProtoPie</CodedText>
				</Link>
			</PageHeader>

			<HeroPages />
		</>
	);
}
