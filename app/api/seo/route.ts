export async function GET(request: Request): Promise<Response> {
	// Temporarily disabled for build optimization
	return Response.json(
		{
			error: "SEO analysis temporarily disabled for performance optimization",
			code: "DISABLED",
			timestamp: new Date().toISOString(),
		},
		{
			status: 503,
			headers: {
				"Cache-Control": "public, max-age=300, s-maxage=300",
			},
		}
	);
}
