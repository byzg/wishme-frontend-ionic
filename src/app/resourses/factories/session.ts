import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { AngularTokenService } from 'angular-token';

import { BaseFactory } from './base-factory';
import { User } from './user';
import { LocalStorage, ServiceLocator, ResponseHandler } from '../../services';

interface ReasonError {
  errors: string[],
  success: boolean
}

@Injectable()
export class Session extends BaseFactory implements ReasonError{
  private tokenService: AngularTokenService
    = ServiceLocator.get(AngularTokenService);
  private responseHandler: ResponseHandler
    = ServiceLocator.get(ResponseHandler);

  user: User = new User(this.localStorage.pull());
  protected readonly _name: string = 'session';
  private _localStorage: LocalStorage;
  errors: string[] = [];
  success: boolean;

  create(): Promise<Session> {
    return this.responseHandler.wrap(()=> (
      this.tokenService.signIn(this.serverData())
    )).then(record => {
      _.extend(this, record)
      delete this.user.password;
      this.localStorage.push(this.user);
      return this;
    }).catch(({ error }: { error: ReasonError }) => {
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
    const { email, password } = this.user;
    return { login: email, password };
  }
}
