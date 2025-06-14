import { NextResponse } from "next/server";
import { getFigmaFiles } from "@/lib/portfolio-data";

export async function GET() {
	try {
		console.log("Testing Figma API...");
		console.log("FIGMA_ACCESS_TOKEN:", process.env.FIGMA_ACCESS_TOKEN ? "Present" : "Missing");
		console.log("FIGMA_TEAM_ID:", process.env.FIGMA_TEAM_ID ? "Present" : "Missing");

		const figmaFiles = await getFigmaFiles();

		return NextResponse.json({
			success: true,
			count: figmaFiles.length,
			files: figmaFiles.slice(0, 3), // Just first 3 for testing
			env: {
				hasToken: !!process.env.FIGMA_ACCESS_TOKEN,
				hasTeamId: !!process.env.FIGMA_TEAM_ID,
				teamId: process.env.FIGMA_TEAM_ID,
			},
		});
	} catch (error) {
		console.error("Figma test error:", error);
		return NextResponse.json({
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
			env: {
				hasToken: !!process.env.FIGMA_ACCESS_TOKEN,
				hasTeamId: !!process.env.FIGMA_TEAM_ID,
				teamId: process.env.FIGMA_TEAM_ID,
			},
		});
	}
}
