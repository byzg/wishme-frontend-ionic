import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import humps from 'humps';
import qs from 'qs';
import * as _ from 'lodash';

import { Spinner } from './spinner';
import { environment } from '../../environments/environment';

class Request {
  private httpArgs: any[];
  private observableResponse: Observable<HttpResponse<any>>;

  constructor(
    private httpClient: HttpClient,
    private method: string,
    private path: string,
    private rawData: Object,
    private opts: Object,
  ) {
    const url = this.url(path, opts['searches']);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const data = humps.decamelizeKeys(rawData);
    this.httpArgs = _.compact([url, data, options]);
  }

  run(): Request {
    this.observableResponse = this.httpClient[this.method](...this.httpArgs);
    return this;
  }

  response(): Promise<any> {
    return this.run().observableResponse.map(res => humps.camelizeKeys(res))
      .toPromise();
  }

  getResponse(): Promise<any> {
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
    private spinner: Spinner
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

  private async request(method, path, rawData, opts = {}): Promise<any> {
    const request = new Request(this.httpClient, method, path, rawData, opts);
    this.spinner.toggle();
    try {
      return await request.getResponse();
    } catch (reason) {
      return Promise.reject(reason);
    } finally {
      this.spinner.toggle();
    }
  }
}
