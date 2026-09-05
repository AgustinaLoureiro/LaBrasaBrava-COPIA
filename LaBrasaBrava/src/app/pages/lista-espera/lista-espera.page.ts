import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
  IonInput, IonButton, IonImg
} from '@ionic/angular';
import { Camara } from '../../services/camara';
import { Almacenamiento } from '../../services/almacenamiento';
import { SupabaseService } from '../../nucleo/servicios/supabase.service';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.page.html',
  styleUrls: ['./lista-espera.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
    IonInput, IonButton, IonImg
  ]
})
export class ListaEsperaPage {
  private constructorFormulario = inject(FormBuilder);
  private camara = inject(Camara);
  private almacenamiento = inject(Almacenamiento);
  private supabase = inject(SupabaseService);

  fotoPrevia: string | null = null;
  enviando = false;
  mensaje = '';

  formulario = this.constructorFormulario.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]]
  });

  async sacarFoto() {
    const foto = await this.camara.tomarFoto();
    if (foto) {
      this.fotoPrevia = foto;
    }
  }

  async solicitarMesa() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensaje = 'Revisá el nombre ingresado.';
      return;
    }
    if (!this.fotoPrevia) {
      this.mensaje = 'Falta sacar la foto.';
      return;
    }

    this.enviando = true;
    const urlFoto = await this.almacenamiento.subirImagen(this.fotoPrevia, 'lista_espera');

    if (!urlFoto) {
      this.enviando = false;
      this.mensaje = 'No se pudo subir la foto, intentá nuevamente.';
      return;
    }

    const { error } = await this.supabase.cliente
      .from('lista_espera')
      .insert({
        nombre: this.formulario.value.nombre,
        foto_url: urlFoto,
        tipo: 'anonimo'
      });

    this.enviando = false;

    if (error) {
      this.mensaje = 'Error al solicitar la mesa: ' + error.message;
    } else {
      this.mensaje = 'Solicitud enviada, esperá a que te asignen una mesa.';
      this.formulario.reset();
      this.fotoPrevia = null;
    }
  }
}