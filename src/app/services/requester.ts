import * as _ from 'lodash';
import sha1 from 'js-sha1';

import { RestClient } from './rest-client';
import { LF, LFTable } from './lovefield';

export interface RecordableObject {
  id: number | string
}

class OfflineRequester {
  table: LFTable;
  constructor(name: string) {
    this.table = LF.getTable(name)
  }

  index(): Promise<RecordableObject[]> {
    return this.table.select()
  }

  create(attrs: RecordableObject): Promise<RecordableObject> {
    const id = attrs.id || sha1(
      localStorage.getItem('uid') +
      this.table.name +
      Date()
    );
    return this.table.insertOrReplace({
      id,
      ...attrs
    })
  }

  update(attrs: Object): Promise<RecordableObject> {
    return this.table.insertOrReplace(attrs)
  }

  destroy(id: number | string): Promise<RecordableObject[]> {
    const deletedAt = new Date().toISOString();
    return this.table.update(id, { deletedAt });
  }

  realDestroy(id: number | string): Promise<RecordableObject[]> {
    return this.table.destroy(id)
  }
}

export class Requester extends RestClient {
  offline: OfflineRequester;
  constructor(name: string) {
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

  destroy(id: number | string): Promise<RecordableObject[]> {
    if (navigator.onLine)
      return super.destroy(id)
        .then(()=> this.offline.realDestroy(id));
    else
      return this.offline.destroy(id)
  }

  protected createOrUpdate(method: string, attrs: Object) {
    if (navigator.onLine)
      return super[method](attrs)
        .then((savedObj: RecordableObject) => {
          return this.offline[method](savedObj);
        });
    else
      return this.offline[method](attrs);
  }
}
