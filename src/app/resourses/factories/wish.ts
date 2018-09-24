import { BaseFactory } from './base-factory';

export class Wish extends BaseFactory {
  protected readonly _name = 'wish';
  protected _attrs = {
    title: '',
    text: '',
    price: 0
  };
  title: string;
  text: string;
  price: number;

}
