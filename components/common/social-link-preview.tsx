"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Flame, Folder, GitCommit, Github, Linkedin, Mail, Twitter } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface ContributionDay {
	count: number;
	date: string;
	level: 0 | 1 | 2 | 3 | 4;
}

interface LanguageStats {
	color: string;
	name: string;
	percentage: number;
}

interface GitHubStats {
	contributionDays: ContributionDay[];
	currentStreak: number;
	longestStreak: number;
	topLanguages: LanguageStats[];
	totalCommits: number;
	totalContributions: number;
	totalPRs: number;
	totalRepos: number;
}

interface SocialLinkPreviewProps {
	children: React.ReactNode;
	platform: "github" | "linkedin" | "twitter" | "email";
}

const containerVariants = {
	hidden: { opacity: 0, scale: 0.96, y: 4 },
	visible: {
		opacity: 1,
		scale: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 500,
			damping: 30,
			staggerChildren: 0.03,
		},
	},
	exit: {
		opacity: 0,
		scale: 0.96,
		y: 4,
		transition: { duration: 0.1 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 4 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { type: "spring", stiffness: 500, damping: 30 },
	},
};

const levelColors = ["bg-muted", "bg-brand/30", "bg-brand/50", "bg-brand/75", "bg-brand"];

function EmailPreviewContent() {
	const [copied, setCopied] = useState(false);

	const copyEmail = () => {
		navigator.clipboard.writeText("byron@byronwade.com");
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="w-52"
		>
			{/* Header */}
			<motion.div variants={itemVariants} className="mb-2.5 flex items-center gap-2">
				<Mail className="h-4 w-4 text-amber-700 dark:text-amber-500" />
				<div>
					<p className="font-medium text-foreground text-xs">Contact Me</p>
					<p className="text-[10px] text-muted-foreground">Let's connect</p>
				</div>
			</motion.div>

			{/* Email */}
			<motion.div variants={itemVariants} className="mb-2.5 rounded bg-muted/60 px-2.5 py-2">
				<code className="font-mono text-[11px] text-amber-700 dark:text-amber-400">
					byron@byronwade.com
				</code>
			</motion.div>

			{/* Availability */}
			<motion.div variants={itemVariants} className="mb-3 space-y-1">
				{["Available for projects", "Quick response"].map((item) => (
					<div key={item} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
						<span className="text-[8px] text-amber-700 dark:text-amber-500">●</span>
						<span>{item}</span>
					</div>
				))}
			</motion.div>

			{/* CTA */}
			<motion.button
				variants={itemVariants}
				onClick={copyEmail}
				type="button"
				className="w-full rounded bg-amber-700 py-1.5 font-medium text-[10px] text-white transition-colors hover:bg-amber-800 dark:bg-amber-500 dark:text-black dark:hover:bg-amber-600"
			>
				<AnimatePresence mode="wait">
					{copied ? (
						<motion.span
							key="copied"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							Copied!
						</motion.span>
					) : (
						<motion.span
							key="copy"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							Copy Email
						</motion.span>
					)}
				</AnimatePresence>
			</motion.button>
		</motion.div>
	);
}

export function SocialLinkPreview({ platform, children }: SocialLinkPreviewProps) {
	const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const fetchGitHubStats = async () => {
		if (platform !== "github" || githubStats || isLoading) {
			return;
		}

		setIsLoading(true);
		try {
			const response = await fetch("/api/github/stats");
			if (!response.ok) {
				throw new Error("Failed to fetch");
			}
			const data = await response.json();
			if (!data.error) {
				setGithubStats(data);
			}
		} catch (error) {
			console.error("Failed to fetch GitHub stats:", error);
			setGithubStats({
				totalContributions: 0,
				currentStreak: 0,
				longestStreak: 0,
				contributionDays: [],
				topLanguages: [],
				totalCommits: 0,
				totalPRs: 0,
				totalRepos: 0,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const renderGitHubContent = () => (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="w-56"
		>
			{/* Header */}
			<motion.div variants={itemVariants} className="mb-3 flex items-center gap-2">
				<Github className="h-4 w-4 text-muted-foreground" />
				<span className="font-medium text-foreground text-xs">byronwade</span>
				<span className="ml-auto text-[10px] text-muted-foreground">Code Activity</span>
			</motion.div>

			{isLoading ? (
				<motion.div variants={itemVariants} className="flex items-center justify-center py-4">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
						className="h-4 w-4 rounded-full border-2 border-brand border-t-transparent"
					/>
				</motion.div>
			) : githubStats ? (
				<>
					{/* Stats Row */}
					<motion.div variants={itemVariants} className="mb-3 flex gap-1">
						{[
							{ icon: GitCommit, value: githubStats.totalCommits, label: "commits" },
							{ icon: Folder, value: githubStats.totalRepos, label: "repos" },
							{ icon: Flame, value: githubStats.currentStreak, label: "streak" },
						].map((stat) => (
							<div key={stat.label} className="flex-1 rounded bg-muted/60 px-2 py-1.5 text-center">
								<p className="font-semibold text-foreground text-xs">{stat.value}</p>
								<p className="text-[9px] text-muted-foreground">{stat.label}</p>
							</div>
						))}
					</motion.div>

					{/* Mini Contribution Graph - Last 35 days (5 weeks) */}
					{githubStats.contributionDays.length > 0 && (
						<motion.div variants={itemVariants} className="mb-3">
							<div className="grid grid-cols-7 gap-[2px]">
								{githubStats.contributionDays.slice(-35).map((day, idx) => (
									<motion.div
										key={day.date}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: idx * 0.005 }}
										className={`aspect-square rounded-[2px] ${levelColors[day.level]}`}
										title={`${day.count} contributions`}
									/>
								))}
							</div>
						</motion.div>
					)}

					{/* Languages Bar */}
					{githubStats.topLanguages.length > 0 && (
						<motion.div variants={itemVariants}>
							<div className="mb-1.5 flex h-1.5 overflow-hidden rounded-full bg-muted">
								{githubStats.topLanguages.slice(0, 4).map((lang) => (
									<motion.div
										key={lang.name}
										initial={{ width: 0 }}
										animate={{ width: `${lang.percentage}%` }}
										transition={{ delay: 0.2, duration: 0.4 }}
										style={{ backgroundColor: lang.color }}
									/>
								))}
							</div>
							<div className="flex flex-wrap gap-x-2 gap-y-0.5">
								{githubStats.topLanguages.slice(0, 3).map((lang) => (
									<span key={lang.name} className="flex items-center gap-1">
										<span
											className="h-1.5 w-1.5 rounded-full"
											style={{ backgroundColor: lang.color }}
										/>
										<span className="text-[9px] text-muted-foreground">{lang.name}</span>
									</span>
								))}
							</div>
						</motion.div>
					)}
				</>
			) : null}

			{/* CTA */}
			<motion.a
				variants={itemVariants}
				href="https://github.com/byronwade"
				target="_blank"
				rel="noopener noreferrer"
				className="mt-3 block w-full rounded bg-muted py-1.5 text-center font-medium text-[10px] text-foreground transition-colors hover:bg-muted/80"
			>
				View Profile
			</motion.a>
		</motion.div>
	);

	const renderLinkedInContent = () => (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="w-52"
		>
			{/* Header */}
			<motion.div variants={itemVariants} className="mb-3 flex items-center gap-2">
				<Linkedin className="h-4 w-4 text-[#0a66c2]" />
				<div>
					<p className="font-medium text-foreground text-xs">Byron Wade</p>
					<p className="text-[10px] text-muted-foreground">Full Stack Developer</p>
				</div>
			</motion.div>

			{/* Experience */}
			<motion.div variants={itemVariants} className="mb-2.5 rounded bg-muted/60 px-2.5 py-2">
				<p className="font-semibold text-foreground text-sm">8+ Years</p>
				<p className="text-[10px] text-muted-foreground">Web Development & Business</p>
			</motion.div>

			{/* Skills */}
			<motion.div variants={itemVariants} className="mb-3 flex flex-wrap gap-1">
				{["React", "Next.js", "TypeScript", "Node.js"].map((skill, idx) => (
					<motion.span
						key={skill}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: idx * 0.03 }}
						className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground"
					>
						{skill}
					</motion.span>
				))}
			</motion.div>

			{/* CTA */}
			<motion.a
				variants={itemVariants}
				href="https://linkedin.com/in/byronwade"
				target="_blank"
				rel="noopener noreferrer"
				className="block w-full rounded bg-[#0a66c2] py-1.5 text-center font-medium text-[10px] text-white transition-colors hover:bg-[#004182]"
			>
				View Profile
			</motion.a>
		</motion.div>
	);

	const renderTwitterContent = () => (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="w-52"
		>
			{/* Header */}
			<motion.div variants={itemVariants} className="mb-2.5 flex items-center gap-2">
				<Twitter className="h-4 w-4 text-foreground" />
				<div>
					<p className="font-medium text-foreground text-xs">Byron Wade</p>
					<p className="text-[10px] text-muted-foreground">@byron_c_wade</p>
				</div>
			</motion.div>

			{/* Bio */}
			<motion.p
				variants={itemVariants}
				className="mb-2.5 text-[11px] text-foreground/80 leading-relaxed"
			>
				Building tools for service professionals. Always shipping.
			</motion.p>

			{/* Topics */}
			<motion.div variants={itemVariants} className="mb-3 flex flex-wrap gap-1">
				{["#webdev", "#nextjs", "#typescript"].map((tag, idx) => (
					<motion.span
						key={tag}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: idx * 0.03 }}
						className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
					>
						{tag}
					</motion.span>
				))}
			</motion.div>

			{/* CTA */}
			<motion.a
				variants={itemVariants}
				href="https://twitter.com/byron_c_wade"
				target="_blank"
				rel="noopener noreferrer"
				className="block w-full rounded bg-primary py-1.5 text-center font-medium text-[10px] text-primary-foreground transition-colors hover:bg-primary/90"
			>
				Follow on X
			</motion.a>
		</motion.div>
	);

	const renderEmailContent = () => <EmailPreviewContent />;

	const renderContent = () => {
		switch (platform) {
			case "github":
				return renderGitHubContent();
			case "linkedin":
				return renderLinkedInContent();
			case "twitter":
				return renderTwitterContent();
			case "email":
				return renderEmailContent();
			default:
				return null;
		}
	};

	return (
		<HoverCard
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				if (open && platform === "github" && !githubStats && !isLoading) {
					fetchGitHubStats();
				}
			}}
		>
			<HoverCardTrigger render={children as React.ReactElement} />
			<HoverCardContent
				className="z-[9999] rounded-lg border border-border bg-popover p-3 shadow-2xl"
				sideOffset={8}
			>
				<AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
			</HoverCardContent>
		</HoverCard>
	);
}
