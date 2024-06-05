const cacheName = "Momo Games-Draw To Smash!-0.1";
const contentToCache = [
    "Build/60151d6a7b2db421af6ff1209b55bc4b.loader.js",
    "Build/11ad4493123d545d780890010ea480d4.framework.js",
    "Build/366e4272f4f7b7b15844766333d897ef.data",
    "Build/963f3c4621763a74bd7c6941fc163520.wasm",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
