import { ArrowUpRight, Sparkle } from "lucide-react";
import Link from "next/link";
import type { StatusTone } from "@/components/ui/status-dot";
import { StatusPill } from "@/components/ui/status-pill";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

interface ProjectsIndexProps {
	projects: Project[];
}

/** Map a free-text status label to a design-system status tone. */
function statusTone(status?: string): { tone: StatusTone; pulse: boolean } | null {
	if (!status) return null;
	const s = status.toLowerCase();
	if (s.includes("live") || s.includes("shipped")) return { tone: "success", pulse: true };
	if (s.includes("dev") || s.includes("progress") || s.includes("beta"))
		return { tone: "warning", pulse: false };
	if (s.includes("open source") || s.includes("oss")) return { tone: "info", pulse: false };
	return { tone: "neutral", pulse: false };
}

function yearOf(date?: string): string {
	if (!date) return "";
	const d = new Date(date);
	return Number.isNaN(d.getTime()) ? "" : String(d.getFullYear());
}

export function ProjectsIndex({ projects }: ProjectsIndexProps) {
	return (
		<div className="flex flex-col">
			<div className="flex items-baseline justify-between border-b border-border pb-3">
				<span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
					Index
				</span>
				<span className="font-mono text-xs tabular-nums text-muted-foreground">
					{String(projects.length).padStart(2, "0")} projects
				</span>
			</div>

			{/* group/list drives the spotlight: hovering one row dims the others. */}
			<ol className="group/list flex flex-col">
				{projects.map((project, i) => {
					const tone = statusTone(project.status);
					const isConcept = !tone && project.type === "concept";
					const year = yearOf(project.date);
					return (
						<li key={project.slug} className="border-b border-border last:border-b-0">
							<Link
								href={`/projects/${project.slug}`}
								className={cn(
									"group/row flex items-center gap-4 py-5 outline-none transition-opacity duration-300",
									"group-hover/list:opacity-40 hover:opacity-100! focus-visible:opacity-100!"
								)}
							>
								<span className="w-6 shrink-0 font-mono text-xs tabular-nums text-muted-foreground/70 transition-colors group-hover/row:text-primary group-focus-visible/row:text-primary">
									{String(i + 1).padStart(2, "0")}
								</span>

								<span className="flex min-w-0 flex-1 items-baseline gap-2.5">
									<span className="shrink-0 font-bold tracking-[-0.01em] text-foreground transition-colors group-hover/row:text-primary group-focus-visible/row:text-primary">
										{project.title.split(":")[0]}
									</span>
									{project.flagship && (
										<Sparkle
											className="size-3 shrink-0 translate-y-px fill-primary text-primary"
											aria-label="Flagship"
										/>
									)}
									{project.tagline && (
										<span className="hidden truncate text-sm text-muted-foreground sm:inline">
											{project.tagline}
										</span>
									)}
								</span>

								{tone ? (
									<StatusPill tone={tone.tone} pulse={tone.pulse} className="shrink-0 capitalize">
										{project.status}
									</StatusPill>
								) : isConcept ? (
									<StatusPill tone="neutral" className="shrink-0">
										Concept
									</StatusPill>
								) : (
									year && (
										<span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
											{year}
										</span>
									)
								)}

								<ArrowUpRight className="size-4 shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-brand group-focus-visible/row:text-brand" />
							</Link>
						</li>
					);
				})}
			</ol>
		</div>
	);
}
