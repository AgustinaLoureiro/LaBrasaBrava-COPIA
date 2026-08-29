/**
 * =====================================================================
 * DATOS DEL GRUPO Y DE LA MARCA
 * =====================================================================
 * ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE EDITAR con los datos reales.
 * Todo lo demás (pantallas de presentación, encabezados, correos) lee
 * de acá, así que con cambiar estos valores se actualiza la aplicación
 * entera.
 * =====================================================================
 */

/** Datos del restaurante ficticio sobre el que trabaja la aplicación. */
export const RESTAURANTE = {
  nombre: 'La Brasa Brava',
  lema: 'Parrilla y cocina de autor',
  direccion: 'Avenida Mitre 1234, Avellaneda, Buenos Aires',
  correo: 'contacto@labrasabrava.com.ar',
  telefono: '11 4201 5678',
} as const;

/** Nombre del grupo de trabajo (el mismo del repositorio de GitHub). */
export const GRUPO = {
  nombre: 'La Brasa Brava',
  anio: 2026,
  materia: 'Trabajo Final Integrador',
} as const;

/**
 * Los cuatro integrantes del grupo.
 * El enunciado exige que apellidos y nombres completos aparezcan en las
 * pantallas de presentación, tanto en la estática como en la animada.
 */
export interface Integrante {
  apellidos: string;
  nombres: string;
  /** Iniciales que se muestran en la pantalla de presentación animada. */
  iniciales: string;
}

export const INTEGRANTES: readonly Integrante[] = [
  { apellidos: 'Montes', nombres: 'Enrique', iniciales: 'ME' },
  { apellidos: 'Apellido dos', nombres: 'Nombre dos', iniciales: 'AN' },
  { apellidos: 'Apellido tres', nombres: 'Nombre tres', iniciales: 'AN' },
  { apellidos: 'Apellido cuatro', nombres: 'Nombre cuatro', iniciales: 'AN' },
] as const;

/** Nombre completo listo para mostrar, en formato "Apellidos, Nombres". */
export function nombreCompleto(integrante: Integrante): string {
  return `${integrante.apellidos}, ${integrante.nombres}`;
}
