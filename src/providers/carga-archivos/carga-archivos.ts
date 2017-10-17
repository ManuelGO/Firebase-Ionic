import { Injectable } from '@angular/core';
import { AngularFireDatabase   } from 'angularfire2/database';
import * as firebase from 'firebase';
import { ToastController } from 'ionic-angular';

@Injectable()
export class CargaArchivosProvider {
  private CARPETA_IMAGENES: string = "img";
  private POSTS: string ="posts";
  imagenes:any[] = [];
  lastKey:string = undefined;

  constructor(public af: AngularFireDatabase, private toastCtrl: ToastController) {}

  cargar_imagenes(){
    let promesa = new Promise((resolve, reject)=>{
      this.af.list("/posts", {
        query: {
          limitToLast: 4,
          orderByKey: true,
          endAt: this.lastKey
        }
      }).subscribe(posts=>{
        if(this.lastKey){
          posts.pop();
        }
        if(posts.length == 0){
          console.log("No existen registros..");
          resolve(false);
          return;
        }
        this.lastKey = posts[0].$key;
        for(let i = posts.length - 1; i>=0; i--){
          let post = posts[i];
          this.imagenes.push(post);
        }
        resolve(true);
      })
    })

    return promesa;
  }

    cargar_imagenes_firebase( archivo:archivoSubir  ){
      let promesa = new Promise((resolve, reject)=>{
        this.mostrar_toast("Inicio de carga...");

        let storageRef = firebase.storage().ref();
        let nombreArchivo = new Date().valueOf(); //generar nombre unico de archivoSubir
        let uploadTask: firebase.storage.UploadTask =
            storageRef.child(`${ this.CARPETA_IMAGENES}/${ nombreArchivo}`)
            .putString( archivo.img, 'base64', {contentType: 'image/jpeg'});

        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
          ( snapshot )=>{}, //Saber el avance del archivo.
          (err)=>{//manejo de errores.
            console.error("Error al subir", JSON.stringify(err));
            this.mostrar_toast('Error al cargar' + JSON.stringify(err));
            reject(err);
          },
          ()=>{//final del procceso
            let url = uploadTask.snapshot.downloadURL;
            this.mostrar_toast("Imagen cargada exitosamente.");
            this.crear_posts(archivo.title, url);
            resolve();
          }

        )

      });

      return promesa;

    }

private crear_posts(titulo:string, url:string){
  let post:archivoSubir = {
    img:url,
    title:titulo
  };

  let $key = this.af.database.ref(`/${this.POSTS}`).push(post).key;
  post.$key = $key;
  this.imagenes.push(post);

}
public mostrar_toast(msg:string){
  this.toastCtrl.create({
    message: msg,
    duration: 2500
  }).present();
}

}

interface archivoSubir{
  $key?:string;
  img:string;
  title:string;
}
