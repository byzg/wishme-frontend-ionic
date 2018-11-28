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
        this.wishes.forEach((wish: Wish)=> {
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
    this.selectMode = new SelectMode();
    wishes.index().then(()=> {
      this.selectMode.collection = wishes;
    });

  }

  openForm = (wish: Wish | null)=> {
    this.nav.push(WishFormPage, { wish });
  }
}
