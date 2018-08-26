import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class Spinner {
  TYPES = ['sbAdmin', 'skRotatePlane'];
  isActive: boolean;
  type = this.TYPES[0];

  constructor() {
    this.TYPES.map(type => {
      this[`is${_.upperFirst(type)}`] = () => this.hasType(type);
    });
  }

  toggle(): void {
    this.isActive = !this.isActive;
  }

  private hasType(type: string): boolean {
    return this.type === type;
  }
}
