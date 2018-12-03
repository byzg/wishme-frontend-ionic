import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home'
import { Users } from '../../resourses/collections';
import { User } from '../../resourses/factories';

@Component({
  templateUrl: 'users.html',
})
export class UsersPage {
  path = 'pages.users';

  constructor(
    private nav: NavController,
    public users: Users
  ) {
    users.index()
  }

  openUserHome(user: User) {
    this.nav.push(HomePage, { user });
  }
}
