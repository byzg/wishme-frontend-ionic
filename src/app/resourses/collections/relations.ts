import { BaseFactory } from '../factories/base-factory';
import { BaseCollection } from './base-collection';

export class Relations<T extends BaseFactory> extends Array<T> {
  constructor(
    private parent: BaseCollection<T>,
    private q: Object
  ) {
    super();
    Object.assign(this, Relations.prototype);
    Object.setPrototypeOf(this, parent);
    this.parent.subscribe(()=> {
      const found = this.parent.where(q);
      this.length = found.length;
      Object.assign(this, found);
    })
  }

  exec(): Promise<any> {
    const { q } = this;
    return this.parent.index({ q });
  }
}
