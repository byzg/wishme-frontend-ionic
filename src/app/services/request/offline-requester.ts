import sha1 from 'js-sha1';

import { RecordableObject } from './requester';
import { LF, LFTable } from './lovefield';

export class OfflineRequester {
  table: LFTable;
  constructor(name: string) {
    this.table = LF.getTable(name)
  }

  now = (): string => {
    return new Date().toISOString();
  };

  index(params = {}): Promise<RecordableObject[]> {
    return this.table.select(params)
  }

  create(attrs: RecordableObject): Promise<RecordableObject> {
    const id = attrs.id || sha1(
      localStorage.getItem('uid') +
      this.table.name +
      this.now()
    );
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

  destroy(id: string): Promise<RecordableObject[]> {
    return this.table.update(id, { deletedAt: this.now() });
  }

  realDestroy(id: string): Promise<RecordableObject[]> {
    return this.table.destroy(id)
  }
}
