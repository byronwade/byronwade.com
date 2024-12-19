import { Link } from "@/components/ui/link";
import { customFont } from "@/lib/fonts";
import { Twitter, Youtube, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-stone-100 py-8 mt-20">
			<div className="container mx-auto px-4 text-center text-stone-600">
				<p>&copy; 2024 Byron Wade. All rights reserved.</p>
			</div>
		</footer>
	);
}
