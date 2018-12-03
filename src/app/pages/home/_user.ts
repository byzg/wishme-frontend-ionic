import { Component, Input } from '@angular/core';

import { User } from '../../resourses/factories/user';

@Component({
  selector: 'wsm-home-user',
  templateUrl: '_user.html',
})
export class HomeUserPartial {
  path = 'pages.home.user';
  @Input() user: User;
}
