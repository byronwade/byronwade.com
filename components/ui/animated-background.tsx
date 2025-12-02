"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	opacity: number;
	color: string;
}

interface AnimatedBackgroundProps {
	variant?: "particles" | "gradient" | "geometric" | "minimal";
	particleCount?: number;
	colors?: string[];
	speed?: number;
	className?: string;
}

export default function AnimatedBackground({
	variant = "particles",
	particleCount = 50,
	colors = ["#fbbf24", "#f59e0b", "#d97706", "#92400e"],
	speed = 1,
	className = "",
}: AnimatedBackgroundProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>(undefined);
	const particlesRef = useRef<Particle[]>([]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		const createParticles = () => {
			particlesRef.current = [];
			for (let i = 0; i < particleCount; i++) {
				particlesRef.current.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					vx: (Math.random() - 0.5) * speed,
					vy: (Math.random() - 0.5) * speed,
					size: Math.random() * 3 + 1,
					opacity: Math.random() * 0.5 + 0.1,
					color: colors[Math.floor(Math.random() * colors.length)],
				});
			}
		};

		const drawParticles = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (variant === "particles") {
				particlesRef.current.forEach((particle) => {
					ctx.beginPath();
					ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
					ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255)
						.toString(16)
						.padStart(2, "0")}`;
					ctx.fill();

					// Update position
					particle.x += particle.vx;
					particle.y += particle.vy;

					// Bounce off edges
					if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
					if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

					// Keep particles in bounds
					particle.x = Math.max(0, Math.min(canvas.width, particle.x));
					particle.y = Math.max(0, Math.min(canvas.height, particle.y));
				});

				// Draw connections between nearby particles
				particlesRef.current.forEach((particle, i) => {
					particlesRef.current.slice(i + 1).forEach((otherParticle) => {
						const dx = particle.x - otherParticle.x;
						const dy = particle.y - otherParticle.y;
						const distance = Math.sqrt(dx * dx + dy * dy);

						if (distance < 100) {
							ctx.beginPath();
							ctx.moveTo(particle.x, particle.y);
							ctx.lineTo(otherParticle.x, otherParticle.y);
							ctx.strokeStyle = `${colors[0]}${Math.floor((1 - distance / 100) * 50)
								.toString(16)
								.padStart(2, "0")}`;
							ctx.lineWidth = 1;
							ctx.stroke();
						}
					});
				});
			} else if (variant === "geometric") {
				const time = Date.now() * 0.001;

				// Draw rotating geometric shapes
				for (let i = 0; i < 8; i++) {
					const angle = (time + (i * Math.PI) / 4) * 0.5;
					const x = canvas.width / 2 + Math.cos(angle) * (100 + i * 20);
					const y = canvas.height / 2 + Math.sin(angle) * (100 + i * 20);
					const size = 20 + Math.sin(time + i) * 10;

					ctx.save();
					ctx.translate(x, y);
					ctx.rotate(angle);
					ctx.beginPath();
					ctx.rect(-size / 2, -size / 2, size, size);
					ctx.fillStyle = `${colors[i % colors.length]}20`;
					ctx.fill();
					ctx.strokeStyle = `${colors[i % colors.length]}40`;
					ctx.lineWidth = 2;
					ctx.stroke();
					ctx.restore();
				}
			} else if (variant === "gradient") {
				const time = Date.now() * 0.001;

				// Create animated gradient
				const gradient = ctx.createRadialGradient(
					canvas.width / 2 + Math.cos(time) * 100,
					canvas.height / 2 + Math.sin(time) * 100,
					0,
					canvas.width / 2,
					canvas.height / 2,
					Math.max(canvas.width, canvas.height)
				);

				gradient.addColorStop(0, `${colors[0]}10`);
				gradient.addColorStop(0.5, `${colors[1]}05`);
				gradient.addColorStop(1, `${colors[2]}02`);

				ctx.fillStyle = gradient;
				ctx.fillRect(0, 0, canvas.width, canvas.height);
			}
		};

		const animate = () => {
			drawParticles();
			animationRef.current = requestAnimationFrame(animate);
		};

		resizeCanvas();
		createParticles();
		animate();

		window.addEventListener("resize", () => {
			resizeCanvas();
			createParticles();
		});

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
			window.removeEventListener("resize", resizeCanvas);
		};
	}, [variant, particleCount, colors, speed]);

	if (variant === "minimal") {
		return (
			<div className={`fixed inset-0 -z-10 ${className}`}>
				<div className="absolute inset-0 bg-gradient-to-br from-yellow-50/20 via-transparent to-yellow-100/10 dark:from-yellow-900/5 dark:via-transparent dark:to-yellow-800/5" />
				<div className="absolute top-0 left-1/4 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-300/5 rounded-full blur-3xl animate-pulse delay-1000" />
			</div>
		);
	}

	return (
		<div className={`fixed inset-0 -z-10 ${className}`}>
			<canvas
				ref={canvasRef}
				className="absolute inset-0 w-full h-full"
				style={{ background: "transparent" }}
			/>
			{variant === "gradient" && (
				<div className="absolute inset-0 bg-gradient-to-br from-transparent via-yellow-50/5 to-transparent dark:via-yellow-900/5" />
			)}
		</div>
	);
}
