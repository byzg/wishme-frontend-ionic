import _ from 'lodash';
import lf from 'lovefield';

class LFHandler {
  schemaBuilder = lf.schema.create('wishme-db', 1);

  createTable(name: string, attrs: Object) {
    let table = this.schemaBuilder.createTable(name);
    _.each(attrs, (val, attr)=> {
      const lfType = this.mapType(attr, val);
      table = table.addColumn(attr, lfType);
    });
    if (attrs.hasOwnProperty('id'))
      table = table.addPrimaryKey(['id']);
    return table;
  }

  protected mapType(attr: string, val: any) {
    if (val % 1 == 0) return lf.Type.INTEGER;
    if (typeof val == 'string') return lf.Type.STRING;
  }
}

export const LF = new LFHandler();
