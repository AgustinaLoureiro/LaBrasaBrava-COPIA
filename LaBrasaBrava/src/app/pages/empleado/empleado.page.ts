import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { Camara } from '../../services/camara';
import { Almacenamiento } from '../../services/almacenamiento';
import { SupabaseService } from '../../nucleo/servicios/supabase.service';
import { LogoMarcaComponent } from '../../componentes/logo-marca/logo-marca.component';
import { NOMBRE_PERFIL, Perfil } from '../../nucleo/modelos/usuario';
import { RESTAURANTE } from '../../nucleo/marca';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.page.html',
  styleUrls: ['./empleado.page.scss'],
  imports: [CommonModule, ReactiveFormsModule, IonContent, LogoMarcaComponent]
})
export class EmpleadoPage implements OnInit {
  private constructorFormulario = inject(FormBuilder);
  private camara = inject(Camara);
  private almacenamiento = inject(Almacenamiento);
  private supabase = inject(SupabaseService);
  private location = inject(Location);

  protected readonly restaurante = RESTAURANTE;
  protected readonly NOMBRE_PERFIL = NOMBRE_PERFIL;

  fotoPrevia: string | null = null;
  guardando = false;
  claveVisible = false;
  mensaje = '';
  /** Pinta el mensaje final en rojo o en verde según cómo haya salido. */
  mensajeEsError = false;

  formulario = this.constructorFormulario.group({
    nombres: ['', [Validators.required, Validators.minLength(2)]],
    apellidos: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
    cuil: ['', [Validators.required, Validators.pattern(/^\d{2}-\d{7,8}-\d{1}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    perfil: ['', Validators.required]
  });

  /** Perfiles que se pueden dar de alta: los del personal del local. */
  perfiles: Perfil[] = ['dueño', 'supervisor', 'metre', 'mozo', 'cocinero', 'cantinero'];

  volver() {
    this.location.back();
  }

  alternarClave() {
    this.claveVisible = !this.claveVisible;
  }

  async ngOnInit() {
    // Restaurar borrador si existe
    const { value } = await Preferences.get({ key: 'borrador-alta-empleado' });
    if (value) {
      this.formulario.patchValue(JSON.parse(value));
    }

    // Autoguardar cada vez que cambia algo del formulario
    this.formulario.valueChanges.subscribe(valores => {
      Preferences.set({ key: 'borrador-alta-empleado', value: JSON.stringify(valores) });
    });
  }

  async sacarFoto() {
    const foto = await this.camara.tomarFoto();
    if (foto) {
      this.fotoPrevia = foto;
    }
  }

  async guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensajeEsError = true;
      this.mensaje = 'Revisá los campos marcados.';
      return;
    }
    if (!this.fotoPrevia) {
      this.mensajeEsError = true;
      this.mensaje = 'Falta sacar la foto del empleado.';
      return;
    }

    this.guardando = true;
    const urlFoto = await this.almacenamiento.subirImagen(this.fotoPrevia, 'empleados');

    if (!urlFoto) {
      this.guardando = false;
      this.mensajeEsError = true;
      this.mensaje = 'No se pudo subir la foto, intentá nuevamente.';
      return;
    }

    const { error } = await this.supabase.cliente
      .from('empleados')
      .insert({
        ...this.formulario.value,
        foto_url: urlFoto
      });

    this.guardando = false;

    if (error) {
      this.mensajeEsError = true;
      this.mensaje = 'No se pudo guardar el empleado: ' + error.message;
    } else {
      this.mensajeEsError = false;
      this.mensaje = 'El empleado se guardó correctamente.';
      this.formulario.reset();
      this.fotoPrevia = null;
      await Preferences.remove({ key: 'borrador-alta-empleado' });
    }

    
  }

  invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  mensajeError(campo: string): string {
    const control = this.formulario.get(campo);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este dato es requerido.';
    if (control.errors['minlength']) {
      const requerido = control.errors['minlength'].requiredLength;
      return `Debe tener al menos ${requerido} caracteres.`;
    }
    if (control.errors['pattern']) {
      switch (campo) {
        case 'dni': return 'El DNI debe tener 7 u 8 números, sin puntos.';
        case 'cuil': return 'Formato de CUIL inválido. Ejemplo: 20-12345678-9';
        default: return 'El formato ingresado no es válido.';
      }
    }
    if (control.errors['email']) return 'Ingresá un correo electrónico válido.';

    return 'Dato inválido.';
  }

}
