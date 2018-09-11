import { BaseFactory } from './base-factory';

export class Wish extends BaseFactory {
  protected readonly _name = 'wish';
  title: string;
  text: string;
  price: number;
}
