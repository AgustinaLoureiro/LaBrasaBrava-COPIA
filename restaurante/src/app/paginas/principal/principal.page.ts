import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';

import { LogoMarcaComponent } from '../../compartido/logo-marca/logo-marca.component';
import { SesionService } from '../../nucleo/servicios/sesion.service';
import { MensajesService } from '../../nucleo/servicios/mensajes.service';
import { CargandoService } from '../../nucleo/servicios/cargando.service';
import { SonidosService } from '../../nucleo/servicios/sonidos.service';
import { COLOR_PERFIL, ICONO_PERFIL, NOMBRE_PERFIL } from '../../nucleo/modelos/usuario';
import { RESTAURANTE } from '../../nucleo/marca';

/**
 * Página principal posterior al ingreso.
 *
 * Por ahora muestra los datos de la sesión y el botón de cierre de sesión
 * que pide el enunciado. A medida que avancen los puntos funcionales, acá
 * van a aparecer los accesos a cada módulo según el perfil.
 */
@Component({
  selector: 'app-principal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonContent, LogoMarcaComponent],
  templateUrl: './principal.page.html',
  styleUrl: './principal.page.scss',
})
export class PrincipalPage {
  private readonly sesion = inject(SesionService);
  private readonly mensajes = inject(MensajesService);
  private readonly cargando = inject(CargandoService);
  private readonly sonidos = inject(SonidosService);
  private readonly router = inject(Router);

  protected readonly restaurante = RESTAURANTE;
  protected readonly usuario = this.sesion.usuario;

  protected readonly nombrePerfil = computed(() => {
    const actual = this.usuario();
    return actual ? NOMBRE_PERFIL[actual.perfil] : '';
  });

  protected readonly colorPerfil = computed(() => {
    const actual = this.usuario();
    return actual ? COLOR_PERFIL[actual.perfil] : '#e9a227';
  });

  protected readonly iconoPerfil = computed(() => {
    const actual = this.usuario();
    return actual ? ICONO_PERFIL[actual.perfil] : 'person';
  });

  /** Módulos que va a ver este perfil. Se completan en las próximas entregas. */
  protected readonly modulosPendientes = [
    'Alta de empleados',
    'Carta de platos y bebidas',
    'Gestión de mesas',
    'Lista de espera',
    'Pedidos y comanda',
    'Encuestas y estadísticas',
  ];

  /**
   * Cierra la sesión, verifica que las credenciales se hayan borrado y
   * reproduce el sonido de cierre que pide el enunciado.
   */
  protected async cerrarSesion(): Promise<void> {
    await this.cargando.durante('Cerrando tu sesión', async () => {
      await this.sesion.cerrarSesion();
    });

    void this.sonidos.cierreDeAplicacion();

    const quedaronCredenciales = Object.keys(localStorage).some((clave) =>
      clave.startsWith('sb-'),
    );

    if (quedaronCredenciales) {
      await this.mensajes.error(
        'No se pudieron borrar las credenciales',
        'Quedaron datos de sesión guardados en el dispositivo.',
      );
      return;
    }

    await this.mensajes.correcto(
      'Sesión cerrada',
      'Tus credenciales se borraron del dispositivo.',
    );
    await this.router.navigateByUrl('/ingreso', { replaceUrl: true });
  }
}
