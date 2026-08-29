/**
 * Modelos de usuario, alineados con la tabla public.usuarios de Supabase
 * y con los perfiles que define el enunciado.
 */

/** Perfiles del enunciado (sección 4.3 de CONTEXTO-TFI.md). */
export type Perfil =
  | 'dueño'
  | 'supervisor'
  | 'metre'
  | 'mozo'
  | 'cocinero'
  | 'cantinero'
  | 'cliente_registrado'
  | 'cliente_anonimo';

/** Estado de aprobación, solo relevante para el cliente registrado. */
export type EstadoAprobacion = 'pendiente' | 'aprobado' | 'rechazado';

/** Fila de public.usuarios. */
export interface Usuario {
  id: string;
  apellidos: string;
  nombres: string;
  dni: string | null;
  cuil: string | null;
  correo: string;
  perfil: Perfil;
  foto_url: string | null;
  estado_aprobacion: EstadoAprobacion;
  fecha_alta: string;
}

/** Texto legible de cada perfil, para mostrar en pantalla. */
export const NOMBRE_PERFIL: Record<Perfil, string> = {
  'dueño': 'Dueño',
  'supervisor': 'Supervisor',
  'metre': 'Metre',
  'mozo': 'Mozo',
  'cocinero': 'Cocinero',
  'cantinero': 'Cantinero',
  'cliente_registrado': 'Cliente registrado',
  'cliente_anonimo': 'Cliente anónimo',
};

/** Color de la tarjeta de acceso rápido de cada perfil. */
export const COLOR_PERFIL: Record<Perfil, string> = {
  'dueño': '#94243a',
  'supervisor': '#7a3d8f',
  'metre': '#2c6e63',
  'mozo': '#2f6f9e',
  'cocinero': '#c9511f',
  'cantinero': '#3f7d4e',
  'cliente_registrado': '#e9a227',
  'cliente_anonimo': '#8b6b4a',
};

/** Ícono de Ionicons que representa a cada perfil. */
export const ICONO_PERFIL: Record<Perfil, string> = {
  'dueño': 'diamond',
  'supervisor': 'shield-checkmark',
  'metre': 'people',
  'mozo': 'restaurant',
  'cocinero': 'flame',
  'cantinero': 'wine',
  'cliente_registrado': 'person-circle',
  'cliente_anonimo': 'happy',
};

/** Devuelve "Apellidos, Nombres". */
export function nombreUsuario(usuario: Usuario): string {
  return `${usuario.apellidos}, ${usuario.nombres}`;
}

/**
 * Credencial de demostración para los botones de ingreso rápido.
 * Vive en su propia tabla de lectura pública porque la pantalla de
 * ingreso necesita mostrarlos antes de que haya una sesión iniciada.
 */
export interface AccesoRapido {
  usuario_id: string;
  orden: number;
  apellidos: string;
  nombres: string;
  correo: string;
  clave_demo: string;
  perfil: Perfil;
  foto_url: string | null;
}
