"use client";

import { useEffect, useRef, memo, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";

interface Star {
	x: number;
	y: number;
	radius: number;
	color: string;
	magnitude: number;
	twinkleSpeed: number;
	twinklePhase: number;
}

interface MovingStar {
	x: number;
	y: number;
	radius: number;
	color: string;
	speed: number;
}

interface Meteor {
	x: number;
	y: number;
	length: number;
	angle: number;
	speed: number;
	opacity: number;
}

const Background = memo(() => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const animationFrameIdRef = useRef<number | undefined>(undefined);
	const starsRef = useRef<Star[]>([]);
	const movingStarsRef = useRef<MovingStar[]>([]);
	const meteorsRef = useRef<Meteor[]>([]);
	const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const offscreenCtxRef = useRef<CanvasRenderingContext2D | null>(null);
	const { theme } = useTheme();

	const isDarkMode = theme === "dark";

	const resizeCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		offscreenCanvasRef.current!.width = canvas.width;
		offscreenCanvasRef.current!.height = canvas.height;
		initStars();
		initMovingStars();
	}, []);

	const animate = useCallback((time: number) => {
		const canvas = canvasRef.current;
		const offscreenCtx = offscreenCtxRef.current;
		if (!canvas || !offscreenCtx) return;

		offscreenCtx.clearRect(0, 0, canvas.width, canvas.height);
		starsRef.current.forEach((star) => drawStar(offscreenCtx, star, time));
		updateMovingStars();
		movingStarsRef.current.forEach((star) => drawMovingStar(offscreenCtx, star));
		createMeteor();
		updateAndDrawMeteors(offscreenCtx);

		const ctx = canvas.getContext("2d");
		if (ctx) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(offscreenCanvasRef.current!, 0, 0);
		}

		animationFrameIdRef.current = requestAnimationFrame(animate);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		offscreenCanvasRef.current = document.createElement("canvas");
		offscreenCtxRef.current = offscreenCanvasRef.current.getContext("2d");

		resizeCanvas();
		animationFrameIdRef.current = requestAnimationFrame(animate);

		window.addEventListener("resize", resizeCanvas);

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			cancelAnimationFrame(animationFrameIdRef.current!);
		};
	}, [resizeCanvas, animate]);

	useEffect(() => {
		initStars();
		initMovingStars();
	}, [theme]);

	const starColors = useMemo(() => {
		return isDarkMode ? ["#FFFFFF", "#FFFFD4", "#FFE9B8", "#FFCAB0", "#FFB7B3"] : ["#000000", "#1A1A1A", "#333333", "#4D4D4D", "#666666"];
	}, [isDarkMode]);

	const initStars = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const starCount = Math.floor((canvas.width * canvas.height) / 1000);
		starsRef.current = Array.from({ length: starCount }, () => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			radius: Math.random() * 1.2 + 0.1,
			color: starColors[Math.floor(Math.random() * starColors.length)],
			magnitude: Math.random() * 2 + 3,
			twinkleSpeed: Math.random() * 0.03 + 0.01,
			twinklePhase: Math.random() * Math.PI * 2,
		}));
	}, [starColors]);

	const initMovingStars = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const movingStarCount = Math.floor(canvas.width / 15);
		const movingStarColors = isDarkMode ? ["#FFFFFF", "#FFFFD4", "#FFE9B8"] : ["#000000", "#1A1A1A", "#333333"];
		movingStarsRef.current = Array.from({ length: movingStarCount }, () => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			radius: Math.random() * 0.8 + 0.3,
			color: movingStarColors[Math.floor(Math.random() * movingStarColors.length)],
			speed: Math.random() * 0.3 + 0.4,
		}));
	}, [isDarkMode]);

	const drawStar = (ctx: CanvasRenderingContext2D, star: Star, time: number) => {
		const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.2 + 0.8;
		const brightness = Math.max(0, Math.min(1, 1 / (star.magnitude * twinkle)));

		ctx.beginPath();
		ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
		ctx.fillStyle = star.color;
		ctx.globalAlpha = brightness;
		ctx.fill();
		ctx.globalAlpha = 1;
	};

	const drawMovingStar = (ctx: CanvasRenderingContext2D, star: MovingStar) => {
		ctx.beginPath();
		ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
		ctx.fillStyle = star.color;
		ctx.fill();
	};

	const updateMovingStars = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		movingStarsRef.current.forEach((star) => {
			star.y -= star.speed;
			if (star.y + star.radius < 0) {
				star.y = canvas.height + star.radius;
				star.x = Math.random() * canvas.width;
			}
		});
	}, []);

	const createMeteor = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		if (Math.random() > 0.99) {
			meteorsRef.current.push({
				x: Math.random() * canvas.width,
				y: 0,
				length: Math.random() * 100 + 50,
				angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
				speed: Math.random() * 5 + 3,
				opacity: 1,
			});
		}
	}, []);

	const updateAndDrawMeteors = useCallback(
		(ctx: CanvasRenderingContext2D) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			meteorsRef.current = meteorsRef.current.filter((meteor) => meteor.opacity > 0 && meteor.y < canvas.height);
			meteorsRef.current.forEach((meteor) => {
				meteor.x += Math.cos(meteor.angle) * meteor.speed;
				meteor.y += Math.sin(meteor.angle) * meteor.speed;
				meteor.opacity -= 0.01;

				ctx.beginPath();
				ctx.moveTo(meteor.x, meteor.y);
				ctx.lineTo(meteor.x - Math.cos(meteor.angle) * meteor.length, meteor.y - Math.sin(meteor.angle) * meteor.length);
				const gradient = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - Math.cos(meteor.angle) * meteor.length, meteor.y - Math.sin(meteor.angle) * meteor.length);
				const color = isDarkMode ? "255, 255, 255" : "0, 0, 0";
				gradient.addColorStop(0, `rgba(${color}, ${meteor.opacity})`);
				gradient.addColorStop(1, `rgba(${color}, 0)`);
				ctx.strokeStyle = gradient;
				ctx.lineWidth = 2;
				ctx.stroke();
			});
		},
		[isDarkMode]
	);

	return <canvas ref={canvasRef} className="fixed inset-0 h-full w-full bg-white dark:bg-black transition-colors duration-300 -z-10" aria-hidden="true" />;
});

Background.displayName = "Background";

export default Background;
