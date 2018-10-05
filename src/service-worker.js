'use strict';
importScripts('./build/sw-toolbox.js');

self.toolbox.options.cache = {
  name: 'wishme-cache'
};

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;
