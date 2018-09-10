import { FormGroup, Validators } from '@angular/forms';

import { BaseForm } from './base-form'
import { Wish } from '../resourses/factories/wish';

export class WishForm extends BaseForm {
  protected model: Wish;

  buildGroup(): FormGroup {
    const { title, text, price } = this.model;
    this.group = this.formBuilder.group({
      title,
      text,
      price
    });
    return this.group;
  }
}
