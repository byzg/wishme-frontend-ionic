import * as _ from 'lodash';

import { RestClient } from '../../services/rest-client';

export class BaseFactory {
  protected readonly _name: string;
  protected _restClient: RestClient;
  protected _attrs: Object;
  protected dirty = {};

  constructor(data: Object = {}) {
    this.initAttrs();
    this.setAttrs(data);
  }

  isNew(): boolean {
    return !_.isNumber(this.id);
  }

  create(): Promise<Object> {
    return this.restClient.create(this.attrs)
      .then(record => {
        this.setAttrs(record);
        return this;
      });
  }

  update(): Promise<Object> {
    return this.restClient.update(this.attrs);
  }

  save() {
    return this.isNew() ? this.create() : this.update();
  }

  setAttrs(data): void {
    _(data).each((attr, val)=> {
      if (Object.keys(this._attrs).includes(attr)) this[attr] = val
    })
  }

  get attrs(): Object {
    return _.pickBy(this._attrs, (attr)=> this.dirty[attr])
  }

  private commonAttrs = ()=> {
    return {
      id: 0,
      updatedAt: ''
    }
  };

  protected get restClient(): RestClient {
    if (!this._restClient) { this._restClient = new RestClient(this._name); }
    return this._restClient;
  }

  protected initAttrs(): void {
    _(this._attrs).extend(this.commonAttrs()).each(attr => {
      this.dirty[attr] = false;
      Object.defineProperty(this, attr, {
        get: ()=> this.attrs[attr],
        set: (val)=> {
          this.dirty[attr] = true;
          this._attrs[attr] = val;
        }
      })
    })
  }
}
