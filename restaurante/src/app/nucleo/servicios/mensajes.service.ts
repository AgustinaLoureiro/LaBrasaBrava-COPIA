import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Muestra la información y los errores de la aplicación.
 *
 * Dos reglas del enunciado se cumplen desde acá, de forma centralizada:
 *   · Nunca se usa alert(): todo se muestra con controles de Ionic.
 *   · Todo error hace vibrar el dispositivo.
 *
 * Al concentrar el manejo en un solo servicio, ningún error puede quedar
 * sin vibración por olvido.
 */
@Injectable({ providedIn: 'root' })
export class MensajesService {
  private readonly toastController = inject(ToastController);

  /** Error: mensaje en color vino y vibración doble. */
  async error(titulo: string, detalle: string): Promise<void> {
    await this.vibrarError();
    await this.mostrar(titulo, detalle, 'mensaje-error', 'alert-circle', 4000);
  }

  /** Confirmación: mensaje en verde y vibración corta. */
  async correcto(titulo: string, detalle: string): Promise<void> {
    await this.vibrarLeve();
    await this.mostrar(titulo, detalle, 'mensaje-correcto', 'checkmark-circle', 2600);
  }

  /** Aviso: mensaje en ámbar, sin vibración. */
  async aviso(titulo: string, detalle: string): Promise<void> {
    await this.mostrar(titulo, detalle, 'mensaje-aviso', 'information-circle', 3200);
  }

  private async mostrar(
    titulo: string,
    detalle: string,
    clase: string,
    icono: string,
    duracion: number,
  ): Promise<void> {
    const toast = await this.toastController.create({
      header: titulo,
      message: detalle,
      icon: icono,
      duration: duracion,
      position: 'top',
      cssClass: clase,
      buttons: [{ text: 'Cerrar', role: 'cancel' }],
    });
    await toast.present();
  }

  /**
   * Vibración de error. En el navegador los plugins de Capacitor no
   * están disponibles, así que se recurre a la interfaz del navegador y,
   * si tampoco existe, simplemente no se hace nada.
   */
  private async vibrarError(): Promise<void> {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch {
      navigator.vibrate?.([120, 60, 120]);
    }
  }

  private async vibrarLeve(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      navigator.vibrate?.(45);
    }
  }
}
