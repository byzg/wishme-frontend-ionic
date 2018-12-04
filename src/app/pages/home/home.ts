import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { SelectMode, Session } from '../../services';
import { Wishes } from '../../resourses/collections';
import { Wish, User } from '../../resourses/factories';

@Component({
  templateUrl: 'home.html',
})
export class HomePage {
  path = 'pages.home';
  selectMode: SelectMode;
  user: User;
  navbarActions = [
    {
      name: 'trash',
      handler: ()=> {
        this.wishes.forEach((wish: Wish)=> {
          if (this.selectMode.isSelected(wish)) this.wishes.destroy(wish)
        })
      },
      isShown: ()=> this.selectMode.enabled
    }
  ];

  constructor(
    public wishes: Wishes,
    private navParams: NavParams,
    private session: Session
  ) {
    this.user = this.navParams.get('user') || session.user;
    this.selectMode = new SelectMode();

    this.user.wishes.exec().then(()=> {
      this.selectMode.collection = this.user.wishes
    })
  }
}
