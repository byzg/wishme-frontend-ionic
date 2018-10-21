import * as _ from 'lodash';

import { RestClient } from './rest-client';
import { OfflineRequester } from './offline-requester';
import { Synchronizer } from './synchronizer';

export interface RecordableObject {
  id: string,
  updatedAt: string,
  deletedAt: string
}

export class Requester extends RestClient {
  offline: OfflineRequester;
  constructor(protected name: string) {
    super(name);
    this.offline = new OfflineRequester(name);
  }

  index(): Promise<RecordableObject[]> {
    if (navigator.onLine)
      return super.index()
        .then((list: RecordableObject[]) => {
          _(list).each((item: RecordableObject) => {
            this.offline.table.insertOrReplace(item)
          });
          return list;
        });
    else
      return this.offline.index()
  }

  create(attrs: Object): Promise<RecordableObject> {
    return this.createOrUpdate('create', attrs)
  }

  update(attrs: Object): Promise<RecordableObject> {
    return this.createOrUpdate('update', attrs)
  }

  destroy(id: string): Promise<RecordableObject[]> {
    if (navigator.onLine)
      return super.destroy(id)
        .then(()=> this.offline.realDestroy(id));
    else
      return this.offline.destroy(id)
  }

  sync(): Promise<RecordableObject[]> {
    return new Synchronizer(this.name, this.offline).run();
  }

  protected createOrUpdate(method: string, attrs: Object) {
    if (navigator.onLine) {
      return super[method](attrs)
        .then((savedObj: RecordableObject) => {
          return this.offline[method](savedObj);
        });
    } else {
      return this.offline[method](attrs);
    }
  }
}
