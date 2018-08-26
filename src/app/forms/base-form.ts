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
    protected collection: BaseCollection<BaseFactory>
  ) {
    this.buildGroup();
  }

  buildGroup(): FormGroup {
    return this.formBuilder.group({});
  }

  save(): Promise<Object> {
    _.extend(this.model, this.group.value);
    const promise = this.model.save();
    if (this.model.isNew()) {
      return promise.then(() => {
        this.collection.push(this.model);
        return this.model;
      });
    }
    return promise;
  }

  get initVals(): Object {
    return {};
  }

  get isNew(): boolean {
    return this.model.isNew();
  }

  get isEdit(): boolean {
    return !this.isNew;
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
