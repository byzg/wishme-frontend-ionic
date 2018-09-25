import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import _ from 'lodash';

import { BaseFactory } from '../resourses/factories/base-factory';

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
    protected collection = []
  ) {
    this.buildGroup();
    this._initVals = _.clone(this.group.value);
  }

  buildGroup(): FormGroup {
    return this.formBuilder.group({});
  }

  save(): Promise<Object> {
    if (!this.isChanged) return Promise.resolve(this.model);
    this.model.setAttrs(this.group.value);
    const promise = this.model.save();
    if (this.model.isNew()) {
      return promise.then(() => {
        this.collection.push(this.model);
        return this.model;
      });
    }
    return promise;
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
