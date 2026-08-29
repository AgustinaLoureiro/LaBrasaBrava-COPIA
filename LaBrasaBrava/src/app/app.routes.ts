import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },  {
    path: 'lista-espera',
    loadComponent: () => import('./pages/lista-espera/lista-espera.page').then( m => m.ListaEsperaPage)
  },

];
