import { Injectable } from '@angular/core';
import * as _ from 'lodash';
// cimport Cookies from 'js-cookie';

import { BaseFactory } from './base-factory';
import { User } from './user';
import { LocalStorage } from '../../services/local-storage';

// const tokenKey = 'Auth-Token';

@Injectable()
export class Session extends BaseFactory {
  user: User = new User(this.localStorage.pull());
  protected readonly _name: string = 'session';
  private _localStorage: LocalStorage;
  errors: string[] = [];

  constructor(data: Object = {}) {
    super(data);
    Object.assign(this.restClient.urlMap, {
      create: () => 'auth/sign_in',
    });
  }

  get isLoggedIn(): boolean {
    return true;
    // const token: string = Cookies.get(tokenKey);
    // return token && token.length > 0;
  }

  create(): Promise<Session> {
    return super.create()
      .then(() => {
        delete this.user.password;
        this.localStorage.push(this.user);
        return this;
      })
      .catch(reason => _.extend(this, reason.error));
  }

  destroy() {
    this.localStorage.remove();
    this.user = new User();
    // Cookies.remove(tokenKey);
  }

  get localStorage() {
    if (!this._localStorage) {
      this._localStorage = new LocalStorage('currentUser');
    }
    return this._localStorage;
  }

  protected serverData() {
    return this.user;
  }
}
