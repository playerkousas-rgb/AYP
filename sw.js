/* Service Worker — AYP 童軍接駁指南（離線可用） */
const CACHE = "ayp-guide-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./data.js",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/logo-192.png",
  "./assets/logo-512.png",
  "./assets/apple-touch-icon.png",
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
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // 只處理同源（本地檔案）
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
          return res;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
