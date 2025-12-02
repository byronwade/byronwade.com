"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Folder, GitCommit, Github, Linkedin, Mail, Twitter } from "lucide-react";
import type React from "react";
import { useState } from "react";

interface ContributionDay {
	date: string;
	count: number;
	level: 0 | 1 | 2 | 3 | 4;
}

interface LanguageStats {
	name: string;
	percentage: number;
	color: string;
}

interface GitHubStats {
	totalContributions: number;
	currentStreak: number;
	longestStreak: number;
	contributionDays: ContributionDay[];
	topLanguages: LanguageStats[];
	totalCommits: number;
	totalPRs: number;
	totalRepos: number;
}

interface SocialLinkPreviewProps {
	platform: "github" | "linkedin" | "twitter" | "email";
	children: React.ReactNode;
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

const levelColors = [
	"bg-zinc-800",
	"bg-emerald-900/70",
	"bg-emerald-600/80",
	"bg-emerald-500",
	"bg-emerald-400",
];

export function SocialLinkPreview({ platform, children }: SocialLinkPreviewProps) {
	const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const fetchGitHubStats = async () => {
		if (platform !== "github" || githubStats || isLoading) return;

		setIsLoading(true);
		try {
			const response = await fetch("/api/github/stats");
			if (!response.ok) throw new Error("Failed to fetch");
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
			<motion.div variants={itemVariants} className="flex items-center gap-2 mb-3">
				<Github className="h-4 w-4 text-zinc-400" />
				<span className="text-xs font-medium text-white">byronwade</span>
				<span className="text-[10px] text-zinc-500 ml-auto">Code Activity</span>
			</motion.div>

			{isLoading ? (
				<motion.div variants={itemVariants} className="flex items-center justify-center py-4">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
						className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full"
					/>
				</motion.div>
			) : githubStats ? (
				<>
					{/* Stats Row */}
					<motion.div variants={itemVariants} className="flex gap-1 mb-3">
						{[
							{ icon: GitCommit, value: githubStats.totalCommits, label: "commits" },
							{ icon: Folder, value: githubStats.totalRepos, label: "repos" },
							{ icon: Flame, value: githubStats.currentStreak, label: "streak" },
						].map((stat) => (
							<div
								key={stat.label}
								className="flex-1 bg-zinc-800/60 rounded px-2 py-1.5 text-center"
							>
								<p className="text-xs font-semibold text-white">{stat.value}</p>
								<p className="text-[9px] text-zinc-500">{stat.label}</p>
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
							<div className="flex h-1.5 rounded-full overflow-hidden bg-zinc-800 mb-1.5">
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
											className="w-1.5 h-1.5 rounded-full"
											style={{ backgroundColor: lang.color }}
										/>
										<span className="text-[9px] text-zinc-500">{lang.name}</span>
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
				className="mt-3 block w-full text-center py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-medium rounded transition-colors"
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
			<motion.div variants={itemVariants} className="flex items-center gap-2 mb-3">
				<Linkedin className="h-4 w-4 text-[#0a66c2]" />
				<div>
					<p className="text-xs font-medium text-white">Byron Wade</p>
					<p className="text-[10px] text-zinc-500">Full Stack Developer</p>
				</div>
			</motion.div>

			{/* Experience */}
			<motion.div variants={itemVariants} className="bg-zinc-800/60 rounded px-2.5 py-2 mb-2.5">
				<p className="text-sm font-semibold text-white">8+ Years</p>
				<p className="text-[10px] text-zinc-400">Web Development & Business</p>
			</motion.div>

			{/* Skills */}
			<motion.div variants={itemVariants} className="flex flex-wrap gap-1 mb-3">
				{["React", "Next.js", "TypeScript", "Node.js"].map((skill, idx) => (
					<motion.span
						key={skill}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: idx * 0.03 }}
						className="px-1.5 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] rounded"
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
				className="block w-full text-center py-1.5 bg-[#0a66c2] hover:bg-[#004182] text-white text-[10px] font-medium rounded transition-colors"
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
			<motion.div variants={itemVariants} className="flex items-center gap-2 mb-2.5">
				<Twitter className="h-4 w-4 text-white" />
				<div>
					<p className="text-xs font-medium text-white">Byron Wade</p>
					<p className="text-[10px] text-zinc-500">@byron_c_wade</p>
				</div>
			</motion.div>

			{/* Bio */}
			<motion.p
				variants={itemVariants}
				className="text-[11px] text-zinc-300 leading-relaxed mb-2.5"
			>
				Building tools for service professionals. Always shipping.
			</motion.p>

			{/* Topics */}
			<motion.div variants={itemVariants} className="flex flex-wrap gap-1 mb-3">
				{["#webdev", "#nextjs", "#typescript"].map((tag, idx) => (
					<motion.span
						key={tag}
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: idx * 0.03 }}
						className="px-1.5 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] rounded"
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
				className="block w-full text-center py-1.5 bg-white hover:bg-zinc-100 text-black text-[10px] font-medium rounded transition-colors"
			>
				Follow on X
			</motion.a>
		</motion.div>
	);

	const renderEmailContent = () => {
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
				<motion.div variants={itemVariants} className="flex items-center gap-2 mb-2.5">
					<Mail className="h-4 w-4 text-amber-500" />
					<div>
						<p className="text-xs font-medium text-white">Contact Me</p>
						<p className="text-[10px] text-zinc-500">Let's connect</p>
					</div>
				</motion.div>

				{/* Email */}
				<motion.div variants={itemVariants} className="bg-zinc-800/60 rounded px-2.5 py-2 mb-2.5">
					<code className="text-[11px] text-amber-400 font-mono">byron@byronwade.com</code>
				</motion.div>

				{/* Availability */}
				<motion.div variants={itemVariants} className="space-y-1 mb-3">
					{["Available for projects", "Quick response"].map((item) => (
						<div key={item} className="flex items-center gap-1.5 text-[10px] text-zinc-400">
							<span className="text-amber-500 text-[8px]">●</span>
							<span>{item}</span>
						</div>
					))}
				</motion.div>

				{/* CTA */}
				<motion.button
					variants={itemVariants}
					onClick={copyEmail}
					type="button"
					className="w-full py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-medium rounded transition-colors"
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
	};

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
			openDelay={200}
			closeDelay={100}
			open={isOpen}
			onOpenChange={(open) => {
				setIsOpen(open);
				if (open && platform === "github" && !githubStats && !isLoading) {
					fetchGitHubStats();
				}
			}}
		>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent
				className="p-3 bg-zinc-900 border border-zinc-800 shadow-2xl rounded-lg z-[9999]"
				sideOffset={8}
			>
				<AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
			</HoverCardContent>
		</HoverCard>
	);
}
