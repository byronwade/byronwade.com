import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const repo = searchParams.get("repo");
	const owner = searchParams.get("owner");

	if (!repo || !owner) {
		return new Response("Missing repo or owner", { status: 400 });
	}

	return new ImageResponse(
		(
			<div
				style={{
					display: "flex",
					fontSize: 60,
					color: "black",
					background: "#f6f6f6",
					width: "100%",
					height: "100%",
					padding: "50px 200px",
					textAlign: "center",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{owner}/{repo}
			</div>
		),
		{
			width: 1200,
			height: 630,
		}
	);
}
