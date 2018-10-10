module.exports = {
  "globDirectory": "www/",
  "globPatterns": [
    "assets/fonts/*.woff2",
    "assets/i18n/*.json",
    "build/**/*.css",
    "build/**/*.js",
    "index.html",
    "manifest.json"
  ],
  "dontCacheBustUrlsMatching": new RegExp('.+\.[a-f0-9]{8}\..+'),
  "maximumFileSizeToCacheInBytes": 5000000,
  "swSrc": "src/service-worker.js",
  "swDest": "www/service-worker.js"
};
