import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 't',
  pure: false
})
export class TPipe implements PipeTransform {
  private translated: string;
  constructor(private translateService: TranslateService) {}

  transform(key: string, path: string) {
    this.translateService.get(`${path}${key}`)
      .subscribe((res: string) => this.translated = res );
    return this.translated;
  }
}
