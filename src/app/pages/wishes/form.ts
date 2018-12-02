import { Component, ViewChild } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';

import { WishForm } from '../../forms';
import { Wishes } from '../../resourses/collections';
import { Wish } from '../../resourses/factories';
import { HomePage } from '../home';

@Component({
  templateUrl: 'form.html'
})
export class WishFormPage {
  path = 'pages.wishes.form';
  wish: Wish;
  wishForm: WishForm;
  navbarActions = [
    {
      name: 'checkmark',
      handler: ()=> {
        this.skipOnBack = true;
        this.wishForm.save().then(()=>
          this.nav.setRoot(HomePage)
        );
      }
    }
  ];
  private skipOnBack = false;

  constructor(
    private nav: NavController,
    navParams: NavParams,
    wishes: Wishes
  ) {
    this.wish = navParams.get('wish') || new Wish();
    this.wishForm = new WishForm(this.wish, wishes);
  }

  ionViewWillLeave() {
    if (!this.skipOnBack) {
      this.wishForm.save()
    }
    this.skipOnBack = false;
  }
}
