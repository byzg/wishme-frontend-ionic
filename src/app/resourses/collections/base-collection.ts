import * as _ from 'lodash';
import { Injectable } from '@angular/core';

import { RestClient } from '../../services/rest-client';

@Injectable()
export class BaseCollection<T> extends Array<T> {
  protected _name: string;
  protected readonly Factory: new (rawDatum: Object) => {};
  protected _restClient: RestClient;

  constructor() {
    super();
    Object.setPrototypeOf(this, BaseCollection.prototype);
  }

  index(): Promise<any> {
    return this.restClient.index().then((rawData) => {
      _(rawData).each((rawDatum) => this.merge(rawDatum));
    });
  }

  show(id: number): Promise<any> {
    return this.restClient.show(id).then((rawDatum) => this.merge(rawDatum));
  }

  where(condition) {
    return _.filter(this, condition);
  }

  find(_arg) {
    const arg: any = _.isString(_arg) ? parseInt(_arg, 10) : _arg;
    if (_.isNumber(arg)) { return this.find({id: arg}); }
    return _.find(this, arg);
  }

  merge(rawDatum: { id: number }): void {
    const resource: T = <T>new this.Factory(rawDatum);
    const oldResource = this.find(rawDatum.id);
    if (oldResource) _.extend(oldResource, resource); else this.push(resource);
  }

  protected get restClient(): RestClient {
    if (!this._restClient) this._restClient = new RestClient(this._name);
    return this._restClient;
  }
}
