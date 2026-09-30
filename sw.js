const CACHE_NAME = "toyhaven-v2";

const FILES_TO_CACHE = [
    "./",
    "index.html",
    "products.html",
    "cart.html",
    "checkout.html",
    "wishlist.html",
    "feedback.html",

    "css/style.css",
    "js/app.js",

    "manifest.json",
    "img/favicon.svg",
    "img/icon-192.png",
    "img/icon-512.png",

    "img/dragon-knight.jpg",
    "img/space-ranger.jpg",
    "img/wizard.jpg",
    "img/robo-buddy.jpg",
    "img/plush-panda.jpg",
    "img/building-blocks.jpg",
    "img/castle-quest.jpg",
    "img/word-wizards.jpg",
    "img/treasure-trek.jpg",
    "img/red-racer.jpg",
    "img/classic-roadster.jpg",
    "img/rescue-truck.jpg"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                return cachedResponse || fetch(event.request);
            })
    );
});