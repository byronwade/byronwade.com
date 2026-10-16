// Thorbis Design port: rules/page + site-shell.stylex @ 46b6654.
// Showcase adaptation; provenance and sync: docs/THORBIS-DESIGN-PORT.md.
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight } from "@/lib/icons";
import { getProjects } from "@/lib/projects";
import { HomeActions } from "./home-actions";

function Fact({ value, label }: { value: string; label: string }) {
	return (
		<div className="flex flex-col gap-1">
			<dt className="text-copy-12 text-muted-foreground">{label}</dt>
			<dd className="order-first font-medium text-heading-20 tabular-nums">{value}</dd>
		</div>
	);
}

export async function HomeHero() {
	const projects = await getProjects();
	return (
		<section aria-labelledby="home-title" className="flex flex-col gap-8">
			<div className="grid items-start gap-8 md:grid-cols-[1.6fr_1fr] md:gap-12">
				<div className="flex flex-col items-start gap-5">
					<p className="flex flex-wrap items-center gap-3 text-copy-13 text-muted-foreground">
						Byron Wade <Badge variant="outline">Product engineer · Founder</Badge>
					</p>
					<h1
						className="max-w-xl text-balance font-medium text-heading-32 tracking-tight"
						id="home-title"
					>
						I ran the service business. Now I build the software it needed.
					</h1>
					<p className="max-w-xl text-body text-copy-16 leading-relaxed">
						I grew a plumbing company to $2.4M in year two. Then it closed. Dispatch, phones,
						reputation: I learned the problems firsthand. Today I turn those lessons into products
						for the trades.
					</p>
					<HomeActions />
					<Link className="link-underline text-copy-13" href="/blog/scaling-plumbing-business">
						Read what went wrong, and what I learned
					</Link>
				</div>
				<Card>
					<CardHeader>
						<p className="mb-3 text-copy-12 text-muted-foreground">What I’m building</p>
						<CardTitle>
							<h2>Thorbis</h2>
						</CardTitle>
						<CardDescription>Software for the people who keep things running.</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-5">
						<p className="text-body text-copy-14 leading-relaxed">
							From the first customer call to the last invoice. Product engineering and a shared
							design system, grounded in the work of a service business.
						</p>
						<a
							className="link-underline inline-flex min-h-11 items-center gap-2 text-copy-13"
							href="https://thorbis.com"
							rel="noopener noreferrer"
							target="_blank"
						>
							Explore Thorbis <ArrowUpRight aria-hidden="true" className="size-4" />
							<span className="sr-only">(opens in a new tab)</span>
						</a>
					</CardContent>
				</Card>
			</div>
			<dl className="grid grid-cols-3 gap-4 border-border border-t pt-6">
				<Fact label="Year-two revenue, before closing" value="$2.4M" />
				<Fact label="Years shipping software" value="8+" />
				<Fact label="Projects documented here" value={String(projects.length)} />
			</dl>
		</section>
	);
}
