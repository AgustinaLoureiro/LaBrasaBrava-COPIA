/**
 * =====================================================================
 * CONEXIÓN CON SUPABASE
 * =====================================================================
 * Cómo obtener estos dos valores:
 *   1. Entrar a https://supabase.com e iniciar sesión.
 *   2. Abrir el proyecto del grupo.
 *   3. Ir a Project Settings → Data API.
 *   4. Copiar "Project URL" y la clave pública "anon public".
 *
 * La clave "anon" es pública por diseño: viaja al teléfono y no es un
 * secreto. La seguridad real la dan las políticas RLS de la base.
 * La clave "service_role" NO va acá nunca: esa es secreta y solo se usa
 * desde supabase/seed.mjs, leyéndola del archivo .env.
 * =====================================================================
 */

export const CONFIGURACION_SUPABASE = {
  url: 'https://COMPLETAR.supabase.co',
  claveAnonima: 'COMPLETAR',
} as const;

/** Indica si todavía faltan cargar los datos de conexión. */
export function faltaConfigurarSupabase(): boolean {
  return (
    CONFIGURACION_SUPABASE.url.includes('COMPLETAR') ||
    CONFIGURACION_SUPABASE.claveAnonima.includes('COMPLETAR')
  );
}
