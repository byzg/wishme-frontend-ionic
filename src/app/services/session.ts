import { Injectable } from '@angular/core';
import { AngularTokenService } from 'angular-token';

import { LocalStorage } from './local-storage';
import { ResponseHandler } from './response-handler';
import { User } from '../resourses/factories';
import { BaseFactory } from '../resourses/factories/base-factory';


@Injectable()
export class Session extends BaseFactory{
  user: User = new User(this.localStorage.pull());
  protected readonly _name: string = 'session';
  private _localStorage: LocalStorage;
  errors: string[] = [];

  constructor(
    private tokenService: AngularTokenService,
    private responseHandler: ResponseHandler
  ) {
    super()
  }

  create(): Promise<Session> {
    return this.responseHandler.wrap(()=> (
      this.tokenService.signIn(this.toServerAttrs)
    )).then(record => {
      delete this.user.password;
      this.localStorage.push(this.user.attrs);
      return this;
    }).catch(({ error }: { error: { errors: string[] } }) => {
      this.errors = error.errors;
      return Promise.reject(error)
    });
  }

  destroy() {
    this.tokenService.signOut().subscribe();
    this.localStorage.remove();
  }

  setAttrs(data): void {
    this.user.setAttrs(data.user)
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
