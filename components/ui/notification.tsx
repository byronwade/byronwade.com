"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, Rocket, Code, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export interface NotificationProps {
	id?: string;
	title: string;
	description?: string;
	variant?: "default" | "success" | "error" | "warning" | "info" | "tech";
	duration?: number;
	onClose?: () => void;
	action?: {
		label: string;
		onClick: () => void;
	};
	persistent?: boolean;
}

const variantStyles = {
	default: {
		container: "bg-background border-border shadow-lg",
		icon: Info,
		iconColor: "text-blue-600",
		accent: "border-l-blue-600",
	},
	success: {
		container: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 shadow-lg",
		icon: CheckCircle,
		iconColor: "text-green-600",
		accent: "border-l-green-600",
	},
	error: {
		container: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 shadow-lg",
		icon: AlertCircle,
		iconColor: "text-red-600",
		accent: "border-l-red-600",
	},
	warning: {
		container: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 shadow-lg",
		icon: AlertTriangle,
		iconColor: "text-yellow-600",
		accent: "border-l-yellow-600",
	},
	info: {
		container: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 shadow-lg",
		icon: Info,
		iconColor: "text-blue-600",
		accent: "border-l-blue-600",
	},
	tech: {
		container: "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-800 shadow-xl",
		icon: Rocket,
		iconColor: "text-yellow-600",
		accent: "border-l-yellow-600",
	},
};

export function Notification({ id, title, description, variant = "default", duration = 5000, onClose, action, persistent = false }: NotificationProps) {
	const [isVisible, setIsVisible] = useState(true);
	const [progress, setProgress] = useState(100);

	const styles = variantStyles[variant];
	const Icon = styles.icon;

	useEffect(() => {
		if (persistent) return;

		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				const newProgress = prev - 100 / (duration / 100);
				return newProgress <= 0 ? 0 : newProgress;
			});
		}, 100);

		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(() => onClose?.(), 300);
		}, duration);

		return () => {
			clearInterval(progressInterval);
			clearTimeout(timer);
		};
	}, [duration, onClose, persistent]);

	const handleClose = () => {
		setIsVisible(false);
		setTimeout(() => onClose?.(), 300);
	};

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div initial={{ opacity: 0, y: -50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} transition={{ duration: 0.3, ease: "easeOut" }} className={cn("relative overflow-hidden rounded-lg border border-l-4 p-4 shadow-lg backdrop-blur-sm", styles.container, styles.accent)}>
					{/* Progress bar */}
					{!persistent && (
						<div className="absolute bottom-0 left-0 h-1 bg-black/10 dark:bg-white/10 w-full">
							<motion.div className="h-full bg-current opacity-30" initial={{ width: "100%" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.1, ease: "linear" }} />
						</div>
					)}

					<div className="flex items-start gap-3">
						{/* Icon */}
						<div className="flex-shrink-0 mt-0.5">
							{variant === "tech" ? (
								<motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
									<Icon className={cn("h-5 w-5", styles.iconColor)} />
								</motion.div>
							) : (
								<Icon className={cn("h-5 w-5", styles.iconColor)} />
							)}
						</div>

						{/* Content */}
						<div className="flex-1 min-w-0">
							<h4 className="text-sm font-semibold text-foreground">{title}</h4>
							{description && <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>}
							{action && (
								<div className="mt-3">
									<Button size="sm" variant="outline" onClick={action.onClick} className="h-8 px-3 text-xs font-medium">
										{action.label}
									</Button>
								</div>
							)}
						</div>

						{/* Close button */}
						<Button variant="ghost" size="sm" onClick={handleClose} className="flex-shrink-0 h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10">
							<X className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</Button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// Notification container for managing multiple notifications
export function NotificationContainer({ notifications }: { notifications: NotificationProps[] }) {
	return (
		<div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
			<AnimatePresence mode="popLayout">
				{notifications.map((notification, index) => (
					<motion.div key={notification.id || index} layout initial={{ opacity: 0, x: 300 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 300 }} transition={{ duration: 0.3, ease: "easeOut" }}>
						<Notification {...notification} />
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	);
}

// Hook for managing notifications
export function useNotifications() {
	const [notifications, setNotifications] = useState<NotificationProps[]>([]);

	const addNotification = (notification: Omit<NotificationProps, "id" | "onClose">) => {
		const id = Math.random().toString(36).substr(2, 9);
		const newNotification: NotificationProps = {
			...notification,
			id,
			onClose: () => removeNotification(id),
		};
		setNotifications((prev) => [...prev, newNotification]);
		return id;
	};

	const removeNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	const clearAll = () => {
		setNotifications([]);
	};

	// Convenience methods
	const success = (title: string, description?: string, options?: Partial<NotificationProps>) => addNotification({ title, description, variant: "success", ...options });

	const error = (title: string, description?: string, options?: Partial<NotificationProps>) => addNotification({ title, description, variant: "error", ...options });

	const warning = (title: string, description?: string, options?: Partial<NotificationProps>) => addNotification({ title, description, variant: "warning", ...options });

	const info = (title: string, description?: string, options?: Partial<NotificationProps>) => addNotification({ title, description, variant: "info", ...options });

	const tech = (title: string, description?: string, options?: Partial<NotificationProps>) => addNotification({ title, description, variant: "tech", ...options });

	return {
		notifications,
		addNotification,
		removeNotification,
		clearAll,
		success,
		error,
		warning,
		info,
		tech,
	};
}

// Pre-built notification components for common use cases
export const ProjectNotifications = {
	deploymentSuccess: () => ({
		title: "Deployment Successful! 🚀",
		description: "Your project has been deployed and is now live.",
		variant: "tech" as const,
		duration: 8000,
	}),

	buildComplete: () => ({
		title: "Build Complete",
		description: "Your application has been built successfully.",
		variant: "success" as const,
	}),

	errorOccurred: (error: string) => ({
		title: "Something went wrong",
		description: error,
		variant: "error" as const,
		persistent: true,
	}),

	newFeature: (feature: string) => ({
		title: "New Feature Available!",
		description: `${feature} is now available in your dashboard.`,
		variant: "tech" as const,
		duration: 10000,
	}),
};
