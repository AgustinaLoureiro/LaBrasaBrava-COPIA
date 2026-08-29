import { Injectable, inject, signal, computed } from '@angular/core';

import { SupabaseService } from './supabase.service';
import { AccesoRapido, Perfil, Usuario } from '../modelos/usuario';

/** Resultado de un intento de ingreso, para que la pantalla decida qué mostrar. */
export type ResultadoIngreso =
  | { estado: 'correcto'; usuario: Usuario }
  | { estado: 'credenciales-invalidas' }
  | { estado: 'pendiente-de-aprobacion' }
  | { estado: 'rechazado' }
  | { estado: 'sin-perfil' }
  | { estado: 'error-de-conexion'; detalle: string };

/**
 * Maneja el ingreso, el cierre de sesión y el usuario que está usando la
 * aplicación en este momento.
 */
@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly supabase = inject(SupabaseService);

  /** Usuario con sesión iniciada, o null si no hay nadie. */
  readonly usuario = signal<Usuario | null>(null);

  readonly haySesion = computed(() => this.usuario() !== null);

  /** Indica si el usuario actual tiene alguno de los perfiles indicados. */
  tienePerfil(...perfiles: Perfil[]): boolean {
    const actual = this.usuario();
    return actual !== null && perfiles.includes(actual.perfil);
  }

  /**
   * Valida las credenciales contra Supabase Auth y, si son correctas,
   * trae la fila de perfil. Un cliente registrado que todavía no fue
   * aprobado no puede entrar (puntos 5, 7 y 8 del enunciado).
   */
  async ingresar(correo: string, clave: string): Promise<ResultadoIngreso> {
    const { data, error } = await this.supabase.cliente.auth.signInWithPassword({
      email: correo.trim().toLowerCase(),
      password: clave,
    });

    if (error) {
      // Supabase devuelve el mismo error para correo inexistente y clave
      // incorrecta, a propósito, para no revelar qué correos existen.
      if (/invalid login credentials/i.test(error.message)) {
        return { estado: 'credenciales-invalidas' };
      }
      return { estado: 'error-de-conexion', detalle: error.message };
    }

    const idUsuario = data.user?.id;
    if (!idUsuario) return { estado: 'credenciales-invalidas' };

    const { data: perfil, error: errorPerfil } = await this.supabase.cliente
      .from('usuarios')
      .select('*')
      .eq('id', idUsuario)
      .single<Usuario>();

    if (errorPerfil || !perfil) {
      await this.cerrarSesion();
      return { estado: 'sin-perfil' };
    }

    if (perfil.perfil === 'cliente_registrado') {
      if (perfil.estado_aprobacion === 'pendiente') {
        await this.cerrarSesion();
        return { estado: 'pendiente-de-aprobacion' };
      }
      if (perfil.estado_aprobacion === 'rechazado') {
        await this.cerrarSesion();
        return { estado: 'rechazado' };
      }
    }

    this.usuario.set(perfil);
    return { estado: 'correcto', usuario: perfil };
  }

  /**
   * Cierra la sesión y borra las credenciales guardadas.
   * El enunciado pide verificar que efectivamente se borren, por eso se
   * limpia tanto la sesión de Supabase como el almacenamiento local.
   */
  async cerrarSesion(): Promise<void> {
    await this.supabase.cliente.auth.signOut();
    this.usuario.set(null);

    // Supabase guarda el token con una clave que empieza con "sb-".
    for (const clave of Object.keys(localStorage)) {
      if (clave.startsWith('sb-')) localStorage.removeItem(clave);
    }
  }

  /**
   * Recupera la sesión guardada al abrir la aplicación, para que el
   * usuario no tenga que volver a escribir sus datos.
   */
  async recuperarSesion(): Promise<Usuario | null> {
    const { data } = await this.supabase.cliente.auth.getSession();
    const idUsuario = data.session?.user?.id;
    if (!idUsuario) return null;

    const { data: perfil } = await this.supabase.cliente
      .from('usuarios')
      .select('*')
      .eq('id', idUsuario)
      .single<Usuario>();

    this.usuario.set(perfil ?? null);
    return perfil ?? null;
  }

  /**
   * Trae los accesos rápidos para la pantalla de ingreso.
   *
   * Se leen de la tabla accesos_rapidos, que es de lectura pública porque
   * la pantalla de ingreso todavía no tiene sesión iniciada. Esa tabla
   * contiene únicamente credenciales de demostración creadas para la
   * corrección de la materia.
   *
   * Se leen de la base y no se escriben fijos en el código, para cumplir
   * con el requisito de que no sean botones fijos.
   */
  async accesosRapidos(): Promise<AccesoRapido[]> {
    const { data, error } = await this.supabase.cliente
      .from('accesos_rapidos')
      .select('*')
      .order('orden', { ascending: true });

    if (error || !data) return [];
    return data as AccesoRapido[];
  }
}
