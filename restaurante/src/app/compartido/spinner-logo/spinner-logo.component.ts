import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { CargandoService } from '../../nucleo/servicios/cargando.service';
import { LogoMarcaComponent } from '../logo-marca/logo-marca.component';

/**
 * Indicador de espera con el logo de la empresa.
 *
 * Se coloca una sola vez, en app.component.html, y se muestra solo cuando
 * el CargandoService informa que hay una operación en curso. Así ninguna
 * espera de la aplicación queda sin indicador.
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
            <app-logo-marca [tamanio]="96" />
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
        background: linear-gradient(
          160deg,
          rgba(201, 81, 31, 0.97),
          rgba(139, 47, 28, 0.97)
        );
      }
      .contenido {
        display: grid;
        justify-items: center;
        gap: 1.1rem;
      }
      .aro {
        display: grid;
        place-items: center;
        padding: 1rem;
        border-radius: 50%;
        border: 0.35rem solid rgba(255, 244, 226, 0.28);
        border-top-color: #e9a227;
        animation: girar 1.15s linear infinite;
      }
      /* El logo gira al revés que el aro para quedar siempre derecho. */
      .aro app-logo-marca {
        animation: girar 1.15s linear infinite reverse;
      }
      .texto {
        margin: 0;
        font-weight: 700;
        font-size: 1.05rem;
        color: #fff4e2;
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
        background: #e9a227;
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
          opacity: 0.55;
        }
        50% {
          transform: translateY(-0.5rem);
          opacity: 1;
        }
      }
    `,
  ],
})
export class SpinnerLogoComponent {
  readonly cargando = inject(CargandoService);
}
