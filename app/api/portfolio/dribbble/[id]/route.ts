import { NextResponse } from "next/server";
import { getDribbbleShot } from "@/lib/portfolio-data";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;

		// Fetch the Dribbble shot data using the server-side function
		const shot = await getDribbbleShot(id)();

		if (!shot) {
			return NextResponse.json({ error: "Shot not found" }, { status: 404 });
		}

		return NextResponse.json({ shot });
	} catch (error) {
		console.error("Error fetching Dribbble shot:", error);
		return NextResponse.json({ error: "Failed to fetch shot data" }, { status: 500 });
	}
}
