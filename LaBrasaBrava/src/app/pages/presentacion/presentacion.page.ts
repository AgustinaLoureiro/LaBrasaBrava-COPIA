import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';

import { LogoCargandoComponent } from '../../componentes/logo-cargando/logo-cargando.component';
import { GRUPO, INTEGRANTES, RESTAURANTE, nombreCompleto } from '../../nucleo/marca';
import { SonidosService } from '../../nucleo/servicios/sonidos.service';
import { CargandoService } from '../../nucleo/servicios/cargando.service';

/**
 * Pantalla de presentación animada.
 *
 * El enunciado pide dos pantallas de presentación: la estática (la que
 * dibuja Android antes de que arranque la aplicación, configurada por
 * Capacitor) y esta, animada, que se muestra apenas la aplicación toma
 * el control. Ambas llevan el ícono centrado, el nombre del grupo y los
 * apellidos y nombres de los cuatro integrantes.
 */
@Component({
  selector: 'app-presentacion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonContent, LogoCargandoComponent],
  templateUrl: './presentacion.page.html',
  styleUrl: './presentacion.page.scss',
})
export class PresentacionPage implements OnInit {
  private readonly router = inject(Router);
  private readonly sonidos = inject(SonidosService);
  private readonly cargando = inject(CargandoService);

  protected readonly restaurante = RESTAURANTE;
  protected readonly grupo = GRUPO;
  protected readonly integrantes = INTEGRANTES;
  protected readonly nombreCompleto = nombreCompleto;

  /**
   * Cuánto dura el indicador de espera al pasar al ingreso.
   * La pantalla NO avanza sola: se queda hasta que se toca «Ingresar».
   */
  private readonly ESPERA_MS = 3000;

  /** Evita que se dispare dos veces si se toca el botón repetidas veces. */
  protected readonly pasando = signal(false);

  ngOnInit(): void {
    // Requisito del enunciado: sonido al iniciar la aplicación.
    void this.sonidos.inicioDeAplicacion();
  }

  /**
   * Pasa a la pantalla de ingreso mostrando el indicador de espera con el
   * logo durante tres segundos. De ahí en adelante la aplicación sigue su
   * curso normal.
   */
  protected async ingresar(): Promise<void> {
    if (this.pasando()) return;
    this.pasando.set(true);

    await this.cargando.durante(
      'Preparando el ingreso',
      () => new Promise<void>((seguir) => setTimeout(seguir, this.ESPERA_MS)),
    );

    await this.router.navigateByUrl('/ingreso', { replaceUrl: true });
  }
}
