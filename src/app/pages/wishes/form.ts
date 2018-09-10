import { Component, ViewChild } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { WishForm } from '../../forms';
import { Wishes } from '../../resourses/collections';
import { Wish } from '../../resourses/factories';

@Component({
  templateUrl: 'form.html'
})
export class WishFormPage {
  @ViewChild('titleInput') titleInput ;
  path = 'pages.wishes.form';
  wish: Wish;
  wishForm: WishForm;

  constructor(navParams: NavParams, wishes: Wishes) {
    this.wish = navParams.get('wish') || new Wish();
    this.wishForm = new WishForm(this.wish, wishes);
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.titleInput.setFocus();
    },150);
  }

  ionViewWillLeave() {
    this.wishForm.save()
  }

}
