import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { IconoModulo } from '../../nucleo/modulos';

/**
 * Dibujo que identifica a cada módulo en la cuadrícula de la pantalla
 * principal.
 *
 * Los trazos van escritos acá adentro, no en archivos de imagen: así el
 * dibujo toma el color del texto que lo rodea, se ve nítido en cualquier
 * pantalla y no hay que subir imágenes al repositorio. El nombre del
 * dibujo que le corresponde a cada módulo sale de nucleo/modulos.ts.
 */
@Component({
  selector: 'app-icono-modulo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      class="icono-modulo"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (icono()) {
        <!-- Alta de empleados: una persona con su credencial. -->
        @case ('empleados') {
          <circle cx="13" cy="11" r="4.2" />
          <path d="M5.5 25.5c0-3.9 3.4-6.6 7.5-6.6s7.5 2.7 7.5 6.6" />
          <rect x="21.5" y="13" width="7" height="9" rx="1.4" />
          <path d="M23.5 16.5h3M23.5 19h3" />
        }

        <!-- Gestión de mesas: una mesa redonda con su código. -->
        @case ('mesas') {
          <ellipse cx="16" cy="11" rx="9.5" ry="3.8" />
          <path d="M16 14.8v9.4" />
          <path d="M10.5 27.5c0-2 2.5-3.3 5.5-3.3s5.5 1.3 5.5 3.3" />
          <path d="M6.5 7.5V5h2.6M25.5 7.5V5h-2.6" />
        }

        <!-- Aprobación de clientes: una persona aprobada. -->
        @case ('aprobacion') {
          <circle cx="12.5" cy="10.5" r="4.2" />
          <path d="M4.5 25c0-4 3.6-6.8 8-6.8 1 0 2 .15 2.9.43" />
          <circle cx="22.5" cy="21.5" r="6" />
          <path d="m19.8 21.6 2 2 3.4-3.6" />
        }

        <!-- Alta de platos: un plato con cubiertos. -->
        @case ('platos') {
          <circle cx="16" cy="16" r="9.5" />
          <circle cx="16" cy="16" r="5" />
          <path d="M4.5 5.5v6a2.2 2.2 0 0 0 4.4 0v-6M6.7 11.5v15" />
          <path d="M25.5 5.5c1.6 1 2.4 3 2.4 5.2s-.9 3.4-2.4 3.6v12.2" />
        }

        <!-- Alta de bebidas: una copa servida. -->
        @case ('bebidas') {
          <path d="M8.5 5.5h15l-6.2 9.4v9.6" />
          <path d="M10.6 10.2h10.8" />
          <path d="M12.5 27.5h9" />
          <path d="M17.3 24.5v3" />
        }

        <!-- Registro de clientes: una persona que se suma. -->
        @case ('clientes') {
          <circle cx="13" cy="11" r="4.4" />
          <path d="M4.5 26c0-4.3 3.8-7.2 8.5-7.2 1.3 0 2.6.22 3.7.64" />
          <path d="M23.5 17.5v8M19.5 21.5h8" />
        }

        <!-- Lista de espera: el turno y el reloj. -->
        @case ('espera') {
          <path d="M4.5 8h11M4.5 14h11M4.5 20h6" />
          <circle cx="22" cy="20.5" r="7" />
          <path d="M22 16.8v3.9l2.6 1.7" />
        }

        <!-- Pedidos y comanda: la libreta del mozo. -->
        @case ('pedidos') {
          <rect x="7" y="5.5" width="18" height="22" rx="2.2" />
          <path d="M11.5 3.5v4M20.5 3.5v4" />
          <path d="M11.5 13.5h9M11.5 18h9M11.5 22.5h5.5" />
        }

        <!-- Encuesta de satisfacción: la estrella con que se puntúa. -->
        @case ('encuesta') {
          <path
            d="m16 4.5 3.6 7.3 8.1 1.2-5.9 5.7 1.4 8-7.2-3.8-7.2 3.8 1.4-8-5.9-5.7 8.1-1.2z"
          />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .icono-modulo {
      width: 100%;
      height: 100%;
    }
  `,
})
export class IconoModuloComponent {
  /** Cuál de los dibujos hay que trazar. */
  readonly icono = input.required<IconoModulo>();
}
