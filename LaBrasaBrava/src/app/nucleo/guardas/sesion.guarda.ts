import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SesionService } from '../servicios/sesion.service';
import { Perfil } from '../modelos/usuario';

/**
 * Impide entrar a una página sin haber iniciado sesión.
 * Si la aplicación se acaba de abrir, primero intenta recuperar la sesión
 * guardada para no obligar a escribir los datos de nuevo.
 */
export const sesionIniciadaGuarda: CanActivateFn = async () => {
  const sesion = inject(SesionService);
  const router = inject(Router);

  if (sesion.haySesion()) return true;

  const recuperado = await sesion.recuperarSesion();
  if (recuperado) return true;

  return router.createUrlTree(['/ingreso']);
};

/**
 * Restringe una página a determinados perfiles.
 *
 * Va siempre después de `sesionIniciadaGuarda`, porque para saber el
 * perfil primero tiene que haber alguien con sesión iniciada. Los grupos
 * de perfiles salen de nucleo/modulos.ts, que es el mismo archivo del
 * que lee la pantalla principal:
 *
 *   {
 *     path: 'empleado',
 *     canActivate: [sesionIniciadaGuarda, perfilGuarda(PERFILES_ADMINISTRACION)],
 *     loadComponent: () => import('...').then((m) => m.EmpleadoPage),
 *   }
 *
 * Al que no le corresponde se lo devuelve a la pantalla principal.
 */
export function perfilGuarda(perfiles: readonly Perfil[]): CanActivateFn {
  return () => {
    const sesion = inject(SesionService);
    const router = inject(Router);

    if (sesion.tienePerfil(...perfiles)) return true;
    return router.createUrlTree(['/principal']);
  };
}
