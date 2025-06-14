export interface FigmaFile {
	key: string;
	name: string;
	thumbnail_url: string;
	last_modified: string;
	// Enhanced file information
	version?: string;
	role?: string;
	editorType?: "figma" | "figjam";
	linkAccess?: "inherit" | "view" | "edit";
	// File metadata
	created_at?: string;
	document?: {
		id: string;
		name: string;
		type: string;
		children?: FigmaNode[];
	};
	// File statistics
	components?: FigmaComponent[];
	componentSets?: FigmaComponentSet[];
	styles?: FigmaStyle[];
	// Team and project context
	projectId?: string;
	teamId?: string;
}

export interface FigmaNode {
	id: string;
	name: string;
	type: string;
	visible?: boolean;
	locked?: boolean;
	children?: FigmaNode[];
	// Layout properties
	absoluteBoundingBox?: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	// Visual properties
	fills?: any[];
	strokes?: any[];
	effects?: any[];
	// Typography (for text nodes)
	characters?: string;
	style?: any;
	// Component properties
	componentId?: string;
	componentSetId?: string;
}

export interface FigmaComponent {
	key: string;
	file_key: string;
	node_id: string;
	thumbnail_url: string;
	name: string;
	description: string;
	created_at: string;
	updated_at: string;
	user: {
		id: string;
		handle: string;
		img_url: string;
		email?: string;
	};
	// Usage analytics
	containing_frame?: {
		nodeId: string;
		name: string;
		backgroundColor?: string;
		pageName?: string;
		pageId?: string;
	};
	// Component metrics
	usage_count?: number;
	instances?: Array<{
		file_key: string;
		file_name: string;
		node_id: string;
		name: string;
	}>;
}

export interface FigmaComponentSet {
	key: string;
	file_key: string;
	node_id: string;
	thumbnail_url: string;
	name: string;
	description: string;
	created_at: string;
	updated_at: string;
	user: {
		id: string;
		handle: string;
		img_url: string;
	};
	// Component set properties
	properties?: Record<string, any>;
	variants?: FigmaComponent[];
}

export interface FigmaStyle {
	key: string;
	file_key: string;
	node_id: string;
	style_type: "FILL" | "TEXT" | "EFFECT" | "GRID";
	thumbnail_url: string;
	name: string;
	description: string;
	created_at: string;
	updated_at: string;
	user: {
		id: string;
		handle: string;
		img_url: string;
	};
	// Style properties
	sort_position?: string;
	// Usage analytics
	usage_count?: number;
	applied_to?: Array<{
		file_key: string;
		file_name: string;
		node_id: string;
		node_name: string;
	}>;
}

// Version history and collaboration data
export interface FigmaVersionHistory {
	fileKey: string;
	versions: Array<{
		id: string;
		created_at: string;
		label?: string;
		description?: string;
		user: {
			id: string;
			handle: string;
			img_url: string;
		};
		thumbnail_url?: string;
	}>;
	// Collaboration metrics
	collaboration_stats?: {
		total_collaborators: number;
		active_collaborators_30d: number;
		total_comments: number;
		resolved_comments: number;
		avg_resolution_time: number; // in hours
	};
}

// File analytics and performance
export interface FigmaFileAnalytics {
	fileKey: string;
	// Usage metrics
	view_count?: number;
	unique_viewers?: number;
	edit_sessions?: Array<{
		user_id: string;
		duration: number; // in minutes
		timestamp: string;
		changes_count: number;
	}>;
	// Performance metrics
	file_size?: number; // in bytes
	load_time?: number; // in milliseconds
	complexity_score?: number; // 0-100 based on layers, components, etc.
	// Export metrics
	exports?: Array<{
		format: string;
		count: number;
		last_exported: string;
	}>;
	// Sharing and access
	sharing_stats?: {
		public_links_created: number;
		private_shares: number;
		presentation_views: number;
		dev_mode_handoffs: number;
	};
}

// Design system metrics
export interface FigmaDesignSystemMetrics {
	teamId: string;
	// Component library health
	library_health?: {
		total_components: number;
		documented_components: number;
		documentation_score: number; // 0-100
		consistency_score: number; // 0-100 based on naming conventions, etc.
	};
	// Component adoption
	component_adoption?: Array<{
		component_key: string;
		component_name: string;
		usage_count: number;
		files_using: number;
		adoption_trend: "increasing" | "stable" | "decreasing";
	}>;
	// Style adoption
	style_adoption?: Array<{
		style_key: string;
		style_name: string;
		style_type: string;
		usage_count: number;
		files_using: number;
	}>;
	// Design token usage
	design_tokens?: {
		color_tokens: number;
		typography_tokens: number;
		spacing_tokens: number;
		elevation_tokens: number;
		consistency_violations: number;
	};
}

// Team collaboration metrics
export interface FigmaTeamMetrics {
	teamId: string;
	// Team activity
	team_activity?: {
		total_members: number;
		active_members_30d: number;
		total_files: number;
		files_created_30d: number;
		total_projects: number;
	};
	// Collaboration patterns
	collaboration_patterns?: {
		avg_collaborators_per_file: number;
		cross_project_collaboration: number;
		mentorship_interactions: number; // based on comment patterns
		knowledge_sharing_score: number; // 0-100
	};
	// Productivity metrics
	productivity_metrics?: {
		avg_design_cycle_time: number; // days from creation to handoff
		component_reuse_rate: number; // percentage
		design_debt_score: number; // 0-100 (lower is better)
		automation_usage: number; // plugin/API usage frequency
	};
}

// Project-level analytics
export interface FigmaProjectAnalytics {
	projectId: string;
	project_name: string;
	// Project health
	project_health?: {
		file_count: number;
		active_files: number;
		outdated_files: number;
		last_activity: string;
		completion_percentage: number;
	};
	// Design workflow
	workflow_metrics?: {
		avg_file_lifecycle: number; // days
		design_review_cycles: number;
		stakeholder_feedback_time: number; // hours
		design_to_dev_handoff_time: number; // hours
	};
	// Asset management
	asset_metrics?: {
		total_assets: number;
		optimized_assets: number;
		asset_organization_score: number; // 0-100
		duplicate_assets: number;
	};
}

// User interaction and workflow data
export interface FigmaUserWorkflow {
	userId: string;
	// User activity patterns
	activity_patterns?: {
		peak_hours: number[]; // hours of day (0-23)
		preferred_tools: string[];
		avg_session_duration: number; // minutes
		daily_active_days: number; // out of 30
	};
	// Skill development
	skill_metrics?: {
		feature_adoption_rate: number; // percentage of features used
		shortcut_usage: number; // efficiency indicator
		component_creation_rate: number; // components created per month
		advanced_feature_usage: number; // auto-layout, variants, etc.
	};
	// Contribution metrics
	contributions?: {
		components_created: number;
		styles_created: number;
		files_created: number;
		comments_made: number;
		feedback_given: number;
	};
}

// Comprehensive Figma analytics combining all metrics
export interface FigmaComprehensiveAnalytics {
	file: FigmaFile;
	version_history?: FigmaVersionHistory;
	analytics?: FigmaFileAnalytics;
	design_system?: FigmaDesignSystemMetrics;
	team_metrics?: FigmaTeamMetrics;
	project_analytics?: FigmaProjectAnalytics;
	user_workflow?: FigmaUserWorkflow;
	// Calculated insights
	insights?: {
		design_maturity_score: number; // 0-100
		collaboration_effectiveness: number; // 0-100
		process_efficiency: number; // 0-100
		innovation_index: number; // 0-100 based on feature adoption
		impact_score: number; // 0-100 based on usage and outcomes
		recommendations: string[];
	};
}
