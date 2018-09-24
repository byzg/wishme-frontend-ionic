import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { AngularTokenService } from 'angular-token';

import { LocalStorage } from './local-storage';
import { ResponseHandler } from './response-handler';
import { User } from '../resourses/factories';

interface ReasonError {
  errors: string[],
  success: boolean
}

@Injectable()
export class Session implements ReasonError{
  user: User = new User(this.localStorage.pull());
  protected readonly _name: string = 'session';
  private _localStorage: LocalStorage;
  errors: string[] = [];
  success: boolean;

  constructor(
    private tokenService: AngularTokenService,
    private responseHandler: ResponseHandler
  ) {}

  create(): Promise<Session> {
    return this.responseHandler.wrap(()=> (
      this.tokenService.signIn(this.toServerAttrs)
    )).then(record => {
      _.extend(this, record);
      delete this.user.password;
      this.localStorage.push(this.user);
      return this;
    }).catch(({ error }: { error: ReasonError }) => {
      _.extend(this, error);
      return Promise.reject(error)
    });
  }

  destroy() {
    this.tokenService.signOut().subscribe();
    this.localStorage.remove();
  }

  get localStorage() {
    if (!this._localStorage) {
      this._localStorage = new LocalStorage('currentUser');
    }
    return this._localStorage;
  }

  get toServerAttrs() {
    const { email, password } = this.user;
    return { login: email, password };
  }
}
