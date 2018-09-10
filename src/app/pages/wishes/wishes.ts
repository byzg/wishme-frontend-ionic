import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';
import * as _ from 'lodash';

import { WishFormPage } from './form';
import { Wishes } from '../../resourses/collections';
import { Wish } from '../../resourses/factories';

@Component({
  templateUrl: 'wishes.html',
})
export class WishesPage {
  path = 'pages.wishes';
  selectMode = false;

  constructor(
    private nav: NavController,
    public wishes: Wishes
  ) {
    wishes.index()
  }

  goToForm(wish: Wish | null) {
    if (this.selectMode) return;
    this.nav.push(WishFormPage, { wish });
  }

  toggleSelected(wish: Wish) {
    wish.selected = !wish.selected;
    this.selectMode = _.some(this.wishes, 'selected');
  }

  handleWishClick(wish: Wish) {
    if (this.selectMode) this.toggleSelected(wish);
  }

}
