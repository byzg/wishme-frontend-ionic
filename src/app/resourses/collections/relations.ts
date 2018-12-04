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
  }

  exec(): Promise<any> {
    const { q } = this;
    const promise = this.parent.index({ q });
    promise.then(()=> {
      Object.assign(this, this.parent.where(q))
    });
    return promise;
  }
}
