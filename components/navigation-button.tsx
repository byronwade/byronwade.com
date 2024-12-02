"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function NavigationButton() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<Button variant="outline" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
			<Menu className="h-4 w-4" />
			<span className="sr-only">Toggle navigation menu</span>
		</Button>
	);
}
