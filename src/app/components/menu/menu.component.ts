import { Component, Input } from '@angular/core';
import { NavController, App } from 'ionic-angular';

import { UsersPage } from '../../pages';

export interface MenuItem {
  title: string;
  component: any;
  icon: string;
}

@Component({
  selector: 'wsm-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent {
  @Input() content: any;

  appMenuItems: MenuItem[] = [
    {
      title: 'Люди',
      icon: 'home',
      component: UsersPage
    }
  ];

  constructor(private app: App) {}

  get navCtrl(): NavController {
    return this.app.getActiveNavs()[0]
  }

  openPage(page) {
    this.navCtrl.push(page.component);
  }
}
