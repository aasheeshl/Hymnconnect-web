const CACHE_NAME = "hymnconnect-cache-v1";

self.addEventListener("install", (event) => {
  // You can pre-cache specific routes here if you want
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",              // main page
        "/index.html",
        "/manifest.json",
        "/logo-192.png",
        "/logo-512.png"
      ]);
    })
  );
});

self.addEventListener("activate", (event) => {
  // Clean up old caches if you change CACHE_NAME
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  // Cache-first strategy: try cache, then network, then fail
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then((response) => {
          // Only cache GET requests and successful responses
          if (
            event.request.method === "GET" &&
            response.status === 200 &&
            response.type === "basic"
          ) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Optional: you can return a fallback page or message here
          return new Response(
            "You are offline. Some features may not be available.",
            { status: 200, headers: { "Content-Type": "text/plain" } }
          );
        });
    })
  );
});