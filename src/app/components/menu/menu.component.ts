import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LoginPage } from '../../pages';
import { Session } from '../../services';

@Component({
  selector: 'wsm-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent {
  @Input() content: any;
}
