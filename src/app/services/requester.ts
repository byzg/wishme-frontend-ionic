import * as _ from 'lodash';
import sha1 from 'js-sha1';

import { RestClient } from './rest-client';
import { LF, LFTable } from './lovefield';

export interface RecordableObject {
  id: number | string,
  updatedAt: string,
  deletedAt: string
}

class OfflineRequester {
  table: LFTable;
  constructor(name: string) {
    this.table = LF.getTable(name)
  }

  now = (): string => {
    return new Date().toISOString();
  };

  index(): Promise<RecordableObject[]> {
    return this.table.select()
  }

  create(attrs: RecordableObject): Promise<RecordableObject> {
    const id = attrs.id || sha1(
      localStorage.getItem('uid') +
      this.table.name +
      this.now()
    )
    return this.table.insertOrReplace({
      ...attrs,
      id,
    })
  }

  update(attrs: Object): Promise<RecordableObject> {
    return this.table.insertOrReplace({
      ...attrs,
     updatedAt: this.now()
    });
  }

  destroy(id: number | string): Promise<RecordableObject[]> {
    return this.table.update(id, { deletedAt: this.now() });
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

  async sync(): Promise<RecordableObject[]> {
    const records: RecordableObject[] = await this.offline.index();
    const serverRecords: RecordableObject[] = await super.index();
    const deleted = _.filter(records, 'deletedAt');
    const promises = [];
    const find = (list, { id })=> <RecordableObject>_.find(list, { id });
    _(deleted).each(record => {
      if (find(serverRecords, record)) promises.push(super.destroy(record.id));
    });
    const stayed = _.difference(records, deleted);
    _(stayed).each( record => {
      const serverRecord: RecordableObject = find(serverRecords, record);
      if (serverRecord) {
        if (new Date(serverRecord.updatedAt) < new Date(record.updatedAt)) {
          promises.push(super.update(record))
        }
      } else if (isFinite(record.id)) {
        promises.push(this.offline.realDestroy(record.id))
      } else {
        promises.push(this.create(record));
      }
    });
    _(serverRecords).each(serverRecord => {
      const record: RecordableObject = find(stayed, serverRecord);
      if (record) {
        if (new Date(record.updatedAt) < new Date(serverRecord.updatedAt)) {
          promises.push(this.offline.update(record))
        }
      } else {
        promises.push(this.offline.create(serverRecord))
      }
    });
    return Promise.all(promises).then(()=> this.offline.index())
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
