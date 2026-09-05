/**
 * =====================================================================
 * SISTEMA DE DISEÑO — BRASA BRAVA
 * =====================================================================
 * Los mismos valores que define el manual de identidad de la marca
 * (Diseño/MANUAL-DE-MARCA.md), disponibles desde TypeScript para cuando
 * un color tiene que decidirse por código y no por hoja de estilos: el
 * color de la ficha de cada perfil, el color de un gráfico, el color de
 * la barra de estado del teléfono.
 *
 * La versión en CSS de estos mismos valores está en
 * src/theme/variables.scss, y es la que usan las pantallas.
 * =====================================================================
 */

/** Colores de marca, con los códigos exactos del manual (versión 3). */
export const PALETA = {
  /** Primario. Botones de acción, íconos activos, progreso y espera. */
  naranjaBrasa: '#e2622c',
  /** Secundario. Destacados, etiquetas y títulos. */
  ambarCeniza: '#f2a63b',
  /** Encabezados y superficies de énfasis. Nunca fondo de pantalla. */
  terracota: '#8e3418',
  /** Fondo alterno para separar módulos. */
  olivaAhumada: '#5c6b46',
  /** Acentos y tarjetas destacadas. */
  ladrillo: '#a83e1e',
  /** Barras de navegación. */
  brasaProfunda: '#6b2a13',
  /** Fondo principal de toda pantalla, y texto sobre los colores oscuros. */
  cremaTrigo: '#f0dfc6',
  /** Texto sobre crema y ámbar. */
  carbonParrilla: '#2e2a28',
} as const;

/** Colores semánticos del manual. */
export const SEMANTICOS = {
  /** Pedido listo, alta confirmada. */
  exito: '#3f8f5b',
  /** Pendiente de aprobación, demora en cocina. */
  alerta: '#e0a72e',
  /** Validación fallida. Siempre acompañado de vibración. */
  error: '#c2352a',
  /** Avisos, notificaciones y estados de espera. */
  informacion: '#3c7e92',
} as const;

/**
 * Escala tipográfica del manual, en píxeles.
 * Ningún texto de la aplicación baja de 16 píxeles.
 */
export const TIPOGRAFIA = {
  display: { tamanio: 40, interlineado: 44, peso: 900 },
  titulo: { tamanio: 28, interlineado: 34, peso: 800 },
  subtitulo: { tamanio: 21, interlineado: 26, peso: 700 },
  cuerpo: { tamanio: 18, interlineado: 26, peso: 400 },
  boton: { tamanio: 18, interlineado: 20, peso: 800, alto: 56 },
  ayuda: { tamanio: 16, interlineado: 22, peso: 600 },
} as const;

/** Familias tipográficas de la marca. */
export const FUENTES = {
  /** Títulos, botones, números de mesa y precios. Pesos 700 / 800 / 900. */
  titulos: 'Montserrat',
  /** Cuerpo, descripciones, validaciones y encuestas. Pesos 400 / 600 / 700. */
  cuerpo: 'Source Sans 3',
} as const;
