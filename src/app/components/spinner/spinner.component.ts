import { Component } from '@angular/core';

import { Spinner} from '../../services';

@Component({
  selector: 'wsm-spinner',
  templateUrl: './spinner.component.html'
})
export class SpinnerComponent {
  constructor(public spinner: Spinner) { }
}
