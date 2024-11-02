"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Background from "./background";
import { CodedText } from "@/components/CodedText";

export default function Hero() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [scrollPosition, setScrollPosition] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const imageRef = useRef<HTMLDivElement>(null);
	const sectionRef = useRef<HTMLElement>(null);
	const textRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};

		const handleScroll = () => {
			setScrollPosition(window.scrollY);
		};

		const observer = new IntersectionObserver(
			([entry]) => {
				setIsVisible(entry.isIntersecting);
			},
			{ threshold: 0.1 }
		);

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("scroll", handleScroll);

		if (textRef.current) {
			observer.observe(textRef.current);
		}

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("scroll", handleScroll);
			if (textRef.current) {
				observer.unobserve(textRef.current);
			}
		};
	}, []);

	const calculateImageTransform = () => {
		if (!imageRef.current || !sectionRef.current) return "";
		const { width, height, left, top } = imageRef.current.getBoundingClientRect();
		const sectionRect = sectionRef.current.getBoundingClientRect();
		const centerX = left + width / 2;
		const centerY = top + height / 2;
		const moveX = (mousePosition.x - centerX) / 25;
		const moveY = (mousePosition.y - centerY) / 25;

		const scrollProgress = scrollPosition / (document.documentElement.scrollHeight - window.innerHeight);
		const trackLength = sectionRect.height - height;
		const verticalMove = scrollProgress * trackLength;

		const waveAmplitude = 50;
		const waveFrequency = 0.005;
		const horizontalMove = Math.sin(scrollPosition * waveFrequency) * waveAmplitude;

		return `translate(${horizontalMove + moveX}px, ${verticalMove + moveY}px)`;
	};

	return (
		<>
			<section ref={sectionRef} className="relative text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
					<div className="grid md:grid-cols-2 gap-12 items-start">
						<div ref={textRef} className="space-y-8">
							<h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight transition-all duration-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"}`}>
								<span className="inline-block overflow-hidden">
									<span className="inline-block animate-speed-left">Launch Your Business with</span>
								</span>{" "}
								<span className="inline-block overflow-hidden">
									<span className="inline-block animate-speed-right bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">Warp-Speed</span>
								</span>{" "}
								<span className="inline-block overflow-hidden">
									<span className="inline-block animate-speed-left">Websites</span>
								</span>
							</h1>
							<p className={`text-xl md:text-2xl text-gray-300 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
								<span className="inline-block overflow-hidden">
									<span className="inline-block animate-speed-up">Propelling Jasper, Georgia businesses into the digital stratosphere with websites that load at light speed, outrank the competition, and convert visitors into loyal customers.</span>
								</span>
							</p>
							<div className={`flex flex-wrap gap-4 items-center transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
								<Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-500 transition duration-150 ease-in-out animate-pulse-fast">
									<CodedText>Launch Your Mission</CodedText>
									<Zap className="ml-2 -mr-1 h-5 w-5" />
								</Link>
								<CodedText>
									<Link href="/projects" className="inline-flex items-center justify-center px-6 py-3 border border-yellow-400 text-base font-medium rounded-md text-yellow-400 hover:bg-yellow-400 hover:text-black transition duration-150 ease-in-out animate-pulse-fast">
										Explore Our Galaxy of Work
									</Link>
								</CodedText>
							</div>
							<div className={`flex flex-col sm:flex-row items-center gap-4 text-sm transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
								<div className="flex items-center animate-speed-left">
									<Zap className="h-5 w-5 text-yellow-400 mr-2" />
									<span>50% Faster Than Light-Speed Loading</span>
								</div>
								<div className="flex items-center animate-speed-right">
									<Zap className="h-5 w-5 text-yellow-400 mr-2" />
									<span>200% Boost in Orbital Rankings</span>
								</div>
							</div>
						</div>
						<div
							ref={imageRef}
							className="transition-transform duration-300 ease-out sticky top-24"
							style={{
								transform: calculateImageTransform(),
							}}
						>
							<Image src="/astronaut.svg" alt="Astronaut piloting blazing fast websites for Jasper, Georgia businesses" width={600} height={600} className="invert animate-float" priority />
						</div>
					</div>
				</div>
			</section>
			<Background />
		</>
	);
}
