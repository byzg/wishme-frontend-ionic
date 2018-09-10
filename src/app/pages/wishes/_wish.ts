import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'wsm-wish',
  templateUrl: '_wish.html',
})
export class WishPartial {
  @Input() wish;
  @Output() edit: EventEmitter<any> = new EventEmitter();

  emitEdit() {
    this.edit.emit(this.wish);
  }
}
