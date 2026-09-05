import { Injectable, signal, computed } from '@angular/core';

/**
 * Controla el indicador de espera con el logo de la empresa.
 *
 * El enunciado exige que TODA espera muestre un spinner con el logo. Para
 * que ninguna quede afuera, la forma recomendada de usarlo es envolver la
 * operación con durante(), que se encarga de mostrarlo y esconderlo
 * incluso si la operación falla.
 */
@Injectable({ providedIn: 'root' })
export class CargandoService {
  /** Cantidad de operaciones en curso: soporta esperas superpuestas. */
  private readonly operaciones = signal(0);

  private readonly textoActual = signal('Cargando');

  readonly visible = computed(() => this.operaciones() > 0);
  readonly texto = computed(() => this.textoActual());

  /**
   * Ejecuta la operación mostrando el indicador mientras dura.
   *
   *   const datos = await this.cargando.durante(
   *     'Verificando sus datos',
   *     () => this.sesion.ingresar(correo, clave),
   *   );
   */
  async durante<T>(texto: string, operacion: () => Promise<T>): Promise<T> {
    this.mostrar(texto);
    try {
      return await operacion();
    } finally {
      this.ocultar();
    }
  }

  mostrar(texto = 'Cargando'): void {
    this.textoActual.set(texto);
    this.operaciones.update((cantidad) => cantidad + 1);
  }

  ocultar(): void {
    this.operaciones.update((cantidad) => Math.max(0, cantidad - 1));
  }
}
