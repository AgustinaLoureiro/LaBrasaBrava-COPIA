import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { IonContent } from '@ionic/angular';

import { LogoMarcaComponent } from '../../componentes/logo-marca/logo-marca.component';
import { RESTAURANTE } from '../../nucleo/marca';

/**
 * Aprobación de clientes.
 *
 * La pantalla todavía no está construida: por ahora usa la misma
 * estructura que el resto de los módulos y anuncia lo que va a hacer,
 * para que no quede una página en blanco.
 * Puntos 6, 7 y 8 del enunciado.
 */
@Component({
  selector: 'app-aprobacion-clientes',
  templateUrl: './aprobacion-clientes.page.html',
  styleUrls: ['./aprobacion-clientes.page.scss'],
  imports: [IonContent, LogoMarcaComponent],
})
export class AprobacionClientesPage {
  private readonly location = inject(Location);

  protected readonly restaurante = RESTAURANTE;

  protected volver(): void {
    this.location.back();
  }
}
