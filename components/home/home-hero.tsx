// Thorbis Design port: rules/page + guidelines/specimen @ 46b6654.
// Showcase adaptation; provenance and sync: docs/THORBIS-DESIGN-PORT.md.
import Link from "next/link";
import { Sheet } from "@/components/layout/sheet";
import { ArrowUpRight } from "@/lib/icons";
import { getProjects } from "@/lib/projects";
import { HomeActions } from "./home-actions";

/**
 * The chain Thorbis organizes, in the order a service call moves through it.
 * Stages, not records: there are no invented customers or totals here, so the
 * specimen cannot be mistaken for live product data.
 */
const CHAIN = [
	{ stage: "Call", detail: "The customer and the job, from the first conversation" },
	{ stage: "Schedule", detail: "An estimate and a time on the calendar" },
	{ stage: "Dispatch", detail: "The right tech, with the job’s history" },
	{ stage: "Invoice", detail: "Priced from the work that was done" },
] as const;

function Fact({ value, label }: { value: string; label: string }) {
	return (
		<div className="flex flex-col gap-1">
			<dt className="text-copy-12 text-muted-foreground">{label}</dt>
			<dd className="order-first font-medium text-heading-20 tabular-nums">{value}</dd>
		</div>
	);
}

function ThorbisSpecimen() {
	return (
		<Sheet caption="What Thorbis organizes, first call to last invoice. An outline of the product’s scope, not live data.">
			<div className="flex items-baseline justify-between gap-4 px-1.5 pt-1 pb-3">
				<h2 className="font-medium text-copy-14 text-foreground">
					Now building <span className="text-muted-foreground">·</span> Thorbis
				</h2>
				<a
					className="link-action text-copy-13"
					href="https://thorbis.com"
					rel="noopener noreferrer"
					target="_blank"
				>
					thorbis.com
					<ArrowUpRight aria-hidden="true" className="size-3.5" />
					<span className="sr-only"> (opens in a new tab)</span>
				</a>
			</div>
			<ol className="flex flex-col gap-0.5">
				{CHAIN.map(({ stage, detail }, index) => (
					<li
						className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 rounded-md px-1.5 py-2 odd:bg-muted"
						key={stage}
					>
						<span className="font-mono text-copy-12 text-muted-foreground tabular-nums">
							{String(index + 1).padStart(2, "0")}
						</span>
						<span className="flex min-w-0 flex-col">
							<span className="font-medium text-copy-14 text-foreground">{stage}</span>
							<span className="text-copy-13 text-muted-foreground">{detail}</span>
						</span>
					</li>
				))}
			</ol>
		</Sheet>
	);
}

export async function HomeHero() {
	const projects = await getProjects();
	return (
		<section aria-labelledby="home-title" className="flex flex-col gap-10">
			<div className="grid items-start gap-10 md:grid-cols-5 md:gap-12">
				<div className="flex flex-col items-start gap-5 md:col-span-3">
					<p className="text-copy-13 text-muted-foreground">
						Byron Wade <span aria-hidden="true">·</span> Product engineer and founder
					</p>
					<h1
						className="max-w-xl text-balance font-medium text-heading-32 tracking-tight"
						id="home-title"
					>
						I ran the service business. Now I build the software it needed.
					</h1>
					<p className="max-w-xl text-pretty text-body text-copy-16 leading-relaxed">
						I grew a plumbing company to $2.4M in year two. Then it closed. Dispatch, phones,
						reputation: I learned the problems firsthand. Today I turn those lessons into products
						for the trades.
					</p>
					<HomeActions />
					<Link
						prefetch={false}
						className="link-action font-normal text-copy-13"
						href="/blog/scaling-plumbing-business"
					>
						Read what went wrong, and what I learned
					</Link>
				</div>
				<div className="md:col-span-2">
					<ThorbisSpecimen />
				</div>
			</div>
			<dl className="grid grid-cols-3 gap-4">
				<Fact label="Year-two revenue, before closing" value="$2.4M" />
				<Fact label="Years shipping software" value="8+" />
				<Fact label="Projects documented here" value={String(projects.length)} />
			</dl>
		</section>
	);
}
