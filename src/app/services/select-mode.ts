interface SelectModeItem {
  id: string
}

export class SelectMode {
  private mapping = {};
  private _enabled = true;
  public collection: Array<SelectModeItem>;

  get isActive() {
    return this.enabled && this.collection &&
      this.collection.some((item: SelectModeItem)=> {
        return this.isSelected(item);
      });
  }

  get enabled(): boolean {
    return this._enabled
  }

  set enabled(val: boolean) {
    this._enabled = val;
  }

  isSelected(item: SelectModeItem) {
    return item && this.mapping[item.id];
  }

  toggle(item: SelectModeItem) {
    if (this.enabled) this.mapping[item.id] = !this.mapping[item.id];
  };
}
