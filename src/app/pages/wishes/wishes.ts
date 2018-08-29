import { Component} from '@angular/core';

import { Wishes } from '../../resourses/collections';

@Component({
  selector: 'page-wishes',
  templateUrl: 'wishes.html'
})
export class WishesPage {
  path = 'pages.wishes';

  constructor(
    wishes: Wishes
  ) {
    wishes.index()
  }

}
