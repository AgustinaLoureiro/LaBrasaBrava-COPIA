import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { CargandoService } from '../../nucleo/servicios/cargando.service';
import { LogoMarcaComponent } from '../logo-marca/logo-marca.component';

/**
 * Indicador de espera con el logo de la empresa.
 *
 * El manual de marca lo define así: el isotipo en crema sobre naranja
 * brasa, cubriendo toda la pantalla.
 *
 * Se coloca una sola vez, en app.component.html, y se muestra solo cuando
 * el CargandoService informa que hay una operación en curso. Así ninguna
 * espera de la aplicación queda sin indicador, como exige el enunciado.
 */
@Component({
  selector: 'app-spinner-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoMarcaComponent],
  template: `
    @if (cargando.visible()) {
      <div class="velo" role="status" aria-live="polite">
        <div class="contenido">
          <div class="aro">
            <app-logo-marca [tamanio]="88" variante="crema" [animado]="true" />
          </div>
          <p class="texto">{{ cargando.texto() }}</p>
          <div class="puntos" aria-hidden="true">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .velo {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: grid;
        place-items: center;
        background: var(--fondo-espera);
      }

      .contenido {
        display: grid;
        justify-items: center;
        gap: var(--espacio);
      }

      /* El aro gira alrededor del isotipo, que queda quieto. */
      .aro {
        display: grid;
        place-items: center;
        padding: var(--espacio);
        border-radius: 50%;
        border: 0.3rem solid rgba(240, 223, 198, 0.3);
        border-top-color: var(--crema-trigo);
        animation: girar 1.15s linear infinite;
      }

      .aro app-logo-marca {
        animation: girar 1.15s linear infinite reverse;
      }

      .texto {
        margin: 0;
        font: var(--texto-subtitulo);
        letter-spacing: var(--espaciado-mayusculas);
        color: var(--crema-trigo);
        text-align: center;
      }

      .puntos {
        display: flex;
        gap: 0.45rem;
      }

      .puntos span {
        width: 0.6rem;
        height: 0.6rem;
        border-radius: 50%;
        background: var(--crema-trigo);
        animation: rebotar 1s ease-in-out infinite;
      }

      .puntos span:nth-child(2) {
        animation-delay: 0.15s;
      }

      .puntos span:nth-child(3) {
        animation-delay: 0.3s;
      }

      @keyframes girar {
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes rebotar {
        0%,
        100% {
          transform: translateY(0);
          opacity: 0.5;
        }
        50% {
          transform: translateY(-0.45rem);
          opacity: 1;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .aro,
        .aro app-logo-marca,
        .puntos span {
          animation: none;
        }
      }
    `,
  ],
})
export class SpinnerLogoComponent {
  readonly cargando = inject(CargandoService);
}
