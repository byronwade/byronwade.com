import PageHeader from "@/components/page-header";
import { Link } from "@/components/ui/link";
import CodedText from "@/components/ui/coded-text";
import TextStroke from "@/components/ui/text-stroke";
import HeroPages from "@/components/sections/hero-pages";

export default function LocalWebDesign() {
	return (
		<>
			<PageHeader title="Marketing">
				<Link prefetch={true} href="https://www.hubspot.com" className="text-[#ff7a59] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">HubSpot</CodedText>
				</Link>
				<Link prefetch={true} href="https://mailchimp.com" className="text-[#ffe01b] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Mailchimp</CodedText>
				</Link>
				<Link prefetch={true} href="https://www.salesforce.com" className="text-[#00a1e0] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Salesforce</CodedText>
				</Link>
				<Link prefetch={true} href="https://www.marketo.com" className="text-[#5c4c9f] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Marketo</CodedText>
				</Link>
				<Link prefetch={true} href="https://www.semrush.com" className="text-[#00bc87] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">SEMrush</CodedText>
				</Link>
				<Link prefetch={true} href="https://moz.com" className="text-[#5b6aea] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Moz</CodedText>
				</Link>
				<Link prefetch={true} href="https://www.hootsuite.com" className="text-[#000000] text-5xl font-bold hover:text-yellow-400">
					<TextStroke strokeColor="white" textColor="black" strokeWidth={1} className="text-black text-5xl font-bold">
						<CodedText className="hover:underline">Hootsuite</CodedText>
					</TextStroke>
				</Link>
				<Link prefetch={true} href="https://www.canva.com" className="text-[#00c4cc] text-5xl font-bold hover:text-yellow-400">
					<CodedText className="hover:underline">Canva</CodedText>
				</Link>
			</PageHeader>

			<HeroPages />
		</>
	);
}
