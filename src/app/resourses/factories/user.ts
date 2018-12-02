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
  name: string;
  email: string;
  password: string;
  errors: string[] = [];
  wishesCount: number;
  protected initAttrs() {
    this._attrs = {
      name: '',
      email: '',
      password: '',
      wishesCount: null,
    };
  };

  private tokenService: AngularTokenService
    = ServiceLocator.get(AngularTokenService);
  private responseHandler: ResponseHandler
    = ServiceLocator.get(ResponseHandler);

  create(): Promise<User> {
    return this.responseHandler.wrap(()=> (
      this.tokenService.registerAccount(this.toServerAttrs)
    )).then(({ data: attrs }) => {
      this.setAttrs(attrs);
      return this;
    }).catch(({ error }: { error: ReasonError }) => {
      this.errors = error.errors.full_messages;
      return Promise.reject(error)
    });
  }

  get toServerAttrs() {
    const { name, email, password } = <User>this.attrs;
    return { name, login: email, password, passwordConfirmation: password };
  }
}
