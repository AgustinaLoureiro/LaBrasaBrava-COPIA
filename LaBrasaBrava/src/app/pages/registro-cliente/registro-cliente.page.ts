import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent,
  IonItem, IonLabel, IonInput, IonNote, IonButton, IonIcon, IonSpinner,
} from '@ionic/angular';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.page.html',
  styleUrls: ['./registro-cliente.page.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    IonContent, IonHeader, IonToolbar, IonTitle, IonCard, IonCardContent,
    IonItem, IonLabel, IonInput, IonNote, IonButton, IonIcon, IonSpinner,
  ],
})
export class RegistroClientePage {
  form: FormGroup;
  fotoPreview: string | null = null;
  enviando = false;
  errorGeneral: string | null = null;
  registroExitoso = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nombres: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
      ]],
      apellidos: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
      ]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.form.controls;
  }

  async tomarFoto() {
    try {
      const foto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera, // fuerza cámara, bloquea la galería
        quality: 90,
      });
      this.fotoPreview = foto.dataUrl ?? null;
    } catch (error) {
      console.log('No se tomó la foto', error);
    }
  }

  async onSubmit() {
    this.errorGeneral = null;

    if (this.form.invalid || !this.fotoPreview) {
      this.form.markAllAsTouched();
      if (!this.fotoPreview) {
        this.errorGeneral = 'Falta tomar la foto personal.';
      }
      await Haptics.impact({ style: ImpactStyle.Medium });
      return;
    }

    this.enviando = true;

    // TODO: acá va la conexión a Supabase (auth.signUp + subida de foto + insert en 'usuarios')
    // cuando el equipo confirme el esquema de la tabla.
    console.log('Registro simulado:', {
      ...this.form.value,
      foto: this.fotoPreview ? '(foto tomada, no se muestra el base64 completo en consola)' : null,
    });

    // Simulamos una pequeña espera, como si estuviera hablando con el servidor
    await new Promise((resolve) => setTimeout(resolve, 800));

    this.enviando = false;
    this.registroExitoso = true;
  }
}