/**
 * TFI 2026 — Restaurante · Carga de usuarios de prueba
 *
 * Crea los siete usuarios que exige el enunciado (sección 4.4 de CONTEXTO-TFI.md)
 * en Supabase Auth, con el correo ya confirmado, y su fila correspondiente en
 * la tabla public.usuarios.
 *
 * Uso:
 *   1. Copiar .env.ejemplo a .env y completar las dos variables.
 *   2. node supabase/seed.mjs
 *
 * IMPORTANTE: usa la clave service_role, que es SECRETA. El archivo .env está
 * en .gitignore y nunca se sube al repositorio.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const raizProyecto = join(dirname(fileURLToPath(import.meta.url)), '..');

// Lectura simple del .env, sin dependencias externas.
function leerVariablesDeEntorno() {
  const variables = {};
  try {
    const contenido = readFileSync(join(raizProyecto, '.env'), 'utf8');
    for (const linea of contenido.split('\n')) {
      const limpia = linea.trim();
      if (!limpia || limpia.startsWith('#')) continue;
      const separador = limpia.indexOf('=');
      if (separador === -1) continue;
      variables[limpia.slice(0, separador).trim()] = limpia.slice(separador + 1).trim();
    }
  } catch {
    console.error('\n  No se encontró el archivo .env en la raíz del proyecto.');
    console.error('  Copiá .env.ejemplo a .env y completá los datos de Supabase.\n');
    process.exit(1);
  }
  return variables;
}

const entorno = leerVariablesDeEntorno();
const URL_SUPABASE = entorno.SUPABASE_URL;
const CLAVE_SERVICIO = entorno.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_SUPABASE || !CLAVE_SERVICIO) {
  console.error('\n  Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el archivo .env.\n');
  process.exit(1);
}

const supabase = createClient(URL_SUPABASE, CLAVE_SERVICIO, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * Los siete usuarios exigidos por el enunciado.
 * La clave es la misma para todos porque son usuarios de demostración y los
 * botones de ingreso rápido los cargan automáticamente durante la corrección.
 */
const CLAVE_DEMO = '111111';

const USUARIOS = [
  { correo: 'dueno@labrasabrava.com.ar',      apellidos: 'Aguirre',  nombres: 'Ricardo Daniel',  dni: '20345678', cuil: '20203456781', perfil: 'dueño' , orden: 1 },
  { correo: 'supervisor@labrasabrava.com.ar', apellidos: 'Benítez',  nombres: 'Silvia Mariana',  dni: '24567890', cuil: '27245678903', perfil: 'supervisor' , orden: 2 },
  { correo: 'metre@labrasabrava.com.ar',      apellidos: 'Cabrera',  nombres: 'Hernán Alberto',  dni: '28901234', cuil: '20289012345', perfil: 'metre' , orden: 3 },
  { correo: 'mozo@labrasabrava.com.ar',       apellidos: 'Duarte',   nombres: 'Lucía Fernanda',  dni: '31234567', cuil: '27312345678', perfil: 'mozo' , orden: 4 },
  { correo: 'cocinero@labrasabrava.com.ar',   apellidos: 'Escobar',  nombres: 'Matías Ezequiel', dni: '33456789', cuil: '20334567890', perfil: 'cocinero' , orden: 5 },
  { correo: 'cantinero@labrasabrava.com.ar',  apellidos: 'Figueroa', nombres: 'Camila Sofía',    dni: '35678901', cuil: '27356789012', perfil: 'cantinero' , orden: 6 },
  { correo: 'cliente@labrasabrava.com.ar',    apellidos: 'Gutiérrez', nombres: 'Joaquín Andrés', dni: '37890123', cuil: null,          perfil: 'cliente_registrado' , orden: 7 },
];

async function crearUsuario(datos) {
  // 1. Alta en Supabase Auth con el correo ya confirmado.
  const { data: creado, error: errorAlta } = await supabase.auth.admin.createUser({
    email: datos.correo,
    password: CLAVE_DEMO,
    email_confirm: true,
  });

  let idUsuario = creado?.user?.id;

  // Si ya existía, lo buscamos para poder actualizar su fila de perfil.
  if (errorAlta) {
    if (!/already|registrad|exist/i.test(errorAlta.message)) {
      throw new Error(`${datos.correo}: ${errorAlta.message}`);
    }
    const { data: listado } = await supabase.auth.admin.listUsers({ perPage: 200 });
    idUsuario = listado?.users.find((u) => u.email === datos.correo)?.id;
    if (!idUsuario) throw new Error(`${datos.correo}: existe en Auth pero no se pudo recuperar.`);
  }

  // 2. Fila de perfil en public.usuarios.
  const { error: errorPerfil } = await supabase.from('usuarios').upsert({
    id: idUsuario,
    apellidos: datos.apellidos,
    nombres: datos.nombres,
    dni: datos.dni,
    cuil: datos.cuil,
    correo: datos.correo,
    perfil: datos.perfil,
    estado_aprobacion: 'aprobado',
  });

  if (errorPerfil) throw new Error(`${datos.correo}: ${errorPerfil.message}`);

  // 3. Acceso rápido, para el botón correspondiente de la pantalla de ingreso.
  const { error: errorAcceso } = await supabase.from('accesos_rapidos').upsert({
    usuario_id: idUsuario,
    orden: datos.orden,
    apellidos: datos.apellidos,
    nombres: datos.nombres,
    correo: datos.correo,
    clave_demo: CLAVE_DEMO,
    perfil: datos.perfil,
  });

  if (errorAcceso) throw new Error(`${datos.correo}: ${errorAcceso.message}`);

  return errorAlta ? 'actualizado' : 'creado';
}

console.log('\n  Cargando usuarios de prueba en Supabase...\n');

let creados = 0;
let actualizados = 0;

for (const datos of USUARIOS) {
  try {
    const resultado = await crearUsuario(datos);
    resultado === 'creado' ? creados++ : actualizados++;
    console.log(`  [${resultado.padEnd(12)}] ${datos.perfil.padEnd(20)} ${datos.correo}`);
  } catch (error) {
    console.error(`  [error       ] ${error.message}`);
  }
}

console.log(`\n  Listo: ${creados} creados, ${actualizados} actualizados.`);
console.log(`  Clave para todos los usuarios de demostración: ${CLAVE_DEMO}\n`);
