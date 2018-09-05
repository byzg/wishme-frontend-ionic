import { Component} from '@angular/core';

import { WishForm } from '../../forms';
import { Wishes } from '../../resourses/collections';
import { Wish } from '../../resourses/factories';

@Component({
  templateUrl: 'form.html'
})
export class WishFormPage {
  path = 'pages.wishes.form';
  wish = new Wish();
  wishForm: WishForm;

  constructor(wishes: Wishes) {
    this.wishForm = new WishForm(this.wish, wishes);
  }

}
