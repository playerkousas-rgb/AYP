/* Service Worker — AYP 童軍接駁指南（離線可用） */
/* 注意：每次改動快取清單（新增／刪除資產）都必須遞增 CACHE 版本號，
   否則舊用戶會繼續用舊快取。見 docs/部署瘦身與防增肥規範.md */
const CACHE = "ayp-guide-v9";
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
          // 只快取健康回應，避免把 404／空 body 凍結進離線快取
          if (res && res.ok && (res.type === "basic" || res.type === "default")) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() =>
          // 離線／網路失敗：回落主頁；保證永遠回一個有效 Response
          caches.match("./index.html").then((pg) =>
            pg || new Response("offline", { status: 503, statusText: "Offline" })
          )
        );
    })
  );
});
