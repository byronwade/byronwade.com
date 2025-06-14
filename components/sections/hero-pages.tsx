import { ArrowRight, Zap, Paintbrush, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";

interface HeroPagesProps {
	title: string;
	subtitle: string;
	backgroundImage?: string;
}

export default function HeroPages({ title, subtitle, backgroundImage }: HeroPagesProps) {
	const sectionStyle = backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {};
	const overlayClass = backgroundImage ? "bg-black/50" : "";

	return (
		<section className="relative flex flex-col items-center justify-center py-20 text-center overflow-hidden" style={sectionStyle}>
			<div className={`absolute inset-0 ${overlayClass}`}></div>
			<div className="container px-4 relative z-10">
				<h1 className={`mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl ${backgroundImage ? "text-white" : ""}`}>{title}</h1>
				<p className={`max-w-3xl mx-auto text-lg ${backgroundImage ? "text-neutral-200" : "text-muted-foreground"}`}>{subtitle}</p>
			</div>
		</section>
	);
}
