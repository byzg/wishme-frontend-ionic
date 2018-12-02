import { Component} from '@angular/core';

import { Session } from '../../services';

@Component({
  selector: 'wsm-home-user',
  templateUrl: '_user.html',
})
export class HomeUserPartial {
  path = 'pages.home.user';

  constructor(public session: Session) {}
}
