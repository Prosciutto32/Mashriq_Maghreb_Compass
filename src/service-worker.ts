/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope;

import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files // everything in `static`
];

sw.addEventListener('install', (event) => {
    // Create a new cache and add all files to it
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll(ASSETS);
    }

    console.log('installing service worker for version', version);
    console.log('caching assets', ASSETS);
    console.log('caching build', build);

    event.waitUntil(addFilesToCache());
});

sw.addEventListener('activate',async  (event) => {
    // Remove previous cached data from disk
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE) await caches.delete(key);
        }
    }

    await sw.clients.claim();

    event.waitUntil(deleteOldCaches());
});

sw.addEventListener('fetch', (event) => {
    // ignore POST requests etc
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith('http')) return;

    async function respond() {
        const url = new URL(event.request.url);
        const cache = await caches.open(CACHE);

        // `build`/`files` can always be served from the cache
        if (ASSETS.includes(url.pathname)) {
            const response = await cache.match(url.pathname);

            if (response) {
                return response;
            }
        }

        // for everything else, try the network first, but
        // fall back to the cache if we're offline
        try {
            const response = await cache.match(event.request) || await fetch(event.request);

            // if we're offline, fetch can return a value that is not a Response
            // instead of throwing - and we can't pass this non-Response to respondWith
            if (!(response instanceof Response)) {
                throw new Error('invalid response from fetch');
            }

            if (response.status === 200) {
                cache.put(event.request, response.clone());
            }

            return response;
        } catch (err) {
            const response = await cache.match(event.request);

            if (response) {
                console.log(`Returning from Cache`, event.request.url);
                return response;
            }

            // if there's no cache, then just error out
            // as there is nothing we can do to respond to this request
            throw err;
        }
    }

    event.respondWith(respond());
});

sw.addEventListener('message',(event) =>{
    if(event.data && event.data.type === 'SKIP_WAITING'){
        sw.skipWaiting();
    }
});

sw.addEventListener('push', event => {
  let data = {
    title: 'Mashriq Maghreb Compass',
    body: 'No payload',
    icon: '/logo.svg'
  };

  if (event.data) {
    try {
      // Try the JSON method first
      data = event.data.json();
    } catch (err) {
      // If fails, parse manually
      try {
        data = JSON.parse(event.data.text());
      } catch (e) {
        console.error('Failed to parse JSON from text:', e);
        data.body = event.data.text();
      }
    }
  }

  console.log('[Service Worker] Push Received:', data);

  event.waitUntil(
    sw.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon
    })
  );
});


