import { Component} from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { SessionForm } from '../../forms';
import { Session } from '../../resourses/factories';
import { ToastService } from '../../services';
import { BaseCollection } from '../../resourses/collections';
import { WishesPage } from '../wishes/wishes';
import { RegisterPage } from '../register/register';

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
    private toastService: ToastService
  ) {
    this.menu.swipeEnable(false);
    this.sessionForm = new SessionForm(
      this.session,
      new BaseCollection<Session>()
    );
  }

  login() {
    this.sessionForm.save()
      .then(() => {
        this.nav.setRoot(WishesPage)
      })
      .catch(()=> {
        this.toastService.modelError(this.session)
      })
  }

  register() {
    this.nav.setRoot(RegisterPage)
  }

}
