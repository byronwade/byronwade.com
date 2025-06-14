"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Users, Globe, Code, Zap, Activity, BarChart3, PieChart, LineChart, Monitor, Smartphone, Tablet, Clock, CheckCircle, AlertCircle, Star, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";

interface DashboardProps {
	className?: string;
}

interface MetricData {
	label: string;
	value: string;
	change: number;
	trend: "up" | "down" | "neutral";
	icon: React.ComponentType<any>;
	color: string;
}

interface ProjectStatus {
	name: string;
	status: "completed" | "in-progress" | "pending";
	progress: number;
	dueDate: string;
}

export default function InteractiveDashboard({ className = "" }: DashboardProps) {
	const [activeTab, setActiveTab] = useState("overview");
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());

	// Update time every second
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1500));
		setIsRefreshing(false);
	};

	const metrics: MetricData[] = [
		{
			label: "Active Projects",
			value: "12",
			change: 8.2,
			trend: "up",
			icon: Code,
			color: "text-blue-600",
		},
		{
			label: "Total Clients",
			value: "47",
			change: 12.5,
			trend: "up",
			icon: Users,
			color: "text-green-600",
		},
		{
			label: "Website Visits",
			value: "2.4K",
			change: -3.1,
			trend: "down",
			icon: Globe,
			color: "text-purple-600",
		},
		{
			label: "Performance Score",
			value: "98%",
			change: 2.3,
			trend: "up",
			icon: Zap,
			color: "text-yellow-600",
		},
	];

	const projects: ProjectStatus[] = [
		{
			name: "E-commerce Platform",
			status: "in-progress",
			progress: 75,
			dueDate: "2024-01-15",
		},
		{
			name: "Portfolio Website",
			status: "completed",
			progress: 100,
			dueDate: "2023-12-20",
		},
		{
			name: "Mobile App Design",
			status: "pending",
			progress: 25,
			dueDate: "2024-02-01",
		},
		{
			name: "Brand Identity",
			status: "in-progress",
			progress: 60,
			dueDate: "2024-01-25",
		},
	];

	const deviceStats = [
		{ device: "Desktop", percentage: 65, icon: Monitor, color: "bg-blue-500" },
		{ device: "Mobile", percentage: 28, icon: Smartphone, color: "bg-green-500" },
		{ device: "Tablet", percentage: 7, icon: Tablet, color: "bg-purple-500" },
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-500";
			case "in-progress":
				return "bg-yellow-500";
			case "pending":
				return "bg-gray-400";
			default:
				return "bg-gray-400";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return CheckCircle;
			case "in-progress":
				return Activity;
			case "pending":
				return Clock;
			default:
				return AlertCircle;
		}
	};

	return (
		<div className={`space-y-6 ${className}`}>
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
					<p className="text-muted-foreground">
						{currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
					</p>
				</div>
				<div className="flex items-center gap-3">
					<Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="border-yellow-600/50 text-yellow-600 hover:bg-yellow-600 hover:text-white">
						<RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
						Refresh
					</Button>
					<Badge variant="outline" className="border-green-500/50 text-green-600">
						<div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
						Live
					</Badge>
				</div>
			</div>

			{/* Tabs */}
			<div className="flex space-x-1 bg-secondary/50 p-1 rounded-lg">
				{["overview", "projects", "analytics"].map((tab) => (
					<button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${activeTab === tab ? "bg-yellow-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"}`}>
						{tab}
					</button>
				))}
			</div>

			{/* Overview Tab */}
			{activeTab === "overview" && (
				<div className="space-y-6">
					{/* Metrics Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{metrics.map((metric, index) => {
							const Icon = metric.icon;
							const TrendIcon = metric.trend === "up" ? ArrowUpRight : ArrowDownRight;

							return (
								<Card key={index} className="bg-secondary/50 border-border/30 hover:shadow-lg transition-all duration-300 hover:border-yellow-600/30">
									<CardContent className="p-6">
										<div className="flex items-center justify-between mb-4">
											<div className={`p-2 rounded-lg bg-yellow-600/10`}>
												<Icon className={`w-5 h-5 ${metric.color}`} />
											</div>
											<div className={`flex items-center text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
												<TrendIcon className="w-4 h-4 mr-1" />
												{Math.abs(metric.change)}%
											</div>
										</div>
										<div className="space-y-1">
											<p className="text-2xl font-bold text-foreground">{metric.value}</p>
											<p className="text-sm text-muted-foreground">{metric.label}</p>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>

					{/* Charts Row */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Device Usage */}
						<Card className="bg-secondary/50 border-border/30">
							<CardHeader>
								<CardTitle className="flex items-center">
									<PieChart className="w-5 h-5 mr-2 text-yellow-600" />
									Device Usage
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{deviceStats.map((stat, index) => {
										const Icon = stat.icon;
										return (
											<div key={index} className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<Icon className="w-4 h-4 text-muted-foreground" />
													<span className="text-sm font-medium">{stat.device}</span>
												</div>
												<div className="flex items-center gap-3">
													<div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
														<div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.percentage}%` }} />
													</div>
													<span className="text-sm font-medium w-10 text-right">{stat.percentage}%</span>
												</div>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>

						{/* Activity Chart */}
						<Card className="bg-secondary/50 border-border/30">
							<CardHeader>
								<CardTitle className="flex items-center">
									<BarChart3 className="w-5 h-5 mr-2 text-yellow-600" />
									Weekly Activity
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-end justify-between h-32 gap-2">
									{[40, 65, 45, 80, 55, 70, 85].map((height, index) => (
										<div key={index} className="flex-1 flex flex-col items-center gap-2">
											<div className="w-full bg-yellow-600/20 rounded-t-sm transition-all duration-1000 hover:bg-yellow-600/40" style={{ height: `${height}%` }} />
											<span className="text-xs text-muted-foreground">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</span>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			)}

			{/* Projects Tab */}
			{activeTab === "projects" && (
				<div className="space-y-6">
					<div className="grid gap-4">
						{projects.map((project, index) => {
							const StatusIcon = getStatusIcon(project.status);

							return (
								<Card key={index} className="bg-secondary/50 border-border/30 hover:shadow-lg transition-all duration-300">
									<CardContent className="p-6">
										<div className="flex items-center justify-between mb-4">
											<div className="flex items-center gap-3">
												<div className={`p-2 rounded-full ${getStatusColor(project.status)}`}>
													<StatusIcon className="w-4 h-4 text-white" />
												</div>
												<div>
													<h3 className="font-semibold text-foreground">{project.name}</h3>
													<p className="text-sm text-muted-foreground capitalize">{project.status.replace("-", " ")}</p>
												</div>
											</div>
											<Badge variant="outline" className="text-xs">
												Due: {project.dueDate}
											</Badge>
										</div>
										<div className="space-y-2">
											<div className="flex justify-between text-sm">
												<span className="text-muted-foreground">Progress</span>
												<span className="font-medium">{project.progress}%</span>
											</div>
											<div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
												<div className="h-full bg-yellow-600 transition-all duration-1000" style={{ width: `${project.progress}%` }} />
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			)}

			{/* Analytics Tab */}
			{activeTab === "analytics" && (
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<Card className="bg-secondary/50 border-border/30">
							<CardHeader>
								<CardTitle className="flex items-center text-lg">
									<LineChart className="w-5 h-5 mr-2 text-yellow-600" />
									Conversion Rate
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-foreground mb-2">3.2%</div>
								<div className="flex items-center text-sm text-green-600">
									<TrendingUp className="w-4 h-4 mr-1" />
									+0.5% from last month
								</div>
							</CardContent>
						</Card>

						<Card className="bg-secondary/50 border-border/30">
							<CardHeader>
								<CardTitle className="flex items-center text-lg">
									<Activity className="w-5 h-5 mr-2 text-yellow-600" />
									Bounce Rate
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-foreground mb-2">24.1%</div>
								<div className="flex items-center text-sm text-green-600">
									<TrendingDown className="w-4 h-4 mr-1" />
									-2.3% from last month
								</div>
							</CardContent>
						</Card>

						<Card className="bg-secondary/50 border-border/30">
							<CardHeader>
								<CardTitle className="flex items-center text-lg">
									<Star className="w-5 h-5 mr-2 text-yellow-600" />
									Avg. Rating
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold text-foreground mb-2">4.9</div>
								<div className="flex items-center text-sm text-yellow-600">
									<Star className="w-4 h-4 mr-1 fill-current" />
									Based on 127 reviews
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Performance Metrics */}
					<Card className="bg-secondary/50 border-border/30">
						<CardHeader>
							<CardTitle>Performance Metrics</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
								{[
									{ label: "Page Load Time", value: "1.2s", status: "excellent" },
									{ label: "First Paint", value: "0.8s", status: "good" },
									{ label: "Time to Interactive", value: "2.1s", status: "good" },
									{ label: "Cumulative Layout Shift", value: "0.05", status: "excellent" },
								].map((metric, index) => (
									<div key={index} className="text-center">
										<div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
										<div className="text-sm text-muted-foreground mb-2">{metric.label}</div>
										<Badge variant="outline" className={`text-xs ${metric.status === "excellent" ? "border-green-500/50 text-green-600" : "border-yellow-500/50 text-yellow-600"}`}>
											{metric.status}
										</Badge>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
