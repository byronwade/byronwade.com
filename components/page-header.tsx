import CodedText from "@/components/ui/coded-text";
import Marquee from "@/components/ui/marquee";

interface PageHeaderProps {
	title: string;
	children: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
	return (
		<div className="relative">
			<div className="relative pb-10 sm:pb-16">
				<Marquee pauseOnHover repeat={30} className="[--duration:30s]">
					<h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mr-4 sm:mr-8 md:mr-12 lg:mr-16 xl:mr-20 hover:text-yellow-400 hover:underline transition-colors duration-300">
						<CodedText>{title}</CodedText>
					</h1>
				</Marquee>
				<Marquee pauseOnHover className="[--duration:30s] -mt-1 sm:-mt-2 md:-mt-3 lg:-mt-4" reverse>
					{children}
				</Marquee>
			</div>
		</div>
	);
};

export default PageHeader;
