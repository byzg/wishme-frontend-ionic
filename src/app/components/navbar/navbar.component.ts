import { Component, Input } from '@angular/core';

@Component({
  selector: 'wsm-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  @Input() actions: Object[] = [];
}
