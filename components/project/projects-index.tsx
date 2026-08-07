import { ArrowUpRight, Sparkle } from "lucide-react";
import Link from "next/link";
import { IndexList, IndexRow, indexRowAccentClass, indexRowLinkClass } from "@/components/common";
import { StatusPill } from "@/components/ui/status-pill";
import type { Project } from "@/lib/projects";
import { statusTone } from "@/lib/status-tone";

/**
 * The `/projects` index: a ranked list where each row carries its own evidence
 * (DESIGN.md §7.1).
 *
 * Two things went in this rebuild. The `INDEX` label above the list was an
 * all-caps eyebrow, which §13 rejects by name, and it labelled a list that is
 * self-evidently a list. The `01 02 03` row numerals went with it: they implied
 * a rank the sort does not actually assert, flagships first, then recency, so
 * they were decoration pretending to be data, and they cost the row its whole
 * left column.
 *
 * The count survives, because "how much work is here" is a real question a
 * visitor arrives with. It now sits with the page's lede rather than as a
 * header strip over the list.
 */

function yearOf(date?: string): string {
	if (!date) {
		return "";
	}
	const d = new Date(date);
	return Number.isNaN(d.getTime()) ? "" : String(d.getFullYear());
}

/**
 * The right-hand marker. Exactly one of status, concept, or year, a row that
 * showed two competed with its own title for attention.
 */
function RowMarker({ project }: { project: Project }) {
	const tone = statusTone(project.status);
	if (tone) {
		return (
			<StatusPill className="shrink-0 capitalize" pulse={tone.pulse} tone={tone.tone}>
				{project.status}
			</StatusPill>
		);
	}
	if (project.type === "concept") {
		return (
			<StatusPill className="shrink-0" tone="neutral">
				Concept
			</StatusPill>
		);
	}
	const year = yearOf(project.date);
	return year ? (
		<span className="shrink-0 font-mono text-muted-foreground text-xs tabular-nums">{year}</span>
	) : null;
}

export function ProjectsIndex({ projects }: { projects: Project[] }) {
	return (
		<IndexList as="ol">
			{projects.map((project) => {
				const proof = project.outcome || project.tagline;
				const leadMetric = project.metrics?.[0];
				const carriesEvidence = Boolean(project.featured || project.flagship);

				return (
					<IndexRow key={project.slug}>
						<Link className={indexRowLinkClass} href={`/projects/${project.slug}`}>
							<div className="flex items-center gap-4">
								<span className="flex min-w-0 flex-1 items-baseline gap-2.5">
									<span className={`shrink-0 font-medium text-foreground ${indexRowAccentClass}`}>
										{project.title.split(":")[0]}
									</span>
									{project.flagship && (
										<Sparkle
											aria-label="Flagship"
											className="size-3 shrink-0 translate-y-px fill-brand text-brand"
										/>
									)}
									{project.tagline && (
										<span className="hidden truncate text-muted-foreground text-sm sm:inline">
											{project.tagline}
										</span>
									)}
								</span>

								<RowMarker project={project} />

								<ArrowUpRight
									aria-hidden="true"
									className="size-4 shrink-0 text-muted-foreground/50 transition-[transform,color] group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5 group-hover/row:text-brand group-focus-visible/row:text-brand"
								/>
							</div>

							{carriesEvidence && (proof || leadMetric) && (
								<div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
									{proof && (
										<p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
											{proof}
										</p>
									)}
									{leadMetric && (
										<span className="shrink-0 font-mono text-muted-foreground text-xs tabular-nums">
											<span className="font-medium text-foreground">{leadMetric.value}</span>
											{" · "}
											{leadMetric.label}
										</span>
									)}
								</div>
							)}
						</Link>
					</IndexRow>
				);
			})}
		</IndexList>
	);
}
