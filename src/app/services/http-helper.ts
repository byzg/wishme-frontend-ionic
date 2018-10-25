import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import humps from 'humps';
import qs from 'qs';
import * as _ from 'lodash';

import { environment } from '../../environments/environment';
import { ResponseHandler } from './request/response-handler';

class Request {
  private httpArgs: any[];

  constructor(
    private httpClient: HttpClient,
    private method: string,
    path: string,
    rawData: Object,
    opts: Object,
  ) {
    const url = this.url(path, opts['searches']);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      // uncoment it to get FULL response with HEADERS
      // observe: 'response'
    };
    const data = humps.decamelizeKeys(rawData);
    this.httpArgs = _.compact([url, data, options]);
  }

  response(): Observable<HttpResponse<any>> {
    return this.httpClient[this.method](...this.httpArgs)
  }

  getResponse(): Observable<HttpResponse<any>> {
    return this.response();
  }

  private url(path: string, searches?: Object): string {
    return `${environment.API_URL}/${path}${this.searches(searches)}`;
  }

  private searches(searches?: Object): string {
    return searches ? `?${qs.stringify(
      _.mapValues(humps.decamelizeKeys(searches), val => JSON.stringify(val))
    )}` : '';
  }
}


@Injectable()
export class HttpHelper {
  public _useLoader = false;

  constructor(
    private httpClient: HttpClient,
    private responseHandler: ResponseHandler
  ) {
  }

  get(path: string, searches?: Object): Promise<any> {
    return this.request('get', path, {}, { searches });
  }

  post(path, rawData, opts = {}): Promise<any> {
    return this.request('post', path, rawData, opts);
  }

  put(path, rawData, opts = {}): Promise<any> {
    return this.request('put', path, rawData, opts);
  }

  destroy(path, rawData, opts = {}): Promise<any> {
    return this.request('delete', path, rawData, opts);
  }

  private request(method, path, rawData, opts = {}): Promise<any> {
    const request = new Request(this.httpClient, method, path, rawData, opts);
    return this.responseHandler.wrap(()=> request.getResponse());
  }
}
