import * as _ from 'lodash';
import { Injectable } from '@angular/core';

import { BaseFactory } from '../factories/base-factory';
import { LF, Requester, RecordableObject } from '../../services';

@Injectable()
export class BaseCollection<T extends BaseFactory> extends Array<T> {
  protected _name: string;
  protected readonly Factory: new (rawDatum?: Object) => BaseFactory;
  loaded = false;

  constructor() {
    super();
    // WARN: some of the Array methods (map, splice etc.) entail
    // re-invoking the constructor. Keep this in mind if the constructor
    // code affects the entire application.
    // For example, creates tables in IndexedDB
    Object.setPrototypeOf(this, BaseCollection.prototype);
  }

  index(): Promise<any> {
    return this.requester.index().then((rawData) => {
      this.mergeAll(rawData);
      this.loaded = true;
    });
  }

  where(condition) {
    return _.filter(this, condition);
  }

  find(_arg) {
    const arg: any = _.isString(_arg) ? parseInt(_arg, 10) : _arg;
    if (_.isNumber(arg)) { return this.find({id: arg}); }
    return _.find(this, arg);
  }

  merge(rawDatum: RecordableObject): void {
    const resource: T = <T>new this.Factory(rawDatum);
    const oldResource: T = this.find(rawDatum.id);
    if (oldResource) {
      _.extend(oldResource, resource);
    } else {
      if (!resource.deletedAt) this.push(resource);
    }
  }

  destroy(item: T): Promise<any> {
    return this.requester.destroy(item.id).then(()=> {
      this.splice(this.indexOf(item), 1)
    });
  }

  sync() {
    return this.requester.sync().then((list: RecordableObject[]) => {
      this.length = 0;
      this.mergeAll(list);
    })
  }

  get isEmpty(): boolean {
    return this.loaded && this.length === 0;
  }

  get requester(): Requester {
    return new Requester(this._name)
  }

  protected mergeAll(data: RecordableObject[]) {
    _(data).each((datum) => this.merge(datum));
  }

  protected createTable(): void {
    if (!LF.getTable(this._name)) {
      LF.createTable(this._name, new this.Factory().schema);
      window.addEventListener('online',  this.sync.bind(this));
    }
  }
}
