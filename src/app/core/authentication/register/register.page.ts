import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  // Variable para el formulario de registro
  registerForm: FormGroup;
  // Variable para el formulario de registro
  constructor(private router: Router, private formBuilder: FormBuilder, private userAuth: AngularFireAuth,
              private realtimeDatabase: AngularFireDatabase, private nativeToast: ToastController) { }

  ngOnInit() {
    // Inicializando formulario
    this.registerForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
    // Inicializando formulario
  }
  // Funcion para crear un nuevo usuario
  async createUser() {
    // Extrayendo datos el formulario
    const userName = this.registerForm.value.userName;
    const userEmail = this.registerForm.value.userEmail;
    const userPassword = this.registerForm.value.userPassword;
    // Extrayendo datos el formulario
    // Creando usuario
    await this.userAuth.auth.createUserWithEmailAndPassword(userEmail, userPassword)
    // Creando usuario
    // En caso de un registro exitoso, se va a ejecutar este bloque de codigo
    .then(async () => {
      // Actualizando el nombre del usuario
      this.userAuth.auth.onAuthStateChanged((userData) => {
        userData.updateProfile({
          displayName: userName
        });
      });
      // Actualizando el nombre del usuario
      // Extrayendo user ID
      const userID = this.userAuth.auth.currentUser.uid;
      // Extrayendo user ID
      // Extrayendo informacion de la fecha
      const dateInfo = new Date();
      const registerDate = (dateInfo.getDate() + '/' + (dateInfo.getMonth() + 1) + '/' + dateInfo.getFullYear());
      // Extrayendo informacion de la fecha
      // Creando registros en la base de datos
      await this.realtimeDatabase.database.ref('Ion-Fire/users/' + userID + '/').set({
        userName: userName,
        userEmail: userEmail,
        userUID: userID,
        userLocationData: {
          userLongitud: '',
          userLatitude: ''
        },
        userRegisterStatus: false,
        isFirebaseUser: false,
        userPhone: '',
        userRegisterDate: registerDate,
      })
      // Creando registros en la base de datos
      // Avisando al usuario sobre un registro exitoso
      .then(async () => {
        const registerToast = await this.nativeToast.create({
          message: 'Registro exitoso',
          position: 'bottom',
          color: 'warning',
          cssClass: 'ProductSans',
          animated: true,
          buttons: [
            {
              icon: 'checkmark',
              text: 'Aceptar',
              handler: () => {
                this.router.navigate(['/login']);
              }
            }
          ]
        });
        registerToast.present();
      });
      // Avisando al usuario sobre un registro exitoso
    })
    // En caso de un registro exitoso, se va a ejecutar este bloque de codigo
    // En caso de un registro problematico, se ejecutara este bloque de codigo
    .catch(async (error) => {
      const errorCodes = error.code;
      switch (errorCodes) {
        case 'auth/invalid-email':
          const invalidEmailToast = await this.nativeToast.create({
            message: 'Dirección de correo invalida',
            buttons: ['Aceptar'],
            color: 'danger'
          });
          invalidEmailToast.present();
          break;
        case 'auth/email-already-in-use':
          const emailInUseToast = await this.nativeToast.create({
            message: 'Correo en uso',
            buttons: ['Aceptar'],
            color: 'danger'
          });
          emailInUseToast.present();
          break;
        case 'auth/operation-not-allowed':
          const operationNotAllowedToast = await this.nativeToast.create({
            message: 'Registro inhabilitado',
            buttons: ['Aceptar'],
            color: 'danger'
          });
          operationNotAllowedToast.present();
          break;
        case 'auth/weak-password':
          const weakPasswordToast = await this.nativeToast.create({
            message: 'Contraseña débil',
            buttons: ['Aceptar'],
            color: 'danger'
          });
          weakPasswordToast.present();
          break;
      }
    })
    // En caso de un registro problematico, se ejecutara este bloque de codigo
  }
  // Funcion para crear un nuevo usuario
}
