import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

// Load font file - using Node.js file system since we can't use edge runtime with cacheComponents
async function getFontData(): Promise<ArrayBuffer> {
	try {
		const fontPath = join(process.cwd(), "public", "fonts", "Modelistasignature-ownAV.otf");
		const fontBuffer = await readFile(fontPath);
		// Convert Buffer to ArrayBuffer
		const arrayBuffer = new ArrayBuffer(fontBuffer.length);
		const view = new Uint8Array(arrayBuffer);
		view.set(fontBuffer);
		return arrayBuffer;
	} catch {
		// Fallback: return empty buffer if font not found
		console.warn("Font file not found, using system fonts");
		return new ArrayBuffer(0);
	}
}

interface OGImageParams {
	title: string;
	description?: string;
	type?: "website" | "article" | "project" | "blog";
	image?: string;
	siteName?: string;
	tags?: string;
	author?: string;
	date?: string;
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		const title = searchParams.get("title") || "Byron Wade";
		const description = searchParams.get("description") || "";
		const type = (searchParams.get("type") || "website") as OGImageParams["type"];
		const siteName = searchParams.get("siteName") || "Byron Wade";
		const tags = searchParams.get("tags");
		const author = searchParams.get("author") || "Byron Wade";
		const date = searchParams.get("date");

		const fontBoldData = await getFontData();

		// Determine colors based on type
		const colors = {
			website: {
				bg: "#000000",
				primary: "#FCD34D",
				secondary: "#FFFFFF",
				accent: "#FBBF24",
			},
			article: {
				bg: "#1A1A1A",
				primary: "#FCD34D",
				secondary: "#FFFFFF",
				accent: "#FBBF24",
			},
			project: {
				bg: "#0A0A0A",
				primary: "#FCD34D",
				secondary: "#FFFFFF",
				accent: "#FBBF24",
			},
			blog: {
				bg: "#111111",
				primary: "#FCD34D",
				secondary: "#FFFFFF",
				accent: "#FBBF24",
			},
		};

		const colorScheme = colors[type as keyof typeof colors] || colors.website;

		return new ImageResponse(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: colorScheme.bg,
					backgroundImage:
						"linear-gradient(135deg, rgba(252, 211, 77, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)",
					padding: "80px",
					fontFamily: "system-ui, -apple-system, sans-serif",
					position: "relative",
				}}
			>
				{/* Decorative elements */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						opacity: 0.1,
						backgroundImage:
							"radial-gradient(circle at 50% 50%, rgba(252, 211, 77, 0.3) 0%, transparent 70%)",
					}}
				/>

				{/* Logo/Brand */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						marginBottom: "40px",
						position: "relative",
						zIndex: 1,
					}}
				>
					<div
						style={{
							fontSize: "32px",
							fontWeight: 700,
							color: colorScheme.primary,
							letterSpacing: "-0.02em",
						}}
					>
						{siteName}
					</div>
				</div>

				{/* Main Content */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						textAlign: "center",
						maxWidth: "900px",
						position: "relative",
						zIndex: 1,
					}}
				>
					{/* Title */}
					<h1
						style={{
							fontSize: title.length > 50 ? "56px" : "72px",
							fontWeight: 800,
							lineHeight: 1.1,
							color: colorScheme.secondary,
							margin: "0 0 24px 0",
							letterSpacing: "-0.03em",
							textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
						}}
					>
						{title}
					</h1>

					{/* Description */}
					{description && (
						<p
							style={{
								fontSize: "28px",
								lineHeight: 1.4,
								color: "#CCCCCC",
								margin: "0 0 32px 0",
								maxWidth: "800px",
							}}
						>
							{description.length > 150 ? `${description.substring(0, 150)}...` : description}
						</p>
					)}

					{/* Meta Information */}
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							gap: "24px",
							marginTop: "32px",
							flexWrap: "wrap",
							justifyContent: "center",
						}}
					>
						{author && (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									fontSize: "20px",
									color: colorScheme.primary,
								}}
							>
								<span>✍️</span>
								<span style={{ marginLeft: "8px" }}>{author}</span>
							</div>
						)}

						{date && (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									fontSize: "20px",
									color: "#999999",
								}}
							>
								<span>📅</span>
								<span style={{ marginLeft: "8px" }}>
									{new Date(date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
								</span>
							</div>
						)}

						{tags && (
							<div
								style={{
									display: "flex",
									alignItems: "center",
									fontSize: "18px",
									color: "#999999",
								}}
							>
								<span>🏷️</span>
								<span style={{ marginLeft: "8px" }}>{tags.split(",").slice(0, 3).join(", ")}</span>
							</div>
						)}
					</div>
				</div>

				{/* Footer */}
				<div
					style={{
						position: "absolute",
						bottom: "40px",
						right: "80px",
						display: "flex",
						alignItems: "center",
						fontSize: "18px",
						color: "#666666",
						zIndex: 1,
					}}
				>
					byronwade.com
				</div>

				{/* Type Badge */}
				<div
					style={{
						position: "absolute",
						top: "40px",
						right: "80px",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						padding: "8px 16px",
						backgroundColor: colorScheme.primary,
						color: colorScheme.bg,
						borderRadius: "20px",
						fontSize: "14px",
						fontWeight: 600,
						textTransform: "uppercase",
						letterSpacing: "0.05em",
						zIndex: 1,
					}}
				>
					{type}
				</div>
			</div>,
			{
				width: 1200,
				height: 630,
				fonts:
					fontBoldData.byteLength > 0
						? [
								{
									name: "Modelista",
									data: fontBoldData,
									style: "normal",
									weight: 700,
								},
							]
						: undefined,
			}
		);
	} catch (error) {
		console.error("OG image generation error:", error);
		return new Response("Failed to generate OG image", { status: 500 });
	}
}
