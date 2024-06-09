const CACHE_NAME = 'tea-timer-cache-v1'
const URLS_TO_CACHE = [
  './',
  './site.webmanifest',
  './index.html',
  './image/icon/favicon.ico',
  './image/icon/favicon-16x16.png',
  './image/icon/favicon-32x32.png',
  './image/icon/android-chrome-144x144.png',
  './image/icon/apple-touch-icon.png',
  './audio/sonar_high.mp3',
  './audio/sonar_low.mp3',
  './assets',
  'https://cdn.jsdelivr.net/npm/bulma@1/css/bulma.min.css',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(URLS_TO_CACHE)
      }),
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
      }),
  )
})

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
