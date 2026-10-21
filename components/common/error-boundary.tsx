"use client";

import React from "react";
import { ErrorNotice } from "./error-notice";

interface ErrorBoundaryState {
	error?: Error;
	errorInfo?: React.ErrorInfo;
	hasError: boolean;
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Log error details for debugging
		console.error("Error Boundary caught an error:", error, errorInfo);

		// Check if this is the specific TypeError we're trying to handle
		if (error.message.includes("Cannot read properties of undefined (reading 'call')")) {
			// This is likely a webpack module loading issue
			console.warn("Detected webpack module loading error. Attempting recovery...");

			// Try to reload the page after a short delay
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}

		// In production, you might want to send this to an error reporting service
		if (process.env.NODE_ENV === "production") {
			// Example: Send to Sentry, LogRocket, etc.
			console.error("Production error:", error.message);
		}

		this.setState({
			error,
			errorInfo,
		});
	}

	handleRetry = () => {
		// Clear error state and try again
		this.setState({ hasError: false, error: undefined, errorInfo: undefined });

		// If the error persists, reload the page
		setTimeout(() => {
			if (this.state.hasError) {
				window.location.reload();
			}
		}, 100);
	};

	render() {
		if (this.state.hasError) {
			const { error } = this.state;

			// Use custom fallback if provided
			if (this.props.fallback) {
				const FallbackComponent = this.props.fallback;
				return (
					<FallbackComponent
						error={error ?? new Error("Something went wrong")}
						retry={this.handleRetry}
					/>
				);
			}

			// Check if this is the specific webpack error
			const isWebpackError = error?.message.includes(
				"Cannot read properties of undefined (reading 'call')"
			);

			return (
				<ErrorNotice
					description={
						isWebpackError
							? "Part of the site’s code didn’t arrive. This usually clears with a refresh; if it doesn’t, clearing the browser cache will."
							: "Something failed while the site was rendering. Nothing you typed was sent or lost. Try again, or start from the homepage."
					}
					onRetry={this.handleRetry}
					reference={process.env.NODE_ENV === "development" ? error?.message : undefined}
					title={isWebpackError ? "The page didn’t finish loading" : "This page didn’t load"}
				/>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
