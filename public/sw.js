/* Regicide PWA service worker — runtime caching for an offline-capable shell.
 * Only same-origin GET requests are handled; cross-origin traffic (Firebase
 * Realtime DB, etc.) is passed straight through to the network untouched. */
const CACHE = "regicide-v1";
const OFFLINE_URL = "/";

self.addEventListener("install", (event) => {
	event.waitUntil(caches.open(CACHE).then((cache) => cache.add(OFFLINE_URL)));
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
			)
			.then(() => self.clients.claim()),
	);
});

self.addEventListener("fetch", (event) => {
	const { request } = event;
	if (request.method !== "GET") return;

	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return; // ignore Firebase & other origins

	// Page navigations: network-first, fall back to the cached shell offline.
	if (request.mode === "navigate") {
		event.respondWith(
			fetch(request)
				.then((res) => {
					const copy = res.clone();
					caches.open(CACHE).then((c) => c.put(OFFLINE_URL, copy));
					return res;
				})
				.catch(() => caches.match(OFFLINE_URL).then((r) => r || Response.error())),
		);
		return;
	}

	// Same-origin assets: stale-while-revalidate.
	event.respondWith(
		caches.match(request).then((cached) => {
			const network = fetch(request)
				.then((res) => {
					if (res && res.status === 200) {
						const copy = res.clone();
						caches.open(CACHE).then((c) => c.put(request, copy));
					}
					return res;
				})
				.catch(() => cached);
			return cached || network;
		}),
	);
});
