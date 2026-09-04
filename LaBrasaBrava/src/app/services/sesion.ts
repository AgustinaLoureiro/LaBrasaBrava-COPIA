import { Injectable, inject, signal } from '@angular/core';
import { Supabase } from './supabase';

export interface EmpleadoSesion {
  id: number;
  nombres: string;
  apellidos: string;
  perfil: string;
}

@Injectable({
  providedIn: 'root'
})
export class Sesion {
  private supabase = inject(Supabase);

  empleadoActual = signal<EmpleadoSesion | null>(null);

  async iniciarSesion(email: string, contrasenia: string): Promise<string | null> {
    const { data, error } = await this.supabase.client
      .from('empleados')
      .select('id, nombres, apellidos, perfil')
      .eq('email', email)
      .eq('password', contrasenia)
      .maybeSingle();

    if (error) {
      return 'Ocurrió un error al validar las credenciales.';
    }

    if (!data) {
      return 'Email o contraseña incorrectos.';
    }

    this.empleadoActual.set(data);
    return null;
  }

  cerrarSesion() {
    this.empleadoActual.set(null);
  }
}