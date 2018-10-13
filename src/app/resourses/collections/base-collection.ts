import * as _ from 'lodash';
import { Injectable } from '@angular/core';

import { BaseFactory } from '../factories/base-factory';
import { RestClient, LF, LFTable } from '../../services';

@Injectable()
export class BaseCollection<T extends BaseFactory> extends Array<T> {
  protected _name: string;
  protected readonly Factory: new (rawDatum?: Object) => BaseFactory;
  protected _restClient: RestClient;
  loaded = false;
  table: LFTable;

  constructor() {
    super();
    // WARN: some of the Array methods (map, splice etc.) entail
    // re-invoking the constructor. Keep this in mind if the constructor
    // code affects the entire application.
    // For example, creates tables in IndexedDB
    Object.setPrototypeOf(this, BaseCollection.prototype);
  }

  index(): Promise<any> {
    return this.restClient.index().then((rawData) => {
      _(rawData).each((rawDatum) => this.merge(rawDatum));
      this.loaded = true;
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
    this.table.insertOrReplace(rawDatum);
    const resource: T = <T>new this.Factory(rawDatum);
    const oldResource: T = this.find(rawDatum.id);
    if (oldResource) _.extend(oldResource, resource); else this.push(resource);
  }

  destroy(item: T): Promise<any> {
    return this.restClient.destroy(item.id).then(()=> {
      this.splice(this.indexOf(item), 1)
    });
  }

  get isEmpty(): boolean {
    return this.loaded && this.length === 0;
  }

  protected get restClient(): RestClient {
    if (!this._restClient) this._restClient = new RestClient(this._name);
    return this._restClient;
  }

  protected createTable(): void {
    this.table = LF.createTable(this._name, new this.Factory().schema);
  }
}
