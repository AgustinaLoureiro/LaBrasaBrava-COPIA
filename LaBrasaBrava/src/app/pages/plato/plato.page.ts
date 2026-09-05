import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder, ReactiveFormsModule,
  Validators, AbstractControl, ValidationErrors, ValidatorFn,
} from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { ActionSheetController, IonHeader, IonToolbar, IonButtons, IonBackButton } from '@ionic/angular';
import { Camera } from '@capacitor/camera';
import { Supabase } from '../../services/supabase';
import { Almacenamiento } from '../../services/almacenamiento';
import { LogoMarcaComponent } from '../../componentes/logo-marca/logo-marca.component';
import { RESTAURANTE } from '../../nucleo/marca';

function numeroPositivo(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const valor = parseFloat(control.value);
    return valor > 0 ? null : { numeroPositivo: true };
  };
}

@Component({
  selector: 'app-plato',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plato.page.html',
  styleUrls: ['./plato.page.scss'],
  imports: [/*IonBackButton, IonButtons, IonToolbar, IonHeader, */CommonModule, ReactiveFormsModule, IonContent, LogoMarcaComponent],
})
export class PlatoPage {
  private constructorFormulario = inject(FormBuilder);
  private actionSheetCtrl = inject(ActionSheetController);
  private supabase = inject(Supabase);
  private almacenamiento = inject(Almacenamiento);
  private location = inject(Location);

  protected readonly restaurante = RESTAURANTE;

  guardando = false;
  mensaje = '';

  formulario = this.constructorFormulario.group({
    nombre: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(40),
      Validators.pattern(/^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ0-9\s]+$/),
    ]],
    descripcion: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(150),
    ]],
    tiempo_elaboracion: ['', [
      Validators.required,
      Validators.pattern(/^\d+$/),
      numeroPositivo(),
    ]],
    precio: ['', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/),
      numeroPositivo(),
    ]],
  });

  fotos: (string | null)[] = [null, null, null];

  volver() {
    this.location.back();
  }

  async elegirFoto(indice: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Foto del plato',
      buttons: [
        { text: 'Tomar foto', handler: () => this.tomarConCamara(indice) },
        { text: 'Elegir de galería', handler: () => this.elegirDeGaleria(indice) },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await actionSheet.present();
  }

  private async tomarConCamara(indice: number) {
    try {
      const resultado = await Camera.takePhoto({ quality: 80, includeMetadata: true });
      this.fotos[indice] = `data:image/${resultado.metadata?.format ?? 'jpeg'};base64,${resultado.thumbnail}`;
    } catch {
      // el usuario canceló
    }
  }

  private async elegirDeGaleria(indice: number) {
    try {
      const { results } = await Camera.chooseFromGallery({ quality: 80, includeMetadata: true });
      if (results[0]) {
        this.fotos[indice] = `data:image/${results[0].metadata?.format ?? 'jpeg'};base64,${results[0].thumbnail}`;
      }
    } catch {
      // el usuario canceló
    }
  }

  fotosCompletas(): boolean {
    return this.fotos.every(f => f !== null);
  }

  fotosFaltantes(): number {
    return this.fotos.filter(f => f === null).length;
  }

  invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  soloNumerosEnteros(evento: KeyboardEvent) {
    const teclasPermitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (teclasPermitidas.includes(evento.key)) return;
    if (evento.ctrlKey || evento.metaKey) return;
    if (!/^[0-9]$/.test(evento.key)) evento.preventDefault();
  }

  soloNumerosConPunto(evento: KeyboardEvent) {
    const teclasPermitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (teclasPermitidas.includes(evento.key)) return;
    if (evento.ctrlKey || evento.metaKey) return;
    const valorActual = (evento.target as HTMLInputElement).value;
    if (evento.key === '.' && valorActual.includes('.')) {
      evento.preventDefault();
      return;
    }
    if (!/^[0-9.]$/.test(evento.key)) evento.preventDefault();
  }



  mensajeError(campo: string): string {
    const control = this.formulario.get(campo);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Este dato es requerido.';
    if (control.errors['minlength']) {
      return `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`;
    }
    if (control.errors['maxlength']) {
      return `No puede superar los ${control.errors['maxlength'].requiredLength} caracteres.`;
    }
    if (control.errors['pattern']) {
      switch (campo) {
        case 'nombre': return 'Solo se permiten letras, números y espacios.';
        case 'tiempo_elaboracion': return 'Ingresá solo números enteros (minutos).';
        case 'precio': return 'Ingresá un precio válido, ej: 4500 o 4500.50';
        default: return 'El formato ingresado no es válido.';
      }
    }
    if (control.errors['numeroPositivo']) return 'El valor debe ser mayor a 0.';
    return 'Dato inválido.';
  }

  mensajeEsError = false;

  async guardar() {
    this.mensaje = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensaje = 'Revisá los campos marcados.';
      this.mensajeEsError = true;
      return;
    }
    if (this.fotos.some(f => f === null)) {
      this.mensaje = 'Faltan cargar las 3 fotos del plato.';
      this.mensajeEsError = true;
      return;
    }

    try {
      this.guardando = true;

      const urlsFotos: string[] = [];
      for (const foto of this.fotos) {
        const url = await this.almacenamiento.subirImagen(foto as string, 'platos');
        if (!url) {
          this.guardando = false;
          this.mensaje = 'No se pudo subir una de las fotos, intentá nuevamente.';
          return;
        }
        urlsFotos.push(url);
      }

      const { error } = await this.supabase.client
        .from('platos')
        .insert({ ...this.formulario.value, fotos: urlsFotos });

      this.guardando = false;

      if (error) {
        this.mensaje = 'Error al guardar: ' + error.message;
        this.mensajeEsError = true;
      } else {
        this.mensaje = 'Plato guardado correctamente.';
        this.mensajeEsError = false;
        this.formulario.reset();
        this.fotos = [null, null, null];
      }
    } catch (err: any) {
      this.guardando = false;
      this.mensaje = 'ERROR: ' + (err.message || JSON.stringify(err));
      this.mensajeEsError = true;
    }
  }
}