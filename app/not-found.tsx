import Link from "next/link";

export default function NotFound() {
	return (
		<div className="bg-[var(--background)] min-h-screen w-full flex justify-center py-12 px-4 sm:py-16 md:py-20 safe-top safe-bottom">
			<div className="flex flex-col gap-6 sm:gap-8 items-center w-full max-w-[544px]">
				<div className="text-center space-y-4 sm:space-y-6">
					<h1 className="text-4xl font-bold text-[var(--foreground)]">404</h1>
					<p className="text-[var(--muted-foreground)] mobile-text">
						The page you're looking for doesn't exist.
					</p>
					<Link
						href="/"
						className="inline-block text-[var(--foreground)] hover:text-amber-700 dark:hover:text-yellow-500 hover:underline underline-offset-4 transition-colors touch-target py-2 px-4"
					>
						Return home →
					</Link>
				</div>
			</div>
		</div>
	);
}
