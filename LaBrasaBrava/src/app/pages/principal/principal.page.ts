import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';

import { LogoMarcaComponent } from '../../componentes/logo-marca/logo-marca.component';
import { SesionService } from '../../nucleo/servicios/sesion.service';
import { MensajesService } from '../../nucleo/servicios/mensajes.service';
import { CargandoService } from '../../nucleo/servicios/cargando.service';
import { SonidosService } from '../../nucleo/servicios/sonidos.service';
import {
  COLOR_PERFIL,
  NOMBRE_PERFIL,
  TEXTO_SOBRE_PERFIL,
} from '../../nucleo/modelos/usuario';
import { modulosDelPerfil } from '../../nucleo/modulos';
import { PALETA } from '../../nucleo/diseno';
import { RESTAURANTE } from '../../nucleo/marca';

/**
 * Página principal posterior al ingreso.
 *
 * Muestra los datos de la sesión, los módulos que le corresponden al
 * perfil que entró y el botón de cierre de sesión que pide el enunciado.
 */
@Component({
  selector: 'app-principal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonContent, LogoMarcaComponent, RouterLink],
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
    return actual ? COLOR_PERFIL[actual.perfil] : PALETA.ladrillo;
  });

  protected readonly textoSobrePerfil = computed(() => {
    const actual = this.usuario();
    return actual ? TEXTO_SOBRE_PERFIL[actual.perfil] : PALETA.cremaTrigo;
  });

  /**
   * Módulos que ve este perfil, y solamente los de este perfil.
   *
   * El reparto está en nucleo/modulos.ts, que es el mismo archivo que
   * usan las guardas de las rutas: así lo que se muestra en pantalla y
   * lo que deja entrar el router no se pueden contradecir.
   *
   * Los que llevan `ruta: null` son los que todavía no están hechos:
   * aparecen igual, anunciados como en desarrollo, para que se vea qué
   * le va a tocar a cada perfil cuando el módulo esté terminado.
   */
  protected readonly modulos: readonly { nombre: string; ruta: string | null }[] = [
    { nombre: 'Alta de empleados', ruta: '/empleado' },
    { nombre: 'Alta de platos', ruta: '/plato' },
    { nombre: 'Carta / Menú', ruta: null },
    { nombre: 'Registro de clientes', ruta: '/registro-cliente' },
    { nombre: 'Aprobación de clientes', ruta: '/aprobacion-clientes' },
    { nombre: 'Lista de espera', ruta: '/lista-espera' },
    { nombre: 'Encuesta de satisfacción', ruta: '/encuesta' },
    { nombre: 'Alta de bebidas', ruta: '/bebida' },
    { nombre: 'Gestión de mesas', ruta: '/mesa' },
    { nombre: 'Pedidos y comanda', ruta: null },
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

    if (this.sesion.quedaronCredenciales()) {
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
