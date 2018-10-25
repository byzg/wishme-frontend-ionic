import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import humps from 'humps';

import { Spinner } from '../spinner';

@Injectable()
export class ResponseHandler {
  constructor(
    private spinner: Spinner
  ) {}

  wrap(requestFn: ()=> Observable<HttpResponse<any>>): Promise<any> {
    this.spinner.toggle();
    const promise = requestFn()
      .map(res => humps.camelizeKeys(res))
      .toPromise();
    const finnaly = ()=> {
      this.spinner.toggle();
      return promise
    };
    return promise
      .then(()=> finnaly())
      .catch(()=> finnaly());
  }
}
