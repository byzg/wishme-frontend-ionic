import { Component} from '@angular/core';
import { NavController, MenuController, ToastController } from 'ionic-angular';

import { SessionForm } from '../../forms';
import { Session } from '../../resourses/factories';
import { BaseCollection } from '../../resourses/collections';
import { WishesPage } from '../wishes/wishes';

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
    private toastCtrl: ToastController
  ) {
    this.menu.swipeEnable(false);
    this.sessionForm = new SessionForm(this.session, new BaseCollection<Session>());
  }

  login() {
    this.sessionForm.save()
      .then(() => {
        if (this.session.isLoggedIn) {
          this.nav.setRoot(WishesPage)
        } else {
          this.toastCtrl.create({
            showCloseButton: false,
            message: this.session.errors.join('\n'),
            position: 'bottom',
            duration: 7000
          }).present();
        }
      })
  }

}
