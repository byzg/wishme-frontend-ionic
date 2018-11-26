import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';

// import { Users } from '../../resourses/collections';
// import { Wish } from '../../resourses/factories';

@Component({
  templateUrl: 'users.html',
})
export class UsersPage {
  path = 'pages.users';

  constructor(
    private nav: NavController,
    // public users: Users
  ) {
    // this.selectMode = new SelectMode();
    // users.index().then(()=> {
    //   this.selectMode.collection = users;
    // });
  }

  // openForm = (wish: Wish | null)=> {
  //   this.nav.push(WishFormPage, { wish });
  // }
}
