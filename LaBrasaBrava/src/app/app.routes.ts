import { Routes } from '@angular/router';

import { sesionIniciadaGuarda } from './nucleo/guardas/sesion.guarda';

export const routes: Routes = [
  // --- Arranque -----------------------------------------------------------
  {
    // El enunciado pide que la aplicación abra con la pantalla de
    // presentación. Ella sola pasa al ingreso cuando termina la animación.
    path: '',
    redirectTo: 'presentacion',
    pathMatch: 'full',
  },
  {
    path: 'presentacion',
    loadComponent: () =>
      import('./pages/presentacion/presentacion.page').then((m) => m.PresentacionPage),
  },

  // --- Acceso -------------------------------------------------------------
  {
    path: 'ingreso',
    loadComponent: () => import('./pages/ingreso/ingreso.page').then((m) => m.IngresoPage),
  },
  {
    path: 'principal',
    canActivate: [sesionIniciadaGuarda],
    loadComponent: () =>
      import('./pages/principal/principal.page').then((m) => m.PrincipalPage),
  },
  

  // --- Clientes -----------------------------------------------------------
  {
    path: 'registro-cliente',
    loadComponent: () =>
      import('./pages/registro-cliente/registro-cliente.page').then((m) => m.RegistroClientePage),
  },
  {
    path: 'aprobacion-clientes',
    loadComponent: () =>
      import('./pages/aprobacion-clientes/aprobacion-clientes.page').then(
        (m) => m.AprobacionClientesPage,
      ),
  },
  {
    path: 'lista-espera',
    loadComponent: () =>
      import('./pages/lista-espera/lista-espera.page').then((m) => m.ListaEsperaPage),
  },

  // --- Altas y encuestas --------------------------------------------------
  {
    path: 'empleado',
    loadComponent: () => import('./pages/empleado/empleado.page').then((m) => m.EmpleadoPage),
  },
  {
    path: 'plato',
    loadComponent: () => import('./pages/plato/plato.page').then((m) => m.PlatoPage),
  },
  {
    path: 'encuesta',
    loadComponent: () => import('./pages/encuesta/encuesta.page').then((m) => m.EncuestaPage),
  },

  {
    // Cualquier dirección desconocida vuelve a la pantalla de presentación.
    path: '**',
    redirectTo: 'presentacion',
  },
];
