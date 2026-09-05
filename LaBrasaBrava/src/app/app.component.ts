import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

import { SpinnerLogoComponent } from './componentes/spinner-logo/spinner-logo.component';
import { SonidosService } from './nucleo/servicios/sonidos.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, SpinnerLogoComponent],
})
export class AppComponent implements OnInit {
  private readonly sonidos = inject(SonidosService);

  ngOnInit(): void {
    // Requisito del enunciado: sonido distinto al cerrar la aplicación.
    window.addEventListener('beforeunload', () => {
      void this.sonidos.cierreDeAplicacion();
    });
  }
}
