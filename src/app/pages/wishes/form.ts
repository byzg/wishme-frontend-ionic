import { Component, ViewChild } from '@angular/core';

import { WishForm } from '../../forms';
import { Wishes } from '../../resourses/collections';
import { Wish } from '../../resourses/factories';

@Component({
  templateUrl: 'form.html'
})
export class WishFormPage {
  @ViewChild('titleInput') titleInput ;
  path = 'pages.wishes.form';
  wish = new Wish();
  wishForm: WishForm;

  constructor(wishes: Wishes) {
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
