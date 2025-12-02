"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Menu } from "lucide-react";

export default function NavigationButton() {
	return (
		<Button variant="outline" size="icon" className="lg:hidden" asChild>
			<Link href="?menu=open" scroll={false}>
				<Menu className="h-4 w-4" />
				<span className="sr-only">Toggle navigation menu</span>
			</Link>
		</Button>
	);
}
