import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { Camara } from '../../services/camara';
import { Almacenamiento } from '../../services/almacenamiento';
import { SupabaseService } from '../../nucleo/servicios/supabase.service';
import { LogoMarcaComponent } from '../../componentes/logo-marca/logo-marca.component';
import { RESTAURANTE } from '../../nucleo/marca';

@Component({
  selector: 'app-lista-espera',
  templateUrl: './lista-espera.page.html',
  styleUrls: ['./lista-espera.page.scss'],
  imports: [CommonModule, ReactiveFormsModule, IonContent, LogoMarcaComponent]
})
export class ListaEsperaPage {
  private constructorFormulario = inject(FormBuilder);
  private camara = inject(Camara);
  private almacenamiento = inject(Almacenamiento);
  private supabase = inject(SupabaseService);
  private location = inject(Location);

  protected readonly restaurante = RESTAURANTE;

  fotoPrevia: string | null = null;
  enviando = false;
  mensaje = '';
  /** Pinta el mensaje final en rojo o en verde según cómo haya salido. */
  mensajeEsError = false;

  formulario = this.constructorFormulario.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]]
  });

  volver() {
    this.location.back();
  }

  invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  mensajeError(campo: string): string {
    const errores = this.formulario.get(campo)?.errors;
    if (!errores) return '';

    if (errores['required']) return 'Escribí tu nombre.';
    if (errores['minlength']) return 'El nombre debe tener al menos 2 letras.';
    return 'Revisá este dato.';
  }

  async sacarFoto() {
    const foto = await this.camara.tomarFoto();
    if (foto) {
      this.fotoPrevia = foto;
    }
  }

  async solicitarMesa() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensajeEsError = true;
      this.mensaje = 'Revisá el nombre que ingresaste.';
      return;
    }
    if (!this.fotoPrevia) {
      this.mensajeEsError = true;
      this.mensaje = 'Falta sacar tu foto.';
      return;
    }

    this.enviando = true;
    const urlFoto = await this.almacenamiento.subirImagen(this.fotoPrevia, 'lista_espera');

    if (!urlFoto) {
      this.enviando = false;
      this.mensajeEsError = true;
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
      this.mensajeEsError = true;
      this.mensaje = 'No se pudo solicitar la mesa: ' + error.message;
    } else {
      this.mensajeEsError = false;
      this.mensaje = 'Listo, ya estás en la lista de espera.';
      this.formulario.reset();
      this.fotoPrevia = null;
    }
  }
}