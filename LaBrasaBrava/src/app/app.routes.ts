import { Routes } from '@angular/router';

import { perfilGuarda, sesionIniciadaGuarda } from './nucleo/guardas/sesion.guarda';
import { PERFILES_ADMINISTRACION } from './nucleo/modulos';

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
    // Sin guarda a propósito: el que se registra todavía no tiene cuenta,
    // y el enunciado (punto 5) permite que lo haga el cliente mismo.
    path: 'registro-cliente',
    loadComponent: () =>
      import('./pages/registro-cliente/registro-cliente.page').then((m) => m.RegistroClientePage),
  },
  {
    // Puntos 6, 7 y 8: solo el dueño o el supervisor aprueban o rechazan.
    path: 'aprobacion-clientes',
    canActivate: [sesionIniciadaGuarda, perfilGuarda(PERFILES_ADMINISTRACION)],
    loadComponent: () =>
      import('./pages/aprobacion-clientes/aprobacion-clientes.page').then(
        (m) => m.AprobacionClientesPage,
      ),
  },
  {
    // Sin guarda a propósito: el cliente anónimo llega escaneando el QR
    // de entrada al local, sin haber iniciado sesión (punto 9).
    path: 'lista-espera',
    loadComponent: () =>
      import('./pages/lista-espera/lista-espera.page').then((m) => m.ListaEsperaPage),
  },

  // --- Altas y encuestas --------------------------------------------------
  {
    // Punto 1: el alta de empleados es del dueño o del supervisor.
    path: 'empleado',
    canActivate: [sesionIniciadaGuarda, perfilGuarda(PERFILES_ADMINISTRACION)],
    loadComponent: () => import('./pages/empleado/empleado.page').then((m) => m.EmpleadoPage),
  },
  {
    // Punto 2: el plato lo carga el cocinero.
    path: 'plato',
    canActivate: [sesionIniciadaGuarda, perfilGuarda(['cocinero'])],
    loadComponent: () => import('./pages/plato/plato.page').then((m) => m.PlatoPage),
  },
  {
    // Sin guarda a propósito: el cliente anónimo puede ver los resultados
    // de las encuestas escaneando el QR de entrada (puntos 9 y 20).
    path: 'encuesta',
    loadComponent: () => import('./pages/encuesta/encuesta.page').then((m) => m.EncuestaPage),
  },

  {
    // Cualquier dirección desconocida vuelve a la pantalla de presentación.
    path: '**',
    redirectTo: 'presentacion',
  },
];
