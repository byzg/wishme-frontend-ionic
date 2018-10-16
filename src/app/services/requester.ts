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
      ...attrs,
      id,
    })
  }

  update(attrs: Object): Promise<RecordableObject> {
    return this.table.insertOrReplace({
      ...attrs,
     updatedAt: this.now
    });
  }

  destroy(id: number | string): Promise<RecordableObject[]> {
    return this.table.update(id, { deletedAt: this.now });
  }

  realDestroy(id: number | string): Promise<RecordableObject[]> {
    return this.table.destroy(id)
  }

  protected static get now(): string {
    new Date().toISOString();
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

  async sync(): Promise<RecordableObject[]> {
    const records = await this.offline.index();
    const serverRecords = await super.index();
    const deleted = _.reject(records, ['deletedAt', null]);
    const promises = [];
    const find = (list, { id })=> _.find(list, { id });
    _(deleted).each(record => {
      if (find(serverRecords, record)) promises.push(super.destroy(record.id));
    });
    const stayed = _.difference(records, deleted);
    _(stayed).each( record => {
      const serverRecord = find(serverRecords, record);
      if (serverRecord &&
        new Date(serverRecord.updatedAt) < new Date(record.updatedAt)) {
          promises.push(super.update(record))
      } else if (_.isNumber(record.id)) {
        promises.push(this.offline.realDestroy(record.id))
      } else {
        promises.push(this.create(record));
      }
    });
    _(serverRecords).each(serverRecord => {
      const record = find(stayed, serverRecord);
      if (serverRecord &&
        new Date(record.updatedAt) < new Date(serverRecord.updatedAt)) {
        promises.push(this.offline.update(record))
      } else {
        promises.push(this.offline.create(serverRecord))
      }
    });
    return Promise.all(promises).then(()=> this.offline.index())
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
