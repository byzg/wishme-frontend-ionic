import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { SelectMode, Session } from '../../services';
import { Wishes } from '../../resourses/collections';
import { Wish, User } from '../../resourses/factories';
import { WishFormPage } from '../wishes';

@Component({
  templateUrl: 'home.html',
})
export class HomePage {
  path = 'pages.home';
  selectMode: SelectMode;
  user: User;
  isCurrentUser: boolean;
  navbarActions = [
    {
      name: 'trash',
      handler: ()=> {
        this.user.wishes.forEach((wish: Wish)=> {
          if (this.selectMode.isSelected(wish))
            this.wishesCollection.destroy(wish);
        })
      },
      isShown: ()=> this.selectMode.isActive
    }
  ];

  constructor(
    private navParams: NavParams,
    private nav: NavController,
    private wishesCollection: Wishes,
    private session: Session
  ) {
    this.user = this.navParams.get('user') || session.user;
    this.isCurrentUser = this.user === session.user || true;
    this.selectMode = new SelectMode();
    this.selectMode.enabled = this.isCurrentUser;

    this.user.wishes.exec().then(()=> {
      this.selectMode.collection = this.user.wishes
    })
  }

  ionViewDidEnter(){

  }

  openWishForm = (wish: Wish | null)=> {
    this.isCurrentUser && this.nav.push(WishFormPage, { wish });
  }
}
