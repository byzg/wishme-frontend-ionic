import { Component} from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  path = 'pages.login';

  constructor(
    public nav: NavController,
    public menu: MenuController,
  ) {
    this.menu.swipeEnable(false);
  }

  login() {
    // this.nav.setRoot(HomePage);
  }

}
