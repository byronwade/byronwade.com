"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import React from "react";

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
	errorInfo?: React.ErrorInfo;
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

	handleGoHome = () => {
		window.location.href = "/";
	};

	render() {
		if (this.state.hasError) {
			const { error } = this.state;

			// Use custom fallback if provided
			if (this.props.fallback && error) {
				const FallbackComponent = this.props.fallback;
				return <FallbackComponent error={error} retry={this.handleRetry} />;
			}

			// Check if this is the specific webpack error
			const isWebpackError = error?.message.includes(
				"Cannot read properties of undefined (reading 'call')"
			);

			return (
				<div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
					<Card className="w-full max-w-md">
						<CardHeader className="text-center">
							<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
								<AlertTriangle className="h-6 w-6 text-destructive" />
							</div>
							<CardTitle className="text-xl">
								{isWebpackError ? "Loading Error" : "Something went wrong"}
							</CardTitle>
							<CardDescription>
								{isWebpackError
									? "There was an issue loading the page. This usually resolves with a refresh."
									: "An unexpected error occurred. Please try again."}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{process.env.NODE_ENV === "development" && error && (
								<div className="rounded-md bg-muted p-3">
									<p className="text-sm font-mono text-muted-foreground">{error.message}</p>
								</div>
							)}

							<div className="flex flex-col gap-2">
								<Button onClick={this.handleRetry} className="w-full">
									<RefreshCw className="mr-2 h-4 w-4" />
									Try Again
								</Button>
								<Button variant="outline" onClick={this.handleGoHome} className="w-full">
									<Home className="mr-2 h-4 w-4" />
									Go Home
								</Button>
							</div>

							{isWebpackError && (
								<p className="text-xs text-muted-foreground text-center">
									If this error persists, try clearing your browser cache or refreshing the page.
								</p>
							)}
						</CardContent>
					</Card>
				</div>
			);
		}

		return this.props.children;
	}
}

// Hook version for functional components
export function useErrorHandler() {
	return React.useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
		console.error("Error caught by useErrorHandler:", error, errorInfo);

		// Handle specific webpack errors
		if (error.message.includes("Cannot read properties of undefined (reading 'call')")) {
			console.warn("Detected webpack module loading error. Reloading page...");
			window.location.reload();
		}
	}, []);
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
	Component: React.ComponentType<P>,
	fallback?: React.ComponentType<{ error: Error; retry: () => void }>
) {
	const WrappedComponent = (props: P) => (
		<ErrorBoundary fallback={fallback}>
			<Component {...props} />
		</ErrorBoundary>
	);

	WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

	return WrappedComponent;
}

export default ErrorBoundary;
