import { Injectable } from '@angular/core';
import { AngularTokenService } from 'angular-token';

import { LocalStorage } from './local-storage';
import { ResponseHandler } from './request/response-handler';
import { User } from '../resourses/factories';
import { BaseFactory } from '../resourses/factories/base-factory';


@Injectable()
export class Session extends BaseFactory{
  user: User;
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
    )).then(({ body: { data: user }}) => {
      this.resetUser(new User(user));
      return this;
    }).catch(({ error }: { error: { errors: string[] } }) => {
      this.errors = error.errors;
      return Promise.reject(error)
    });
  }

  isNew(): boolean { return true }

  destroy() {
    this.tokenService.signOut().subscribe();
    this.localStorage.remove();
  }

  setAttrs({ user: attrs }): void {
    this.user.setAttrs(attrs)
  }

  resetUser(user: User) {
    this.user = user;
    this.user.password = null;
    this.localStorage.push(this.user.attrs);
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

  protected initAttrs() {
    this.user = new User(this.localStorage.pull());
  }
}
