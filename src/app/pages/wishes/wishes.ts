import { Component} from '@angular/core';
import { NavController } from 'ionic-angular';

import { WishFormPage } from './form';
import { SelectMode } from '../../services';
import { Wishes } from '../../resourses/collections';
import { Wish } from '../../resourses/factories';

@Component({
  templateUrl: 'wishes.html',
})
export class WishesPage {
  path = 'pages.wishes';
  selectMode: SelectMode;
  navbarActions = [
    {
      name: 'trash',
      handler: ()=> {
        this.wishes.map((wish: Wish)=> {
          if (this.selectMode.isSelected(wish)) this.wishes.destroy(wish)
        })
      },
      isShown: ()=> this.selectMode.enabled
    }
  ];

  constructor(
    private nav: NavController,
    public wishes: Wishes
  ) {
    wishes.index();
    this.selectMode = new SelectMode(wishes);
  }

  openForm = (wish: Wish | null)=> {
    this.nav.push(WishFormPage, { wish });
  }
}
