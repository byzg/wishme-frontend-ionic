import { Injectable } from '@angular/core';
import * as _ from 'lodash';

import { BaseFactory } from './base-factory';
import { User } from './user';
import { LocalStorage } from '../../services/local-storage';

interface ReasonError {
  errors: string[],
  success: boolean
}

@Injectable()
export class Session extends BaseFactory implements ReasonError{
  user: User = new User(this.localStorage.pull());
  protected readonly _name: string = 'session';
  private _localStorage: LocalStorage;
  errors: string[] = [];
  success: boolean;

  constructor(data: Object = {}) {
    super(data);
    Object.assign(this.restClient.urlMap, {
      create: () => 'auth/sign_in',
    });
  }

  create(): Promise<Session> {
    return super.create()
      .then(() => {
        delete this.user.password;
        this.localStorage.push(this.user);
        return this;
      })
      .catch(({ error }: { error: ReasonError }) => {
        _.extend(this, error);
        return Promise.reject(error)
      });
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
