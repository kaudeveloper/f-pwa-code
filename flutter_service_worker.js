'use strict';
const MANIFEST = 'flutter-app-manifest';
 
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = ["assets/AssetManifest.bin",
"assets/AssetManifest.bin.json",
"assets/AssetManifest.json",
"assets/FontManifest.json",
"assets/fonts/MaterialIcons-Regular.otf",
"assets/lib/assets/fonts/Inter-Regular.ttf",
"assets/NOTICES",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf",
"assets/packages/font_awesome_flutter/lib/fonts/Font%2520Awesome%25207%2520Brands-Regular-400.otf",
"assets/packages/font_awesome_flutter/lib/fonts/Font%2520Awesome%25207%2520Free-Regular-400.otf",
"assets/packages/font_awesome_flutter/lib/fonts/Font%2520Awesome%25207%2520Free-Solid-900.otf",
"assets/shaders/ink_sparkle.frag",
"canvaskit/canvaskit.js",
"canvaskit/canvaskit.js.symbols" ,
"canvaskit/canvaskit.wasm",
"canvaskit/chromium/canvaskit.js",
"canvaskit/chromium/canvaskit.js.symbols",
"canvaskit/chromium/canvaskit.wasm",
"canvaskit/skwasm.js",
"canvaskit/skwasm.js.symbols",
"canvaskit/skwasm.wasm",
"canvaskit/skwasm_heavy.js",
"canvaskit/skwasm_heavy.js.symbols",
"canvaskit/skwasm_heavy.wasm",
"favicon.png",
"flutter.js",
"flutter_bootstrap.js",
"icons/Icon-192.png",
"icons/Icon-512.png",
"icons/Icon-maskable-192.png",
"icons/Icon-maskable-512.png",
"index.html",
"/",
"main.dart.js",
"manifest.json",
"version.json",
"main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];
 
 

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const resourceKey = url.pathname.substring(1) || "/";

  if (RESOURCES[resourceKey]) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(resp => {
          return (
            resp ||
            fetch(event.request).then(networkResp => {
              cache.put(event.request, networkResp.clone());
              return networkResp;
            })
          );
        })
      )
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});