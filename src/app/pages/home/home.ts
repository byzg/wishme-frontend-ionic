import { Component} from '@angular/core';

import { SelectMode } from '../../services';
import { Wishes } from '../../resourses/collections';
import { Wish } from '../../resourses/factories';

@Component({
  templateUrl: 'home.html',
})
export class HomePage {
  path = 'pages.home';
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
    public wishes: Wishes,
  ) {
    this.selectMode = new SelectMode();
    wishes.index().then(()=> {
      this.selectMode.collection = wishes;
    });
  }
}
