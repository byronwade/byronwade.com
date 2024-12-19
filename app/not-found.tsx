import Link from "next/link";

export default function NotFound() {
	return (
		<div className="min-h-[60vh] flex items-center justify-center">
			<div className="text-center space-y-4">
				<h1 className="text-4xl font-bold">404 - Page Not Found</h1>
				<p className="text-muted-foreground">This feature is currently unavailable or the page you&apos;re looking for doesn&apos;t exist.</p>
				<Link href="/" className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
					Return Home
				</Link>
			</div>
		</div>
	);
}
