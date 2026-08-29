# Reparto de tareas — Trabajo Final Integrador 2026

> Listado preliminar de tareas asignadas a cada integrante.
> **Cuatro integrantes.** Primera fecha de entrega: **17-10-2026** (siete semanas).

---

## Criterio con el que se dividió

El trabajo tiene 31 puntos funcionales, pero **no se pueden repartir de a ocho por cabeza**.
Hay tres problemas que la división tiene que resolver:

1. **Hay piezas que usan todos.** Las notificaciones push aparecen en 15 puntos, los correos
   automáticos en 7 y los códigos QR en 6. Si cada uno arma la suya, terminamos con cuatro
   implementaciones distintas y ninguna funcionando. **Cada pieza compartida tiene un solo
   dueño**, y los demás la consumen.

2. **Hay dependencias de orden.** Nadie puede armar el pedido si todavía no existen los platos.
   Nadie puede probar nada sin el ingreso funcionando. El orden importa tanto como el reparto.

3. **Cuatro personas tocando los mismos archivos es un problema de integración.** Cada uno es
   dueño de su propia carpeta dentro de `paginas/`, y los archivos compartidos se tocan lo menos
   posible.

Por eso la división es **por flujo completo**, no por tipo de tarea. Cada integrante se lleva un
recorrido entero de la aplicación, de punta a punta.

---

## Los cuatro roles

### Integrante 1 — Núcleo, acceso y cierre de la estadía

Arranca primero porque **todos los demás construyen sobre lo que él deja**.

| Etapa | Trabajo |
|---|---|
| Base | Sistema de diseño, ícono, pantallas de presentación (estática y animada), ingreso, accesos rápidos, cierre de sesión, control de acceso por perfil |
| Datos | Carga simulada de cuatro semanas de historial (la exige el enunciado para los gráficos) |
| Primera fecha | Puntos **9, 10** (lista de espera y asignación de mesa) · Punto **15** y los **tres juegos** · Puntos **21, 22** (cuenta, propina, pago, liberación de mesa) |
| Segunda fecha | Punto **23** (ingreso por redes sociales) |
| Tercera fecha | Puntos **24, 25, 26** (reservas agendadas) |

**Pieza compartida que provee:** el sistema de diseño y los servicios de mensajes, espera y sonidos.

> Los juegos y la cuenta van juntos a propósito: el descuento que se gana jugando se aplica en
> la cuenta final. Separarlos obligaría a dos personas a coordinar el mismo cálculo.

---

### Integrante 2 — Altas, carta y códigos QR

| Etapa | Trabajo |
|---|---|
| Primera fecha | Puntos **1, 2, 3, 4** (empleado, plato, bebida, mesa) con todas sus validaciones y el manejo de cámara |
| Primera fecha | **Todos los códigos QR**: lectura del DNI, generación del QR de mesa, del de ingreso al local y de los cinco de propina |
| Segunda fecha | Punto **22** ampliado: generación de la factura en PDF |
| Tercera fecha | Punto **31** (menú con acelerómetro y giroscopio) |

**Pieza compartida que provee:** el servicio de códigos QR, que después usan el ingreso al local,
la mesa, la propina y el registro de clientes.

---

### Integrante 3 — Clientes, correos y notificaciones

| Etapa | Trabajo |
|---|---|
| Primera fecha | Puntos **5, 6, 7, 8** (registro del cliente, aprobación, rechazo, aceptación) |
| Primera fecha | Punto **20** (encuesta con variedad de controles y los gráficos estadísticos, uno por pantalla) |
| Segunda fecha | Envío de la factura por correo a los clientes registrados |
| Tercera fecha | Puntos **27, 28** (pedidos a domicilio y su gestión) |

**Piezas compartidas que provee:** el servicio de **correo automático** desde la cuenta
empresarial y el de **notificaciones push**. Son las dos que más consume el resto del grupo, así
que tienen que estar andando temprano.

---

### Integrante 4 — Pedidos y comanda

Se lleva el recorrido más largo, pero también el más parejo: los puntos 16, 17 y 18 son casi el
mismo listado repetido para dos sectores, y el 13 y el 14 son variantes del 12.

| Etapa | Trabajo |
|---|---|
| Primera fecha | Punto **11** (menú de productos y sala de conversación entre mozos y clientes) |
| Primera fecha | Puntos **12, 13, 14** (armado del pedido, rechazo del mozo, confirmación y derivación) |
| Primera fecha | Puntos **16, 17, 18, 19** (cocina, bar, aviso de pedido completo, entrega) |
| Tercera fecha | Puntos **29, 30** (repartidor, mapa con la ruta y entrega a domicilio) |

---

## Cronograma hasta la primera entrega

Siete semanas, con revisión semanal de la cátedra. **Hay que llegar con 14 puntos aprobados**
para poder entregar en la primera fecha, y con los 22 para promocionar.

| Semana | Integrante 1 | Integrante 2 | Integrante 3 | Integrante 4 |
|---|---|---|---|---|
| **1** · 28/08 – 04/09 | Base, diseño, ingreso ✅ | Entorno y Supabase | Entorno y Supabase | Entorno y Supabase |
| **2** · 05/09 – 11/09 | Presentaciones e ícono, carga del historial | Servicio de QR + punto 1 | Servicios de correo y push | Modelo de pedidos, chat del punto 11 |
| **3** · 12/09 – 18/09 | Punto 9 | Puntos 2 y 3 | Puntos 5 y 6 | Punto 11 |
| **4** · 19/09 – 25/09 | Punto 10 | Punto 4 y QR de mesa | Puntos 7 y 8 | Punto 12 |
| **5** · 26/09 – 02/10 | Los tres juegos y el punto 15 | QR de propina, retoques de altas | Punto 20: encuesta | Puntos 13 y 14 |
| **6** · 03/10 – 09/10 | Puntos 21 y 22 | Apoyo donde haga falta | Punto 20: gráficos | Puntos 16, 17, 18, 19 |
| **7** · 10/10 – 17/10 | **Los cuatro:** integración, pruebas en los cuatro dispositivos, README al día, ensayo de la presentación |

> La semana 7 no es de desarrollo. Es para que la aplicación funcione **igual en los cuatro
> teléfonos** — la cátedra exige la misma versión en todos — y para ensayar los 30 minutos de
> presentación.

---

## Cómo trabajar sin pisarse

**Una rama por integrante**, y cada uno es dueño de su carpeta dentro de `src/app/paginas/`:

```
main                      Siempre funcionando. Nadie trabaja directo acá.
nucleo-acceso             Integrante 1
altas-carta-qr            Integrante 2
clientes-correos          Integrante 3
pedidos-comanda           Integrante 4
```

Los comandos del día a día, los cuatro archivos compartidos que hay que avisar antes de tocar y
el texto para explicarle todo esto al grupo están en **`FLUJO-DE-TRABAJO.md`**.

---

## Responsabilidades transversales de los cuatro

Estas no son de nadie en particular, y son las que más grupos reprueban. Cada uno las verifica
**en sus propias pantallas**:

- Que **ninguna pantalla tenga espacios neutros** (superficie completa ocupada).
- Que **todo error vibre** y se muestre con un control propio, nunca con un `alert`.
- Que **toda espera** muestre el indicador con el logo.
- Que **todo texto esté en español, con tildes** y sin palabras abreviadas.
- Que **todos los campos de todos los formularios** estén validados.
- Que ninguna imagen ni texto quede cortado, descentrado o ilegible.

> En el proyecto, las primeras tres ya están resueltas de forma centralizada: los errores pasan
> por `MensajesService` y las esperas por `CargandoService.durante()`. Mientras se usen esos dos
> servicios, no hace falta acordarse de la vibración ni del spinner.

---

## Tabla para el README (formato que pide la cátedra)

Reemplazar los marcadores por los datos reales:

| Apellidos y nombres | Módulos (objetivos) a desarrollar | Inicio | Finalización | Branch |
|---|---|---|---|---|
| _(completar)_ | Núcleo, acceso, juegos y cierre de la estadía (puntos 9, 10, 15, 21, 22) | 28-08-2026 | | `nucleo-acceso` |
| _(completar)_ | Altas, carta y códigos QR (puntos 1, 2, 3, 4) | | | `altas-carta-qr` |
| _(completar)_ | Clientes, correos, notificaciones y encuestas (puntos 5, 6, 7, 8, 20) | | | `clientes-correos` |
| _(completar)_ | Pedidos y comanda (puntos 11, 12, 13, 14, 16, 17, 18, 19) | | | `pedidos-comanda` |

Recordatorio del enunciado: si alguien no llega con lo que se comprometió, **se cambia el plazo o
se reasigna el módulo, y queda informado en el README**. Mantenerlo actualizado es
responsabilidad del líder y cuenta para su nota final.
