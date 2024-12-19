import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavigationButton from "./navigation-button";
import { Link } from "@/components/ui/link";

interface NavigationMenuProps {
	searchParams: { menu?: string };
}

export default function NavigationMenu({ searchParams }: NavigationMenuProps) {
	const isOpen = searchParams.menu === "open";

	return (
		<Sheet open={isOpen}>
			<SheetTrigger asChild>
				<NavigationButton />
			</SheetTrigger>
			<SheetContent side="left" className="w-[300px] sm:w-[400px]">
				<nav className="flex flex-col gap-4">
					<Link href="/" className="text-lg font-medium">
						Home
					</Link>
					<Link href="/about" className="text-lg font-medium">
						About
					</Link>
					<Link href="/services" className="text-lg font-medium">
						Services
					</Link>
					<Link href="/contact" className="text-lg font-medium">
						Contact
					</Link>
				</nav>
			</SheetContent>
		</Sheet>
	);
}
