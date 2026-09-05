import { Injectable } from '@angular/core';

/**
 * Sonidos de la aplicación.
 *
 * El enunciado exige sonidos DISTINTOS al iniciar y al cerrar. Se generan
 * con la interfaz de audio del navegador en lugar de usar archivos, así
 * no hay que sumar recursos al repositorio y suenan igual en cualquier
 * dispositivo.
 *
 * Al iniciar suena un arpegio ascendente y al cerrar uno descendente,
 * claramente diferenciables entre sí.
 */
@Injectable({ providedIn: 'root' })
export class SonidosService {
  private contexto: AudioContext | null = null;

  /** Arpegio ascendente: la aplicación se abre. */
  async inicioDeAplicacion(): Promise<void> {
    await this.reproducirSecuencia([
      { frecuencia: 392.0, desde: 0.0, duracion: 0.16 }, // sol
      { frecuencia: 523.25, desde: 0.13, duracion: 0.16 }, // do
      { frecuencia: 659.25, desde: 0.26, duracion: 0.34 }, // mi
    ]);
  }

  /** Arpegio descendente: la aplicación se cierra. */
  async cierreDeAplicacion(): Promise<void> {
    await this.reproducirSecuencia([
      { frecuencia: 587.33, desde: 0.0, duracion: 0.15 }, // re
      { frecuencia: 440.0, desde: 0.13, duracion: 0.15 }, // la
      { frecuencia: 293.66, desde: 0.26, duracion: 0.4 }, // re grave
    ]);
  }

  private obtenerContexto(): AudioContext | null {
    try {
      this.contexto ??= new AudioContext();
      // Los navegadores suspenden el audio hasta que el usuario interactúa.
      if (this.contexto.state === 'suspended') void this.contexto.resume();
      return this.contexto;
    } catch {
      return null;
    }
  }

  private async reproducirSecuencia(
    notas: { frecuencia: number; desde: number; duracion: number }[],
  ): Promise<void> {
    const contexto = this.obtenerContexto();
    if (!contexto) return;

    const ahora = contexto.currentTime;

    for (const nota of notas) {
      const oscilador = contexto.createOscillator();
      const volumen = contexto.createGain();

      oscilador.type = 'triangle';
      oscilador.frequency.value = nota.frecuencia;

      const comienzo = ahora + nota.desde;
      const fin = comienzo + nota.duracion;

      // Envolvente suave para que no se escuche un chasquido.
      volumen.gain.setValueAtTime(0.0001, comienzo);
      volumen.gain.exponentialRampToValueAtTime(0.22, comienzo + 0.03);
      volumen.gain.exponentialRampToValueAtTime(0.0001, fin);

      oscilador.connect(volumen).connect(contexto.destination);
      oscilador.start(comienzo);
      oscilador.stop(fin + 0.02);
    }
  }
}
