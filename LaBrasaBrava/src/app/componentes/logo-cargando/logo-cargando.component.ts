import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { VarianteLogo } from '../logo-marca/logo-marca.component';

/**
 * Animación de carga de Brasa Brava.
 *
 * Es la animación que define el manual de marca
 * (docs/marca/MANUAL-DE-MARCA.md, variante «Loader Pro»), escrita en
 * Angular con animaciones de CSS. Sus tres etapas son:
 *
 *   1. Encendido: la llama se revela de abajo hacia arriba.
 *   2. Aparición del nombre: «Brasa Brava» sube y se asienta.
 *   3. Ciclo de brasas: la llama respira y titila, las brasas suben y el
 *      anillo de progreso gira. El ciclo empalma solo y se repite mientras
 *      dure la espera.
 *
 * La animación original traía las variantes naranja y crema sobre un fondo
 * casi negro, que el enunciado y el manual prohíben. Acá el fondo lo pone
 * quien usa el componente: el indicador de espera lo apoya sobre naranja
 * brasa con el isotipo en crema, que es exactamente lo que pide el manual.
 *
 * Ejemplos de uso:
 *   <app-logo-cargando [tamanio]="220" />
 *   <app-logo-cargando [tamanio]="120" [conPalabra]="false" [conAnillo]="false" />
 */
@Component({
  selector: 'app-logo-cargando',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="escena" aria-hidden="true">
      <!-- Resplandor de fondo: late al mismo ritmo que la llama. -->
      <span class="resplandor"></span>

      <!-- Anillo de progreso: gira sin parar mientras dura la espera. -->
      @if (conAnillo) {
        <svg class="anillo" viewBox="0 0 100 100">
          <circle class="anillo-base" cx="50" cy="50" r="46" />
          <circle class="anillo-avance" cx="50" cy="50" r="46" />
        </svg>
      }

      <!-- Brasas que suben, con recorridos y tiempos distintos. -->
      <span class="brasas">
        @for (brasa of BRASAS; track brasa.indice) {
          <span
            class="brasa"
            [style.--desde]="brasa.desde"
            [style.--hasta]="brasa.hasta"
            [style.--lado-brasa]="brasa.lado"
            [style.--demora]="brasa.demora"
          ></span>
        }
      </span>

      <!-- Isotipo: se enciende una vez y después respira y titila. -->
      <span class="llama">
        <img class="isotipo" [src]="archivo()" [alt]="'Logotipo de ' + nombre" />
      </span>
    </div>

    @if (conPalabra) {
      <p class="palabra">Brasa Brava</p>
    }
  `,
  styles: [
    `
      :host {
        /* El lado del cuadrado de la escena manda sobre todo lo demás:
           cambiando [tamanio] escala la animación entera. */
        display: grid;
        justify-items: center;
        gap: calc(var(--lado) * 0.06);
        line-height: 1;
      }

      .escena {
        position: relative;
        width: var(--lado);
        height: var(--lado);
        display: grid;
        place-items: center;
      }

      /* --- Resplandor ------------------------------------------------- */

      .resplandor {
        position: absolute;
        inset: -12%;
        border-radius: 50%;
        background: radial-gradient(
          circle,
          rgba(var(--brillo), 0.55) 0%,
          rgba(var(--brillo), 0.18) 45%,
          rgba(var(--brillo), 0) 70%
        );
        filter: blur(calc(var(--lado) * 0.04));
        animation: respirar-resplandor 0.8s ease-in-out infinite alternate;
      }

      @keyframes respirar-resplandor {
        from {
          opacity: 0.55;
          transform: scale(0.94);
        }
        to {
          opacity: 0.95;
          transform: scale(1.04);
        }
      }

      /* --- Anillo de progreso ------------------------------------------ */

      .anillo {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
        animation: girar 3.8s linear infinite;
      }

      .anillo circle {
        fill: none;
        stroke-linecap: round;
        transform-origin: 50% 50%;
      }

      .anillo-base {
        stroke: rgba(var(--brillo), 0.22);
        stroke-width: 1.2;
      }

      /* El tramo se alarga y se acorta, como el arco de progreso del
         archivo original. El perímetro del círculo mide 289 unidades. */
      .anillo-avance {
        stroke: rgba(var(--brillo), 0.9);
        stroke-width: 2.2;
        stroke-dasharray: 90 289;
        animation: avanzar 2.4s ease-in-out infinite;
      }

      @keyframes girar {
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes avanzar {
        0%,
        100% {
          stroke-dasharray: 58 289;
        }
        50% {
          stroke-dasharray: 132 289;
        }
      }

      /* --- Brasas que suben --------------------------------------------- */

      .brasas {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .brasa {
        position: absolute;
        left: 50%;
        top: 46%;
        width: var(--lado-brasa);
        height: var(--lado-brasa);
        border-radius: 50%;
        background: radial-gradient(
          circle,
          rgba(var(--brillo), 1) 0%,
          rgba(var(--brillo), 0.65) 55%,
          rgba(var(--brillo), 0) 100%
        );
        opacity: 0;
        animation: subir-brasa 1.2s linear infinite;
        animation-delay: var(--demora);
      }

      @keyframes subir-brasa {
        0% {
          transform: translate(var(--desde), 0) scale(1);
          opacity: 0;
        }
        30% {
          opacity: 0.9;
        }
        100% {
          transform: translate(var(--hasta), calc(var(--lado) * -0.55)) scale(0.35);
          opacity: 0;
        }
      }

      /* --- Isotipo ------------------------------------------------------- */
      /* Dos animaciones encimadas: el encendido, que se reproduce una sola
         vez, y el titileo, que se repite mientras dure la espera. */

      .llama {
        position: relative;
        display: grid;
        place-items: center;
        width: 72%;
        height: 72%;
        animation: encender 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      .isotipo {
        width: 100%;
        height: 100%;
        object-fit: contain;
        animation: titilar 1.2s ease-in-out 0.75s infinite;
      }

      @keyframes encender {
        from {
          clip-path: inset(100% 0 0 0);
          transform: scale(0.94);
          filter: brightness(0.7);
        }
        to {
          clip-path: inset(0 0 0 0);
          transform: scale(1);
          filter: brightness(1);
        }
      }

      @keyframes titilar {
        0%,
        100% {
          transform: scale(1) skewX(0.6deg);
          filter: brightness(1.04);
        }
        35% {
          transform: scale(1.025) skewX(-0.5deg);
          filter: brightness(1.11);
        }
        70% {
          transform: scale(0.985) skewX(0.35deg);
          filter: brightness(0.97);
        }
      }

      /* --- Nombre --------------------------------------------------------- */

      .palabra {
        margin: 0;
        font-family: var(--tipografia-titulos);
        font-weight: 800;
        font-size: calc(var(--lado) * 0.13);
        letter-spacing: 0.22em;
        text-transform: uppercase;
        text-align: center;
        color: var(--color-palabra);
        /* La palabra aparece recién cuando terminó de encenderse la llama. */
        animation: asentar-palabra 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
      }

      @keyframes asentar-palabra {
        from {
          opacity: 0;
          transform: translateY(calc(var(--lado) * 0.05));
          letter-spacing: 0.34em;
        }
        to {
          opacity: 1;
          transform: translateY(0);
          letter-spacing: 0.22em;
        }
      }

      /* Con el movimiento reducido queda el logo quieto y legible. */
      @media (prefers-reduced-motion: reduce) {
        .resplandor,
        .anillo,
        .anillo-avance,
        .brasa,
        .llama,
        .isotipo,
        .palabra {
          animation: none;
        }

        .brasa {
          opacity: 0.6;
        }
      }
    `,
  ],
  host: {
    '[style.--lado.px]': 'tamanio',
    '[style.--brillo]': 'brillo()',
    '[style.--color-palabra]': 'colorPalabra()',
  },
})
export class LogoCargandoComponent {
  /** Lado del cuadrado que ocupa la escena, en píxeles. */
  @Input() tamanio = 200;

  /** Variante de color del isotipo, de las tres que define el manual. */
  @Input() variante: VarianteLogo = 'crema';

  /** Muestra el nombre debajo, como la etapa 2 de la animación original. */
  @Input() conPalabra = true;

  /** Muestra el anillo de progreso que gira alrededor del isotipo. */
  @Input() conAnillo = true;

  /** Texto alternativo para lectores de pantalla. */
  @Input() nombre = 'Brasa Brava';

  /**
   * Archivo del isotipo, color del resplandor y color del nombre de cada
   * variante. El color del resplandor va con los tres canales sueltos
   * porque las brasas y el resplandor lo usan con transparencia.
   */
  private static readonly VARIANTES: Record<
    VarianteLogo,
    { archivo: string; brillo: string; palabra: string }
  > = {
    color: { archivo: 'assets/marca/logo-bb.png', brillo: '242, 166, 59', palabra: '#f0dfc6' },
    crema: {
      archivo: 'assets/marca/logo-bb-crema.png',
      brillo: '240, 223, 198',
      palabra: '#f0dfc6',
    },
    carbon: { archivo: 'assets/marca/logo-bb-carbon.png', brillo: '46, 42, 40', palabra: '#2e2a28' },
  };

  /** Brasas: cada una arranca y termina en un lugar distinto del ancho. */
  protected readonly BRASAS = [
    { indice: 1, desde: '-2.6em', hasta: '-1.9em', lado: '0.42em', demora: '0s' },
    { indice: 2, desde: '1.7em', hasta: '0.8em', lado: '0.3em', demora: '-0.3s' },
    { indice: 3, desde: '-0.8em', hasta: '0.2em', lado: '0.36em', demora: '-0.55s' },
    { indice: 4, desde: '2.9em', hasta: '2.3em', lado: '0.24em', demora: '-0.8s' },
    { indice: 5, desde: '-3.4em', hasta: '-2.9em', lado: '0.3em', demora: '-1.05s' },
    { indice: 6, desde: '0.4em', hasta: '-0.4em', lado: '0.34em', demora: '-1.45s' },
  ];

  protected archivo(): string {
    return LogoCargandoComponent.VARIANTES[this.variante].archivo;
  }

  protected brillo(): string {
    return LogoCargandoComponent.VARIANTES[this.variante].brillo;
  }

  protected colorPalabra(): string {
    return LogoCargandoComponent.VARIANTES[this.variante].palabra;
  }
}
