import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { CargandoService } from '../../nucleo/servicios/cargando.service';
import { LogoCargandoComponent } from '../logo-cargando/logo-cargando.component';

/**
 * Indicador de espera con el logo de la empresa.
 *
 * El manual de marca lo define así: el isotipo en crema sobre naranja
 * brasa, cubriendo toda la pantalla. El isotipo no es una imagen quieta:
 * es la animación de carga que entregó el manual, reescrita en Angular en
 * LogoCargandoComponent.
 *
 * Se coloca una sola vez, en app.component.html, y se muestra solo cuando
 * el CargandoService informa que hay una operación en curso. Así ninguna
 * espera de la aplicación queda sin indicador, como exige el enunciado.
 */
@Component({
  selector: 'app-spinner-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogoCargandoComponent],
  template: `
    @if (cargando.visible()) {
      <div class="velo" role="status" aria-live="polite">
        <div class="contenido">
          <app-logo-cargando [tamanio]="216" variante="crema" />
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
      /* Naranja brasa a pantalla completa, con las brasas del degradado
         empujando hacia el borde: ni un espacio neutro. */
      .velo {
        position: fixed;
        inset: 0;
        z-index: 99999;
        display: grid;
        place-items: center;
        padding: var(--espacio-grande);
        background:
          radial-gradient(circle at 50% 42%, rgba(242, 166, 59, 0.45) 0%, rgba(242, 166, 59, 0) 62%),
          var(--fondo-espera);
        animation: entrar-velo 0.25s ease-out both;
      }

      @keyframes entrar-velo {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .contenido {
        display: grid;
        justify-items: center;
        gap: var(--espacio);
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
        .velo,
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
