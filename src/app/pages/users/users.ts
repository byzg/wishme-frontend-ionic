import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';

import { WishesPage } from '../'
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

  openUserWishes(user: User) {
    this.nav.push(WishesPage);
  }
}
