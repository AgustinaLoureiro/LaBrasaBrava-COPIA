import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular';
import { Sesion } from '../services/sesion';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, RouterLink],
})
export class HomePage {
  sesion = inject(Sesion);
  private router = inject(Router);

  salir() {
    this.sesion.cerrarSesion();
    this.router.navigateByUrl('/login');
  }
}