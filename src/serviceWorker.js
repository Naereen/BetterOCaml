/*
  Service worker for BetterOCaml offline use

  - References: https://levelup.gitconnected.com/build-a-pwa-using-only-vanilla-javascript-bdf1eee6f37a
*/

console.log("Starting serviceWorker.js");

const staticAssets = [
  // './',
  './manifest.json',
  './index.html',
  './favicon.ico',
  './cache.appcache',
  // './css/',
  './css/bootstrap.css',
  './css/icon.css',
  './css/index.css',
  './css/codemirror/codemirror.min.css',
  './css/codemirror/dialog.css',
  './css/iconfont/MaterialIcons-Regular.eot',
  './css/iconfont/MaterialIcons-Regular.ttf',
  './css/iconfont/MaterialIcons-Regular.woff',
  './css/iconfont/MaterialIcons-Regular.woff2',
  './css/materialize/materialize.min.css',
  './css/theme/material.css',
  './css/theme/mdn-like.css',
  './css/theme/monokai.css',
  // './icon/',
  './icon/apple-touch-icon.png',
  './icon/android-chrome-192x192.png',
  './icon/android-chrome-512x512.png',
  './icon/favicon-16x16.png',
  './icon/favicon-32x32.png',
  // './screenshots/',
  './screenshots/screenshot1.png',
  // './js/',
  './js/buttons.js',
  // './js/serviceWorker.js',
  './js/editor_change.js',
  './js/jquery.min.js',
  './js/materialize.min.js',
  './js/resizer.js',
  './js/toplevel-4.08.js',
  './js/codemirror/closebrackets.js',
  './js/codemirror/codemirror.min.js',
  './js/codemirror/dialog.js',
  './js/codemirror/jump-to-line.js',
  './js/codemirror/matchbrackets.min.js',
  './js/codemirror/mllike.min.js',
  './js/codemirror/search.js',
  './js/codemirror/searchcursor.js',
  './js/codemirror/show-hint.js',
  './js/codemirror/sublime.min.js',
  './js/old/autocomplete.js',
  './js/old/utility.js'
];

self.addEventListener('install', async event => {
  const cache = await caches.open('static-cache');
  cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === location.url) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = caches.match(req);
  return cachedResponse || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open('dynamic-cache');

  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    return await cache.match(req);
  }
}

console.log("Finished serviceWorker.js");
