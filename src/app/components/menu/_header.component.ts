import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../../pages';
import { Session } from '../../services';

@Component({
  selector: 'wsm-menu-header',
  templateUrl: '_header.component.html'
})
export class MenuHeaderComponent {
  // @ViewChild(NavController) nav: NavController;

  constructor(
    public session: Session,
    // private nav: NavController
  ) {}

  logout() {
    this.session.destroy();
    // this.nav.setRoot(LoginPage);
  }
}
