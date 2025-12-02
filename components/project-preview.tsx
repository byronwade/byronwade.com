"use client";

import { cn } from "@/lib/utils";
import { ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ProjectPreviewProps {
	href: string;
	title: string;
	url: string;
	children: React.ReactNode;
	className?: string;
}

export function ProjectPreview({ href, title, url, children, className }: ProjectPreviewProps) {
	const [iframeError, setIframeError] = useState(false);
	const [iframeLoading, setIframeLoading] = useState(true);
	const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
	const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const previewRef = useRef<HTMLDivElement>(null);
	const iframeContainerRef = useRef<HTMLDivElement>(null);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const triggerRef = useRef<HTMLAnchorElement>(null);

	// Check if URL is a byronwade.com subdomain
	const isByronWadeSubdomain = (url: string) => {
		try {
			const urlObj = new URL(url);
			return urlObj.hostname.endsWith(".byronwade.com") || urlObj.hostname === "byronwade.com";
		} catch {
			return false;
		}
	};

	// Get the iframe src - use proxy for byronwade.com subdomains
	const getIframeSrc = () => {
		if (isByronWadeSubdomain(href)) {
			// Use proxy API route for subdomains to bypass CSP restrictions
			return `/api/proxy-site?url=${encodeURIComponent(href)}`;
		}
		return href;
	};

	// Track global mouse position
	useEffect(() => {
		const handleDocumentMouseMove = (e: MouseEvent) => {
			// Use clientX/clientY which are relative to viewport
			setCursorPosition({
				x: Math.max(0, Math.min(e.clientX, window.innerWidth)),
				y: Math.max(0, Math.min(e.clientY, window.innerHeight)),
			});
		};

		document.addEventListener("mousemove", handleDocumentMouseMove);

		return () => {
			document.removeEventListener("mousemove", handleDocumentMouseMove);
		};
	}, []);

	// Handle trigger hover
	useEffect(() => {
		const handleTriggerMouseMove = (e: MouseEvent) => {
			// Update cursor position when moving over trigger
			setCursorPosition({ x: e.clientX, y: e.clientY });
		};

		const handleTriggerMouseEnter = () => {
			setIsOpen(true);
		};

		const handleTriggerMouseLeave = (e: MouseEvent) => {
			// Don't close if moving to the preview
			const relatedTarget = e.relatedTarget as HTMLElement;
			const trigger = triggerRef.current;
			if (!relatedTarget || !previewRef.current?.contains(relatedTarget)) {
				// Add a small delay to allow mouse to move to preview
				setTimeout(() => {
					if (!previewRef.current?.matches(":hover") && !trigger?.matches(":hover")) {
						setIsOpen(false);
					}
				}, 100);
			}
		};

		const trigger = triggerRef.current;
		if (trigger) {
			trigger.addEventListener("mousemove", handleTriggerMouseMove);
			trigger.addEventListener("mouseenter", handleTriggerMouseEnter);
			trigger.addEventListener("mouseleave", handleTriggerMouseLeave);
		}

		return () => {
			if (trigger) {
				trigger.removeEventListener("mousemove", handleTriggerMouseMove);
				trigger.removeEventListener("mouseenter", handleTriggerMouseEnter);
				trigger.removeEventListener("mouseleave", handleTriggerMouseLeave);
			}
		};
	}, []);

	// Track mouse position inside preview for cursor indicator
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (iframeContainerRef.current) {
				const rect = iframeContainerRef.current.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				// Only show cursor if it's within the iframe container bounds
				if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
					setMousePosition({ x, y });
				} else {
					setMousePosition(null);
				}
			}
		};

		const handleMouseLeave = () => {
			setMousePosition(null);
		};

		const container = iframeContainerRef.current;
		if (container) {
			container.addEventListener("mousemove", handleMouseMove);
			container.addEventListener("mouseleave", handleMouseLeave);
		}

		return () => {
			if (container) {
				container.removeEventListener("mousemove", handleMouseMove);
				container.removeEventListener("mouseleave", handleMouseLeave);
			}
		};
	}, [isOpen]);

	return (
		<>
			<a
				ref={triggerRef}
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className={cn(
					"flex items-center justify-between w-full hover:opacity-70 transition-all duration-200 group hover-scale focus-ring touch-target py-2 sm:py-1",
					className
				)}
			>
				{children}
			</a>
			{isOpen && cursorPosition && (
				<div
					ref={previewRef}
					className="fixed z-50 pointer-events-none"
					style={{
						left: `${cursorPosition.x + 20}px`,
						top: `${cursorPosition.y + 20}px`,
						maxWidth: "calc(100vw - 40px)",
						maxHeight: "calc(100vh - 40px)",
					}}
					onMouseEnter={() => setIsOpen(true)}
					onMouseMove={(e) => {
						// Update position when hovering over preview
						setCursorPosition({ x: e.clientX, y: e.clientY });
					}}
					onMouseLeave={() => {
						setTimeout(() => {
							if (!triggerRef.current?.matches(":hover")) {
								setIsOpen(false);
							}
						}, 100);
					}}
				>
					<div
						className="w-[600px] h-[400px] p-0 overflow-hidden border-yellow-600/20 bg-[var(--background)] shadow-xl rounded-lg pointer-events-auto"
						style={{
							maxWidth: "calc(100vw - 40px)",
							maxHeight: "calc(100vh - 40px)",
						}}
					>
						<div className="relative w-full h-full bg-gray-100 dark:bg-gray-900">
							{/* Browser chrome */}
							<div className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
								<div className="flex gap-1.5">
									<div className="w-3 h-3 rounded-full bg-red-500" />
									<div className="w-3 h-3 rounded-full bg-yellow-500" />
									<div className="w-3 h-3 rounded-full bg-green-500" />
								</div>
								<div className="flex-1 mx-3 px-3 py-1 bg-white dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300 truncate">
									{url}
								</div>
							</div>
							{/* Website preview iframe */}
							<div
								ref={iframeContainerRef}
								className="relative w-full h-[calc(100%-40px)] overflow-hidden bg-white dark:bg-gray-950"
							>
								{/* Cursor indicator */}
								{mousePosition && (
									<div
										className="absolute z-50 pointer-events-none transition-all duration-75 ease-out"
										style={{
											left: `${mousePosition.x}px`,
											top: `${mousePosition.y}px`,
											transform: "translate(-50%, -50%)",
										}}
									>
										<div className="relative">
											<div className="w-5 h-5 border-2 border-yellow-600 dark:border-yellow-500 rounded-full bg-yellow-600/30 dark:bg-yellow-500/30 shadow-lg backdrop-blur-sm">
												<div className="w-1.5 h-1.5 bg-yellow-600 dark:bg-yellow-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
											</div>
											<div className="absolute inset-0 w-5 h-5 border border-yellow-400/50 dark:border-yellow-400/50 rounded-full animate-ping" />
										</div>
									</div>
								)}
								{iframeLoading && !iframeError && (
									<div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
										<Loader2 className="w-6 h-6 text-yellow-600 dark:text-yellow-500 animate-spin" />
									</div>
								)}
								{iframeError ? (
									<div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 dark:bg-gray-900">
										<ExternalLink className="w-8 h-8 text-gray-400 dark:text-gray-600" />
										<p className="text-sm text-gray-600 dark:text-gray-400 text-center">
											Preview unavailable. Click to visit the website.
										</p>
										<a
											href={href}
											target="_blank"
											rel="noopener noreferrer"
											className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-md transition-colors"
										>
											Visit {url}
										</a>
									</div>
								) : (
									<div
										style={{
											width: "100%",
											height: "100%",
											position: "relative",
											overflow: "hidden",
										}}
									>
										<div
											style={{
												width: "1920px", // Fixed desktop width
												height: "1080px", // Fixed desktop height
												transform: `scale(${Math.min(600 / 1920, 400 / 1080)})`, // Scale to fit 600x400 container
												transformOrigin: "top left",
												position: "absolute",
												top: 0,
												left: 0,
											}}
										>
											<iframe
												ref={iframeRef}
												src={getIframeSrc()}
												style={{
													width: "1920px",
													height: "1080px",
													border: "none",
													display: "block",
													pointerEvents: "none",
												}}
												title={`Preview of ${title}`}
												loading="eager"
												sandbox={(() => {
													try {
														const urlObj = new URL(href);
														const isSubdomain =
															urlObj.hostname.endsWith(".byronwade.com") ||
															urlObj.hostname === "byronwade.com";
														return isSubdomain
															? "allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation-by-user-activation"
															: "allow-same-origin allow-scripts allow-popups allow-forms";
													} catch {
														return "allow-same-origin allow-scripts allow-popups allow-forms";
													}
												})()}
												onLoad={() => {
													// Check if iframe actually loaded content after a delay
													setTimeout(() => {
														if (iframeRef.current && !iframeError) {
															try {
																const iframe = iframeRef.current;
																const iframeDoc =
																	iframe.contentDocument || iframe.contentWindow?.document;
																if (iframeDoc) {
																	const body = iframeDoc.body;
																	if (
																		body &&
																		(body.children.length === 0 || body.textContent?.trim() === "")
																	) {
																		// Blank iframe - likely blocked
																		setIframeError(true);
																		setIframeLoading(false);
																		return;
																	}
																}
															} catch (_e) {
																// Cross-origin - check if it's a subdomain that might be blocked
																try {
																	const urlObj = new URL(href);
																	const isSubdomain =
																		urlObj.hostname.endsWith(".byronwade.com") ||
																		urlObj.hostname === "byronwade.com";
																	if (isSubdomain) {
																		// Give subdomains extra time, then check
																		setTimeout(() => {
																			if (iframeRef.current && !iframeError) {
																				// Still no content accessible - likely blocked
																				setIframeError(true);
																				setIframeLoading(false);
																			}
																		}, 3000);
																		return;
																	}
																} catch {
																	// Invalid URL, continue normally
																}
															}
														}
														if (!iframeError) {
															setIframeLoading(false);
														}
													}, 500);
												}}
												onError={() => {
													setIframeError(true);
													setIframeLoading(false);
												}}
											/>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
