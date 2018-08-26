import { FormGroup, Validators } from '@angular/forms';

import { BaseForm } from './base-form'
import { Session } from '../resourses/factories/session';

export class SessionForm extends BaseForm {
  protected model: Session;

  buildGroup(): FormGroup {
    this.group = this.formBuilder.group({
      user: this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
      })
    });
    return this.group;
  }
}
