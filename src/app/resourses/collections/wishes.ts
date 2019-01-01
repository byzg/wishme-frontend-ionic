import { Injectable } from '@angular/core';

import { BaseCollection } from './base-collection';
import { Wish } from '../factories';
import { BaseFactory } from "../factories/base-factory";

@Injectable()
export class Wishes extends BaseCollection<Wish> {
  protected _name: string = 'wishes';
  protected readonly Factory: new (rawDatum: Object) => BaseFactory = Wish;

  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
    this.createTable();
  }
}
