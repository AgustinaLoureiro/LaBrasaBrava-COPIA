import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'plato',
    pathMatch: 'full',
  },
  /*{
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
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
  },*/
  {
    path: 'plato',
    loadComponent: () => import('./pages/plato/plato.page').then( m => m.PlatoPage)
  },


];