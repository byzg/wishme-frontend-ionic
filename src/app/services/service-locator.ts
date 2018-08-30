import { Injector } from '@angular/core';

export class ServiceLocator {
  static injector: Injector;

  static get(token) {
    return this.injector.get(token)
  }
}
