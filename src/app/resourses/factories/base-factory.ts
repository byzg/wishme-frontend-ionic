import * as _ from 'lodash';

import { RestClient } from '../../services/rest-client';

export class BaseFactory {
  id: number;
  updatedAt: string;
  protected readonly _name: string;
  protected _restClient: RestClient;
  constructor(data: Object = {}) {
    _.extend(this, data);
    if (this.isNew()) { _.defaults(this, this.defaultNewData()); }
  }

  defaultNewData(): Object {
    return {};
  }

  isNew(): boolean {
    return !_.isNumber(this.id);
  }

  create(): Promise<Object> {
    return this.restClient.create(this.serverData()).then(record => {
      _.extend(this, record);
      return this;
    });
  }

  update(): Promise<Object> {
    return this.restClient.update(this.serverData());
  }

  save() {
    return this.isNew() ? this.create() : this.update();
  }

  protected serverData() {
    return _.pick(this, _.filter(Object.getOwnPropertyNames(this), (k) => k[0] !== '_'));
  }

  protected get restClient(): RestClient {
    if (!this._restClient) { this._restClient = new RestClient(this._name); }
    return this._restClient;
  }
}
