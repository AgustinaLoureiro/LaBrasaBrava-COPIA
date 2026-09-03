import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular';
import { Sesion } from '../../services/sesion';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton
  ]
})
export class LoginPage {
  private constructorFormulario = inject(FormBuilder);
  private sesion = inject(Sesion);
  private router = inject(Router);

  ingresando = false;
  mensaje = '';

  formulario = this.constructorFormulario.group({
    email: ['', [Validators.required, Validators.email]],
    contrasenia: ['', Validators.required]
  });

  async ingresar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.ingresando = true;
    const error = await this.sesion.iniciarSesion(
      this.formulario.value.email!,
      this.formulario.value.contrasenia!
    );
    this.ingresando = false;

    if (error) {
      this.mensaje = error;
    } else {
      this.router.navigateByUrl('/home');
    }
  }
}