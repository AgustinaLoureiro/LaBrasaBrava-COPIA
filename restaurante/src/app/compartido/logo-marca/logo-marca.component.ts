import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/** Variaciones de color que define el manual de marca. */
export type VarianteLogo = 'color' | 'crema' | 'carbon';

/** Variaciones de composición que define el manual de marca. */
export type ComposicionLogo = 'isotipo' | 'horizontal' | 'vertical';

/**
 * Logo de Brasa Brava.
 *
 * Es el logo original del manual de identidad (carpeta Diseño), pasado a
 * PNG con el fondo blanco quitado para que se pueda apoyar sobre los
 * fondos de color de la aplicación. Los tres archivos viven en
 * src/assets/marca y son el mismo dibujo en los tres colores que pide el
 * manual: a color, monocromo crema (sobre color) y monocromo carbón
 * (impresión y códigos QR).
 *
 * Ejemplos de uso:
 *   <app-logo-marca [tamanio]="76" />
 *   <app-logo-marca composicion="horizontal" [tamanio]="52" />
 *   <app-logo-marca variante="crema" [animado]="false" />
 */
@Component({
  selector: 'app-logo-marca',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="logo" [class.logo-vertical]="composicion === 'vertical'">
      <img
        class="isotipo"
        [src]="archivo()"
        [width]="tamanio"
        [height]="tamanio"
        [alt]="'Logotipo de ' + nombre"
      />

      @if (composicion !== 'isotipo') {
        <p class="palabra" [style.color]="colorTexto()">
          <span>Brasa</span><span>Brava</span>
        </p>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        line-height: 0;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 0.55em;
      }

      .logo-vertical {
        flex-direction: column;
        gap: 0.3em;
      }

      .isotipo {
        display: block;
        object-fit: contain;
      }

      /* La palabra escala junto con el isotipo. */
      .palabra {
        display: flex;
        flex-wrap: wrap;
        gap: 0 0.35em;
        margin: 0;
        font-family: var(--tipografia-titulos);
        font-weight: 800;
        font-size: calc(var(--lado) * 0.29);
        line-height: 1.05;
        letter-spacing: var(--espaciado-mayusculas);
        text-transform: uppercase;
        white-space: nowrap;
      }

      /* En la versión vertical la palabra va en dos líneas, centrada. */
      .logo-vertical .palabra {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0;
      }

      .logo-animado .isotipo {
        animation: latir 2.6s ease-in-out infinite;
      }

      @keyframes latir {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.04);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .isotipo {
          animation: none;
        }
      }
    `,
  ],
  host: {
    '[class.logo-animado]': 'animado',
    '[style.--lado.px]': 'tamanio',
  },
})
export class LogoMarcaComponent {
  /** Lado del cuadrado que ocupa el isotipo, en píxeles. */
  @Input() tamanio = 120;

  /** Isotipo solo, o imagotipo con la palabra al lado o debajo. */
  @Input() composicion: ComposicionLogo = 'isotipo';

  /** A color, monocromo crema o monocromo carbón. */
  @Input() variante: VarianteLogo = 'color';

  /** El logo late suavemente. Se apaga en pantallas con mucho contenido. */
  @Input() animado = true;

  /** Texto alternativo para lectores de pantalla. */
  @Input() nombre = 'Brasa Brava';

  /** Archivo del logo y color de la palabra en cada variante del manual. */
  private static readonly VARIANTES: Record<VarianteLogo, { archivo: string; texto: string }> = {
    color: { archivo: 'assets/marca/logo-bb.png', texto: '#f0dfc6' },
    crema: { archivo: 'assets/marca/logo-bb-crema.png', texto: '#f0dfc6' },
    carbon: { archivo: 'assets/marca/logo-bb-carbon.png', texto: '#2e2a28' },
  };

  protected archivo(): string {
    return LogoMarcaComponent.VARIANTES[this.variante].archivo;
  }

  protected colorTexto(): string {
    return LogoMarcaComponent.VARIANTES[this.variante].texto;
  }
}
