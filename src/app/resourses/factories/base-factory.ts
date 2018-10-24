import * as _ from 'lodash';

import { Requester, RecordableObject } from '../../services';

export class BaseFactory implements RecordableObject {
  protected readonly _name: string;
  protected _attrs: Object = {};
  protected _schema: Object = {};
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

  create(): Promise<Object> {
    return this.requester.create(this.attrs)
      .then(record => {
        this.setAttrs(record);
        return this;
      });
  }

  update(): Promise<Object> {
    return this.requester.update(this.attrs)
  }

  save() {
    return this.isNew() ? this.create() : this.update();
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
    // NOTE: destructuring and lodash extend is not same
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
}
