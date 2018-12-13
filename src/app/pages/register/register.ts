import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RegisterForm } from '../../forms';
import { User } from '../../resourses/factories';
import { ToastService, Session } from '../../services';
import { BaseCollection } from '../../resourses/collections';
import { LoginPage } from '../login/login';
import { HomePage } from '../home';

@Component({
  templateUrl: 'register.html'
})
export class RegisterPage {
  path = 'pages.register';
  user = new User();
  registerForm = new RegisterForm(
    this.user,
    new BaseCollection<User>()
  );

  constructor(
    private nav: NavController,
    private toastService: ToastService,
    private session: Session
  ) {}

  register() {
    this.registerForm.save()
      .then((user: User) => {
        this.session.resetUser(user);
        this.nav.setRoot(HomePage)
      })
      .catch(()=> {
        this.toastService.showModelError(this.user)
      })
  }

  loginPage() {
    this.nav.push(LoginPage);
  }
}
