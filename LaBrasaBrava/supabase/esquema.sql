-- =====================================================================
-- TFI 2026 — Restaurante · Esquema OBJETIVO (migración a Supabase Auth)
-- Ejecutar en: Supabase → SQL Editor → New query → Run
-- =====================================================================
--
-- OJO: esto TODAVÍA NO ES lo que hay en la base del grupo.
--
-- Hoy la base tiene las tablas `empleados`, `clientes`, `platos`,
-- `bebidas`, `mesas` y `lista_espera`, con la contraseña guardada en
-- texto plano y sin Supabase Auth. La aplicación valida contra esas
-- tablas (ver nucleo/servicios/sesion.service.ts) y los usuarios de
-- prueba se cargan con `node supabase/usuarios-de-prueba.mjs`.
--
-- Este archivo es a dónde queremos llegar: una sola tabla de usuarios
-- espejo de auth.users, con las contraseñas administradas por Supabase
-- Auth y con políticas RLS de verdad. Cuando se aplique, el único
-- archivo de la aplicación que hay que tocar es sesion.service.ts.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tipos (perfiles del enunciado, sección 4.3 de CONTEXTO-TFI.md)
-- ---------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'perfil_usuario') then
    create type perfil_usuario as enum (
      'dueño',
      'supervisor',
      'metre',
      'mozo',
      'cocinero',
      'cantinero',
      'cliente_registrado',
      'cliente_anonimo'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'estado_aprobacion') then
    create type estado_aprobacion as enum ('pendiente', 'aprobado', 'rechazado');
  end if;
end $$;

-- ---------------------------------------------------------------------
-- 2. Tabla de usuarios (espejo de auth.users con los datos del enunciado)
-- ---------------------------------------------------------------------
create table if not exists public.usuarios (
  id                 uuid primary key references auth.users (id) on delete cascade,
  apellidos          text        not null,
  nombres            text        not null,
  dni                text,
  cuil               text,
  correo             text        not null unique,
  perfil             perfil_usuario   not null,
  foto_url           text,
  estado_aprobacion  estado_aprobacion not null default 'aprobado',
  fecha_alta         timestamptz not null default now()
);

comment on table public.usuarios is
  'Datos de perfil del enunciado. La contraseña la administra Supabase Auth, nunca se guarda acá.';
comment on column public.usuarios.estado_aprobacion is
  'Solo aplica a cliente_registrado (puntos 5 a 8). Empleados y anónimos nacen aprobados.';

-- Índice para el listado de clientes pendientes de aprobación (punto 6)
create index if not exists usuarios_pendientes_idx
  on public.usuarios (estado_aprobacion)
  where estado_aprobacion = 'pendiente';

-- ---------------------------------------------------------------------
-- 3. Seguridad a nivel de fila (RLS)
-- ---------------------------------------------------------------------
alter table public.usuarios enable row level security;

-- Cada usuario autenticado puede leer su propia fila.
drop policy if exists "usuarios_leen_su_fila" on public.usuarios;
create policy "usuarios_leen_su_fila"
  on public.usuarios for select
  to authenticated
  using (auth.uid() = id);

-- Dueño y supervisor pueden leer todas las filas (listados de aprobación).
drop policy if exists "gerencia_lee_todo" on public.usuarios;
create policy "gerencia_lee_todo"
  on public.usuarios for select
  to authenticated
  using (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid()
        and u.perfil in ('dueño', 'supervisor')
    )
  );

-- Dueño y supervisor pueden aprobar o rechazar clientes.
drop policy if exists "gerencia_actualiza" on public.usuarios;
create policy "gerencia_actualiza"
  on public.usuarios for update
  to authenticated
  using (
    exists (
      select 1 from public.usuarios u
      where u.id = auth.uid()
        and u.perfil in ('dueño', 'supervisor')
    )
  );

-- ---------------------------------------------------------------------
-- 4. Verificación rápida
-- ---------------------------------------------------------------------
-- select correo, perfil, estado_aprobacion from public.usuarios order by perfil;

-- =====================================================================
-- 5. Accesos rápidos (botones de ingreso rápido de la pantalla inicial)
-- =====================================================================
-- El enunciado exige botones de ingreso rápido por perfil y que NO sean
-- botones fijos. Por eso se leen de esta tabla en lugar de escribirlos
-- en el código de la aplicación.
--
-- Es de lectura pública porque la pantalla de ingreso todavía no tiene
-- sesión iniciada. Contiene únicamente credenciales de demostración,
-- creadas para la corrección de la materia.
-- ---------------------------------------------------------------------

create table if not exists public.accesos_rapidos (
  usuario_id  uuid primary key references public.usuarios (id) on delete cascade,
  orden       integer not null,
  apellidos   text    not null,
  nombres     text    not null,
  correo      text    not null,
  clave_demo  text    not null,
  perfil      perfil_usuario not null,
  foto_url    text
);

comment on table public.accesos_rapidos is
  'Credenciales de demostración para los botones de ingreso rápido. Solo usuarios de prueba.';

alter table public.accesos_rapidos enable row level security;

-- Cualquiera puede leerlos: la pantalla de ingreso los necesita sin sesión.
drop policy if exists "accesos_rapidos_lectura_publica" on public.accesos_rapidos;
create policy "accesos_rapidos_lectura_publica"
  on public.accesos_rapidos for select
  to anon, authenticated
  using (true);

-- Verificación:
-- select orden, perfil, correo from public.accesos_rapidos order by orden;
