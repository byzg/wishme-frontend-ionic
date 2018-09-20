import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  modelError(model) {
    this.toastCtrl.create({
      showCloseButton: false,
      message: model.errors.join('\n'),
      position: 'bottom',
      duration: 7000
    }).present();
  }
}
