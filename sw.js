const CACHE_VERSION = "forest-tps-v1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./Meshy_AI_biped_Animation_Walking_withSkin.fbx",
  "./Meshy_AI_biped_Animation_Attack_withSkin.fbx",
  "./Meshy_AI_biped_Animation_Running_withSkin.fbx",
  "./tree.glb",
  "./boar.glb",
  "./yakusou.glb",
  "./herb.glb"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => Promise.allSettled(CORE_ASSETS.map((asset) => cache.add(asset))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isHeavyLocalAsset = isSameOrigin && /\.(?:glb|fbx|png|jpg|jpeg|webp|ktx2|bin|wasm)$/i.test(url.pathname);
  const isHtmlNavigation = request.mode === "navigate";

  if (isHeavyLocalAsset) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (isSameOrigin || isHtmlNavigation) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok || response.type === "opaque") {
    cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok || response.type === "opaque") {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkPromise;
}
