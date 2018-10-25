import { Injectable } from '@angular/core';
import { App, IonicApp, MenuController } from 'ionic-angular';

@Injectable()
export class BackManager {
  constructor(
    private app: App,
    private menu: MenuController,
  ) {}

  setupBackButtonBehavior (ionicApp: IonicApp) {
    // https://gist.github.com/t00ts/3542ac4573ffbc73745641fa269326b8
    // If on web version (browser)
    if (window.location.protocol !== "file:") {

      // Register browser back button action(s)
      window.onpopstate = (evt) => {

        // Close menu if open
        if (this.menu.isOpen()) {
          this.menu.close ();
          return;
        }

        // Close any active modals or overlays
        let activePortal = ionicApp._loadingPortal.getActive() ||
          ionicApp._modalPortal.getActive() ||
          ionicApp._toastPortal.getActive() ||
          ionicApp._overlayPortal.getActive();

        if (activePortal) {
          activePortal.dismiss();
          return;
        }

        // Navigate back
        if (this.app.getActiveNav().getViews().length > 1)
          this.app.getRootNav().pop()
        else
          history.go(-history.length + 1);
      };

      // Fake browser history on each view enter
      this.app.viewDidEnter.subscribe(({index, name}) => {
        if (index > 0)
          history.pushState ({ name, index }, name, name);
        if (history.state && history.state.index > index)
          history.back();
      });

    }

  }
}
