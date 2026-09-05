import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'registro-cliente',
    loadComponent: () => import('./pages/registro-cliente/registro-cliente.page').then( m => m.RegistroClientePage)
  },
  {
    path: 'lista-espera',
    loadComponent: () => import('./pages/lista-espera/lista-espera.page').then((m) => m.ListaEsperaPage),
  },
  {
    path: 'empleado',
    loadComponent: () => import('./pages/empleado/empleado.page').then( m => m.EmpleadoPage)
  },
  {
    path: 'presentacion',
    loadComponent: () => import('./pages/presentacion/presentacion.page').then(m => m.PresentacionPage)
  },
  {
    path: 'plato',
    loadComponent: () => import('./pages/plato/plato.page').then( m => m.PlatoPage)
  },
  {
    path: 'registro-cliente',
    loadComponent: () => import('./pages/registro-cliente/registro-cliente.page').then( m => m.RegistroClientePage)
  },
  {
    path: 'aprobacion-clientes',
    loadComponent: () => import('./pages/aprobacion-clientes/aprobacion-clientes.page').then( m => m.AprobacionClientesPage)
  },
  {
    path: 'encuesta',
    loadComponent: () => import('./pages/encuesta/encuesta.page').then( m => m.EncuestaPage)
  },

];
