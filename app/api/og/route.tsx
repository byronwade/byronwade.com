import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { safeFormatDate } from "@/lib/markdown-utils";
import { type OGImageType, ogImageTypes } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const siteName = "Byron Wade";

// Satori cannot read oklch, so these are the sRGB values of the dark (deep
// space) Thorbis tokens in app/globals.css, the site's default theme; the
// share card is the space theme in one frame, over the same Hubble photograph. tests/share-card.test.mjs fails
// when they drift.
const palette = {
	background: "#050714", // --thorbis-bg (dark)
	foreground: "#f1f5fa", // --thorbis-fg (dark)
	body: "#d7deec", // --thorbis-body (dark)
	marker: "#a8b1c5", // --thorbis-marker (dark)
	border: "#1d1f2b", // --thorbis-border over --thorbis-bg (dark)
	planet: "#0e1329", // --space-planet (dark)
	rim: "#4e7de8", // --thorbis-accent (dark)
};

const kickers: Record<OGImageType, string | undefined> = {
	article: "Blog",
	blog: undefined,
	project: "Project",
	website: undefined,
};

// Static Inter instances of the site's own Latin face, generated as documented
// in docs/PERFORMANCE.md. Satori reads TTF but not the WOFF2 the pages use.
// Without these it would fall back to a font the site never shows, so a
// missing file fails the request instead.
async function loadAssets() {
	const [regular, medium, mark, sky] = await Promise.all([
		readFile(join(process.cwd(), "assets", "og", "inter-og-regular.ttf")),
		readFile(join(process.cwd(), "assets", "og", "inter-og-medium.ttf")),
		readFile(join(process.cwd(), "public", "icon-192x192.png")),
		// The Hubble eXtreme Deep Field, dimmed under the type (scripts/build-space-band.py).
		readFile(join(process.cwd(), "assets", "space", "hubble-xdf-card.jpg")),
	]);
	return {
		regular,
		medium,
		mark: `data:image/png;base64,${mark.toString("base64")}`,
		sky: `data:image/jpeg;base64,${sky.toString("base64")}`,
	};
}

// About two lines of the description at 30px. lineClamp stays as the backstop,
// but it would cut mid-word.
const descriptionLimit = 120;
const TRAILING_PUNCTUATION = /[\s,;:.–—-]+$/;

function clip(text: string, limit: number): string {
	if (text.length <= limit) {
		return text;
	}
	const cut = text.slice(0, limit + 1);
	const lastSpace = cut.lastIndexOf(" ");
	return `${cut.slice(0, lastSpace > 0 ? lastSpace : limit).replace(TRAILING_PUNCTUATION, "")}…`;
}

function readType(value: string | null): OGImageType {
	return ogImageTypes.find((type) => type === value) ?? "website";
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const title = searchParams.get("title") || siteName;
		const description = clip(searchParams.get("description") || "", descriptionLimit);
		const type = readType(searchParams.get("type"));
		const date = safeFormatDate(searchParams.get("date"));
		const kicker = [kickers[type], date].filter(Boolean).join(" · ");
		const titleIsName = title === siteName;

		const { regular, medium, mark, sky } = await loadAssets();

		return new ImageResponse(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					backgroundColor: palette.background,
					color: palette.foreground,
					fontFamily: "Inter",
					padding: "72px 80px 64px",
					position: "relative",
				}}
			>
				{/* biome-ignore lint/performance/noImgElement: Satori renders plain img elements only. */}
				<img
					alt=""
					height={630}
					src={sky}
					style={{ position: "absolute", left: 0, top: 0 }}
					width={1200}
				/>
				{/* The footer's planet horizon, rising from the card's lower right. */}
				<div
					style={{
						position: "absolute",
						left: 640,
						top: 430,
						width: 1100,
						height: 1100,
						borderRadius: 999,
						backgroundColor: palette.planet,
						border: `2px solid ${palette.rim}`,
					}}
				/>
				<div style={{ display: "flex", flexDirection: "column" }}>
					{kicker && (
						<div style={{ fontSize: 26, color: palette.marker, marginBottom: 28 }}>{kicker}</div>
					)}
					<div
						style={{
							display: "block",
							fontSize: title.length > 48 ? 60 : 76,
							fontWeight: 500,
							lineHeight: 1.12,
							letterSpacing: "-0.025em", // tracking-tight, as on the page titles
							lineClamp: 3,
						}}
					>
						{title}
					</div>
					{description && (
						<div
							style={{
								display: "block",
								marginTop: 28,
								maxWidth: 980,
								fontSize: 30,
								lineHeight: 1.45,
								color: palette.body,
								lineClamp: 2,
							}}
						>
							{description}
						</div>
					)}
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						borderTop: `2px solid ${palette.border}`,
						paddingTop: 32,
					}}
				>
					<div style={{ display: "flex", alignItems: "center" }}>
						{/* biome-ignore lint/performance/noImgElement: Satori renders plain img elements only. */}
						<img src={mark} alt="" width={48} height={43} />
						<div style={{ display: "flex", flexDirection: "column", marginLeft: 18 }}>
							{!titleIsName && <div style={{ fontSize: 26, fontWeight: 500 }}>{siteName}</div>}
							<div style={{ fontSize: 22, color: palette.marker }}>Design & engineering</div>
						</div>
					</div>
					<div style={{ fontSize: 24, color: palette.marker }}>byronwade.com</div>
				</div>
			</div>,
			{
				width: 1200,
				height: 630,
				// Cards depend only on their query and these deployed assets, never a visitor.
				headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
				fonts: [
					{ name: "Inter", data: regular, style: "normal", weight: 400 },
					{ name: "Inter", data: medium, style: "normal", weight: 500 },
				],
			}
		);
	} catch (error) {
		console.error("OG image generation error:", error);
		return new Response("Failed to generate OG image", {
			status: 500,
			headers: { "Cache-Control": "no-store" },
		});
	}
}
