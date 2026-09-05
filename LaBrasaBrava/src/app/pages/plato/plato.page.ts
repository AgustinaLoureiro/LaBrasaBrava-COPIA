import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonButtons, IonBackButton} from '@ionic/angular';
import { Camera } from '@capacitor/camera';
import { ActionSheetController } from '@ionic/angular';
import { SupabaseService } from '../../nucleo/servicios/supabase.service';
import { Almacenamiento } from '../../services/almacenamiento';

//import { IonButton } from "@ionic/angular/standalone";

function numeroPositivo(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const valor = parseFloat(control.value);
    return valor > 0 ? null : { numeroPositivo: true };
  };
}

// Componente que representa la página de creación de un plato

@Component({
  selector: 'app-plato',
  templateUrl: './plato.page.html',
  styleUrls: ['./plato.page.scss'],
  imports: [IonBackButton, IonButtons, IonIcon, IonButton, 
    CommonModule, ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput
  ]
})

// Clase que representa la página de creación de un plato

export class PlatoPage{
  private constructorFormulario = inject(FormBuilder);
  private actionSheetCtrl = inject(ActionSheetController);
  private supabase = inject(SupabaseService);
  private almacenamiento = inject(Almacenamiento);

  guardando = false;
  mensaje = '';

  // Formulario reactivo para la creación de un plato, con validaciones para cada campo

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

  // Array para almacenar las fotos del plato, inicializado con valores nulos

  fotos: (string | null)[] = [null, null, null];

  // Método para mostrar un ActionSheet que permite al usuario elegir entre tomar una foto con la cámara o seleccionar una de la galería

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

  //  Método para tomar una foto con la cámara del dispositivo

  private async tomarConCamara(indice: number) {
    try {
      const resultado = await Camera.takePhoto({
        quality: 80,
        includeMetadata: true,
      });
      this.fotos[indice] = `data:image/${resultado.metadata?.format ?? 'jpeg'};base64,${resultado.thumbnail}`;
    } catch {
      // el usuario canceló, no hacemos nada
    }
  }

  // Método para elegir una foto de la galería del dispositivo

  private async elegirDeGaleria(indice: number) {
    try {
      const { results } = await Camera.chooseFromGallery({
        quality: 80,
        includeMetadata: true,
      });
      if (results[0]) {
        this.fotos[indice] = `data:image/${results[0].metadata?.format ?? 'jpeg'};base64,${results[0].thumbnail}`;
      }
    } catch {
      // el usuario canceló
    }
  }

  // Método para verificar si todas las fotos han sido cargadas

  fotosCompletas(): boolean {
    return this.fotos.every(f => f !== null);
  }

  // Método para verificar si un campo del formulario es inválido y ha sido tocado o modificado

  invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  // Método para permitir solo números y un punto decimal en el campo de precio

  soloNumerosEnteros(evento: KeyboardEvent) {
    const teclasPermitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (teclasPermitidas.includes(evento.key)) return;
    if (evento.ctrlKey || evento.metaKey) return;
    if (!/^[0-9]$/.test(evento.key)) {
      evento.preventDefault();
    }
  }

  // Método para permitir solo números y un punto decimal en el campo de precio

  soloNumerosConPunto(evento: KeyboardEvent) {
    const teclasPermitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (teclasPermitidas.includes(evento.key)) return;
    if (evento.ctrlKey || evento.metaKey) return;

    const valorActual = (evento.target as HTMLInputElement).value;
    // bloquea un segundo punto si ya hay uno
    if (evento.key === '.' && valorActual.includes('.')) {
      evento.preventDefault();
      return;
    }
    if (!/^[0-9.]$/.test(evento.key)) {
      evento.preventDefault();
    }
  }

  // Método para obtener el mensaje de error de un campo del formulario

  mensajeError(campo: string): string {
    const control = this.formulario.get(campo);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este dato es requerido.';
    if (control.errors['minlength']) {
      const requerido = control.errors['minlength'].requiredLength;
      return `Debe tener al menos ${requerido} caracteres.`;
    }
    if (control.errors['maxlength']) {
      const max = control.errors['maxlength'].requiredLength;
      return `No puede superar los ${max} caracteres.`;
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

  // Método para guardar el plato en la base de datos

  async guardar() {
    this.mensaje = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensaje = 'Revisá los campos marcados.';
      return;
    }

    if (this.fotos.some(f => f === null)) {
      this.mensaje = 'Faltan cargar las 3 fotos del plato.';
      return;
    }

    // AGREGAMOS UN TRY/CATCH GLOBAL PARA CAPTURAR CUALQUIER CAÍDA SILENCIOSA
    try {

    this.guardando = true;

    // Subir las 3 fotos y juntar sus URLs
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

    const { error } = await this.supabase.cliente
      .from('platos')
      .insert({
        ...this.formulario.value,
        fotos: urlsFotos,
      });

    this.guardando = false;

    if (error) {
      this.mensaje = 'Error al guardar: ' + error.message;
    } else {
      this.mensaje = 'Plato guardado correctamente.';
      this.formulario.reset();
      this.fotos = [null, null, null];
    }
    } catch (err: any) {
      // SI ALGO SE ROMPE NATIVAMENTE, LO MUESTRA EN LA PANTALLA DE LA APP
      this.guardando = false;
      this.mensaje = 'ERROR CRÍTICO CAPTURADO: ' + (err.message || JSON.stringify(err));
    }
  }
}


