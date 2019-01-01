import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ToastService {

  constructor(
    private toastCtrl: ToastController,
    private translate: TranslateService
  ) {}

  showModelError(model) {
    this.toastCtrl.create({
      showCloseButton: false,
      message: model.errors.join('\n'),
      position: 'bottom',
      duration: 7000
    }).present();
  }

  showHttpError(code) {
    this.translate
      .get(`services.toastService.httpErrors.${code}`)
      .subscribe(message => {
        this.toastCtrl.create({
          showCloseButton: true,
          message,
          position: 'bottom',
          duration: 7000
        }).present();
      });
  }
}
