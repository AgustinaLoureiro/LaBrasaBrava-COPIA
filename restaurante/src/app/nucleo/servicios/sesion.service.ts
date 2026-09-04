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
 * Fila de la tabla public.empleados, que es la que el grupo tiene creada
 * hoy en Supabase. Ver la nota sobre autenticación más abajo.
 */
interface FilaEmpleado {
  id: number;
  apellidos: string;
  nombres: string;
  dni: string | null;
  cuil: string | null;
  email: string;
  password: string;
  perfil: Perfil;
  foto_url: string | null;
  created_at: string;
}

/** Clave con la que se recuerda la sesión en el dispositivo. */
const CLAVE_SESION = 'brasa-brava-sesion';

/**
 * Maneja el ingreso, el cierre de sesión y el usuario que está usando la
 * aplicación en este momento.
 *
 * -------------------------------------------------------------------
 * NOTA SOBRE LA AUTENTICACIÓN
 * -------------------------------------------------------------------
 * La base del grupo tiene hoy una tabla `empleados` con la contraseña
 * guardada en texto plano, y no usa Supabase Auth. Este servicio valida
 * contra esa tabla para que la aplicación funcione con los datos reales
 * que ya están cargados.
 *
 * Cuando el grupo migre a Supabase Auth (que es lo que corresponde, y
 * para lo que ya está escrito supabase/esquema.sql), el único archivo
 * que hay que tocar es este: las pantallas no saben cómo se valida, solo
 * piden ingresar() y leen el resultado.
 * -------------------------------------------------------------------
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
   * Valida las credenciales contra la base y, si son correctas, deja la
   * sesión iniciada. Un cliente registrado que todavía no fue aprobado
   * no puede entrar (puntos 5, 7 y 8 del enunciado).
   */
  async ingresar(correo: string, clave: string): Promise<ResultadoIngreso> {
    const correoNormalizado = correo.trim().toLowerCase();

    const { data, error } = await this.supabase.cliente
      .from('empleados')
      .select('*')
      .eq('email', correoNormalizado)
      .maybeSingle<FilaEmpleado>();

    if (error) {
      return { estado: 'error-de-conexion', detalle: this.explicar(error.message) };
    }

    // Se responde lo mismo si el correo no existe y si la contraseña está
    // mal, a propósito, para no revelar qué correos están dados de alta.
    if (!data || data.password !== clave) {
      return { estado: 'credenciales-invalidas' };
    }

    const usuario = this.aUsuario(data);

    if (usuario.perfil === 'cliente_registrado') {
      if (usuario.estado_aprobacion === 'pendiente') {
        return { estado: 'pendiente-de-aprobacion' };
      }
      if (usuario.estado_aprobacion === 'rechazado') {
        return { estado: 'rechazado' };
      }
    }

    this.usuario.set(usuario);
    this.recordar(usuario);
    return { estado: 'correcto', usuario };
  }

  /**
   * Cierra la sesión y borra las credenciales guardadas.
   * El enunciado pide verificar que efectivamente se borren, por eso se
   * limpia tanto la sesión propia como la que pudiera haber dejado
   * Supabase Auth.
   */
  async cerrarSesion(): Promise<void> {
    this.usuario.set(null);
    localStorage.removeItem(CLAVE_SESION);

    // Supabase Auth guarda su token con una clave que empieza con "sb-".
    for (const clave of Object.keys(localStorage)) {
      if (clave.startsWith('sb-')) localStorage.removeItem(clave);
    }

    await this.supabase.cliente.auth.signOut().catch(() => undefined);
  }

  /** Indica si quedó alguna credencial guardada en el dispositivo. */
  quedaronCredenciales(): boolean {
    return (
      localStorage.getItem(CLAVE_SESION) !== null ||
      Object.keys(localStorage).some((clave) => clave.startsWith('sb-'))
    );
  }

  /**
   * Recupera la sesión guardada al abrir la aplicación, para que el
   * usuario no tenga que volver a escribir sus datos.
   */
  async recuperarSesion(): Promise<Usuario | null> {
    const guardado = localStorage.getItem(CLAVE_SESION);
    if (!guardado) return null;

    try {
      const usuario = JSON.parse(guardado) as Usuario;
      this.usuario.set(usuario);
      return usuario;
    } catch {
      // Si el dato quedó corrupto se descarta y se pide ingresar de nuevo.
      localStorage.removeItem(CLAVE_SESION);
      return null;
    }
  }

  /**
   * Trae los accesos rápidos para la pantalla de ingreso.
   *
   * Se leen de la base y no se escriben fijos en el código, para cumplir
   * con el requisito del enunciado de que no sean botones fijos: si el
   * supervisor da de alta un empleado nuevo, su ficha aparece sola.
   */
  async accesosRapidos(): Promise<AccesoRapido[]> {
    const { data, error } = await this.supabase.cliente
      .from('empleados')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data) return [];

    return (data as FilaEmpleado[]).map((fila, indice) => ({
      usuario_id: String(fila.id),
      orden: indice,
      apellidos: fila.apellidos,
      nombres: fila.nombres,
      correo: fila.email,
      clave_demo: fila.password,
      perfil: fila.perfil,
      foto_url: fila.foto_url,
    }));
  }

  // --- Auxiliares -----------------------------------------------------

  /** Traduce una fila de `empleados` al modelo de usuario de la aplicación. */
  private aUsuario(fila: FilaEmpleado): Usuario {
    return {
      id: String(fila.id),
      apellidos: fila.apellidos,
      nombres: fila.nombres,
      dni: fila.dni,
      cuil: fila.cuil,
      correo: fila.email,
      perfil: fila.perfil,
      foto_url: fila.foto_url,
      // Los empleados nacen aprobados: el estado solo aplica a los
      // clientes registrados, que todavía no tienen tabla propia.
      estado_aprobacion: 'aprobado',
      fecha_alta: fila.created_at,
    };
  }

  /** Guarda la sesión en el dispositivo para no volver a pedir los datos. */
  private recordar(usuario: Usuario): void {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
  }

  /** Convierte el error técnico de Supabase en algo legible en español. */
  private explicar(mensaje: string): string {
    if (/fetch|network/i.test(mensaje)) {
      return 'No se pudo llegar al servidor. Revisá tu conexión a internet.';
    }
    if (/schema cache|does not exist/i.test(mensaje)) {
      return 'La tabla de empleados todavía no está creada en la base de datos.';
    }
    return mensaje;
  }
}
