import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { IonContent } from '@ionic/angular';

import { LogoMarcaComponent } from '../../componentes/logo-marca/logo-marca.component';
import { RESTAURANTE } from '../../nucleo/marca';

/**
 * Encuesta de satisfacción.
 *
 * La pantalla todavía no está construida: por ahora usa la misma
 * estructura que el resto de los módulos y anuncia lo que va a hacer,
 * para que no quede una página en blanco.
 * Punto 20 del enunciado.
 */
@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
  imports: [IonContent, LogoMarcaComponent],
})
export class EncuestaPage {
  private readonly location = inject(Location);

  protected readonly restaurante = RESTAURANTE;

  protected volver(): void {
    this.location.back();
  }
}
