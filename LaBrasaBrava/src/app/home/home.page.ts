import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular';
import { Supabase } from '../services/supabase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, RouterLink],
})
export class HomePage implements OnInit {
  private supabase = inject(Supabase);

  async ngOnInit() {
    const { data, error } = await this.supabase.client.auth.getSession();

    if (error) {
      console.error('Error al conectar con Supabase:', error.message);
    } else {
      console.log('Conexión con Supabase establecida. Sesión actual:', data.session);
    }
  }
}