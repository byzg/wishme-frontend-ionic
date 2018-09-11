import { Component, Input } from '@angular/core';

import { Wish } from '../../resourses/factories';
import { SelectMode } from '../../services';

@Component({
  selector: 'wsm-wish',
  templateUrl: '_wish.html',
})
export class WishPartial {
  @Input() wish: Wish;
  @Input() selectMode: boolean;
  @Input() openForm: SelectMode;

  handleClick() {
    if (this.selectMode.enabled) this.selectMode.toggle(this.wish);
  }
}
