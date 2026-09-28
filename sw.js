// Central Cache Registry Token Name
const CACHE = "toyhaven-v1";

const FILES = [
  './', 
  'index.html', 
  'products.html', 
  'cart.html', 
  'checkout.html', 
  'wishlist.html', 
  'feedback.html', 
  'css/style.css', 
  'js/app.js', 
  'manifest.json', 
  'img/favicon.svg'
];


self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => {
      console.log("PWA Engine: Committing static local asset registry parameters...");
      return c.addAll(FILES);
    })
  );
});


self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => {
      // Returns the matching file out of local memory caches, or fetches from live servers
      return r || fetch(e.request);
    })
  );
});