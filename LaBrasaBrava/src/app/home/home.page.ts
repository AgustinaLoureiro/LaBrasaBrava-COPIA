import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';
import { Supabase } from '../services/supabase';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})

export class HomePage implements OnInit {
  private supabase = inject(Supabase);

  async ngOnInit() {
    const { data, error } = await this.supabase.client.auth.getSession();
    if (error) {
      console.error('❌ Error conectando con Supabase:', error.message);
    } else {
      console.log('✅ Conexión con Supabase exitosa. Sesión actual:', data.session);
    }
  }
}
