export class SelectMode {
  private mapping = {};
  constructor(private collection: Array<T>) {}

  get enabled(): boolean {
    return this.collection.some((item: T)=> this.isSelected(item));
  }

  isSelected(item: T) {
    return item && this.mapping[item.id];
  }

  toggle(item: T) {
    this.mapping[item.id] = !this.mapping[item.id]
  };
}
