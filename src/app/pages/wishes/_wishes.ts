import { Component, Input } from '@angular/core';

import { SelectMode } from '../../services';
import { Wishes } from '../../resourses/collections';

@Component({
  selector: 'wsm-wishes',
  templateUrl: '_wishes.html',
})
export class WishesPartial {
  path = 'pages.wishes';
  @Input() wishes: Wishes;
  @Input() selectMode: SelectMode;
  @Input() openForm: Function;
}
