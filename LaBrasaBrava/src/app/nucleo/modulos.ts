/**
 * =====================================================================
 * MÓDULOS DE LA APLICACIÓN Y QUÉ PERFIL VE CADA UNO
 * =====================================================================
 * Este archivo es la única fuente de verdad sobre los permisos: la
 * pantalla principal arma su lista leyendo de acá y las rutas usan estos
 * mismos grupos de perfiles en sus guardas. Si un módulo se agrega o
 * cambia de dueño, se toca acá y en ningún otro lado.
 *
 * El reparto sale del enunciado (ver la sección 6 de
 * docs/AUDITORIA-DEL-ENUNCIADO.md, punto por punto).
 * =====================================================================
 */

import { Perfil } from './modelos/usuario';

/**
 * Los que administran el local.
 * Puntos 1 (alta de empleados), 4 (alta de mesas) y 6, 7 y 8 (aprobar o
 * rechazar clientes registrados).
 */
export const PERFILES_ADMINISTRACION: readonly Perfil[] = ['dueño', 'supervisor'];

/**
 * Los que atienden el salón.
 * El metre da de alta clientes en el mostrador (punto 5) y maneja la
 * lista de espera y la asignación de mesas (puntos 9 y 10).
 */
export const PERFILES_SALON: readonly Perfil[] = ['metre'];

/**
 * Los que preparan y sirven el pedido.
 * Puntos 12 a 19: el mozo toma y confirma el pedido, la cocina y el bar
 * lo preparan en sus listados por sector.
 */
export const PERFILES_SERVICIO: readonly Perfil[] = ['mozo', 'cocinero', 'cantinero'];

/**
 * Las dos clases de cliente.
 * El anónimo entra con nombre y foto (punto 9); el registrado tiene
 * cuenta y necesita la aprobación del dueño o del supervisor (punto 5).
 */
export const PERFILES_CLIENTE: readonly Perfil[] = ['cliente_registrado', 'cliente_anonimo'];

/** Un módulo de la aplicación, tal como se lo ofrece en la pantalla principal. */
export interface Modulo {
  /** Nombre que se muestra, en español y sin abreviaturas. */
  nombre: string;
  /** Ruta a la que lleva, o null si todavía no está construido. */
  ruta: string | null;
  /** Perfiles que pueden verlo y entrar. */
  perfiles: readonly Perfil[];
}

/**
 * Todos los módulos del trabajo, con el perfil que corresponde a cada
 * uno. Los que tienen `ruta: null` están anunciados pero todavía no los
 * terminó el integrante que los tiene asignados.
 */
export const MODULOS: readonly Modulo[] = [
  // --- Administración ---------------------------------------------------
  {
    // Punto 1: el dueño o el supervisor dan de alta a un cocinero.
    nombre: 'Alta de empleados',
    ruta: '/empleado',
    perfiles: PERFILES_ADMINISTRACION,
  },
  {
    // Punto 4: alta de una mesa nueva, con su código QR.
    nombre: 'Gestión de mesas',
    ruta: null,
    perfiles: PERFILES_ADMINISTRACION,
  },
  {
    // Puntos 6, 7 y 8: solo el dueño o el supervisor aprueban o rechazan.
    nombre: 'Aprobación de clientes',
    ruta: '/aprobacion-clientes',
    perfiles: PERFILES_ADMINISTRACION,
  },

  // --- Cocina y barra ---------------------------------------------------
  {
    // Punto 2: el plato lo carga el cocinero.
    nombre: 'Alta de platos',
    ruta: '/plato',
    perfiles: ['cocinero'],
  },
  {
    // Punto 3: la bebida la carga el cantinero.
    nombre: 'Alta de bebidas',
    ruta: null,
    perfiles: ['cantinero'],
  },

  // --- Salón ------------------------------------------------------------
  {
    // Punto 5: lo hace el propio cliente o el metre desde el mostrador.
    nombre: 'Registro de clientes',
    ruta: '/registro-cliente',
    perfiles: [...PERFILES_SALON, 'cliente_anonimo'],
  },
  {
    // Puntos 9 y 10: el cliente se anota y el metre asigna la mesa.
    nombre: 'Lista de espera',
    ruta: '/lista-espera',
    perfiles: [...PERFILES_SALON, ...PERFILES_CLIENTE],
  },
  {
    // Puntos 12 a 19: pedido, comanda y listados por sector.
    nombre: 'Pedidos y comanda',
    ruta: null,
    perfiles: [...PERFILES_SERVICIO, ...PERFILES_CLIENTE],
  },

  // --- Cliente ----------------------------------------------------------
  {
    // Punto 20: la contesta el cliente y después ve los gráficos.
    nombre: 'Encuesta de satisfacción',
    ruta: '/encuesta',
    perfiles: PERFILES_CLIENTE,
  },
];

/** Devuelve los módulos que le corresponden al perfil indicado. */
export function modulosDelPerfil(perfil: Perfil): Modulo[] {
  return MODULOS.filter((modulo) => modulo.perfiles.includes(perfil));
}
