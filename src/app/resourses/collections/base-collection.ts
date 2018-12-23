import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { BaseFactory } from '../factories/base-factory';
import { LF, Requester, RecordableObject } from '../../services';

@Injectable()
export class BaseCollection<T extends BaseFactory> extends Array<T> {
  protected _name: string;
  protected readonly Factory: new (rawDatum?: Object) => BaseFactory;
  protected _emitter = new BehaviorSubject(null);
  loaded = false;

  constructor() {
    super();
    // WARN: some of the Array methods (map, splice etc.) entail
    // re-invoking the constructor. Keep this in mind if the constructor
    // code affects the entire application.
    // For example, creates tables in IndexedDB
    Object.setPrototypeOf(this, BaseCollection.prototype);
  }

  index(params = {}): Promise<any> {
    return this.requester.index(params).then((rawData) => {
      this.mergeAll(rawData);
      this.emit();
      this.loaded = true;
    });
  }

  create(attrs) {
    const resource: T = <T>new this.Factory(attrs);
    return resource.save(attrs)
      .then((model: T)=> {
        this.push(model);
        this.emit();
        return model;
      })
  }

  where(condition) {
    return _.filter(this, condition);
  }

  find(arg) {
    return _.find(
      this,
      _.isObject(arg) ? arg : { id: arg }
    );
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
      this.splice(this.indexOf(item), 1);
      this.emit();
    });
  }

  sync() {
    return this.requester.sync().then((list: RecordableObject[]) => {
      this.length = 0;
      this.mergeAll(list);
    })
  }

  emit() {
    this._emitter.next(null);
  }

  subscribe(callback) {
    this._emitter.subscribe(callback);
  }

  get className(): string {
    return this._name;
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
