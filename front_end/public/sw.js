const STATIC_CACHE = "pritechvior-static-v2.0.0";
const DYNAMIC_CACHE = "pritechvior-dynamic-v2.0.0";
const API_CACHE = "pritechvior-api-v2.0.0";

// Static assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/offline.html",
  // Cache the main built assets
  "/assets/index-CMjK9cw3.css",
  "/assets/index-e-GuRZr5.js",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("Service Worker: Caching static assets");
        // Cache assets individually to handle failures better
        return Promise.all(
          STATIC_ASSETS.map((url) => {
            return cache.add(url).catch((error) => {
              console.log("Failed to cache:", url, error);
              // Continue even if one asset fails
              return Promise.resolve();
            });
          })
        );
      }),
      caches.open(API_CACHE), // Pre-create API cache
      caches.open(DYNAMIC_CACHE), // Pre-create dynamic cache
    ])
      .then(() => {
        console.log("Service Worker: Installation complete");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.log("Service Worker: Installation failed", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  const cacheWhitelist = [STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activation complete");
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content and cache new content
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip cross-origin requests and chrome-extension requests
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  // Handle API requests with network-first strategy
  if (requestUrl.pathname.startsWith("/api/")) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // Cache successful API responses
            if (response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          })
          .catch(() => {
            // Return cached version if network fails
            return cache.match(event.request).then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline fallback for API requests
              return new Response(
                JSON.stringify({
                  error: "Network unavailable",
                  offline: true,
                  message: "This data is not available offline",
                }),
                {
                  status: 503,
                  statusText: "Service Unavailable",
                  headers: { "Content-Type": "application/json" },
                }
              );
            });
          });
      })
    );
    return;
  }

  // Handle navigation requests with cache-first strategy for HTML pages
  if (event.request.mode === "navigate") {
    event.respondWith(
      // First try to get the specific page from cache
      caches.match(event.request).then((response) => {
        if (response) {
          console.log("Serving cached page:", event.request.url);
          return response;
        }

        // If not cached, try to fetch from network
        return fetch(event.request)
          .then((response) => {
            // Clone the response before using it
            const responseToCache = response.clone();

            // Cache successful navigation responses
            if (response.status === 200) {
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          })
          .catch(() => {
            console.log("Network failed for navigation, trying fallbacks");
            // First try to serve the cached root page (for React Router)
            return caches.match("/").then((rootResponse) => {
              if (rootResponse) {
                console.log("Serving cached root page for offline navigation");
                return rootResponse;
              }
              // If root page not cached, serve offline page
              return caches.match("/offline.html").then((offlineResponse) => {
                if (offlineResponse) {
                  console.log("Serving offline page");
                  return offlineResponse;
                }
                // Final fallback
                return new Response(
                  "<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You're offline</h1><p>Please check your internet connection.</p></body></html>",
                  { headers: { "Content-Type": "text/html" } }
                );
              });
            });
          });
      })
    );
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response for caching
          const responseToCache = response.clone();

          // Cache assets (CSS, JS, images) more aggressively
          if (
            event.request.url.includes("/assets/") ||
            event.request.destination === "script" ||
            event.request.destination === "style" ||
            event.request.destination === "image"
          ) {
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          } else {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          // Return offline fallback for other resources
          if (event.request.destination === "image") {
            return new Response(
              '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" fill="#666">Offline</text></svg>',
              { headers: { "Content-Type": "image/svg+xml" } }
            );
          }
          // For document requests, return the offline page
          if (
            event.request.mode === "navigate" ||
            event.request.destination === "document"
          ) {
            return caches.match("/offline.html").then((offlineResponse) => {
              if (offlineResponse) {
                return offlineResponse;
              }
              return caches.match("/");
            });
          }
          return new Response("Resource not available offline", {
            status: 503,
          });
        });
    })
  );
});

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("Service Worker: Background sync triggered");
    event.waitUntil(syncData());
  }
});

// Handle push notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New notification from PRITECH VIOR",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "Open App",
        icon: "/icons/icon-72x72.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icons/icon-72x72.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("PRITECH VIOR", options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(self.clients.openWindow("/"));
  }
});

// Sync function for background operations
async function syncData() {
  try {
    // Sync cached data when back online
    const cache = await caches.open(API_CACHE);
    const requests = await cache.keys();

    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.status === 200) {
          await cache.put(request, response);
        }
      } catch (error) {
        console.log("Sync failed for:", request.url);
      }
    }

    // Notify clients about sync completion
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: "SYNC_COMPLETE",
        message: "Data synchronized successfully",
      });
    });
  } catch (error) {
    console.error("Background sync failed:", error);
  }
}

// Handle skipWaiting message from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
