# La Brasa Brava — Trabajo Final Integrador 2026

Aplicación móvil de gestión integral para un restaurante: comanda para los empleados y
experiencia completa para el cliente.

> **Grupo:** _(completar)_ · **Materia:** Trabajo Final Integrador · **Año:** 2026
> **Universidad Tecnológica Nacional — Facultad Regional Avellaneda**

---

## Índice

1. [Integrantes y reparto de tareas](#1-integrantes-y-reparto-de-tareas)
2. [Índice de imágenes del proyecto](#2-índice-de-imágenes-del-proyecto)
3. [Códigos QR del sistema](#3-códigos-qr-del-sistema)
4. [Cómo levantar el proyecto](#4-cómo-levantar-el-proyecto)
5. [Usuarios de prueba](#5-usuarios-de-prueba)
6. [Tecnologías](#6-tecnologías)
7. [Estructura de carpetas](#7-estructura-de-carpetas)

---

## 1. Integrantes y reparto de tareas

> **Responsabilidad del líder del grupo.** Esta tabla debe estar actualizada al momento de
> cada entrega, preliminar o final. Si alguien no llega con su módulo, se cambia el plazo o
> se reasigna, y **queda informado acá**.

| Apellidos y nombres | Módulos (objetivos) a desarrollar | Inicio | Finalización | Branch |
|---|---|---|---|---|
| _(completar)_ | Base del proyecto, identidad visual, pantallas de presentación, ingreso y cierre de sesión | 28-08-2026 | _(en curso)_ | `main` |
| _(completar)_ | Altas y validaciones: empleados (punto 1), platos (2), bebidas (3), mesas (4) | | | |
| _(completar)_ | Clientes: registro (5), aprobación (6), rechazo (7), aceptación (8), correos automáticos | | | |
| _(completar)_ | Salón: lista de espera (9), asignación de mesa (10), menú y consulta al mozo (11) | | | |

### Propuesta de reparto para todo el cuatrimestre

El detalle completo, con el cronograma semana por semana y las reglas para no pisarse entre
ramas, está en **[REPARTO-DE-TAREAS.md](REPARTO-DE-TAREAS.md)**.

| Integrante | Primera fecha (17-10) | Segunda fecha (07-11) | Tercera fecha (28-11) |
|---|---|---|---|
| **1 — Núcleo y acceso** | Diseño, presentaciones, ingreso, cierre de sesión · Puntos 9, 10, 15, 21, 22 y los tres juegos | Punto 23 (redes sociales) | Puntos 24, 25, 26 (reservas) |
| **2 — Altas, carta y QR** | Puntos 1, 2, 3, 4 · Todos los códigos QR | Punto 22 (factura en PDF) | Punto 31 (acelerómetro y giroscopio) |
| **3 — Clientes y avisos** | Puntos 5, 6, 7, 8, 20 · Correos automáticos y notificaciones push | Envío de la factura por correo | Puntos 27, 28 (delivery) |
| **4 — Pedidos y comanda** | Puntos 11, 12, 13, 14, 16, 17, 18, 19 | — | Puntos 29, 30 (repartidor) |

**Transversales (los cuatro):** que ninguna pantalla tenga espacios neutros, que todo error
vibre, que toda espera muestre el spinner con el logo y que todos los campos estén validados.

---

## 2. Índice de imágenes del proyecto

> La cátedra exige que **TODAS Y CADA UNA** de las imágenes del proyecto estén enlazadas acá:
> íconos, pantallas de presentación, formularios, listados, etc.

### Identidad
| Imagen | Descripción |
|---|---|
| _(pendiente)_ | Ícono de la aplicación (1024 × 1024) |
| _(pendiente)_ | Ícono enmascarable para Android |
| _(pendiente)_ | Pantalla de presentación estática |
| _(pendiente)_ | Pantalla de presentación animada |

### Pantallas
| Imagen | Descripción |
|---|---|
| _(pendiente)_ | Pantalla de ingreso con accesos rápidos |
| _(pendiente)_ | Pantalla de ingreso con errores de validación |
| _(pendiente)_ | Pantalla principal según perfil |
| _(pendiente)_ | Indicador de espera con el logo |

---

## 3. Códigos QR del sistema

> Excluyente: **todos** los códigos QR deben estar disponibles acá y en pantalla.

| Código | Cantidad | Estado |
|---|---|---|
| Ingreso al local | 1 | _(pendiente)_ |
| Mesa (uno por mesa, generado automáticamente) | 5 o más | _(pendiente)_ |
| Propina — Excelente (20 %) | 1 | _(pendiente)_ |
| Propina — Muy bueno (15 %) | 1 | _(pendiente)_ |
| Propina — Bueno (10 %) | 1 | _(pendiente)_ |
| Propina — Regular (5 %) | 1 | _(pendiente)_ |
| Propina — Malo (0 %) | 1 | _(pendiente)_ |

---

## 4. Cómo levantar el proyecto

### Requisitos
- Node.js 20 o superior
- Android Studio con un dispositivo o emulador configurado
- Una cuenta en [Supabase](https://supabase.com)

### Pasos

```bash
# 1. Instalar las dependencias
npm install

# 2. Preparar la base de datos
#    Entrar a Supabase → SQL Editor → New query
#    Pegar y ejecutar el contenido de supabase/esquema.sql

# 3. Configurar la conexión de la aplicación
#    Editar src/app/nucleo/configuracion.ts con la URL del proyecto
#    y la clave pública "anon" (Project Settings → Data API).

# 4. Cargar los usuarios de prueba
cp supabase/.env.ejemplo .env      # completar con la clave service_role
node supabase/seed.mjs

# 5. Levantar la aplicación en el navegador
ionic serve

# 6. Compilar y abrir el proyecto de Android
ionic build
npx cap add android
npx cap sync
npx cap open android
```

---

## 5. Usuarios de prueba

Todos usan la contraseña **`111111`**. Se cargan con `node supabase/seed.mjs` y aparecen
solos en la pantalla de ingreso como accesos rápidos.

| Perfil | Correo electrónico |
|---|---|
| Dueño | `dueno@labrasabrava.com.ar` |
| Supervisor | `supervisor@labrasabrava.com.ar` |
| Metre | `metre@labrasabrava.com.ar` |
| Mozo | `mozo@labrasabrava.com.ar` |
| Cocinero | `cocinero@labrasabrava.com.ar` |
| Cantinero | `cantinero@labrasabrava.com.ar` |
| Cliente registrado | `cliente@labrasabrava.com.ar` |

---

## 6. Tecnologías

| Área | Herramienta |
|---|---|
| Framework | Ionic 9 + Angular 22 (componentes standalone) |
| Empaquetado nativo | Capacitor 8 |
| Base de datos y autenticación | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Vibración | `@capacitor/haptics` |
| Sonidos | Web Audio API, generados por código |

---

## 7. Estructura de carpetas

```
src/app/
  nucleo/
    marca.ts              Datos del grupo y del restaurante (ÚNICO archivo a editar)
    configuracion.ts      Conexión con Supabase
    modelos/              Tipos de datos (usuario, perfiles)
    servicios/            Supabase, sesión, mensajes, espera, sonidos
    guardas/              Control de acceso por sesión y por perfil
  compartido/
    logo-marca/           Isotipo vectorial animado
    spinner-logo/         Indicador de espera con el logo
  paginas/
    presentacion/         Pantalla de presentación animada
    ingreso/              Formulario de ingreso y accesos rápidos
    principal/            Pantalla posterior al ingreso, con cierre de sesión
supabase/
  esquema.sql             Tablas, tipos y políticas de seguridad
  seed.mjs                Carga de los usuarios de prueba
```

### Dos reglas de código que no se negocian

**Todo error pasa por `MensajesService`.** Nunca se usa `alert()`, y el servicio garantiza
que cada error vibre:

```ts
await this.mensajes.error('No pudimos verificarte', 'El correo o la contraseña son incorrectos.');
```

**Toda espera pasa por `CargandoService.durante()`.** Así ninguna queda sin el spinner con
el logo, incluso si la operación falla:

```ts
const resultado = await this.cargando.durante('Verificando tus datos', () =>
  this.sesion.ingresar(correo, clave),
);
```
