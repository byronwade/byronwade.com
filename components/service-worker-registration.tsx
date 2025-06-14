"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
	useEffect(() => {
		if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
			navigator.serviceWorker
				.register("/sw.js")
				.then((registration) => {
					console.log("Service Worker registered successfully:", registration);

					// Check for updates
					registration.addEventListener("updatefound", () => {
						const newWorker = registration.installing;
						if (newWorker) {
							newWorker.addEventListener("statechange", () => {
								if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
									// New content is available, prompt user to refresh
									if (confirm("New content is available! Would you like to refresh?")) {
										window.location.reload();
									}
								}
							});
						}
					});
				})
				.catch((error) => {
					console.log("Service Worker registration failed:", error);
				});

			// Listen for messages from service worker
			navigator.serviceWorker.addEventListener("message", (event) => {
				if (event.data && event.data.type === "CACHE_UPDATED") {
					console.log("Cache updated:", event.data.payload);
				}
			});
		}
	}, []);

	return null;
}
