"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error("Blog error:", error);
	}, [error]);

	return (
		<div className="min-h-[50vh] flex items-center justify-center">
			<div className="text-center space-y-4">
				<h2 className="text-2xl font-bold">Something went wrong!</h2>
				<Button onClick={reset} variant="outline">
					Try again
				</Button>
			</div>
		</div>
	);
}
