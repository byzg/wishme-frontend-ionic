import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';

import { WishFormPage } from './form';
import { Wishes } from '../../resourses/collections';

@Component({
  templateUrl: 'wishes.html'
})
export class WishesPage {
  path = 'pages.wishes';

  constructor(
    private nav: NavController,
    wishes: Wishes
  ) {
    wishes.index()
  }

  goToForm() {
    this.nav.push(WishFormPage);
  }

}
