"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { createNoise3D } from "simplex-noise";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface VortexProps {
	children?: React.ReactNode;
	className?: string;
	containerClassName?: string;
	particleCount?: number;
	rangeY?: number;
	baseHue?: number;
	baseSpeed?: number;
	rangeSpeed?: number;
	baseRadius?: number;
	rangeRadius?: number;
	backgroundColor?: string | null;
}

const Vortex = (props: VortexProps) => {
	const frameRef = useRef<number | undefined>(undefined);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef(null);
	const { resolvedTheme } = useTheme();
	const [baseHue, setBaseHue] = useState(220);

	// Constants
	const particleCount = props.particleCount || 700;
	const particlePropCount = 9;
	const particlePropsLength = particleCount * particlePropCount;
	const rangeY = props.rangeY || 100;
	const baseTTL = 50;
	const rangeTTL = 150;
	const baseSpeed = props.baseSpeed || 0.0;
	const rangeSpeed = props.rangeSpeed || 1.5;
	const baseRadius = props.baseRadius || 1;
	const rangeRadius = props.rangeRadius || 2;
	const rangeHue = 20;
	const noiseSteps = 3;
	const xOff = 0.00125;
	const yOff = 0.00125;
	const zOff = 0.0005;
	const backgroundColor = props.backgroundColor || null;
	let tick = 0;
	const noise3D = createNoise3D();
	let particleProps = new Float32Array(particlePropsLength);
	let center: [number, number] = [0, 0];

	const HALF_PI: number = 0.5 * Math.PI;
	const TAU: number = 2 * Math.PI;
	const TO_RAD: number = Math.PI / 180;
	const rand = (n: number): number => n * Math.random();
	const randRange = (n: number): number => n - rand(2 * n);
	const fadeInOut = (t: number, m: number): number => {
		let hm = 0.5 * m;
		return Math.abs(((t + hm) % m) - hm) / hm;
	};
	const lerp = (n1: number, n2: number, speed: number): number => (1 - speed) * n1 + speed * n2;

	// Move all function declarations before they're used
	const initParticle = (particleProps: Float32Array, i: number) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const x = rand(canvas.width);
		const y = center[1] + randRange(rangeY);
		const vx = 0;
		const vy = 0;
		const life = 0;
		const ttl = baseTTL + rand(rangeTTL);
		const speed = baseSpeed + rand(rangeSpeed);
		const radius = baseRadius + rand(rangeRadius);
		const hue = baseHue + rand(rangeHue);

		particleProps.set([x, y, vx, vy, life, ttl, speed, radius, hue], i);
	};

	const initParticles = () => {
		tick = 0;
		particleProps = new Float32Array(particlePropsLength);
		for (let i = 0; i < particlePropsLength; i += particlePropCount) {
			initParticle(particleProps, i);
		}
	};

	const resize = useCallback((width?: number, height?: number) => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const w = width || window.innerWidth;
		const h = height || window.innerHeight;

		canvas.width = w;
		canvas.height = h;

		center = [w * 0.5, h * 0.5];
		initParticles();
	}, []);

	// Rest of your component code...
	// (Keep all the other functions as they are)

	const setup = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		center = [canvas.width * 0.5, canvas.height * 0.5];
		initParticles();

		const animate = () => {
			draw(canvas, ctx, particleProps, baseHue, baseSpeed, rangeSpeed, baseRadius, rangeRadius);
			frameRef.current = requestAnimationFrame(animate);
		};
		animate();
	}, []);

	useEffect(() => {
		setBaseHue(resolvedTheme === "dark" ? 45 : 270);
	}, [resolvedTheme]);

	useEffect(() => {
		setup();

		const handleResize = () => resize(window.innerWidth, window.innerHeight);
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			if (frameRef.current) {
				cancelAnimationFrame(frameRef.current);
			}
		};
	}, [setup, resize]);

	const drawParticle = (x: number, y: number, x2: number, y2: number, life: number, ttl: number, radius: number, hue: number, ctx: CanvasRenderingContext2D) => {
		ctx.save();
		ctx.lineCap = "round";
		ctx.lineWidth = radius;
		ctx.strokeStyle = `hsla(${hue},100%,${resolvedTheme === "dark" ? "60%" : "50%"},${fadeInOut(life, ttl)})`;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
	};

	const updateParticle = (i: number, ctx: CanvasRenderingContext2D) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		let i2 = 1 + i,
			i3 = 2 + i,
			i4 = 3 + i,
			i5 = 4 + i,
			i6 = 5 + i,
			i7 = 6 + i,
			i8 = 7 + i,
			i9 = 8 + i;

		let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue;

		x = particleProps[i];
		y = particleProps[i2];
		n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * TAU;
		vx = lerp(particleProps[i3], Math.cos(n), 0.5);
		vy = lerp(particleProps[i4], Math.sin(n), 0.5);
		life = particleProps[i5];
		ttl = particleProps[i6];
		speed = particleProps[i7];
		x2 = x + vx * speed;
		y2 = y + vy * speed;
		radius = particleProps[i8];
		hue = particleProps[i9];

		drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);

		life++;

		particleProps[i] = x2;
		particleProps[i2] = y2;
		particleProps[i3] = vx;
		particleProps[i4] = vy;
		particleProps[i5] = life;

		if (checkBounds(x, y, canvas) || life > ttl) {
			initParticle(particleProps, i);
		}
	};

	const checkBounds = (x: number, y: number, canvas: HTMLCanvasElement) => {
		return x > canvas.width || x < 0 || y > canvas.height || y < 0;
	};

	const drawParticles = (ctx: CanvasRenderingContext2D) => {
		for (let i = 0; i < particlePropsLength; i += particlePropCount) {
			updateParticle(i, ctx);
		}
	};

	const draw = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, particleProps: Float32Array, baseHue: number, baseSpeed: number, rangeSpeed: number, baseRadius: number, rangeRadius: number) => {
		tick++;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (backgroundColor) {
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
		}

		drawParticles(ctx);
		renderGlow(canvas, ctx);
		renderToScreen(canvas, ctx);
	};

	const renderGlow = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
		ctx.save();
		ctx.filter = "blur(8px) brightness(200%)";
		ctx.globalCompositeOperation = "lighter";
		ctx.drawImage(canvas, 0, 0);
		ctx.restore();

		ctx.save();
		ctx.filter = "blur(4px) brightness(200%)";
		ctx.globalCompositeOperation = "lighter";
		ctx.drawImage(canvas, 0, 0);
		ctx.restore();
	};

	const renderToScreen = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
		ctx.save();
		ctx.globalCompositeOperation = "lighter";
		ctx.drawImage(canvas, 0, 0);
		ctx.restore();
	};

	return (
		<div className={cn("relative h-full w-full", props.containerClassName)}>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				ref={containerRef}
				style={{
					position: "absolute",
					height: "100%",
					width: "100%",
					inset: 0,
					zIndex: 0,
					background: "transparent",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<canvas ref={canvasRef}></canvas>
			</motion.div>

			<div className={cn("relative z-10", props.className)}>{props.children}</div>
		</div>
	);
};

export { Vortex };
export default Vortex;
