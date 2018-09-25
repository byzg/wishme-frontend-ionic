import { FormGroup, Validators } from '@angular/forms';

import { BaseForm } from './base-form'
import { User } from '../resourses/factories';

export class RegisterForm extends BaseForm {
  protected model: User;

  buildGroup(): FormGroup {
    this.group = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    return this.group;
  }
}
