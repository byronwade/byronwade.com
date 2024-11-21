// @ts-nocheck
"use client";

import Image from "next/image";
import Link from "next/link";
import { Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CodedText = dynamic(() => import("@/components/ui/coded-text"), { ssr: false });

const Hero = () => {
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	// Create smooth spring animations for x and y movement
	const springConfig = { damping: 50, stiffness: 400, mass: 0.5 };
	const x = useSpring(mouseX, springConfig);
	const y = useSpring(mouseY, springConfig);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			// Calculate movement based on cursor position
			// Divide by larger numbers to make the movement more subtle
			mouseX.set(e.clientX / 20);
			mouseY.set(e.clientY / 20);
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [mouseX, mouseY]);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	const textVariants = {
		hidden: { opacity: 0, x: -50 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	const highlightVariants = {
		hidden: { opacity: 0, x: 50 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut",
			},
		},
	};

	return (
		<section className="min-h-[calc(100dvh-100px)] flex items-center justify-center py-8 md:py-16 lg:py-0">
			<div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
				<div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
					<motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4 md:space-y-6 lg:space-y-8">
						<motion.h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
							<motion.span variants={textVariants} className="inline-block">
								Launch Your Business with
							</motion.span>{" "}
							<motion.span variants={highlightVariants} className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
								Warp-Speed
							</motion.span>{" "}
							<motion.span variants={textVariants} className="inline-block">
								Websites
							</motion.span>
						</motion.h1>

						<motion.p variants={itemVariants} className="text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-700 dark:text-gray-300">
							Propelling Jasper, Georgia businesses into the digital stratosphere with websites that load at light speed, outrank the competition, and convert visitors into loyal customers.
						</motion.p>

						<motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
							<Link href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-yellow-400 hover:bg-yellow-500 transition duration-150 ease-in-out">
								<CodedText>Launch Your Mission</CodedText>
								<Zap className="ml-2 -mr-1 h-5 w-5" />
							</Link>
							<Link href="/projects" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-yellow-400 text-base font-medium rounded-md text-yellow-400 hover:bg-yellow-400 hover:text-black transition duration-150 ease-in-out">
								<CodedText>Explore Our Galaxy of Work</CodedText>
							</Link>
						</motion.div>

						<motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs sm:text-sm">
							<motion.div variants={textVariants} className="flex items-center">
								<Zap className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
								<span>50% Faster Than Light-Speed Loading</span>
							</motion.div>
							<motion.div variants={highlightVariants} className="flex items-center">
								<Zap className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
								<span>200% Boost in Orbital Rankings</span>
							</motion.div>
						</motion.div>
					</motion.div>

					<motion.div
						style={{
							x,
							y,
						}}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						className="relative md:sticky md:top-24 mt-4 md:mt-0"
					>
						<Image src="/astronaut.svg" alt="Astronaut piloting blazing fast websites for Jasper, Georgia businesses" width={600} height={600} className="dark:invert max-w-full h-auto" priority />
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
