import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SubirPage } from '../pages/subir/subir';
//firebase:
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { firebaseConfig } from '../config/firebase.config'

//pipes:
import { PlaceholderPipe } from '../pipes/placeholder/placeholder';

//plugins
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { SocialSharing } from '@ionic-native/social-sharing';


//Servicios
import { CargaArchivosProvider } from '../providers/carga-archivos/carga-archivos';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SubirPage,
    PlaceholderPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SubirPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ImagePicker,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CargaArchivosProvider,
    AuthServiceProvider,
    Facebook,
    SocialSharing
  ]
})
export class AppModule {}
