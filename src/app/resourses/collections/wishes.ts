import { Injectable } from '@angular/core';

import { BaseCollection } from './base-collection';
import { Wish } from '../factories';

@Injectable()
export class Wishes extends BaseCollection<Wish> {
  protected _name: string = 'wishes';
  protected readonly Factory: new (rawDatum: Object) => {} = Wish;

  constructor() {
    super();
    Object.setPrototypeOf(this, Wishes.prototype);
  }
}
