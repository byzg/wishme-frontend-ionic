interface SelectModeItem {
  id: number
}

export class SelectMode {
  private mapping = {};
  public collection: Array<SelectModeItem>;

  get enabled(): boolean {
    return this.collection &&
      this.collection.some((item: SelectModeItem)=> {
        return this.isSelected(item);
      });
  }

  isSelected(item: SelectModeItem) {
    return item && this.mapping[item.id];
  }

  toggle(item: SelectModeItem) {
    this.mapping[item.id] = !this.mapping[item.id]
  };
}
