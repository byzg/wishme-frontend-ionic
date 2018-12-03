import _ from 'lodash';
import pluralize from 'pluralize';
import lf from 'lovefield';

class LFHandler {
  schemaBuilder: lf.schema.Builder = lf.schema.create('wishme-db', 1);
  tables: {[key: string]: LFTable} = {};
  private _connect: Promise<lf.Database>;

  createTable(name: string, attrs: Object): LFTable {
    if (this.tables[name]) return this.tables[name];
    let table: lf.schema.TableBuilder = this.schemaBuilder.createTable(name);
    _.each(attrs, (val, attr)=> {
      const lfType = this.mapType(attr, val);
      table = table.addColumn(attr, lfType);
    });
    table.addNullable(_(attrs).keys().without('id').value());
    if (attrs.hasOwnProperty('id'))
      table = table.addPrimaryKey(['id']);
    this.tables[name] = new LFTable(name);
    return this.tables[name];
  }

  getTable(name: string): LFTable {
    return this.tables[pluralize(name)]
  }

  get connect() {
    if (this._connect) return this._connect;
    this._connect = LF.schemaBuilder.connect();
    return this._connect;
  }

  protected mapType(attr: string, val: any) {
    if (typeof val === 'number')  return lf.Type.NUMBER;
    // All undefined fields are 'string' by default
    if (!val || typeof val == 'string') return lf.Type.STRING;
  }
}

export class LFTable {
  table: lf.schema.Table;

  constructor(public name: string) {}

  get connect() {
    return LF.connect.then(db=> {
      if (!this.table)
        this.table = db.getSchema().table(this.name);
      return LF.connect
    });
  }

  insertOrReplace(rowData) {
    return this.connect.then(db => {
      const row = this.table.createRow(rowData);
      return db.insertOrReplace().into(this.table)
        .values([row]).exec()
        .then(rows => rows[0]);
    });
  }

  update(id, attrs) {
    return this.connect.then(db => {
      let query = db.update(this.table);
      _(attrs).each((v, k)=> {
        query = query.set(this.table[k], v)
      });
      return query.where(this.table.id.eq(id)).exec();
    });
  }

  select(params = {}) {
    return this.connect.then(db => {
      const search =_.map(params, (val, attr)=> this.table[attr].eq(val));
      let qwery = db.select().from(this.table);
      if (search.length) qwery = qwery.where(...search);
      return qwery.exec();
    });
  }

  destroy(id) {
    return this.connect.then(db => {
      return db.delete().from(this.table)
        .where(this.table.id.eq(id)).exec()
    });
  }
}

export const LF = new LFHandler();
