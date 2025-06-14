const CACHE_NAME = "byronwade-v1";
const STATIC_CACHE = "static-v1";
const DYNAMIC_CACHE = "dynamic-v1";
const IMAGE_CACHE = "images-v1";

// Assets to cache immediately
const STATIC_ASSETS = ["/", "/portfolio", "/contact", "/resume", "/fonts/Modelistasignature-ownAV.otf", "/icon-192x192.png", "/icon-512x512.png", "/manifest.json"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(STATIC_CACHE)
			.then((cache) => {
				return cache.addAll(STATIC_ASSETS);
			})
			.then(() => {
				return self.skipWaiting();
			})
	);
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== IMAGE_CACHE) {
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => {
				return self.clients.claim();
			})
	);
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== "GET") {
		return;
	}

	// Skip external requests
	if (url.origin !== location.origin) {
		return;
	}

	// Handle different types of requests
	if (request.destination === "image") {
		event.respondWith(handleImageRequest(request));
	} else if (url.pathname.startsWith("/api/")) {
		event.respondWith(handleAPIRequest(request));
	} else if (url.pathname.startsWith("/_next/static/")) {
		event.respondWith(handleStaticAssets(request));
	} else {
		event.respondWith(handlePageRequest(request));
	}
});

// Cache-first strategy for images
async function handleImageRequest(request) {
	try {
		const cache = await caches.open(IMAGE_CACHE);
		const cachedResponse = await cache.match(request);

		if (cachedResponse) {
			return cachedResponse;
		}

		const networkResponse = await fetch(request);

		if (networkResponse.ok) {
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch (error) {
		// Return a fallback image if available
		const fallback = await caches.match("/icon-192x192.png");
		return fallback || new Response("Image not available", { status: 404 });
	}
}

// Network-first strategy for API requests
async function handleAPIRequest(request) {
	try {
		const networkResponse = await fetch(request);

		if (networkResponse.ok) {
			const cache = await caches.open(DYNAMIC_CACHE);
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch (error) {
		const cache = await caches.open(DYNAMIC_CACHE);
		const cachedResponse = await cache.match(request);

		if (cachedResponse) {
			return cachedResponse;
		}

		return new Response("API not available", { status: 503 });
	}
}

// Cache-first strategy for static assets
async function handleStaticAssets(request) {
	try {
		const cache = await caches.open(STATIC_CACHE);
		const cachedResponse = await cache.match(request);

		if (cachedResponse) {
			return cachedResponse;
		}

		const networkResponse = await fetch(request);

		if (networkResponse.ok) {
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch (error) {
		return new Response("Asset not available", { status: 404 });
	}
}

// Stale-while-revalidate strategy for pages
async function handlePageRequest(request) {
	try {
		const cache = await caches.open(DYNAMIC_CACHE);
		const cachedResponse = await cache.match(request);

		// Fetch from network in background
		const networkPromise = fetch(request)
			.then((networkResponse) => {
				if (networkResponse.ok) {
					cache.put(request, networkResponse.clone());
				}
				return networkResponse;
			})
			.catch(() => null);

		// Return cached version immediately if available
		if (cachedResponse) {
			networkPromise; // Update cache in background
			return cachedResponse;
		}

		// Wait for network if no cache
		return (await networkPromise) || new Response("Page not available", { status: 404 });
	} catch (error) {
		return new Response("Page not available", { status: 404 });
	}
}

// Background sync for failed requests
self.addEventListener("sync", (event) => {
	if (event.tag === "background-sync") {
		event.waitUntil(doBackgroundSync());
	}
});

async function doBackgroundSync() {
	// Implement background sync logic here
	console.log("Background sync triggered");
}

// Push notifications (if needed in the future)
self.addEventListener("push", (event) => {
	if (event.data) {
		const data = event.data.json();
		const options = {
			body: data.body,
			icon: "/icon-192x192.png",
			badge: "/icon-192x192.png",
			vibrate: [100, 50, 100],
			data: {
				dateOfArrival: Date.now(),
				primaryKey: data.primaryKey,
			},
		};

		event.waitUntil(self.registration.showNotification(data.title, options));
	}
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
	event.notification.close();

	event.waitUntil(clients.openWindow("/"));
});
