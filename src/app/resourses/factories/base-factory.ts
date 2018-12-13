import * as _ from 'lodash';

import { Requester, RecordableObject, ServiceLocator } from '../../services';
import { BaseCollection, Relations } from '../collections';

export class BaseFactory implements RecordableObject {
  protected readonly _name: string;
  protected _attrs: Object = {};
  protected _schema: Object = {};
  protected _relations: Object = {};
  id: string;
  updatedAt: string;
  deletedAt: string;

  constructor(data: Object = {}) {
    this.initAttrs();
    this.setupAttrs(data);
  }

  isNew(): boolean {
    return !this.id;
  }

  create(attrs: Object = {}): Promise<Object> {
    this.setAttrs(attrs);
    return this.requester.create(this.attrs);

  }

  update(attrs: Object): Promise<Object> {
    return this.requester.update({ ...attrs, id: this.id });
  }

  save(attrs: Object = {}): Promise<Object> {
    return (this.isNew() ? this.create(attrs) : this.update(attrs))
      .then(record => {
        this.setAttrs(record);
        return this;
      });
  }

  setAttrs(data): void {
    _(data).each((val, attr)=> {
      if (_.has(this._attrs, attr)) this[attr] = val
    })
  }

  get attrs() {
    return this._attrs
  }

  get schema() {
    return this._schema
  }

  private commonAttrs = (): RecordableObject=> {
    return {
      id: null,
      updatedAt: null,
      deletedAt: null
    }
  };

  get requester(): Requester {
    return new Requester(this._name)
  }

  protected initAttrs() {}

  protected setupAttrs(data: Object): void {
    // NOTE: destructuring is not the same lodash.extend
    // see a = {foo: 2}; b = {bar: 3}; c = _.extend(a, b); a.foo = 8; c.foo;
    _.extend(this._attrs, this.commonAttrs());
    this._schema = { ...this._attrs };
    _(this._attrs).each((val, attr)=> {
      this._attrs[attr] = data[attr]
    });
    _.each(this._attrs, (val, attr) => {
      Object.defineProperty(this, attr, {
        get: ()=> this.attrs[attr],
        set: (val)=> this._attrs[attr] = val
      })
    })
  }

  protected hasMany(CollectionClass): void {
    const collection = ServiceLocator.get(CollectionClass);
    const name: string = collection.className;
    if (this._relations[name])
      throw `Already hasMany ${name} for ${this._name}`;
    const q = { userId: parseInt(this.id) };
    Object.defineProperty(this, name, {
      get: ()=> {
        if (this._relations[name]) return this._relations[name];
        this._relations[name] = new Relations(collection, q);
        return this._relations[name];
      }
    })
  }
}
