/**
 * =====================================================================
 * CONEXIÓN CON SUPABASE
 * =====================================================================
 * Estos son los datos del proyecto de Supabase del grupo, los mismos que
 * ya están en LaBrasaBrava/src/environments/environment.ts.
 *
 * La clave publicable es pública por diseño: viaja al teléfono dentro de
 * la aplicación y no es un secreto. La seguridad real la dan las
 * políticas RLS de la base.
 *
 * La clave "service_role" NO va acá nunca: esa sí es secreta y solo se
 * usa desde supabase/seed.mjs, leyéndola del archivo .env.
 *
 * Cómo obtener estos dos valores, si alguna vez hay que cambiarlos:
 *   1. Entrar a https://supabase.com e iniciar sesión.
 *   2. Abrir el proyecto del grupo.
 *   3. Ir a Project Settings → Data API.
 *   4. Copiar "Project URL" y la clave publicable.
 * =====================================================================
 */

export const CONFIGURACION_SUPABASE = {
  url: 'https://jrlcuuschytropszvowh.supabase.co',
  claveAnonima: 'sb_publishable_fg9_mEboK6vi1oYcnjEK4w_SlzV_pTF',
} as const;

/** Indica si todavía faltan cargar los datos de conexión. */
export function faltaConfigurarSupabase(): boolean {
  return (
    CONFIGURACION_SUPABASE.url.includes('COMPLETAR') ||
    CONFIGURACION_SUPABASE.claveAnonima.includes('COMPLETAR')
  );
}
