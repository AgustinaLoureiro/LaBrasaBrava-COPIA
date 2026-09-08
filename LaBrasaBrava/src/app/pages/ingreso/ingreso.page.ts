import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { IonContent } from '@ionic/angular';

import { LogoMarcaComponent } from '../../componentes/logo-marca/logo-marca.component';
import { SesionService } from '../../nucleo/servicios/sesion.service';
import { MensajesService } from '../../nucleo/servicios/mensajes.service';
import { CargandoService } from '../../nucleo/servicios/cargando.service';
import {
  AccesoRapido,
  COLOR_PERFIL,
  ETIQUETA_ESTADO_APROBACION,
  NOMBRE_ESTADO_APROBACION,
  NOMBRE_PERFIL,
  TEXTO_SOBRE_PERFIL,
} from '../../nucleo/modelos/usuario';
import { GRUPO, RESTAURANTE } from '../../nucleo/marca';
import { faltaConfigurarSupabase } from '../../nucleo/configuracion';

/**
 * Pantalla de ingreso.
 *
 * Cumple con tres requisitos del enunciado:
 *   · Valida todos los campos del formulario (correo y clave).
 *   · Ofrece accesos rápidos por perfil, leídos de la base de datos y no
 *     escritos fijos en el código.
 *   · El ingreso es real contra Supabase.
 */
@Component({
  selector: 'app-ingreso',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonContent, ReactiveFormsModule, LogoMarcaComponent],
  templateUrl: './ingreso.page.html',
  styleUrl: './ingreso.page.scss',
})
export class IngresoPage implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly sesion = inject(SesionService);
  private readonly mensajes = inject(MensajesService);
  private readonly cargando = inject(CargandoService);
  private readonly router = inject(Router);

  protected readonly restaurante = RESTAURANTE;
  protected readonly grupo = GRUPO;
  protected readonly NOMBRE_PERFIL = NOMBRE_PERFIL;
  protected readonly COLOR_PERFIL = COLOR_PERFIL;
  protected readonly TEXTO_SOBRE_PERFIL = TEXTO_SOBRE_PERFIL;
  protected readonly NOMBRE_ESTADO_APROBACION = NOMBRE_ESTADO_APROBACION;
  protected readonly ETIQUETA_ESTADO_APROBACION = ETIQUETA_ESTADO_APROBACION;

  protected readonly accesos = signal<AccesoRapido[]>([]);
  protected readonly claveVisible = signal(false);
  protected readonly intentoDeEnvio = signal(false);

  /**
   * Expresión para validar el correo.
   * La de Angular acepta direcciones sin punto en el dominio, como
   * "juan@servidor", así que se usa una propia, más estricta.
   */
  private readonly PATRON_CORREO = /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(\.[\w-]+)+$/;

  protected readonly formulario = this.formBuilder.nonNullable.group({
    correo: [
      '',
      [Validators.required, Validators.pattern(this.PATRON_CORREO), Validators.maxLength(120)],
    ],
    clave: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(64)],
    ],
  });

  async ngOnInit(): Promise<void> {
    if (faltaConfigurarSupabase()) {
      await this.mensajes.aviso(
        'Falta configurar la conexión',
        'Completá los datos de Supabase en el archivo nucleo/configuracion.ts.',
      );
      return;
    }

    const accesos = await this.cargando.durante('Preparando los accesos', () =>
      this.sesion.accesosRapidos(),
    );
    this.accesos.set(accesos);
  }

  // --- Validación ----------------------------------------------------

  protected campo(nombre: 'correo' | 'clave'): AbstractControl {
    return this.formulario.controls[nombre];
  }

  /** El error se muestra si el campo fue tocado o si ya intentó enviar. */
  protected debeMostrarError(nombre: 'correo' | 'clave'): boolean {
    const control = this.campo(nombre);
    return control.invalid && (control.touched || this.intentoDeEnvio());
  }

  /** Mensaje de error en español, específico para cada regla incumplida. */
  protected mensajeDeError(nombre: 'correo' | 'clave'): string {
    const errores = this.campo(nombre).errors;
    if (!errores) return '';

    if (nombre === 'correo') {
      if (errores['required']) return 'Escribí tu dirección de correo electrónico.';
      if (errores['pattern']) return 'El correo debe tener el formato nombre@servidor.com.';
      if (errores['maxlength']) return 'El correo no puede superar los 120 caracteres.';
    }

    if (errores['required']) return 'Escribí tu contraseña.';
    if (errores['minlength']) return 'La contraseña debe tener al menos 6 caracteres.';
    if (errores['maxlength']) return 'La contraseña no puede superar los 64 caracteres.';

    return 'Revisá este dato.';
  }

  // --- Acciones ------------------------------------------------------

  protected alternarClave(): void {
    this.claveVisible.update((visible) => !visible);
  }

  /**
   * Carga las credenciales del acceso rápido elegido.
   *
   * Si la ficha trae la contraseña (los empleados), entra directamente.
   * Si no la trae (los clientes registrados, cuya contraseña guarda
   * Supabase Auth), completa el correo y avisa que falta escribirla.
   */
  protected async usarAccesoRapido(acceso: AccesoRapido): Promise<void> {
    this.formulario.patchValue({ correo: acceso.correo, clave: acceso.clave_demo });
    await this.ingresar();
  }

  protected async ingresar(): Promise<void> {
    this.intentoDeEnvio.set(true);

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      await this.mensajes.error(
        'Revisá los datos',
        'Hay campos sin completar o con un formato incorrecto.',
      );
      return;
    }

    const { correo, clave } = this.formulario.getRawValue();

    const resultado = await this.cargando.durante('Verificando tus datos', () =>
      this.sesion.ingresar(correo, clave),
    );

    switch (resultado.estado) {
      case 'correcto':
        await this.mensajes.correcto(
          `Hola, ${resultado.usuario.nombres}`,
          `Ingresaste como ${NOMBRE_PERFIL[resultado.usuario.perfil]}.`,
        );
        this.formulario.reset();
        this.intentoDeEnvio.set(false);
        await this.router.navigateByUrl('/principal', { replaceUrl: true });
        break;

      case 'credenciales-invalidas':
        await this.mensajes.error(
          'No pudimos verificarte',
          'El correo electrónico o la contraseña son incorrectos.',
        );
        break;

      case 'pendiente-de-aprobacion':
        await this.mensajes.error(
          'Tu registro está pendiente',
          'Todavía no fue aprobado. Vas a recibir un correo electrónico cuando se resuelva.',
        );
        break;

      case 'rechazado':
        await this.mensajes.error(
          'Registro rechazado',
          'Tu solicitud fue rechazada, por lo que no podés ingresar a la aplicación.',
        );
        break;

      case 'sin-perfil':
        await this.mensajes.error(
          'Falta tu ficha de usuario',
          'Tu cuenta existe pero no tiene perfil asignado. Avisá al supervisor.',
        );
        break;

      case 'error-de-conexion':
        await this.mensajes.error('No hay conexión', resultado.detalle);
        break;
    }
  }
}
