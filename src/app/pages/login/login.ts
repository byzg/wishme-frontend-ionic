import { Component} from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { SessionForm } from '../../forms';
import { Session } from '../../resourses/factories';
import { BaseCollection } from '../../resourses/collections';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  path = 'pages.login';
  sessionForm: SessionForm;

  constructor(
    public nav: NavController,
    public menu: MenuController,
    public session: Session,
  ) {
    this.menu.swipeEnable(false);
    this.sessionForm = new SessionForm(this.session, new BaseCollection<Session>());
  }

  login() {
    this.sessionForm.save()
    // .then(() => this.nav.setRoot(HomePage));
  }

}
