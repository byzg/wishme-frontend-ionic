import * as _ from 'lodash';

import { Requester, RecordableObject } from '../../services';

export class BaseFactory implements RecordableObject {
  protected readonly _name: string;
  protected _attrs: Object;
  id: number;
  updatedAt: string;
  deletedAt: string;

  constructor(data: Object = {}) {
    setTimeout(()=> {
      this.initAttrs();
      this.setAttrs(data);
    });
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
    return this._attrs;
  }

  get schema(): Object {
    return _.extend(this._attrs, this.commonAttrs())
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

  protected initAttrs(): void {
    _.each(this.schema, (val, attr) => {
      Object.defineProperty(this, attr, {
        get: ()=> this.attrs[attr],
        set: (val)=> this._attrs[attr] = val
      })
    })
  }
}
