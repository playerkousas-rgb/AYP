/* Service Worker — AYP 童軍接駁指南（離線可用） */
/* 應用程式或快取資產更新時遞增版本，讓既有用戶取得新內容。 */
const CACHE = "ayp-guide-v12";
const ASSETS = [
  "./",
  "./index.html",
  "./data.js",
  "./app.js",
  "./analytics.js",
  "./manifest.webmanifest",
  "./assets/logo-192.avif",
  "./assets/logo-192.png",
  "./assets/logo-512.png",
  "./assets/apple-touch-icon.png",
  "./assets/favicon-32.avif",
  "./assets/favicon-32.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      // Never remove caches owned by a different app on the same origin.
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("ayp-guide-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  const offline = () => new Response("Offline", {
    status: 503, statusText: "Offline", headers: { "Content-Type": "text/plain; charset=utf-8" }
  });

  if (e.request.mode === "navigate") {
    // Prefer fresh HTML online; only navigations may fall back to the app shell.
    e.respondWith(fetch(e.request).catch(() => caches.open(CACHE)
      .then((c) => c.match("./index.html"))
      .then((page) => page || offline())));
    return;
  }

  const isAsset = ASSETS.some((asset) => new URL(asset, self.registration.scope).pathname === url.pathname);
  if (isAsset) {
    // A newer HTML shell must not receive stale JS from an older active worker.
    const requestedVersion = url.searchParams.get("v");
    if (requestedVersion && requestedVersion !== CACHE.replace(/^ayp-guide-v/, "")) {
      e.respondWith(fetch(e.request).catch(offline));
      return;
    }
    e.respondWith(caches.open(CACHE).then((c) => c.match(e.request, { ignoreSearch: true }))
      .then((hit) => hit || fetch(e.request).catch(offline)));
    return;
  }
  // Do not cache arbitrary responses, and never return HTML for a failed asset/API request.
  e.respondWith(fetch(e.request).catch(offline));
});
