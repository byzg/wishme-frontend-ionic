import { Component} from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

import { SessionForm } from '../../forms';
import { Session, ToastService } from '../../services';
import { HomePage } from '../home';
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
    private toastService: ToastService,
  ) {
    this.menu.swipeEnable(false);
    this.sessionForm = new SessionForm(this.session);
  }

  login() {
    this.sessionForm.save()
      .then(() => {
        this.nav.setRoot(HomePage)
      })
      .catch(()=> {
        this.toastService.showModelError(this.session)
      })
  }

  register() {
    this.nav.push(RegisterPage)
  }

}
