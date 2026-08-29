import { Routes } from '@angular/router';

import { sesionIniciadaGuarda } from './nucleo/guardas/sesion.guarda';

export const routes: Routes = [
  {
    path: 'presentacion',
    loadComponent: () =>
      import('./paginas/presentacion/presentacion.page').then((m) => m.PresentacionPage),
  },
  {
    path: 'ingreso',
    loadComponent: () => import('./paginas/ingreso/ingreso.page').then((m) => m.IngresoPage),
  },
  {
    path: 'principal',
    canActivate: [sesionIniciadaGuarda],
    loadComponent: () =>
      import('./paginas/principal/principal.page').then((m) => m.PrincipalPage),
  },
  {
    path: '',
    redirectTo: 'presentacion',
    pathMatch: 'full',
  },
  {
    // Cualquier dirección desconocida vuelve a la pantalla de presentación.
    path: '**',
    redirectTo: 'presentacion',
  },
];
