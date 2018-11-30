import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Pipe({
  name: 't',
  pure: false
})
export class TPipe implements PipeTransform {
  private translatePipe: TranslatePipe;
  constructor(
    private translateService: TranslateService,
    private _ref: ChangeDetectorRef
  ) {
    this.translatePipe = new TranslatePipe(this.translateService, this._ref)
  }

  transform(key: string, path: string, interpolateParams: Object) {
    return this.translatePipe.transform(`${path}${key}`, interpolateParams);
  }
}
