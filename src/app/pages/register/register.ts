import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RegisterForm } from '../../forms';
import { User } from '../../resourses/factories';
import { ToastService } from '../../services';
import { BaseCollection } from '../../resourses/collections';
import { LoginPage } from '../login/login';

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
    private toastService: ToastService
  ) {}

  register() {
    this.registerForm.save()
      .then(() => this.loginPage())
      .catch(()=> {
        this.toastService.modelError(this.user)
      })
  }

  loginPage() {
    this.nav.setRoot(LoginPage);
  }
}
