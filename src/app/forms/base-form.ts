import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import _ from 'lodash';

import { BaseFactory } from '../resourses/factories/base-factory';
import { BaseCollection } from '../resourses/collections/base-collection';

export interface IBaseForm {
  group: FormGroup;
  buildGroup(): FormGroup;
  save(): Promise<Object>;
}

export abstract class BaseForm implements IBaseForm {
  group: FormGroup;
  protected formBuilder: FormBuilder = new FormBuilder();
  protected _initVals: Object;

  constructor(
    protected model: BaseFactory,
    protected collection: (BaseCollection<BaseFactory> | null) = null
  ) {
    this.buildGroup();
    this._initVals = _.clone(this.group.value);
  }

  buildGroup(): FormGroup {
    return this.formBuilder.group({});
  }

  save(): Promise<Object> {
    if (!this.isChanged) return Promise.resolve(this.model);
    if (this.model.isNew() && this.collection) {
      return this.collection.create(this.group.value)
    } else {
      return this.model.save(this.group.value)
    }
  }

  get isNew(): boolean {
    return this.model.isNew();
  }

  get isEdit(): boolean {
    return !this.isNew;
  }

  get isChanged(): boolean {
    return !_.isEqual(this.group.value, this._initVals);
  }

  get type(): string {
    return this.isNew ? 'new' : 'edit';
  }

  discard(): void {
    this.group.reset(this._initVals);
    this.group.markAsPristine();
  }

  control(name: string): AbstractControl {
    return this.group.controls[name];
  }
}
