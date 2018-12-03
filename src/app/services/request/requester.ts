import * as _ from 'lodash';

import { RestClient } from './rest-client';
import { OfflineRequester } from './offline-requester';
import { Synchronizer } from './synchronizer';

export interface RecordableObject {
  id: string,
  updatedAt: string,
  deletedAt: string
}

export class Requester {
  offline: OfflineRequester;
  online: RestClient;
  constructor(protected name: string) {
    this.online = new RestClient(name);
    this.offline = new OfflineRequester(name);
  }

  index(params = {}): Promise<RecordableObject[]> {
    if (navigator.onLine)
      return this.online.index(params)
        .then((list: RecordableObject[]) => {
          _(list).each((item: RecordableObject) => {
            this.offline.table.insertOrReplace(item)
          });
          return list;
        });
    else
      return this.offline.index(params)
  }

  create(attrs: Object): Promise<RecordableObject> {
    return this.createOrUpdate('create', attrs)
  }

  update(attrs: Object): Promise<RecordableObject> {
    return this.createOrUpdate('update', attrs)
  }

  destroy(id: string): Promise<RecordableObject[]> {
    if (navigator.onLine)
      return this.online.destroy(id)
        .then(()=> this.offline.realDestroy(id));
    else
      return this.offline.destroy(id)
  }

  sync(): Promise<RecordableObject[]> {
    return new Synchronizer(this.online, this.offline).run();
  }

  protected createOrUpdate(method: string, attrs: Object) {
    if (navigator.onLine) {
      return this.online[method](attrs)
        .then((savedObj: RecordableObject) => {
          return this.offline[method](savedObj);
        });
    } else {
      return this.offline[method](attrs);
    }
  }
}
