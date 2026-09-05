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
 * Se usa así en las rutas:
 *
 *   {
 *     path: 'alta-empleado',
 *     canActivate: [sesionIniciadaGuarda, perfilGuarda(['dueño', 'supervisor'])],
 *     loadComponent: () => import('...').then((m) => m.AltaEmpleadoPage),
 *   }
 */
export function perfilGuarda(perfiles: Perfil[]): CanActivateFn {
  return () => {
    const sesion = inject(SesionService);
    const router = inject(Router);

    if (sesion.tienePerfil(...perfiles)) return true;
    return router.createUrlTree(['/principal']);
  };
}
