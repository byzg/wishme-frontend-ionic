import _ from 'lodash';
import lf from 'lovefield';

class LFHandler {
  schemaBuilder: lf.schema.Builder = lf.schema.create('wishme-db', 1);
  tables: {[key: string]: LFTable} = {};

  createTable(name: string, attrs: Object) {
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

  protected mapType(attr: string, val: any) {
    if (val % 1 == 0) return lf.Type.INTEGER;
    if (typeof val == 'string') return lf.Type.STRING;
  }
}

export class LFTable {
  name: string;
  table: lf.schema.Table;
  connect: Promise<lf.Database>;

  constructor(public name: string) {
    this.connect = LF.schemaBuilder.connect();
    this.connect.then(db=> this.table = db.getSchema().table(name))
  }

  insertOrReplace(rowData) {
    this.connect.then(db=> {
      const row = this.table.createRow(rowData);
      db.insertOrReplace().into(this.table).values([row]).exec();
    });
  }
}

export const LF = new LFHandler();
