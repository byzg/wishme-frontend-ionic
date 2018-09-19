import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../../pages';
import { Session } from '../../resourses/factories';

@Component({
  selector: 'wsm-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  @Input() actions: Object[] = [];
  constructor(
    private session: Session,
    private nav: NavController
  ) { }

  logout() {
    this.session.destroy();
    this.nav.setRoot(LoginPage);
  }
}
