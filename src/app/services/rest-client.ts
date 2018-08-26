import * as pluralize from 'pluralize';
import * as _ from 'lodash';

import { ServiceLocator } from './service-locator';
import { HttpHelper } from './http-helper';

interface IUrlMap {
  index: () => string
  show: (id: number) => string;
  create: () => string;
  update: (id: number) => string;
  destroy: (id: number) => string;
}

export class RestClient {
  static actionTypeMap = {
    index: 'get',
    show: 'get',
    create: 'post',
    update: 'put',
    destroy: 'delete'
  };

  public urlMap: IUrlMap;
  private httpClient: HttpHelper = ServiceLocator.injector.get(HttpHelper);
  private plural: string;

  constructor(public resourceName: string) {
    this.plural = pluralize(resourceName);
    this.urlMap = {
      index: () => this.plural,
      show: (id: number) => `${this.plural}/${id}`,
      create: () => this.plural,
      update: (id: number) => `${this.plural}/${id}`,
      destroy: (id: number) => `${this.plural}/${id}`
    };
  }

  index() {
    return this.action('index');
  }

  show(id: number) {
    return this.action('show', { id });
  }

  create(attributes) {
    return this.action('create', attributes);
  }

  update(attributes) {
    return this.action('update', attributes);
  }

  destroy(id: number) {
    return this.action('destroy', { id });
  }

  private action(actionName: string, attributes?): Promise<any> {
    const url = this.urlMap[actionName](attributes && attributes.id);
    const actionType = RestClient.actionTypeMap[actionName];
    return this.httpClient[actionType](url, _.omit(attributes, 'id'));
  }
}
