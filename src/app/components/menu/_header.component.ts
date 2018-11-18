import { Component, ViewChild } from '@angular/core';
import { NavController, App } from 'ionic-angular';

import { LoginPage } from '../../pages';
import { Session } from '../../services';

@Component({
  selector: 'wsm-menu-header',
  templateUrl: '_header.component.html'
})
export class MenuHeaderComponent {
  private navCtrl: NavController;
  path = 'components.menu.header';

  constructor(
    public session: Session,
    private app: App
  ) {
    this.navCtrl = app.getActiveNav();
  }

  logout() {
    this.session.destroy();
    this.navCtrl.setRoot(LoginPage);
  }
}
