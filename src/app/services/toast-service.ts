import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
  private HTTP_ERROR_MESSAGES = {
    401: 'Сессия недействительна',
    403: 'Действие запрещено',
  };

  constructor(private toastCtrl: ToastController) {}

  showModelError(model) {
    this.toastCtrl.create({
      showCloseButton: false,
      message: model.errors.join('\n'),
      position: 'bottom',
      duration: 7000
    }).present();
  }

  showHttpError(code) {
    this.toastCtrl.create({
      showCloseButton: true,
      message: this.HTTP_ERROR_MESSAGES[code] || 'Что-то пошло не так',
      position: 'bottom',
      duration: 7000
    }).present();
  }
}
