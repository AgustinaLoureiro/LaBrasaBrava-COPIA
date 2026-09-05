# Flujo de trabajo con Git — La Brasa Brava 2026

> Cómo trabajamos los cuatro sobre el mismo repositorio sin pisarnos.
> El reparto de puntos funcionales está en **`REPARTO-DE-TAREAS.md`**.

- **Repositorio:** https://github.com/acostaamericonicolas/LaBrasaBrava-2026 (privado, con los seis docentes agregados como colaboradores)
- **Nombre del grupo:** La Brasa Brava
- **Rama principal:** `main` — nadie programa directamente sobre ella

---

## La idea en una frase

Cada integrante trabaja en **su propia rama** y es **dueño de su propia carpeta** dentro de
`src/app/pages/`. Los cambios se unen a `main` una vez por semana, antes de cada revisión de
la cátedra. Así, dos personas nunca editan el mismo archivo al mismo tiempo.

---

## Las cuatro ramas

| Rama | Integrante | Recorrido que se lleva |
|---|---|---|
| `nucleo-acceso` | _(completar)_ | Diseño, presentación, ingreso, lista de espera, juegos, cuenta y pago |
| `altas-carta-qr` | _(completar)_ | Altas de empleado, plato, bebida y mesa, y todos los códigos QR |
| `clientes-correos` | _(completar)_ | Clientes registrados, encuesta con gráficos, correos y notificaciones |
| `pedidos-comanda` | _(completar)_ | Menú, chat con el mozo, pedido, cocina, bar y entrega |

---

## Puesta en marcha (una sola vez por persona)

```bash
git clone https://github.com/acostaamericonicolas/LaBrasaBrava-2026.git
cd LaBrasaBrava-2026/restaurante
npm install
git switch -c NOMBRE-DE-TU-RAMA
git push -u origin NOMBRE-DE-TU-RAMA
```

Además, cada uno necesita completar `src/environments/environment.ts` con la dirección y la clave
anónima del proyecto de Supabase del grupo. La clave anónima es pública por diseño; la clave
`service_role` **nunca** va en el repositorio, va en el archivo `.env`, que está ignorado.

---

## El día a día

**Antes de empezar a programar**, traer a la rama propia lo que los demás hayan subido:

```bash
git switch main
git pull
git switch NOMBRE-DE-TU-RAMA
git merge main
```

Hacerlo todos los días resuelve los conflictos de a uno. Dejarlo para el final los junta todos
juntos, que es el escenario que hay que evitar.

**Al terminar cada cosa**, un commit chico con el mensaje en español:

```bash
git add -A
git commit -m "Alta de plato con validación de precio"
git push
```

**Una vez por semana**, antes de la revisión de la cátedra, unir la rama a `main` con un Pull
Request en GitHub. Aunque se apruebe en dos minutos, deja registro de quién hizo qué, que es
exactamente lo que el README le tiene que mostrar a los profesores.

---

## Las tres reglas que evitan los conflictos

1. **Cada uno toca solamente su carpeta** dentro de `src/app/pages/`. En la carpeta de otro no
   mete mano nadie.

2. **Hay cuatro archivos compartidos.** Antes de tocar cualquiera de ellos, avisar por el grupo y
   unir a `main` enseguida:

   | Archivo | Para qué |
   |---|---|
   | `src/app/app.routes.ts` | Registro de pantallas nuevas |
   | `src/app/nucleo/marca.ts` | Datos del grupo y del restaurante |
   | `src/theme/variables.scss` | Paleta de colores |
   | `supabase/esquema.sql` | Tablas nuevas |

3. **`main` tiene que compilar siempre.** De ahí sale la aplicación que instalamos en los cuatro
   teléfonos, y la cátedra exige que los cuatro tengamos exactamente la misma versión al momento
   de presentar. Si después de un merge algo deja de compilar, avisar antes de seguir tocando.

---

## Texto para mandarle al grupo

```
Equipo, el repositorio ya está creado y los profesores agregados:
https://github.com/acostaamericonicolas/LaBrasaBrava-2026

Cómo vamos a trabajar: nadie programa sobre "main". Cada uno tiene su
propia rama y su propia parte de la aplicación, así no nos pisamos.

Las ramas y quién lleva cada una:
- nucleo-acceso     → (nombre) diseño, ingreso, lista de espera, juegos, cuenta y pago
- altas-carta-qr    → (nombre) altas de empleado, plato, bebida y mesa, y todos los códigos QR
- clientes-correos  → (nombre) clientes registrados, encuesta con gráficos, correos y notificaciones
- pedidos-comanda   → (nombre) menú, chat con el mozo, pedido, cocina, bar y entrega

El reparto completo, punto por punto, está en LaBrasaBrava/docs/REPARTO-DE-TAREAS.md

Para arrancar (una sola vez):
  git clone https://github.com/acostaamericonicolas/LaBrasaBrava-2026.git
  cd LaBrasaBrava-2026/restaurante
  npm install
  git switch -c TU-RAMA
  git push -u origin TU-RAMA

Todos los días, antes de ponerte a programar, traé lo último de main:
  git switch main
  git pull
  git switch TU-RAMA
  git merge main

Cuando terminás algo:
  git add -A
  git commit -m "lo que hiciste, en español"
  git push

Tres reglas y listo:

1. Cada uno toca solamente su carpeta dentro de src/app/pages/.
   En la carpeta del otro no mete mano nadie.

2. Hay cuatro archivos que usamos los cuatro: app.routes.ts,
   config/marca.ts, theme/variables.scss y supabase/esquema.sql.
   Antes de tocar cualquiera de esos, avisá por el grupo.

3. Una vez por semana, antes de la revisión de la cátedra, subimos
   todo a main con un Pull Request. Nada de guardar el trabajo para
   el final: main tiene que compilar siempre, porque de ahí sacamos
   la aplicación que instalamos en los cuatro teléfonos, y la cátedra
   exige que los cuatro tengamos exactamente la misma versión.

Si después de un merge algo deja de compilar, avisá antes de tocar nada.
```
