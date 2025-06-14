"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface OptimizedImageProps {
	src: string;
	alt: string;
	width?: number;
	height?: number;
	className?: string;
	priority?: boolean;
	sizes?: string;
	quality?: number;
	placeholder?: "blur" | "empty";
	blurDataURL?: string;
	fill?: boolean;
	style?: React.CSSProperties;
}

export function OptimizedImage({ src, alt, width, height, className = "", priority = false, sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw", quality = 85, placeholder = "empty", blurDataURL, fill = false, style, ...props }: OptimizedImageProps) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [hasError, setHasError] = useState(false);

	// Generate blur placeholder if not provided
	const generateBlurDataURL = (w: number, h: number) => {
		const canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext("2d");
		if (ctx) {
			ctx.fillStyle = "#f3f4f6";
			ctx.fillRect(0, 0, w, h);
		}
		return canvas.toDataURL();
	};

	const defaultBlurDataURL = width && height ? generateBlurDataURL(width, height) : undefined;

	// Detect WebP/AVIF support
	const [supportsWebP, setSupportsWebP] = useState(false);
	const [supportsAVIF, setSupportsAVIF] = useState(false);

	useEffect(() => {
		// Check WebP support
		const webpTest = new window.Image();
		webpTest.onload = webpTest.onerror = () => {
			setSupportsWebP(webpTest.height === 2);
		};
		webpTest.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";

		// Check AVIF support
		const avifTest = new window.Image();
		avifTest.onload = avifTest.onerror = () => {
			setSupportsAVIF(avifTest.height === 2);
		};
		avifTest.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=";
	}, []);

	// Optimize image URL based on format support
	const getOptimizedSrc = (originalSrc: string) => {
		if (originalSrc.startsWith("data:") || originalSrc.startsWith("blob:")) {
			return originalSrc;
		}

		// If using Next.js Image component, let it handle optimization
		return originalSrc;
	};

	const handleLoad = () => {
		setIsLoaded(true);
	};

	const handleError = () => {
		setHasError(true);
		setIsLoaded(true);
	};

	if (hasError) {
		return (
			<div className={`bg-gray-200 flex items-center justify-center ${className}`} style={{ width, height, ...style }}>
				<span className="text-gray-500 text-sm">Failed to load image</span>
			</div>
		);
	}

	const imageProps = {
		src: getOptimizedSrc(src),
		alt,
		onLoad: handleLoad,
		onError: handleError,
		quality,
		sizes,
		priority,
		placeholder: placeholder as "blur" | "empty",
		blurDataURL: blurDataURL || defaultBlurDataURL,
		className: `transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`,
		style,
		...props,
	};

	if (fill) {
		return <Image {...imageProps} fill />;
	}

	if (width && height) {
		return <Image {...imageProps} width={width} height={height} />;
	}

	// Fallback for cases where dimensions aren't provided
	return <Image {...imageProps} width={800} height={600} />;
}
