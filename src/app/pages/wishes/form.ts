import { Component, ViewChild } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { WishForm } from '../../forms';
import { Wishes } from '../../resourses/collections';
import { Wish } from '../../resourses/factories';

@Component({
  templateUrl: 'form.html'
})
export class WishFormPage {
  path = 'pages.wishes.form';
  wish: Wish;
  wishForm: WishForm;

  constructor(navParams: NavParams, wishes: Wishes) {
    this.wish = navParams.get('wish') || new Wish();
    this.wishForm = new WishForm(this.wish, wishes);
  }

  ionViewWillLeave() {
    this.wishForm.save()
  }

}
