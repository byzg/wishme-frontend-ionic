import { Injectable } from '@angular/core';

import { BaseCollection } from './base-collection';
import { User } from '../factories';
import { BaseFactory } from "../factories/base-factory";

@Injectable()
export class Users extends BaseCollection<User> {
  protected _name: string = 'users';
  protected readonly Factory: new (rawDatum: Object) => BaseFactory = User;

  constructor() {
    super();
    Object.setPrototypeOf(this, Users.prototype);
    this.createTable();
  }
}
