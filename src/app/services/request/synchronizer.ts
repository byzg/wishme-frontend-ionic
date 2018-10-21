import * as _ from 'lodash';

import { OfflineRequester } from './offline-requester';
import { RestClient } from './rest-client';
import { RecordableObject } from './requester';

export class Synchronizer extends RestClient {
  protected promises: Promise<any>[] = [];
  protected clientRecords: RecordableObject[];
  protected deletedClientRecords: RecordableObject[];
  protected stayedClientRecords: RecordableObject[];
  protected serverRecords: RecordableObject[];

  constructor(
    protected name: string,
    protected offline: OfflineRequester
  ) {
    super(name);
  }

  async run(): Promise<RecordableObject[]> {
    this.clientRecords = await this.offline.index();
    this.serverRecords = await super.index();
    this.deletedClientRecords =
      _.filter(this.clientRecords, 'deletedAt');
    this.stayedClientRecords =
      _.difference(this.clientRecords, this.deletedClientRecords);
    this.handleDeleted();
    this.syncServerFromClient();
    this.syncClientFromServer();
    return Promise.all(this.promises).then(()=> this.offline.index())
  }

  protected find(list, { id }) {
    return <RecordableObject>_.find(list, { id });
  }

  protected handleDeleted(): void {
    _(this.deletedClientRecords).each(record => {
      if (this.find(this.serverRecords, record))
        this.promises.push(super.destroy(record.id));
    });
  }

  protected syncServerFromClient(): void {
    _(this.stayedClientRecords).each( record => {
      const serverRecord: RecordableObject =
        this.find(this.serverRecords, record);
      if (serverRecord) {
        if (new Date(serverRecord.updatedAt) < new Date(record.updatedAt)) {
          this.promises.push(super.update(record))
        }
      } else if (Number(record.id)) {
        this.promises.push(this.offline.realDestroy(record.id))
      } else {
        this.promises.push(
          super.create(record)
            .then(createdRecord => {
              this.offline.table.update(record.id, createdRecord)
            })
        );
      }
    });
  }

  protected syncClientFromServer(): void {
    _(this.serverRecords).each(serverRecord => {
      const record: RecordableObject =
        this.find(this.stayedClientRecords, serverRecord);
      if (record) {
        if (new Date(record.updatedAt) < new Date(serverRecord.updatedAt)) {
          this.promises.push(this.offline.update(record))
        }
      } else {
        this.promises.push(this.offline.create(serverRecord))
      }
    });
  }
}
