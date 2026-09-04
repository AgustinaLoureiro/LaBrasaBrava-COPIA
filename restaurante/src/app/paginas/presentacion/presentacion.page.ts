import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';

import { LogoCargandoComponent } from '../../compartido/logo-cargando/logo-cargando.component';
import { GRUPO, INTEGRANTES, RESTAURANTE, nombreCompleto } from '../../nucleo/marca';
import { SonidosService } from '../../nucleo/servicios/sonidos.service';

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

  protected readonly restaurante = RESTAURANTE;
  protected readonly grupo = GRUPO;
  protected readonly integrantes = INTEGRANTES;
  protected readonly nombreCompleto = nombreCompleto;

  /** Duración total de la animación antes de pasar al ingreso. */
  private readonly DURACION_MS = 4200;

  async ngOnInit(): Promise<void> {
    // Requisito del enunciado: sonido al iniciar la aplicación.
    void this.sonidos.inicioDeAplicacion();

    setTimeout(() => {
      void this.router.navigateByUrl('/ingreso', { replaceUrl: true });
    }, this.DURACION_MS);
  }

  /** Permite saltear la animación tocando la pantalla. */
  protected saltear(): void {
    void this.router.navigateByUrl('/ingreso', { replaceUrl: true });
  }
}
