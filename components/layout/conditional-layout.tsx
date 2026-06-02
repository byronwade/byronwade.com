import type { ReactNode } from "react";
import Background from "@/components/sections/background";
import Footer from "./footer";
import Header from "./header";

export default function SiteLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Background />
			<div className="relative flex min-h-screen flex-col">
				<Header />
				<main id="main-content" className="flex-1">
					{children}
				</main>
				<Footer />
			</div>
		</>
	);
}
