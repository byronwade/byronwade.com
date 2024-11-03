import React from "react";
import CodedText from "@/components/ui/coded-text";
import Background from "@/components/sections/background";
import Marquee from "@/components/ui/marquee";

interface PageHeaderProps {
	title: string;
	children: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, children }) => {
	return (
		<div className="relative">
			<Background />
			<div className="relative pb-20">
				<Marquee pauseOnHover className="[--duration:20s]">
					<h1 className="text-white text-9xl font-bold mr-20 hover:text-yellow-400 hover:underline">
						<CodedText>{title}</CodedText>
					</h1>
				</Marquee>
				<Marquee pauseOnHover className="[--duration:20s] -mt-4">
					{children}
				</Marquee>
			</div>
		</div>
	);
};

export default PageHeader;
