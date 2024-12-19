import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const title = searchParams.get("title") ?? "Byron Wade";
		const description = searchParams.get("description") ?? "Full Stack Developer & Web Performance Expert";
		const type = searchParams.get("type") ?? "website";

		// Font
		const interBold = await fetch(new URL("https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2", req.url)).then((res) => res.arrayBuffer());

		return new ImageResponse(
			(
				<div
					style={{
						height: "100%",
						width: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "black",
						position: "relative",
					}}
				>
					{/* Gradient Background */}
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: "linear-gradient(45deg, #000000 0%, #1a1a1a 100%)",
							opacity: 0.9,
						}}
					/>

					{/* Content Container */}
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							textAlign: "center",
							padding: "40px",
							position: "relative",
							zIndex: 10,
						}}
					>
						{/* Title */}
						<h1
							style={{
								fontSize: "64px",
								fontWeight: "bold",
								color: "white",
								lineHeight: 1.2,
								marginBottom: "20px",
								fontFamily: "Inter",
								maxWidth: "900px",
							}}
						>
							{title}
						</h1>

						{/* Description */}
						<p
							style={{
								fontSize: "32px",
								color: "#888888",
								lineHeight: 1.4,
								fontFamily: "Inter",
								maxWidth: "800px",
							}}
						>
							{description}
						</p>

						{/* Type Badge */}
						<div
							style={{
								position: "absolute",
								top: "40px",
								right: "40px",
								backgroundColor: "#333333",
								padding: "8px 16px",
								borderRadius: "20px",
								color: "white",
								fontSize: "24px",
								fontFamily: "Inter",
								textTransform: "capitalize",
							}}
						>
							{type}
						</div>

						{/* Author Info */}
						<div
							style={{
								position: "absolute",
								bottom: "40px",
								display: "flex",
								alignItems: "center",
								gap: "12px",
							}}
						>
							<div
								style={{
									fontSize: "24px",
									color: "#666666",
									fontFamily: "Inter",
								}}
							>
								byronwade.com
							</div>
						</div>
					</div>
				</div>
			),
			{
				width: 1200,
				height: 630,
				fonts: [
					{
						name: "Inter",
						data: interBold,
						style: "normal",
						weight: 700,
					},
				],
			}
		);
	} catch (e) {
		console.error(e);
		return new Response("Failed to generate image", { status: 500 });
	}
}
