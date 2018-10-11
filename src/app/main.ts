import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { environment } from '../environments/environment';
import { AppModule } from './app.module';

if (environment.production) {
  enableProdMode();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(function(reg) {
        console.log('service worker registered: ', reg)
      })
      .catch(function(err) { console.error('[SW ERROR]', err) });
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
