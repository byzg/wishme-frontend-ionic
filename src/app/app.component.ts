import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { AngularTokenService } from 'angular-token';

import { LoginPage, WishesPage } from './pages';

@Component({
  templateUrl: 'app.component.html'
})

export class AppComponent {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;

  constructor(
    public platform: Platform,
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
      console.log('Platform is ready')
      document.addEventListener('backbutton', () => {
        console.log('fghjkl');
        alert('dfghjkl')
      }, false)
      this.platform.registerBackButtonAction(()=>{
        console.log('fghjkl');
        alert('dfghjkl')
      })
    });

  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  logout() {
    this.nav.setRoot(LoginPage);
  }

}
