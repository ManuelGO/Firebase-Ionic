import { Component } from '@angular/core';
import {  ModalController } from 'ionic-angular';
import { SubirPage } from '../subir/subir';
import { AngularFireAuth } from 'angularfire2/auth';

//import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
//servicios o providers:
import { CargaArchivosProvider } from '../../providers/carga-archivos/carga-archivos'
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import { SocialSharing } from '@ionic-native/social-sharing';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  hayMas:boolean = true;
  isAuthenticated:boolean;
  displayName;



//   posts: FirebaseListObservable<any[]>;
  constructor(private modalCtrl: ModalController,
              private _ca: CargaArchivosProvider,
              private _aut: AuthServiceProvider,
              private afAuth: AngularFireAuth,
              private socialSharing: SocialSharing) {
    this._ca.cargar_imagenes();
    this.afAuth.authState.subscribe(user => {
      if (!user) {
        this.displayName = null;
        this.isAuthenticated = false;
        return;
      }
      this.displayName = user.displayName;
      this.isAuthenticated = true;
      console.log(this.displayName);
    });

  }

  ingresar(){
    this._aut.signInWithFacebook();
  }
  salir(){
    this._aut.signOut();
    this.isAuthenticated = false;
  }

  cargar_siguientes(infiniteScroll: any){
    console.log('siguientes..');
    this._ca.cargar_imagenes()
          .then((hayMas: boolean)=>{
            infiniteScroll.complete();
            console.log(hayMas);
            this.hayMas = hayMas;
          })
  }
  mostrarModal(){
    let modal = this.modalCtrl.create(SubirPage);
    modal.present();
  }
  compartir(posts:any){
    this.socialSharing.shareViaFacebook(posts.title, posts.img)
          .then(()=>{
            this._ca.mostrar_toast('Post compartido: '+ posts.title)
          }).catch(err=>{this._ca.mostrar_toast(err);})
  }

}
