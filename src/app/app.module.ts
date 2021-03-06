import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AngularTokenModule } from 'angular-token';
import { AvatarModule } from 'ng2-avatar';

import { environment } from '../environments/environment';
import {
  ServiceLocator,
  BackManager,
  HttpHelper,
  Spinner,
  Session,
  ResponseHandler,
  ToastService,
} from './services';
import { Wishes } from './resourses/collections';

import { AppComponent } from './app.component';
import { TPipe } from './pipes';
import {
  LoginPage,
  RegisterPage,
  WishesPage,
  WishFormPage,
  WishPartial
} from './pages';

import {
  SpinnerComponent,
  NavbarComponent,
  MenuComponent,
  MenuHeaderComponent
} from './components';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    TPipe,
    LoginPage,
    RegisterPage,
    WishesPage,
    WishFormPage,
    WishPartial,

    SpinnerComponent,
    NavbarComponent,
    MenuComponent,
    MenuHeaderComponent,
  ],
  entryComponents: [
    AppComponent,
    LoginPage,
    RegisterPage,
    WishesPage,
    WishFormPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(AppComponent, {
      scrollPadding: false,
      scrollAssist: true,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot({
      name: '__ionic3_start_theme',
        driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AngularTokenModule.forRoot({
      apiBase:                    environment.API_URL,
      registerAccountPath:        'auth',
    }),
    AvatarModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  providers: [
    AngularTokenModule,

    BackManager,
    Session,
    HttpHelper,
    Spinner,
    ResponseHandler,
    ToastService,

    Wishes,
  ]
})

export class AppModule {
  constructor(private injector: Injector) {
    ServiceLocator.injector = this.injector;
  }
}
