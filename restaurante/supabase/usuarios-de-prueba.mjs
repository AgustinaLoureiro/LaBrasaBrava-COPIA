/**
 * =====================================================================
 * TFI 2026 — La Brasa Brava · Alta de los usuarios de prueba
 * =====================================================================
 * El enunciado (sección 4.4 de CONTEXTO-TFI.md) exige tener cargados,
 * como mínimo, un dueño, un supervisor, un metre, un mozo, un cocinero,
 * un cantinero y un cliente registrado. Este script los da de alta en la
 * base del grupo y deja además un cliente pendiente de aprobación y uno
 * rechazado, que hacen falta para probar los puntos 6, 7 y 8.
 *
 * Escribe sobre las tablas que el grupo tiene creadas hoy:
 *   · public.empleados → dueño, supervisor, metre, mozo, cocinero, cantinero
 *   · public.clientes  → cliente registrado, con estado de aprobación
 *
 * Uso:
 *   node supabase/usuarios-de-prueba.mjs
 *
 * Es idempotente: busca por correo electrónico y solo da de alta a quien
 * falta, así que se puede correr las veces que haga falta sin duplicar
 * nada ni pisar los datos que hayan cargado los demás integrantes.
 *
 * No necesita ninguna clave secreta: usa la misma clave publicable que
 * la aplicación, que es pública por diseño (ver nucleo/configuracion.ts).
 * =====================================================================
 */

import { createClient } from '@supabase/supabase-js';

const URL_SUPABASE = 'https://jrlcuuschytropszvowh.supabase.co';
const CLAVE_PUBLICABLE = 'sb_publishable_fg9_mEboK6vi1oYcnjEK4w_SlzV_pTF';

const supabase = createClient(URL_SUPABASE, CLAVE_PUBLICABLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * Clave de todos los usuarios de demostración. Es la misma para todos
 * porque los botones de ingreso rápido la cargan solos durante la
 * corrección, y porque tiene los seis caracteres que exige la validación
 * de la pantalla de ingreso.
 */
const CLAVE_DEMO = '123456';

/** Los seis perfiles de empleado del enunciado. */
const EMPLEADOS = [
  {
    apellidos: 'Loureiro',
    nombres: 'Agustina',
    dni: '12345678',
    cuil: '27-12345678-0',
    email: 'aloureiro@labrasabrava.com',
    perfil: 'dueño',
  },
  {
    apellidos: 'Benítez',
    nombres: 'Silvia Mariana',
    dni: '24567890',
    cuil: '27-24567890-3',
    email: 'supervisora@labrasabrava.com',
    perfil: 'supervisor',
  },
  {
    apellidos: 'Cabrera',
    nombres: 'Hernán Alberto',
    dni: '28901234',
    cuil: '20-28901234-5',
    email: 'metre@labrasabrava.com',
    perfil: 'metre',
  },
  {
    apellidos: 'Duarte',
    nombres: 'Lucía Fernanda',
    dni: '31234567',
    cuil: '27-31234567-8',
    email: 'mozo@labrasabrava.com',
    perfil: 'mozo',
  },
  {
    apellidos: 'Escobar',
    nombres: 'Matías Ezequiel',
    dni: '33456789',
    cuil: '20-33456789-0',
    email: 'cocinero@labrasabrava.com',
    perfil: 'cocinero',
  },
  {
    apellidos: 'Figueroa',
    nombres: 'Camila Sofía',
    dni: '35678901',
    cuil: '27-35678901-2',
    email: 'cantinero@labrasabrava.com',
    perfil: 'cantinero',
  },
];

/**
 * Clientes registrados, uno por cada estado de aprobación.
 * El aceptado es el que exige el enunciado; los otros dos existen para
 * poder mostrar el listado de pendientes (punto 6), el rechazo con su
 * correo (punto 7) y la aceptación (punto 8).
 */
const CLIENTES = [
  {
    apellidos: 'Gutiérrez',
    nombres: 'Joaquín Andrés',
    dni: '37890123',
    email: 'cliente@labrasabrava.com',
    estado: 'aceptado',
  },
  {
    apellidos: 'Ibarra',
    nombres: 'Valentina Rocío',
    dni: '40123456',
    email: 'valentina.ibarra@ejemplo.com.ar',
    estado: 'pendiente',
  },
  {
    apellidos: 'Juárez',
    nombres: 'Rodrigo Emanuel',
    dni: '41234567',
    email: 'rodrigo.juarez@ejemplo.com.ar',
    estado: 'rechazado',
  },
];

/**
 * Da de alta una fila si su correo todavía no existe.
 * Devuelve qué pasó, para poder informarlo en la consola.
 */
async function darDeAlta(tabla, fila) {
  const { data: existente, error: errorBusqueda } = await supabase
    .from(tabla)
    .select('id')
    .eq('email', fila.email)
    .maybeSingle();

  if (errorBusqueda) {
    throw new Error(`${fila.email}: ${errorBusqueda.message}`);
  }

  if (existente) return 'ya estaba';

  const { error: errorAlta } = await supabase.from(tabla).insert(fila);
  if (errorAlta) throw new Error(`${fila.email}: ${errorAlta.message}`);

  return 'dado de alta';
}

console.log('\n  Cargando los usuarios de prueba de La Brasa Brava...\n');
console.log('  --- Empleados ---------------------------------------------');

for (const empleado of EMPLEADOS) {
  try {
    const resultado = await darDeAlta('empleados', {
      ...empleado,
      password: CLAVE_DEMO,
      foto_url: null,
    });
    console.log(`  [${resultado.padEnd(12)}] ${empleado.perfil.padEnd(12)} ${empleado.email}`);
  } catch (error) {
    console.error(`  [error       ] ${error.message}`);
  }
}

console.log('\n  --- Clientes registrados ----------------------------------');

for (const cliente of CLIENTES) {
  try {
    const resultado = await darDeAlta('clientes', {
      ...cliente,
      password: CLAVE_DEMO,
      foto_url: null,
    });
    console.log(`  [${resultado.padEnd(12)}] ${cliente.estado.padEnd(12)} ${cliente.email}`);
  } catch (error) {
    console.error(`  [error       ] ${error.message}`);
  }
}

console.log(`\n  Clave de todos los usuarios de demostración: ${CLAVE_DEMO}`);
console.log('  Las fotos quedan vacías a propósito: se cargan desde la cámara');
console.log('  cuando se usan las pantallas de alta (puntos 1 y 5).\n');
