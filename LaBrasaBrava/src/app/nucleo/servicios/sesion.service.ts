import { Injectable, inject, signal, computed } from '@angular/core';

import { SupabaseService } from './supabase.service';
import { AccesoRapido, EstadoAprobacion, Perfil, Usuario } from '../modelos/usuario';

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

/**
 * Fila de la tabla public.clientes.
 *
 * Los clientes registrados viven en su propia tabla, sin CUIL y sin
 * perfil (todos son cliente_registrado), y con un estado de aprobación
 * que la base restringe a estos tres valores. Ojo: la base dice
 * 'aceptado' donde la aplicación dice 'aprobado'.
 *
 * No tiene columna de contraseña: la contraseña la guarda Supabase Auth
 * y el `id` de esta fila es el mismo uuid que Auth le dio al usuario.
 */
interface FilaCliente {
  id: string;
  apellidos: string;
  nombres: string;
  dni: string | null;
  email: string;
  foto_url: string | null;
  estado: 'pendiente' | 'aceptado' | 'rechazado';
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
 * Hoy conviven dos formas, porque las dos tablas están en momentos
 * distintos de la migración:
 *
 *   · `clientes` ya usa **Supabase Auth**, igual que la pantalla de
 *     registro: la contraseña la guarda Auth y la tabla solo tiene el
 *     perfil, con el mismo uuid que Auth le dio al usuario.
 *   · `empleados` todavía guarda la contraseña en texto plano en la
 *     tabla. Migrarlos también implica crear en Auth a los empleados que
 *     ya están cargados, así que queda para cuando lo decida el grupo.
 *
 * Las pantallas no saben nada de esto: solo piden ingresar() y leen el
 * resultado, así que el día que se migren los empleados se toca
 * únicamente este archivo.
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
   * Valida las credenciales y, si son correctas, deja la sesión iniciada.
   *
   * Busca primero entre los empleados, que todavía se validan contra la
   * tabla, y si el correo no es de ningún empleado prueba con Supabase
   * Auth, que es donde viven los clientes registrados. Un cliente que
   * todavía no fue aprobado, o que fue rechazado, no puede entrar
   * (puntos 5, 7 y 8 del enunciado).
   */
  async ingresar(correo: string, clave: string): Promise<ResultadoIngreso> {
    const correoNormalizado = correo.trim().toLowerCase();

    const empleado = await this.buscarEmpleado(correoNormalizado);
    if (empleado.error) {
      return { estado: 'error-de-conexion', detalle: this.explicar(empleado.error) };
    }

    if (empleado.fila) {
      // Se responde lo mismo si el correo no existe y si la contraseña
      // está mal, a propósito, para no revelar qué correos existen.
      if (empleado.fila.password !== clave) return { estado: 'credenciales-invalidas' };

      const usuario = this.empleadoAUsuario(empleado.fila);
      this.iniciar(usuario);
      return { estado: 'correcto', usuario };
    }

    return this.ingresarComoCliente(correoNormalizado, clave);
  }

  /**
   * Ingreso de un cliente registrado, contra Supabase Auth.
   *
   * Es el otro lado de la pantalla de registro: allá se crea la cuenta
   * con signUp() y acá se entra con signInWithPassword(). La contraseña
   * nunca pasa por la tabla `clientes`: la guarda Auth, encriptada.
   */
  private async ingresarComoCliente(correo: string, clave: string): Promise<ResultadoIngreso> {
    const { data, error } = await this.supabase.cliente.auth.signInWithPassword({
      email: correo,
      password: clave,
    });

    if (error || !data.user) {
      // Auth distingue "no hay conexión" de "los datos están mal", y esa
      // diferencia sí le sirve a la persona que está entrando.
      if (error && /fetch|network/i.test(error.message)) {
        return { estado: 'error-de-conexion', detalle: this.explicar(error.message) };
      }
      return { estado: 'credenciales-invalidas' };
    }

    // La contraseña era correcta: ahora se busca su ficha de cliente,
    // que lleva el mismo uuid que le dio Auth.
    const { data: fila, error: errorFicha } = await this.supabase.cliente
      .from('clientes')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle<FilaCliente>();

    if (errorFicha) {
      await this.cerrarSesionDeAuth();
      return { estado: 'error-de-conexion', detalle: this.explicar(errorFicha.message) };
    }

    // Tiene cuenta en Auth pero nadie le creó la ficha de cliente, así
    // que no hay perfil con el que entrar.
    if (!fila) {
      await this.cerrarSesionDeAuth();
      return { estado: 'sin-perfil' };
    }

    // Al que no está aprobado se le cierra la sesión de Auth en el acto,
    // para que no le quede nada abierto en el dispositivo.
    if (fila.estado === 'pendiente' || fila.estado === 'rechazado') {
      await this.cerrarSesionDeAuth();
      return fila.estado === 'pendiente'
        ? { estado: 'pendiente-de-aprobacion' }
        : { estado: 'rechazado' };
    }

    const usuario = this.clienteAUsuario(fila);
    this.iniciar(usuario);
    return { estado: 'correcto', usuario };
  }

  /** Cierra la sesión de Auth sin tocar la sesión propia de la aplicación. */
  private async cerrarSesionDeAuth(): Promise<void> {
    await this.supabase.cliente.auth.signOut().catch(() => undefined);
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
   * Trae los accesos rápidos para la pantalla de ingreso: primero los
   * empleados y después los clientes registrados.
   *
   * Se leen de la base y no se escriben fijos en el código, para cumplir
   * con el requisito del enunciado de que no sean botones fijos: si el
   * supervisor da de alta un empleado nuevo, su ficha aparece sola.
   *
   * Los clientes pendientes y rechazados también aparecen, porque el
   * enunciado pide verificar que esos dos NO puedan ingresar: tocando su
   * ficha se ve el mensaje que corresponde a cada estado.
   *
   * La ficha de un empleado entra sola, porque su contraseña todavía
   * está en la tabla. La de un cliente completa el correo y nada más:
   * su contraseña la guarda Supabase Auth y no se puede leer.
   */
  async accesosRapidos(): Promise<AccesoRapido[]> {
    const [empleados, clientes] = await Promise.all([
      this.supabase.cliente.from('empleados').select('*').order('id', { ascending: true }),
      this.supabase.cliente.from('clientes').select('*').order('id', { ascending: true }),
    ]);

    const accesos: AccesoRapido[] = [];

    for (const fila of (empleados.data ?? []) as FilaEmpleado[]) {
      accesos.push({
        usuario_id: `empleado-${fila.id}`,
        orden: accesos.length,
        apellidos: fila.apellidos,
        nombres: fila.nombres,
        correo: fila.email,
        clave_demo: fila.password,
        perfil: fila.perfil,
        foto_url: fila.foto_url,
        estado_aprobacion: 'aprobado',
      });
    }

    for (const fila of (clientes.data ?? []) as FilaCliente[]) {
      accesos.push({
        usuario_id: `cliente-${fila.id}`,
        orden: accesos.length,
        apellidos: fila.apellidos,
        nombres: fila.nombres,
        correo: fila.email,
        clave_demo: null,
        perfil: 'cliente_registrado',
        foto_url: fila.foto_url,
        estado_aprobacion: this.aEstadoAprobacion(fila.estado),
      });
    }

    return accesos;
  }

  // --- Consultas a la base ---------------------------------------------

  private async buscarEmpleado(correo: string) {
    const { data, error } = await this.supabase.cliente
      .from('empleados')
      .select('*')
      .eq('email', correo)
      .maybeSingle<FilaEmpleado>();

    return { fila: data, error: error?.message ?? null };
  }

  // --- Auxiliares -----------------------------------------------------

  /** Deja la sesión iniciada y la recuerda en el dispositivo. */
  private iniciar(usuario: Usuario): void {
    this.usuario.set(usuario);
    localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
  }

  /** Traduce una fila de `empleados` al modelo de usuario de la aplicación. */
  private empleadoAUsuario(fila: FilaEmpleado): Usuario {
    return {
      id: `empleado-${fila.id}`,
      apellidos: fila.apellidos,
      nombres: fila.nombres,
      dni: fila.dni,
      cuil: fila.cuil,
      correo: fila.email,
      perfil: fila.perfil,
      foto_url: fila.foto_url,
      // Los empleados nacen aprobados: el estado solo aplica a los
      // clientes registrados.
      estado_aprobacion: 'aprobado',
      fecha_alta: fila.created_at,
    };
  }

  /** Traduce una fila de `clientes` al modelo de usuario de la aplicación. */
  private clienteAUsuario(fila: FilaCliente): Usuario {
    return {
      id: `cliente-${fila.id}`,
      apellidos: fila.apellidos,
      nombres: fila.nombres,
      dni: fila.dni,
      // El enunciado (punto 5) pide el alta del cliente sin CUIL.
      cuil: null,
      correo: fila.email,
      perfil: 'cliente_registrado',
      foto_url: fila.foto_url,
      estado_aprobacion: this.aEstadoAprobacion(fila.estado),
      fecha_alta: fila.created_at,
    };
  }

  /** La base dice 'aceptado' donde la aplicación dice 'aprobado'. */
  private aEstadoAprobacion(estado: FilaCliente['estado']): EstadoAprobacion {
    return estado === 'aceptado' ? 'aprobado' : estado;
  }

  /** Convierte el error técnico de Supabase en algo legible en español. */
  private explicar(mensaje: string): string {
    if (/fetch|network/i.test(mensaje)) {
      return 'No se pudo llegar al servidor. Revisá tu conexión a internet.';
    }
    if (/schema cache|does not exist/i.test(mensaje)) {
      return 'Las tablas de usuarios todavía no están creadas en la base de datos.';
    }
    return mensaje;
  }
}
