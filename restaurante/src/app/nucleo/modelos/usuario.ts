import { PALETA, SEMANTICOS } from '../diseno';

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

/** Texto legible de cada estado de aprobación, para mostrar en pantalla. */
export const NOMBRE_ESTADO_APROBACION: Record<EstadoAprobacion, string> = {
  pendiente: 'Pendiente de aprobación',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
};

/**
 * Clase de etiqueta con la que se pinta cada estado.
 * Los colores salen de los semánticos del manual: alerta para lo que está
 * esperando, éxito para lo aprobado y error para lo rechazado.
 */
export const ETIQUETA_ESTADO_APROBACION: Record<EstadoAprobacion, string> = {
  pendiente: 'etiqueta-alerta',
  aprobado: 'etiqueta-exito',
  rechazado: 'etiqueta-error',
};

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

/**
 * Color de la ficha de cada perfil.
 *
 * El manual de marca muestra una muestra de color por perfil pero no
 * publica los códigos, así que cada uno está tomado de un color distinto
 * de la paleta oficial (ver Diseño/MANUAL-DE-MARCA.md, sección 4).
 */
export const COLOR_PERFIL: Record<Perfil, string> = {
  'dueño': PALETA.ladrillo,
  'supervisor': PALETA.brasaProfunda,
  'metre': PALETA.olivaAhumada,
  'mozo': SEMANTICOS.informacion,
  'cocinero': PALETA.naranjaBrasa,
  'cantinero': SEMANTICOS.exito,
  'cliente_registrado': PALETA.ambarCeniza,
  'cliente_anonimo': '#8a7458',
};

/**
 * Color del texto que va encima del color del perfil.
 * Sobre ámbar y sobre la crema oscurecida el manual pide carbón; sobre
 * el resto de los colores, crema.
 */
export const TEXTO_SOBRE_PERFIL: Record<Perfil, string> = {
  'dueño': PALETA.cremaTrigo,
  'supervisor': PALETA.cremaTrigo,
  'metre': PALETA.cremaTrigo,
  'mozo': PALETA.cremaTrigo,
  'cocinero': PALETA.cremaTrigo,
  'cantinero': PALETA.cremaTrigo,
  'cliente_registrado': PALETA.carbonParrilla,
  'cliente_anonimo': PALETA.carbonParrilla,
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
 * Se arma leyendo las tablas de empleados y de clientes registrados, así
 * que las fichas no son botones fijos: aparecen solas a medida que se dan
 * de alta usuarios nuevos.
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
  /**
   * Solo cambia para el cliente registrado. Los pendientes y los
   * rechazados aparecen en la lista a propósito: el enunciado pide poder
   * verificar que esos dos no logran ingresar.
   */
  estado_aprobacion: EstadoAprobacion;
}
