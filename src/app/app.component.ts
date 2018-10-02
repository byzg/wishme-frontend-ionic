import { Component, ViewChild } from '@angular/core';
import {
  Platform,
  Nav,
  IonicApp,
  App,
  MenuController,
  ViewController
} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { AngularTokenService } from 'angular-token';

import { LoginPage, WishesPage } from './pages';

@Component({
  templateUrl: 'app.component.html'
})

export class AppComponent {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(ViewController) view: ViewController;
  rootPage: any;

  constructor(
    private platform: Platform,
    private app: App,
    private ionicApp: IonicApp,
    private menu: MenuController,
    private translate: TranslateService,
    private tokenService: AngularTokenService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.rootPage = this.tokenService.userSignedIn() ?
      WishesPage : LoginPage;

    this.translate.setDefaultLang('ru');
    this.translate.use('ru');
    this.platform.ready().then(() => {
      this.setupBackButtonBehavior ();
    });

  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logout() {
    this.nav.setRoot(LoginPage);
  }

  private setupBackButtonBehavior () {
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
        let activePortal = this.ionicApp._loadingPortal.getActive() ||
          this.ionicApp._modalPortal.getActive() ||
          this.ionicApp._toastPortal.getActive() ||
          this.ionicApp._overlayPortal.getActive();

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
