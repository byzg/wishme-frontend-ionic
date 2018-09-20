import * as _ from 'lodash';
import { AngularTokenService } from 'angular-token';

import { BaseFactory } from './base-factory';
import { ServiceLocator, ResponseHandler } from '../../services';

export interface ReasonError {
  errors: {
    full_messages: string[]
  }
}

export class User extends BaseFactory {
  protected readonly _name = 'user';
  attrs: {
    name: string,
    email: string,
    password: string,
  };
  errors: string[] = [];

  private tokenService: AngularTokenService
    = ServiceLocator.get(AngularTokenService);
  private responseHandler: ResponseHandler
    = ServiceLocator.get(ResponseHandler);

  create(): Promise<User> {
    return this.responseHandler.wrap(()=> (
      this.tokenService.registerAccount(this.serverData())
    )).then(record => {
      _.extend(this, record);
      return this;
    }).catch(({ error }: { error: ReasonError }) => {
      this.errors = error.errors.full_messages;
      return Promise.reject(error)
    });
  }

  protected serverData() {
    const { name, email, password } = this.attrs;
    return { name, login: email, password };
  }
}
