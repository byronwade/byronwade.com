import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, ExternalLink, MapPin, Calendar, Users, Star, GitFork, Eye, Code2, Palette, Zap, Award, TrendingUp } from "lucide-react";
import { Link } from "@/components/ui/link";
import { GitHubProfile } from "@/types/github";

interface PortfolioHeroProps {
	profile: GitHubProfile | null;
	readme: string | null;
	stats: GitHubProfile | null;
}

const extractSkillsFromReadme = (readme: string | null): string[] => {
	if (!readme) return ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python"];

	const skillPatterns = [/(?:JavaScript|TypeScript|React|Next\.js|Node\.js|Python|Java|C\+\+|Go|Rust|PHP|Ruby|Swift|Kotlin|Dart|Flutter|Vue\.js|Angular|Svelte|Express|Django|Flask|Spring|Laravel|Rails|ASP\.NET)/gi, /(?:HTML|CSS|SCSS|Sass|Tailwind|Bootstrap|Material-UI|Chakra UI|Styled Components)/gi, /(?:MongoDB|PostgreSQL|MySQL|SQLite|Redis|Firebase|Supabase|AWS|Azure|GCP|Docker|Kubernetes|GraphQL|REST|API)/gi];

	const skills = new Set<string>();
	skillPatterns.forEach((pattern) => {
		const matches = readme.match(pattern);
		if (matches) {
			matches.forEach((match) => skills.add(match));
		}
	});

	return Array.from(skills).slice(0, 12);
};

export default function PortfolioHero({ profile, readme, stats }: PortfolioHeroProps) {
	const skills = extractSkillsFromReadme(readme);

	const extractBioFromReadme = (readme: string | null): string => {
		if (!readme) return "Crafting digital experiences that push boundaries and inspire innovation";

		const lines = readme.split("\n").filter((line) => line.trim() && !line.startsWith("#") && !line.startsWith("![") && !line.startsWith("[![") && !line.includes("badge") && line.length > 50);

		return lines[0] || "Crafting digital experiences that push boundaries and inspire innovation";
	};

	const dynamicBio = profile?.bio || extractBioFromReadme(readme);

	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/30">
			{/* Modern Background Pattern */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" style={{ backgroundSize: "50px 50px" }}></div>

				{/* Floating Elements */}
				<div className="absolute top-20 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-pulse opacity-60"></div>
				<div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40"></div>
				<div className="absolute bottom-40 left-32 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-30"></div>
				<div className="absolute top-1/3 right-20 w-2 h-2 bg-green-400 rounded-full animate-pulse delay-1000 opacity-50"></div>
			</div>

			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex items-center">
				<div className="grid lg:grid-cols-12 gap-12 items-center w-full">
					{/* Left Column - Main Content */}
					<div className="lg:col-span-7 space-y-8">
						{/* Status Badge */}
						<div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700">
							<div className="relative">
								<div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
								<div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
							</div>
							<span className="text-green-400 text-sm font-mono tracking-wider uppercase">Available for Projects</span>
						</div>

						{/* Main Heading */}
						<div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
							<h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
								<span className="block text-foreground">BYRON</span>
								<span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">WADE</span>
							</h1>
							<div className="flex items-center gap-4 text-lg text-muted-foreground font-mono">
								<span className="text-yellow-400">/</span>
								<span className="hover:text-yellow-400 transition-colors cursor-default">DEVELOPER</span>
								<span className="text-yellow-400">/</span>
								<span className="hover:text-yellow-400 transition-colors cursor-default">DESIGNER</span>
								<span className="text-yellow-400">/</span>
								<span className="hover:text-yellow-400 transition-colors cursor-default">CREATOR</span>
							</div>
						</div>

						{/* Bio */}
						<div className="max-w-2xl animate-in fade-in slide-in-from-left-4 duration-700 delay-400">
							<p className="text-xl text-muted-foreground leading-relaxed">{dynamicBio}</p>
						</div>

						{/* Stats Grid */}
						{stats && (
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-600">
								<Card className="bg-background/50 border-border/30 hover:border-yellow-600/30 transition-all duration-300">
									<CardContent className="p-4 text-center">
										<div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-blue-600/10 rounded-lg">
											<Github className="w-5 h-5 text-blue-600" />
										</div>
										<div className="text-2xl font-bold text-foreground">{stats.public_repos}</div>
										<div className="text-xs text-muted-foreground">Repositories</div>
									</CardContent>
								</Card>
								<Card className="bg-background/50 border-border/30 hover:border-yellow-600/30 transition-all duration-300">
									<CardContent className="p-4 text-center">
										<div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-green-600/10 rounded-lg">
											<Users className="w-5 h-5 text-green-600" />
										</div>
										<div className="text-2xl font-bold text-foreground">{stats.followers}</div>
										<div className="text-xs text-muted-foreground">Followers</div>
									</CardContent>
								</Card>
								<Card className="bg-background/50 border-border/30 hover:border-yellow-600/30 transition-all duration-300">
									<CardContent className="p-4 text-center">
										<div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-purple-600/10 rounded-lg">
											<Star className="w-5 h-5 text-purple-600" />
										</div>
										<div className="text-2xl font-bold text-foreground">{stats.following}</div>
										<div className="text-xs text-muted-foreground">Following</div>
									</CardContent>
								</Card>
								<Card className="bg-background/50 border-border/30 hover:border-yellow-600/30 transition-all duration-300">
									<CardContent className="p-4 text-center">
										<div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 bg-yellow-600/10 rounded-lg">
											<Award className="w-5 h-5 text-yellow-600" />
										</div>
										<div className="text-2xl font-bold text-foreground">{stats.public_gists}</div>
										<div className="text-xs text-muted-foreground">Gists</div>
									</CardContent>
								</Card>
							</div>
						)}

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-800">
							<Button asChild size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-8 py-4">
								<Link href="/contact">
									<Zap className="w-5 h-5 mr-2" />
									Start a Project
								</Link>
							</Button>
							<Button asChild variant="outline" size="lg" className="border-yellow-600/50 hover:bg-yellow-600 hover:text-black text-yellow-600 px-8 py-4">
								<Link href="/resume">
									<ExternalLink className="w-5 h-5 mr-2" />
									View Resume
								</Link>
							</Button>
							{profile?.html_url && (
								<Button asChild variant="outline" size="lg" className="border-border/30 hover:bg-secondary px-8 py-4">
									<Link href={profile.html_url} target="_blank">
										<Github className="w-5 h-5 mr-2" />
										GitHub Profile
									</Link>
								</Button>
							)}
						</div>
					</div>

					{/* Right Column - Skills & Info */}
					<div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-1000">
						{/* Skills Section */}
						<Card className="bg-background/50 border-border/30 hover:shadow-xl transition-all duration-300">
							<CardContent className="p-6">
								<div className="flex items-center gap-3 mb-6">
									<div className="p-2 bg-yellow-600/10 rounded-lg">
										<Code2 className="w-5 h-5 text-yellow-600" />
									</div>
									<h3 className="text-lg font-semibold">Tech Stack</h3>
								</div>
								<div className="flex flex-wrap gap-2">
									{skills.map((skill) => (
										<Badge key={skill} variant="secondary" className="bg-secondary/50 hover:bg-yellow-600/10 hover:text-yellow-600 transition-colors">
											{skill}
										</Badge>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Profile Info */}
						{profile && (
							<Card className="bg-background/50 border-border/30 hover:shadow-xl transition-all duration-300">
								<CardContent className="p-6 space-y-4">
									<div className="flex items-center gap-3 mb-4">
										<div className="p-2 bg-blue-600/10 rounded-lg">
											<Users className="w-5 h-5 text-blue-600" />
										</div>
										<h3 className="text-lg font-semibold">Profile Info</h3>
									</div>

									{profile.location && (
										<div className="flex items-center gap-3 text-muted-foreground">
											<MapPin className="w-4 h-4 text-yellow-600" />
											<span>{profile.location}</span>
										</div>
									)}

									{profile.created_at && (
										<div className="flex items-center gap-3 text-muted-foreground">
											<Calendar className="w-4 h-4 text-yellow-600" />
											<span>Coding since {new Date(profile.created_at).getFullYear()}</span>
										</div>
									)}

									{profile.company && (
										<div className="flex items-center gap-3 text-muted-foreground">
											<TrendingUp className="w-4 h-4 text-yellow-600" />
											<span>{profile.company}</span>
										</div>
									)}
								</CardContent>
							</Card>
						)}

						{/* Quick Links */}
						<Card className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200/50 dark:border-yellow-800/50 hover:shadow-xl transition-all duration-300">
							<CardContent className="p-6">
								<div className="flex items-center gap-3 mb-4">
									<div className="p-2 bg-yellow-600/10 rounded-lg">
										<Palette className="w-5 h-5 text-yellow-600" />
									</div>
									<h3 className="text-lg font-semibold">Explore My Work</h3>
								</div>
								<div className="grid grid-cols-2 gap-3">
									<Button asChild variant="outline" size="sm" className="border-yellow-600/30 hover:bg-yellow-600/10">
										<Link href="/design">
											<Palette className="w-4 h-4 mr-2" />
											Design
										</Link>
									</Button>
									<Button asChild variant="outline" size="sm" className="border-yellow-600/30 hover:bg-yellow-600/10">
										<Link href="/development">
											<Code2 className="w-4 h-4 mr-2" />
											Development
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>

			{/* Scroll Indicator */}
			<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
				<div className="flex flex-col items-center gap-3 text-muted-foreground">
					<span className="text-xs font-mono uppercase tracking-wider">Scroll to Explore</span>
					<div className="w-px h-16 bg-gradient-to-b from-yellow-400 to-transparent rounded-full"></div>
				</div>
			</div>
		</section>
	);
}
