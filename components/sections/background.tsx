"use client";

import React, { useEffect, useRef } from "react";

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

export default function StarrySkyView() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		let animationFrameId: number;
		let stars: Star[] = [];
		let movingStars: MovingStar[] = [];
		let meteors: Meteor[] = [];
		let offscreenCanvas: HTMLCanvasElement;
		let offscreenCtx: CanvasRenderingContext2D;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			offscreenCanvas.width = canvas.width;
			offscreenCanvas.height = canvas.height;
			initStars();
			initMovingStars();
		};

		const initStars = () => {
			const starCount = Math.floor((canvas.width * canvas.height) / 1000); // Increased star density
			const starColors = ["#FFFFFF", "#FFFFD4", "#FFE9B8", "#FFCAB0", "#FFB7B3"];
			stars = Array.from({ length: starCount }, () => ({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				radius: Math.random() * 1.2 + 0.1, // Slightly smaller stars
				color: starColors[Math.floor(Math.random() * starColors.length)],
				magnitude: Math.random() * 2 + 3,
				twinkleSpeed: Math.random() * 0.03 + 0.01,
				twinklePhase: Math.random() * Math.PI * 2,
			}));
		};

		const initMovingStars = () => {
			const movingStarCount = Math.floor(canvas.width / 15); // Increased moving star count
			const starColors = ["#FFFFFF", "#FFFFD4", "#FFE9B8"];
			movingStars = Array.from({ length: movingStarCount }, () => ({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				radius: Math.random() * 0.8 + 0.3, // Slightly smaller moving stars
				color: starColors[Math.floor(Math.random() * starColors.length)],
				speed: Math.random() * 0.3 + 0.05, // Slower moving stars
			}));
		};

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

		const updateMovingStars = () => {
			movingStars.forEach((star) => {
				star.y -= star.speed;
				if (star.y + star.radius < 0) {
					star.y = canvas.height + star.radius;
					star.x = Math.random() * canvas.width;
				}
			});
		};

		const createMeteor = () => {
			if (Math.random() > 0.997) {
				meteors.push({
					x: Math.random() * canvas.width,
					y: 0,
					length: Math.random() * 50 + 10,
					angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
					speed: Math.random() * 3 + 1,
					opacity: 1,
				});
			}
		};

		const updateAndDrawMeteors = (ctx: CanvasRenderingContext2D) => {
			meteors = meteors.filter((meteor) => meteor.opacity > 0);
			meteors.forEach((meteor) => {
				meteor.x += Math.cos(meteor.angle) * meteor.speed;
				meteor.y += Math.sin(meteor.angle) * meteor.speed;
				meteor.opacity -= 0.02;

				ctx.beginPath();
				ctx.moveTo(meteor.x, meteor.y);
				ctx.lineTo(meteor.x - Math.cos(meteor.angle) * meteor.length, meteor.y - Math.sin(meteor.angle) * meteor.length);
				ctx.strokeStyle = `rgba(255, 255, 255, ${meteor.opacity})`;
				ctx.lineWidth = 2;
				ctx.stroke();
			});
		};

		const animate = (time: number) => {
			if (!ctx || !canvas || !offscreenCtx) return;

			offscreenCtx.clearRect(0, 0, canvas.width, canvas.height);
			stars.forEach((star) => drawStar(offscreenCtx, star, time));
			updateMovingStars();
			movingStars.forEach((star) => drawMovingStar(offscreenCtx, star));
			createMeteor();
			updateAndDrawMeteors(offscreenCtx);

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(offscreenCanvas, 0, 0);

			animationFrameId = requestAnimationFrame(animate);
		};

		offscreenCanvas = document.createElement("canvas");
		offscreenCtx = offscreenCanvas.getContext("2d")!;

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);
		animate(0);

		return () => {
			window.removeEventListener("resize", resizeCanvas);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return <canvas ref={canvasRef} className="fixed inset-0 h-full w-full bg-black" aria-hidden="true" />;
}
