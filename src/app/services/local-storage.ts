import _ from 'lodash';

export class LocalStorage {
  constructor(public key: string) {};

  push(value: any): void {
    let forPush: Object = _.isObject(value) ? _.merge(this.pull(), value) : value;
    localStorage.setItem(this.key, JSON.stringify(forPush))
  }

  pull(): Object {
    return JSON.parse(localStorage.getItem(this.key)) || {};
  }

  remove(): void {
    localStorage.removeItem(this.key);
  }
}
