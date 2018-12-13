import * as pluralize from 'pluralize';
import * as _ from 'lodash';

import { ServiceLocator } from '../service-locator';
import { Session } from '../session';
import { ToastService } from '../toast-service';
import { HttpHelper } from '../http-helper';
import {HttpErrorResponse} from "@angular/common/http";

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
    destroy: 'destroy'
  };

  public urlMap: IUrlMap;
  private httpClient: HttpHelper = ServiceLocator.injector.get(HttpHelper);
  private session: Session = ServiceLocator.injector.get(Session);
  private toastService: ToastService = ServiceLocator.injector.get(ToastService);
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

  index(params = {}) {
    return this.action('index', params);
  }

  show(id) {
    return this.action('show', { id });
  }

  create(attributes) {
    return this.action('create', attributes);
  }

  update(attributes) {
    return this.action('update', attributes);
  }

  destroy(id) {
    return this.action('destroy', { id });
  }

  private action(actionName: string, attributes?): Promise<any> {
    const url = this.urlMap[actionName](attributes && attributes.id);
    const actionType = RestClient.actionTypeMap[actionName];
    const request = this.httpClient[actionType](url, _.omit(attributes, 'id'));
    return request.catch((httpErrorResponse: HttpErrorResponse) => {
      this.toastService.showHttpError(httpErrorResponse.status);
      if (httpErrorResponse.status == 401) {
        this.session.destroy();
      }
      return Promise.reject(httpErrorResponse.message)
    })
  }
}
