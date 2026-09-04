import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
  IonInput, IonSelect, IonSelectOption, IonButton, IonImg
} from '@ionic/angular';
import { Camara } from '../../services/camara';
import { Almacenamiento } from '../../services/almacenamiento';
import { Supabase } from '../../services/supabase';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.page.html',
  styleUrls: ['./empleado.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
    IonInput, IonSelect, IonSelectOption, IonButton, IonImg
  ]
})
export class EmpleadoPage {
  private constructorFormulario = inject(FormBuilder);
  private camara = inject(Camara);
  private almacenamiento = inject(Almacenamiento);
  private supabase = inject(Supabase);

  fotoPrevia: string | null = null;
  guardando = false;
  mensaje = '';

  formulario = this.constructorFormulario.group({
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
    cuil: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{7,8}-\d{1}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    perfil: ['', Validators.required]
  });

  perfiles = ['dueño', 'supervisor', 'metre', 'mozo', 'cocinero', 'cantinero'];

  async sacarFoto() {
    const foto = await this.camara.tomarFoto();
    if (foto) {
      this.fotoPrevia = foto;
    }
  }

  async guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensaje = 'Revisá los campos marcados.';
      return;
    }
    if (!this.fotoPrevia) {
      this.mensaje = 'Falta sacar la foto.';
      return;
    }

    this.guardando = true;
    const urlFoto = await this.almacenamiento.subirImagen(this.fotoPrevia, 'empleados');

    if (!urlFoto) {
      this.guardando = false;
      this.mensaje = 'No se pudo subir la foto, intentá nuevamente.';
      return;
    }

    const { error } = await this.supabase.client
      .from('empleados')
      .insert({
        ...this.formulario.value,
        foto_url: urlFoto
      });

    this.guardando = false;

    if (error) {
      this.mensaje = 'Error al guardar: ' + error.message;
    } else {
      this.mensaje = 'Empleado guardado correctamente.';
      this.formulario.reset();
      this.fotoPrevia = null;
    }
  }
}
