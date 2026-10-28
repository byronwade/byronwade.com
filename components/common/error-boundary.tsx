"use client";

import React from "react";
import { ErrorNotice } from "./error-notice";

interface ErrorBoundaryState {
	error: Error | null;
}

interface ErrorBoundaryProps {
	children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	state: ErrorBoundaryState = { error: null };

	static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
		// JavaScript also permits throwing null, strings and other non-Error values.
		return {
			error: error instanceof Error ? error : new Error("An unexpected render error occurred"),
		};
	}

	componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
		console.error("Error Boundary caught an error:", error, errorInfo);
	}

	handleReload = () => {
		// The failed shell can include navigation or client code. A full reload is
		// deliberate: automatic retries can loop and discard unsent work elsewhere.
		window.location.reload();
	};

	render() {
		const { error } = this.state;
		if (error) {
			return (
				<main id="main-content">
					<ErrorNotice
						description="Something failed while the site was rendering. Reload the page to try again. Any unsent text may need to be entered again."
						onRetry={this.handleReload}
						reference={process.env.NODE_ENV === "development" ? error.message : undefined}
						retryLabel="Reload page"
						title="This page didn’t load"
					/>
				</main>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
