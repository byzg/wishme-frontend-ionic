import { Pipe, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';

@Pipe({
  name: 't',
  pure: false
})
export class TPipe implements PipeTransform {
  private translated: string;
  constructor(
    private translateService: TranslateService,
    // private _ref: ChangeDetectorRef
  ) {}

  transform(key: string, path: string) {
    this.translateService.get(`${path}${key}`)
      .subscribe((res: string) => this.translated = res );
    return this.translated;
  }

  // transform(key: string, path: string) {
  //   const translatePipe = new TranslatePipe(this.translateService, _ref)
  //   // this.translateService.get(`${path}${key}`)
  //   //   .subscribe((res: string) => this.translated = res );
  //   return translatePipe.transform();
  // }
}
