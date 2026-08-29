import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { CONFIGURACION_SUPABASE } from '../configuracion';

/**
 * Punto único de acceso a Supabase. Cualquier otro servicio pide el
 * cliente acá en lugar de crear uno propio, para que exista una sola
 * sesión activa en toda la aplicación.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  readonly cliente: SupabaseClient;

  constructor() {
    this.cliente = createClient(
      CONFIGURACION_SUPABASE.url,
      CONFIGURACION_SUPABASE.claveAnonima,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      },
    );
  }
}
