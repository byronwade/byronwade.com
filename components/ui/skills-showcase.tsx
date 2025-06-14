"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Palette, Database, Cloud, Smartphone, Globe, Zap, Shield, Star, TrendingUp, Award, Target, CheckCircle, ArrowRight, Filter, Search } from "lucide-react";

interface Skill {
	name: string;
	level: number;
	category: string;
	years: number;
	projects: number;
	icon: React.ComponentType<any>;
	color: string;
	description: string;
	trending?: boolean;
	certified?: boolean;
}

interface SkillsShowcaseProps {
	className?: string;
}

export default function SkillsShowcase({ className = "" }: SkillsShowcaseProps) {
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [searchTerm, setSearchTerm] = useState("");
	const [animatedSkills, setAnimatedSkills] = useState<Set<string>>(new Set());
	const observerRef = useRef<IntersectionObserver | null>(null);
	const skillRefs = useRef<Map<string, HTMLDivElement>>(new Map());

	const skills: Skill[] = [
		{
			name: "React",
			level: 95,
			category: "frontend",
			years: 6,
			projects: 45,
			icon: Code,
			color: "text-blue-500",
			description: "Advanced React development with hooks, context, and performance optimization",
			trending: true,
			certified: true,
		},
		{
			name: "TypeScript",
			level: 90,
			category: "frontend",
			years: 4,
			projects: 38,
			icon: Code,
			color: "text-blue-600",
			description: "Type-safe development with advanced TypeScript patterns",
			trending: true,
		},
		{
			name: "Next.js",
			level: 92,
			category: "frontend",
			years: 3,
			projects: 28,
			icon: Globe,
			color: "text-gray-800",
			description: "Full-stack React framework with SSR, SSG, and API routes",
			trending: true,
			certified: true,
		},
		{
			name: "Node.js",
			level: 88,
			category: "backend",
			years: 5,
			projects: 32,
			icon: Database,
			color: "text-green-600",
			description: "Server-side JavaScript with Express, APIs, and microservices",
		},
		{
			name: "PostgreSQL",
			level: 85,
			category: "backend",
			years: 4,
			projects: 25,
			icon: Database,
			color: "text-blue-700",
			description: "Advanced database design, optimization, and complex queries",
		},
		{
			name: "AWS",
			level: 82,
			category: "cloud",
			years: 3,
			projects: 22,
			icon: Cloud,
			color: "text-orange-500",
			description: "Cloud infrastructure, serverless, and DevOps practices",
			certified: true,
		},
		{
			name: "Docker",
			level: 80,
			category: "cloud",
			years: 3,
			projects: 20,
			icon: Cloud,
			color: "text-blue-500",
			description: "Containerization, orchestration, and deployment automation",
		},
		{
			name: "Figma",
			level: 93,
			category: "design",
			years: 4,
			projects: 50,
			icon: Palette,
			color: "text-purple-500",
			description: "Advanced design systems, prototyping, and collaboration",
			trending: true,
		},
		{
			name: "UI/UX Design",
			level: 87,
			category: "design",
			years: 6,
			projects: 42,
			icon: Palette,
			color: "text-pink-500",
			description: "User-centered design, research, and interface optimization",
		},
		{
			name: "React Native",
			level: 78,
			category: "mobile",
			years: 2,
			projects: 12,
			icon: Smartphone,
			color: "text-blue-400",
			description: "Cross-platform mobile development with native performance",
		},
		{
			name: "Performance Optimization",
			level: 90,
			category: "optimization",
			years: 5,
			projects: 35,
			icon: Zap,
			color: "text-yellow-500",
			description: "Web vitals, bundle optimization, and performance monitoring",
			trending: true,
		},
		{
			name: "Security",
			level: 83,
			category: "security",
			years: 4,
			projects: 28,
			icon: Shield,
			color: "text-red-500",
			description: "Application security, authentication, and vulnerability assessment",
		},
	];

	const categories = [
		{ id: "all", label: "All Skills", icon: Target },
		{ id: "frontend", label: "Frontend", icon: Code },
		{ id: "backend", label: "Backend", icon: Database },
		{ id: "design", label: "Design", icon: Palette },
		{ id: "cloud", label: "Cloud", icon: Cloud },
		{ id: "mobile", label: "Mobile", icon: Smartphone },
		{ id: "optimization", label: "Performance", icon: Zap },
		{ id: "security", label: "Security", icon: Shield },
	];

	const filteredSkills = skills.filter((skill) => {
		const matchesCategory = selectedCategory === "all" || skill.category === selectedCategory;
		const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || skill.description.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesCategory && matchesSearch;
	});

	// Intersection Observer for animations
	useEffect(() => {
		observerRef.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const skillName = entry.target.getAttribute("data-skill");
						if (skillName) {
							setAnimatedSkills((prev) => new Set([...prev, skillName]));
						}
					}
				});
			},
			{ threshold: 0.3 }
		);

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
		};
	}, []);

	// Observe skill elements
	useEffect(() => {
		if (observerRef.current) {
			skillRefs.current.forEach((element) => {
				observerRef.current?.observe(element);
			});
		}

		return () => {
			if (observerRef.current) {
				skillRefs.current.forEach((element) => {
					observerRef.current?.unobserve(element);
				});
			}
		};
	}, [filteredSkills]);

	const setSkillRef = (skillName: string, element: HTMLDivElement | null) => {
		if (element) {
			skillRefs.current.set(skillName, element);
		} else {
			skillRefs.current.delete(skillName);
		}
	};

	const getSkillLevelColor = (level: number) => {
		if (level >= 90) return "bg-green-500";
		if (level >= 80) return "bg-blue-500";
		if (level >= 70) return "bg-yellow-500";
		return "bg-gray-500";
	};

	const getSkillLevelLabel = (level: number) => {
		if (level >= 90) return "Expert";
		if (level >= 80) return "Advanced";
		if (level >= 70) return "Intermediate";
		return "Beginner";
	};

	return (
        <div className={`space-y-8 ${className}`}>
            {/* Header */}
            <div className="text-center space-y-4">
				<h2 className="text-4xl font-bold text-foreground">Skills & Expertise</h2>
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">A comprehensive overview of my technical skills, design capabilities, and professional experience</p>
			</div>
            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
				{/* Search */}
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<input type="text" placeholder="Search skills..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600" />
				</div>

				{/* Category Filters */}
				<div className="flex flex-wrap gap-2">
					{categories.map((category) => {
						const Icon = category.icon;
						return (
							<Button key={category.id} variant={selectedCategory === category.id ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category.id)} className={`${selectedCategory === category.id ? "bg-yellow-600 text-white hover:bg-yellow-700" : "border-border hover:border-yellow-600/50 hover:text-yellow-600"}`}>
								<Icon className="w-4 h-4 mr-2" />
								{category.label}
							</Button>
						);
					})}
				</div>
			</div>
            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredSkills.map((skill) => {
					const Icon = skill.icon;
					const isAnimated = animatedSkills.has(skill.name);

					return (
                        <Card key={skill.name} ref={el => {
                            setSkillRef(skill.name, el);
                        }} data-skill={skill.name} className="group bg-secondary/50 border-border/30 hover:shadow-xl transition-all duration-300 hover:border-yellow-600/30 overflow-hidden">
                            <CardHeader className="pb-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="p-2 rounded-lg bg-yellow-600/10 group-hover:bg-yellow-600/20 transition-colors">
											<Icon className={`w-5 h-5 ${skill.color}`} />
										</div>
										<div>
											<CardTitle className="text-lg">{skill.name}</CardTitle>
											<div className="flex items-center gap-2 mt-1">
												<Badge variant="outline" className="text-xs">
													{getSkillLevelLabel(skill.level)}
												</Badge>
												{skill.trending && (
													<Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/30">
														<TrendingUp className="w-3 h-3 mr-1" />
														Trending
													</Badge>
												)}
												{skill.certified && (
													<Badge className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30">
														<Award className="w-3 h-3 mr-1" />
														Certified
													</Badge>
												)}
											</div>
										</div>
									</div>
									<div className="text-right">
										<div className="text-2xl font-bold text-foreground">{skill.level}%</div>
									</div>
								</div>
							</CardHeader>
                            <CardContent className="space-y-4">
								{/* Progress Bar */}
								<div className="space-y-2">
									<div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
										<div
											className={`h-full ${getSkillLevelColor(skill.level)} transition-all duration-1000 ease-out`}
											style={{
												width: isAnimated ? `${skill.level}%` : "0%",
												transitionDelay: "200ms",
											}}
										/>
									</div>
								</div>

								{/* Description */}
								<p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>

								{/* Stats */}
								<div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/30">
									<div className="text-center">
										<div className="text-lg font-bold text-foreground">{skill.years}</div>
										<div className="text-xs text-muted-foreground">Years</div>
									</div>
									<div className="text-center">
										<div className="text-lg font-bold text-foreground">{skill.projects}</div>
										<div className="text-xs text-muted-foreground">Projects</div>
									</div>
								</div>
							</CardContent>
                        </Card>
                    );
				})}
			</div>
            {/* Summary Stats */}
            <Card className="bg-gradient-to-r from-yellow-600/10 to-yellow-600/5 border-yellow-600/20">
				<CardContent className="p-8">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
						<div>
							<div className="text-3xl font-bold text-foreground mb-2">{skills.length}</div>
							<div className="text-sm text-muted-foreground">Total Skills</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-foreground mb-2">{Math.round(skills.reduce((acc, skill) => acc + skill.level, 0) / skills.length)}%</div>
							<div className="text-sm text-muted-foreground">Average Proficiency</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-foreground mb-2">{skills.reduce((acc, skill) => acc + skill.years, 0)}</div>
							<div className="text-sm text-muted-foreground">Total Years Experience</div>
						</div>
						<div>
							<div className="text-3xl font-bold text-foreground mb-2">{skills.reduce((acc, skill) => acc + skill.projects, 0)}</div>
							<div className="text-sm text-muted-foreground">Projects Completed</div>
						</div>
					</div>
				</CardContent>
			</Card>
            {/* No Results */}
            {filteredSkills.length === 0 && (
				<div className="text-center py-12">
					<div className="text-muted-foreground mb-4">
						<Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
						<p className="text-lg">No skills found matching your criteria</p>
						<p className="text-sm">Try adjusting your search or category filter</p>
					</div>
					<Button
						variant="outline"
						onClick={() => {
							setSearchTerm("");
							setSelectedCategory("all");
						}}
						className="border-yellow-600/50 text-yellow-600 hover:bg-yellow-600 hover:text-white"
					>
						Clear Filters
					</Button>
				</div>
			)}
        </div>
    );
}
