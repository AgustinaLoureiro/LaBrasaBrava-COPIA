import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Isotipo de la marca, dibujado como vector para que se vea nítido en
 * cualquier tamaño y se pueda animar por partes.
 *
 * Representa una llama sobre las barras de una parrilla, dentro de un
 * medallón circular con borde ámbar.
 */
@Component({
  selector: 'app-logo-marca',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="tamanio"
      [attr.height]="tamanio"
      viewBox="0 0 200 200"
      role="img"
      [attr.aria-label]="'Isotipo de ' + nombre"
    >
      <defs>
        <linearGradient id="degradadoLlama" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stop-color="#c9511f" />
          <stop offset="55%" stop-color="#e9a227" />
          <stop offset="100%" stop-color="#f5c45f" />
        </linearGradient>
        <linearGradient id="degradadoFondo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#a83a18" />
          <stop offset="100%" stop-color="#7d2a1a" />
        </linearGradient>
      </defs>

      <!-- Medallón -->
      <circle cx="100" cy="100" r="94" fill="url(#degradadoFondo)" />
      <circle cx="100" cy="100" r="94" fill="none" stroke="#e9a227" stroke-width="9" />

      <!-- Barras de la parrilla -->
      <g stroke="#e9a227" stroke-width="7" stroke-linecap="round" opacity="0.95">
        <line x1="52" y1="146" x2="148" y2="146" />
        <line x1="60" y1="160" x2="140" y2="160" />
      </g>

      <!-- Llama principal -->
      <path
        class="llama"
        d="M100 36
           c 16 26, 34 38, 34 62
           a 34 34 0 0 1 -68 0
           c 0 -14, 9 -22, 14 -32
           c 4 10, 12 12, 12 22
           c 6 -8, 4 -30, 8 -52 z"
        fill="url(#degradadoLlama)"
      />

      <!-- Centro de la llama -->
      <path
        class="llama-interna"
        d="M100 88 c 8 12, 14 18, 14 28 a 14 14 0 0 1 -28 0 c 0 -10, 6 -16, 14 -28 z"
        fill="#fff4e2"
        opacity="0.9"
      />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        line-height: 0;
      }
      .llama {
        transform-origin: 100px 120px;
        animation: latir 2.4s ease-in-out infinite;
      }
      .llama-interna {
        transform-origin: 100px 116px;
        animation: latir 2.4s ease-in-out infinite reverse;
      }
      @keyframes latir {
        0%,
        100% {
          transform: scaleY(1) scaleX(1);
        }
        50% {
          transform: scaleY(1.06) scaleX(0.97);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .llama,
        .llama-interna {
          animation: none;
        }
      }
    `,
  ],
})
export class LogoMarcaComponent {
  /** Lado del cuadrado que ocupa el isotipo, en píxeles. */
  @Input() tamanio = 120;
  @Input() nombre = 'La Brasa Brava';
}
