import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { WishFormPage } from './form';
import { SelectMode } from '../../services';
import { Wishes } from '../../resourses/collections';
import { Wish } from '../../resourses/factories';

@Component({
  selector: 'wsm-wishes',
  templateUrl: '_wishes.html',
})
export class WishesPartial {
  path = 'pages.wishes';
  @Input() wishes: Wishes;
  @Input() selectMode: SelectMode;

  constructor(private nav: NavController) {}

  openForm = (wish: Wish | null)=> {
    this.nav.push(WishFormPage, { wish });
  }
}
