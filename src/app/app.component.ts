import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, ViewController, IonicApp } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { AngularTokenService } from 'angular-token';

import { BackManager } from './services';
import { LoginPage, HomePage } from './pages';

@Component({
  templateUrl: 'app.component.html'
})

export class AppComponent {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(ViewController) view: ViewController;

  constructor(
    private backManager: BackManager,
    private platform: Platform,
    private ionicApp: IonicApp,
    private translate: TranslateService,
    private tokenService: AngularTokenService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.translate.setDefaultLang('ru');
    this.translate.use('ru');
    this.platform.ready().then(() => {
      this.backManager.setupBackButtonBehavior (this.ionicApp);
    });

  }

  rootPage() {
    return this.tokenService.userSignedIn() ? HomePage : LoginPage;
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logout() {
    this.nav.setRoot(LoginPage);
  }
}
