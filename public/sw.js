// Kill-switch service worker.
//
// A previous version of this site registered a caching service worker that
// cached HTML documents. That can serve stale markup after a deploy and cause
// asset/version mismatches. This file intentionally replaces it: it unregisters
// itself and deletes all caches so any client that still has the old worker is
// cleaned up automatically on its next visit. New visitors never register a
// service worker (registration was removed from the app).

self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			try {
				const keys = await caches.keys();
				await Promise.all(keys.map((key) => caches.delete(key)));
			} catch {
				// ignore
			}
			await self.registration.unregister();
			const clients = await self.clients.matchAll({ type: "window" });
			for (const client of clients) {
				client.navigate(client.url);
			}
		})()
	);
});
