# CONTEXTO COMPLETO — Trabajo Final Integrador (TFI) 2026

> **Documento maestro de contexto.** Auditoría completa y sin omisiones del PDF
> `Trabajo práctico - 2026 - TFI.pdf` (22 páginas). Este archivo es la fuente de verdad
> para cualquier sesión futura de Claude sobre este proyecto.
>
> - **Materia:** Trabajo Final Integrador (UTN FRA)
> - **Cátedra / autores del enunciado:** Neiner Maximiliano · Constanzo Alejandro · Villegas Octavio · Ferrero Nicolás · Morelli Augusto · Loredo Alejandro
> - **Producto a construir:** aplicación móvil para **gestión integral de un restaurante**, con dos caras: la **comanda** (empleados) y la **experiencia del cliente**.
> - **Fecha de auditoría de este documento:** 2026-08-26

---

## 0. Resumen en una frase

Hay que construir **una sola app móvil multi-perfil** (dueño, supervisor, metre, mozo, cocinero,
cantinero, cliente registrado, cliente anónimo) que cubre el ciclo completo de un restaurante:
alta de empleados/productos/mesas → lista de espera por QR → asignación de mesa → menú →
pedido → derivación a cocina/bar → entrega → juegos con descuento → encuesta con gráficos →
propina por QR → cuenta → pago → factura PDF → y, en la última etapa, reservas, delivery con
mapas y navegación del menú por acelerómetro/giroscopio.

Todo atravesado por: **push notifications, correos automáticos empresariales, QR (lectura y
generación), validaciones totales de formularios, feedback háptico/sonoro y reglas de UI muy
estrictas.**

---

## 1. Marco administrativo y organizativo

### 1.1 Conformación del grupo
- Grupo de **cuatro (4) personas**.
- Inscripción vía formulario (solo el **líder** inscribe a todos):
  `https://forms.cloud.microsoft/r/gFbFTZjPeN?origin=lprLink`
- **Cierre de inscripción: 29-08-2026.**
- **05-09-2026:** se asignan aleatoriamente los alumnos sin grupo y queda cerrada la conformación (integrantes definitivos).
- Las entregas preliminares y definitivas se hacen durante todo el cuatrimestre y **otorgan las notas de parciales y recuperatorios**.

### 1.2 Fechas de entrega
| Entrega | Fecha | Observación |
|---|---|---|
| 1ª fecha | **17-10-2026** | — |
| 2ª fecha | **07-11-2026** | (*) sujeta a puntos aprobados |
| 3ª fecha | **28-11-2026** | (*) sujeta a puntos aprobados |

### 1.3 Repositorio grupal
- El **líder** crea un repositorio **privado en GitHub**.
- **Nombre:** `nombre-del-grupo-guion-medio-año`, p. ej. `grupete-2026`.
- **Colaboradores a agregar (obligatorio):**

| Docente | Usuario GitHub |
|---|---|
| Maximiliano Neiner | `maxineinerutn` |
| Alejandro Constanzo | `aleconsta` |
| Nicolás Ferrero | `naferrero-utnfra` |
| Augusto Morelli | `amorelli-utnfra` |
| Octavio Villegas | `octaviovillegas` |
| Alejandro Loredo | `aleloredo` |

### 1.4 README (responsabilidad del LÍDER, cuenta para su nota final)
El README debe detallar, por cada integrante:
1. **Apellidos y nombres.**
2. **Módulos (objetivos) a desarrollar.**
3. **Fecha de inicio** de la tarea.
4. **Fecha de finalización** de la tarea.
5. **Branch** (si posee).

Además:
- Si un integrante **no termina** la funcionalidad comprometida → se debe **cambiar el plazo o reasignar el módulo** a otro integrante, y **quedar informado en el README**.
- El README debe tener un **índice que permita visualizar TODAS Y CADA UNA de las imágenes** del proyecto: íconos, splash screens, formularios, listados, etc.
- **Debe estar siempre actualizado** al momento de cada entrega (preliminar o final).
- **Todos los códigos QR deben estar disponibles en el README** (y también en pantalla).

### 1.5 Entregas preliminares (revisiones semanales)
- El **líder** anota al grupo para la **revisión semanal** de la clase en curso.
- **Umbrales de puntos aprobados:**
  - **14 puntos aprobados** en revisiones preliminares → habilita entrega definitiva en la **1ª y 2ª fecha**.
  - **23 puntos aprobados** → habilita entrega definitiva en la **3ª fecha**.
- **Todos los integrantes deben estar presentes** en cada entrega preliminar semanal.
- **TODOS los dispositivos móviles del grupo deben tener la MISMA app (misma versión)** al momento de presentar.
- Cada grupo tiene **máximo 30 minutos** para mostrar el avance → **traer la presentación grupal armada de antemano**.

> ⚠️ Implicancia práctica: hay que tener un flujo de build/distribución (APK firmado o
> canal de distribución interno) que garantice que las 4 personas instalen exactamente
> el mismo build antes de cada revisión.

### 1.6 Concepto de "dispositivo 1..4"
El enunciado escribe los casos de prueba asumiendo **4 dispositivos físicos simultáneos**
(uno por integrante). Cada punto funcional indica en qué dispositivo se ejecuta y con qué
perfil. Las demos son **multi-dispositivo en tiempo real** → la sincronización en vivo
(realtime DB / websockets) no es opcional, es estructural.

---

## 2. Objetivo académico declarado

> "Lograr realizar, implementar y documentar una aplicación totalmente funcional,
> utilizando las características de un dispositivo móvil para la gestión de un restaurante.
> La aplicación estará enfocada en la experiencia de usuario, tanto de los clientes como de
> los empleados del comercio."

Palabras clave: **totalmente funcional**, **documentar**, **características del dispositivo**
(cámara, QR, sensores, vibración, notificaciones, sonido, GPS), **UX para ambos lados del mostrador**.

---

## 3. Requerimientos EXCLUYENTES (transversales)

### 3.1 Excluyentes para promoción — 1ª fecha
Estos aplican a **toda** la app y se verifican en cada revisión. Son los que más grupos reprueban.

1. **Splash screens estáticas Y animadas** con: ícono de la app, nombre del grupo, y **apellidos y nombres de cada integrante**.
2. **Todo texto o mensaje en español** — *"¡TODO EN ESPAÑOL, los tildes pertenecen al idioma!"*.
3. **Todo error o información se muestra con distintos tipos de controles — ¡NO alerts!** (usar toasts, snackbars, modales propios, banners, bottom sheets, etc., **variados**).
4. **Sonidos DISTINTOS al iniciar y al cerrar** la aplicación.
5. **Validación de datos en TODOS los formularios** — *"TODOS LOS DATOS, EN TODOS LOS FORMULARIOS"*.
6. **Indicadores visuales (spinners) con el LOGO de la empresa en TODAS las esperas.** (TODAS).
7. **Vibración al detectarse un error** — en **TODOS** los errores.
8. **Botones de ingreso rápido** de usuarios con distintos perfiles. **NO** botones fijos, **NO** combos ni similares.
9. **Botón de cierre de sesión** — y hay que **verificar que las credenciales se borren**.
10. **La TOTALIDAD de la superficie de pantalla ocupada** con distintos elementos — **¡NO debe haber espacios neutros!**
11. **Contraste nítido** entre textos/fondos y entre imágenes/textos/fondos.
    - ❌ **NO** fondos blancos ni "claritos".
    - ❌ **NO** fondos negros ni "oscuritos".
    - ❌ **NO se admite modo oscuro.**
12. **Ninguna imagen o texto cortado, descentrado o ilegible.** **NO se admiten palabras abreviadas.**
13. **Encuestas de distintos tipos usando variedad de controles** (no repetir siempre el mismo control para recolectar información).
14. **Push notifications** funcionando **con la app abierta Y cerrada**.
15. **Envío automático de correos electrónicos desde cuenta 'empresarial'**, **NO** desde la cuenta personal de un integrante.
16. **Lectura Y generación de distintos tipos de códigos QR.**
17. **Al menos TRES juegos simples, completamente funcionales.**
18. **Gráficos estadísticos** (torta, barra, lineal, etc.) con los datos de las encuestas — **cada gráfico en una pantalla distinta**.
19. **Puntos funcionales 1 al 22 completos.**

**Enlaces de ejemplo del enunciado** (imágenes de referencia de la cátedra, SharePoint UTN FRA):
- Pantalla completa sin espacios neutros: `https://o365frautneduar-my.sharepoint.com/:i:/g/personal/mneiner_fra_utn_edu_ar/IQANJvMTb5vXR5IwYZU_pl7OAZ5JSrDW8owve---4cdjCgc?e=59KcVk`
- Contraste texto/fondo: `https://o365frautneduar-my.sharepoint.com/:i:/g/personal/mneiner_fra_utn_edu_ar/IQCmkWpM_FkAQbE-I_Jpqf-IAQstTghexxxVesTUCHwFKQc?e=enEIqS`
- Imágenes/textos cortados: `https://o365frautneduar-my.sharepoint.com/:i:/g/personal/mneiner_fra_utn_edu_ar/IQDY2idLx31BTJ7vCoCJumLtAUE7zFQAwM2TCU5ZKe2yvJc?e=VGLrdI`
- Referencia UX citada: `https://es.wikipedia.org/wiki/Diseño_de_experiencia_de_usuario`

### 3.2 Excluyentes para promoción — 2ª fecha
1. Tener **completa la parte anterior** (hasta punto 22, con notificaciones y correos automáticos).
2. **Autenticación por redes sociales.**
3. **Archivos PDF** para envío por correo electrónico **o** descarga en dispositivo, **según tipo de cliente**.
4. **Adaptar los ingresos y el punto 22** según el listado de la 2ª fecha.

### 3.3 Excluyentes para promoción — 3ª fecha
1. Tener **completa la app con los puntos extras anteriores** (hasta el punto 23 y sus modificaciones).
2. **Herramientas de mapas Y sensores del dispositivo.**
3. **Puntos funcionales 1 al 31 completos.**

### 3.4 Tabla de umbrales (cómo se lee el PDF)
| Hito marcado en el PDF | Alcance |
|---|---|
| "MÍNIMO DE PUNTOS APROBADOS PARA PODER REALIZAR ENTREGA EN PRIMERA FECHA" (tras el punto 14) | **Puntos 1–14** |
| "PUNTOS APROBADOS PARA PODER PROMOCIONAR (PRIMERA FECHA ENTREGA)" (tras el punto 22) | **Puntos 1–22** |
| "PUNTOS APROBADOS PARA PROMOCIONAR (SEGUNDA FECHA)" + "MÍNIMO … TERCERA FECHA" (tras el punto 23) | **Puntos 1–23** |
| "PUNTOS APROBADOS PARA PODER PROMOCIONAR (TERCERA FECHA ENTREGA)" (tras el punto 31) | **Puntos 1–31** |

---

## 4. Preparación inicial (seed de datos)

### 4.1 Simulación histórica obligatoria
> Se debe disponer de un entorno que permita simular **interacciones simuladas (encuestas,
> consumos, estadías, etc.) de al menos CUATRO SEMANAS** en **repositorios externos (base de datos)**.

Esto existe para que los **gráficos estadísticos** de las encuestas tengan datos reales que mostrar
(series temporales de 4 semanas). Hay que escribir un **script de seed** que genere ese histórico.

### 4.2 Campos mínimos de usuario
- Apellidos
- Nombres
- Número de documento (**DNI y/o CUIL**)
- Correo electrónico
- Clave
- Perfil

### 4.3 Perfiles de usuario
```
❖ dueño
❖ supervisor
❖ empleados
    ➢ metre
    ➢ mozo
    ➢ cocinero
    ➢ cantinero
❖ cliente registrado
❖ cliente anónimo
```

### 4.4 Registros mínimos a tener cargados
- **1 dueño**, **1 supervisor**, **1 metre**, **1 mozo**, **1 cocinero**, **1 cantinero**, **1 cliente registrado**.
- **Al menos 5 platos.**
- **Al menos 5 bebidas.**
- **Al menos 5 mesas.**

(Los campos de platos/bebidas/mesas se definen en los puntos 2, 3 y 4.)

---

## 5. Códigos QR (sistema completo)

### 5.1 QR de ingreso al local
Permite al cliente:
- **Anunciarse en la lista de espera.**
- **Acceder a las encuestas realizadas con anterioridad** (resultados/gráficos).

### 5.2 QR de mesa
El comportamiento **depende del perfil que escanea**:

**Perfiles metre / mozo / dueño / supervisor** → ven la información de la mesa:
- Número asignado
- Cantidad de lugares
- Tipo (**VIP**, **estándar**, **para comensales con movilidad reducida**)
- Disponibilidad (**vacía** u **ocupada**)

**Perfil cliente (anónimo o registrado)** → ve número, tipo, verifica disponibilidad, **se relaciona con la mesa** y habilita:
- ➔ Generar **'consultas' al mozo**
- ➔ Acceder al **menú de productos**
- ➔ Verificar el **estado de su pedido**
- ➔ Acceder a la **encuesta de satisfacción**
- ➔ Acceder a los **juegos**
- ➔ **Pagar su cuenta**

### 5.3 QR de propinas (CINCO códigos QR distintos)
Definen el nivel de satisfacción y el **porcentaje de propina** sobre la cuenta final:

| Nivel | Propina |
|---|---|
| Excelente | **20 %** |
| Muy Bueno | **15 %** |
| Bueno | **10 %** |
| Regular | **5 %** |
| Malo | **0 %** |

### 5.4 QR de DNI
Lectura del **QR del DNI argentino** para autocompletar los campos en alta de empleados (punto 1) y alta de cliente registrado (punto 5).

### 5.5 Excluyente
> **Tener TODOS los códigos QR disponibles (README, en pantalla, etc.).**

**Inventario total de QR del sistema:**
1. QR de ingreso al local (1)
2. QR de mesa (1 por mesa, **generado automáticamente** al crear la mesa — punto 4)
3. QR de propina (5)
4. Lectura de QR de DNI (no se genera, se lee)

---

## 6. LISTADO DE FUNCIONALIDADES — PRIMERA FECHA (puntos 1 a 22)

### Punto 1 — Agregar un empleado *(dispositivo 1)* · Perfiles: **dueño o supervisor**
- Ingresar: **nombres, apellidos, número de DNI, número de CUIL, correo electrónico, contraseña, perfil cocinero, foto personal**.
- La foto **se toma desde el dispositivo** — **NO** se elige desde la galería.
- Debe existir la posibilidad de un **lector de QR del DNI** que cargue la información en los campos correspondientes.
- **Validar todos los campos. TODOS.** Formatos, campos vacíos, tipos de datos, etc.
- Verificar la **lectura del código QR del DNI**.

### Punto 2 — Agregar un nuevo plato *(dispositivo 2)* · Perfil: **cocinero**
- Cargar: **nombre, descripción, tiempo de elaboración (en minutos), precio y TRES (3) fotos** tomadas del dispositivo (aquí **sí** se puede optar por la galería).
- Las fotos se deben ver en **contenedores individuales**, con **buen tamaño**, **sin que se muestren partes de otras fotos**, **centradas** y con **posibilidad de seleccionar otra imagen**.
- **Validar todos los campos. TODOS.**
- Se verifica la **existencia en la carta (menú)**.

### Punto 3 — Agregar una nueva bebida *(dispositivo 3)* · Perfil: **cantinero**
- Idéntico al punto 2: **nombre, descripción, tiempo de elaboración (minutos), precio, 3 fotos** (dispositivo o galería).
- Mismas reglas de visualización de fotos (contenedores individuales, buen tamaño, sin recortes, centradas, reemplazables).
- **Validar todos los campos. TODOS.**
- Se verifica la **existencia en la carta (menú)**.

### Punto 4 — Agregar una nueva mesa *(dispositivo 4)* · Perfiles: **dueño o supervisor**
- Agregar: **número, cantidad de comensales, tipo (VIP / estándar / movilidad reducida), disponibilidad (vacía por defecto) y foto** (tomada desde el dispositivo).
- La foto en **contenedor individual, buen tamaño y centrada**.
- **Validar todos los campos. TODOS.**
- Verificar la **existencia de la nueva mesa (listado)**.
- **Generar el código QR correspondiente de forma AUTOMÁTICA.**
- **Permitir la gestión de mesas**, con posibilidad de **modificar la disponibilidad**.

### Punto 5 — Crear un cliente registrado *(dispositivo 2)* · Perfiles: **cliente o metre**
- Ingresar: **nombres, apellidos, número de DNI, correo electrónico, contraseña y foto personal**.
  (Nótese: **sin CUIL**, a diferencia del empleado.)
- La foto **se toma desde el dispositivo** — **NO** galería.
- Posibilidad de **lector de QR del DNI** que autocomplete.
- Foto en **contenedor individual, buen tamaño y centrada**.
- **Validar todos los campos. TODOS.**
- **Notas clave:**
  - Al completar el alta, el registro queda en estado **'pendiente de aprobación'**.
  - **Sólo dueño o supervisor** pueden **aprobar o rechazar** a los potenciales clientes.
  - Se **envía automáticamente un correo** al cliente informando el estado de su registro.
  - El cliente **NO puede ingresar** a la app si no fue aceptado previamente.
  - **Los clientes anónimos NO requieren aprobación.**
- Verificar la **lectura del QR del DNI**.

### Punto 6 — Verificar ingreso del cliente registrado *(dispositivo 1)* · Perfiles: **dueño o supervisor**
- Verificar que el registro se visualice en el **listado de clientes pendientes de aprobación**. **(push notification)**
- El listado debe contener **como mínimo: apellidos, nombres y la foto** del cliente.
  - Cada foto **con buen tamaño** y **relacionada con los nombres y apellidos** de cada cliente.
- Posibilidad de **aceptar o rechazar** al cliente **mediante algún control**.

### Punto 7 — Dueño/supervisor *(dispositivo 1)* **RECHAZA** a un cliente
- El cliente recibe un **correo electrónico** informando la situación de su registro.
- **Requisitos del correo (aplican a TODOS los correos de la app, aquí y en adelante):**
  - **Logo de la empresa**
  - **Mensajes personalizados**
  - **Fuentes distintas** a las que vienen por defecto
  - **Colores y tamaños diferentes** a los que vienen por defecto
  - Estos cambios **también aplican al correo de confirmación** (deben diferenciarse entre sí)
- El correo debe ser **automático** y **NO enviarse desde la cuenta personal de ningún integrante**.
- Verificar que el **cliente rechazado (dispositivo 2) NO pueda ingresar** a la app.
- **Informar lo acontecido con un mensaje alusivo.**

### Punto 8 — Dueño/supervisor *(dispositivo 1)* **ACEPTA** a un cliente registrado
- El cliente recibe un **correo electrónico** informando la situación de su registro.
- Mismos requisitos de formato de correo que el punto 7 (y **diferenciado** del correo de rechazo).
- Correo **automático**, **no** desde cuenta personal de ningún alumno.
- Verificar que el **cliente SÍ pueda ingresar** a la aplicación.

### Punto 9 — Ingresar al local como **cliente anónimo** *(dispositivo 3)*
- Para registrarse, el anónimo ingresa **nombre y foto** (no requiere aprobación).
- **Escanear el QR de entrada** para solicitar mesa (**lista de espera**).
- **Notas:** el QR de ingreso al local permite (a) **ver las encuestas** y (b) **registrarse a la lista de espera**.
  - Una vez en la lista de espera, el **listado de clientes en espera del metre se actualiza**.
  - Los clientes **sólo pueden acceder a una mesa si el metre se la asigna**.
- Verificar que **aparezca en la lista de espera del metre (dispositivo 4)**. **(push notification)**
- Verificar que cada cliente pueda ser **'eliminado' del listado**.
- Verificar que **NO puede tomar una mesa sin estar previamente en la lista de espera**.
- Verificar que **sólo puede acceder a los resultados de las encuestas previas**.

### Punto 10 — El metre *(dispositivo 4)* asigna una mesa a un cliente registrado *(dispositivo 2)* **(push notification)**
- Verificar que el cliente **no pueda vincularse con otra mesa** (indicar qué mesa debe ser).
- El cliente **escanea el QR de la mesa asignada** *(dispositivo 2)*.
- Con mesa asignada, verificar que el cliente **no se pueda vincular a otra mesa** (indicar cuál es su mesa asignada).
- Con mesa asignada, verificar que **NO se le pueda asignar esa mesa a otro cliente** *(dispositivo 3)*.

### Punto 11 — Menú + consulta al mozo
Al cargar el **QR de la mesa** (en el dispositivo del cliente) se permite ver el **listado de productos
(comidas, bebidas, postres)** con, por cada producto:
- **Tres imágenes**
- **Nombre**
- **Precio**
- **Descripción**
- **Tiempo estimado de elaboración**

Las imágenes: **contenedores individuales, buen tamaño** (sin que se vean partes de otras imágenes,
textos o similares), **centradas** y **con posibilidad de visualizar otra imagen**.

- Con mesa asignada, se habilita el botón **"consulta al mozo"**: consulta rápida al mozo, con
  **número de mesa y fecha con hora y minutos**.
- **Generar una sala de conversación estilo WhatsApp entre los mozos y los clientes** — **todos los mozos y todos los clientes** (chat grupal, no 1 a 1).
- Verificar que **la consulta le llegue a TODOS los mozos** *(dispositivo 1 y dispositivo 4)*. **(push notification)**
- Un mozo *(dispositivo 4)* **responde** la consulta con **nombre y fecha (hora y minutos)**. Se verifica en el cliente. **(push notification)**

### Punto 12 — El cliente realiza el pedido para todos los comensales de la mesa
- Se pueden elegir **productos con sus cantidades** para **todos los comensales**.
- Verificar que **en todo momento esté visible (y con buen tamaño) el importe acumulado**.
- Mostrar el **tiempo total estimado** de realización del pedido completo.
- El cliente **termina el pedido y espera la confirmación del mozo**. **(push notification)**
- Verificar que **el pedido NO sea derivado a sus sectores hasta que el mozo lo confirme**.
- El cliente ya puede **acceder al estado de su pedido**.

### Punto 13 — El mozo *(dispositivo 4)* **RECHAZA** el pedido **(push notification)**
- Para que el usuario lo **modifique (parcial o totalmente)**.
- Verificar que el cliente pueda **modificar productos y cantidades**.
- Verificar que el cliente pueda **agregar, modificar y/o quitar** productos.
- El cliente **termina el pedido nuevamente**. **(push notification)**

### Punto 14 — El mozo *(dispositivo 4)* **CONFIRMA** el pedido → derivación a sectores
- El pedido se deriva a **cocina y bar**.
- Verificar que **las distintas partes del pedido se visualicen en dichos sectores**. **(push notification)**
- El cliente puede acceder a los **juegos** y al **estado de su pedido**.
- **Notas sobre juegos:**
  - Los descuentos **NO son acumulativos**.
  - Sólo se obtiene descuento **si se gana EN EL PRIMER INTENTO**.
  - En caso de ganar, se **descuenta de la cuenta final** el porcentaje correspondiente.
  - **Tres juegos simples**, sólo para **cliente registrado (anónimo NO)**:
    - ➔ **10 % de descuento**
    - ➔ **15 % de descuento**
    - ➔ **20 % de descuento**

> **⛳ HITO: MÍNIMO DE PUNTOS APROBADOS PARA PODER REALIZAR ENTREGA EN PRIMERA FECHA → puntos 1–14.**

### Punto 15 — El cliente accede a la sección de juegos en busca de descuentos
- Verificar que **sólo se aplique UN descuento (el primero)**, y **sólo si ganó en el primer intento**.
- Verificar que, **una vez obtenido el beneficio**, se pueda acceder **libremente a todos los juegos, las veces que se quiera** (ya sin efecto sobre el descuento).

### Punto 16 — El sector **COCINA** recibe los productos correspondientes *(dispositivo 1)*
- En el **listado de pedidos pendientes** debe visualizarse:
  - **Número de mesa**
  - **Fecha (con hora y minutos)**
  - **Los ítems a elaborar en el sector (nombre y cantidad)**
- Los listados deben estar **agrupados por número de mesa**, **visibles**, con **espacio entre distintos pedidos** para fácil manipulación por parte del cocinero.
- El cliente **verifica el cambio de estado** en su pedido.

### Punto 17 — El sector **BAR** recibe los productos correspondientes *(dispositivo 3)*
- Mismo listado que el punto 16: **número de mesa**, **fecha con hora y minutos**, **ítems del sector (nombre y cantidad)**.
- **Agrupados por número de mesa**, visibles, con espacio entre pedidos, para el cantinero.
- El cliente **verifica el cambio de estado** en su pedido.

### Punto 18 — Cada sector avisa cuando sus productos están listos
- Cocina y bar realizan sus tareas y **avisan cuando todos los productos están listos** para que el mozo los entregue (**pedido completo**).
- Verificar que **cada parte del pedido se visualice en el listado de pedidos pendientes del mozo** y que **se informe cuando el pedido esté completo**.
  - **Sólo se informa "completo" cuando el pedido está listo en TODOS los sectores intervinientes.** **(push notification)**
- El cliente **verifica el cambio de estado** en su pedido.

### Punto 19 — El mozo entrega el pedido completo (comidas, bebidas y postres)
- El cliente **confirma la recepción** de su pedido.
- El cliente **verifica el cambio de estado** en su pedido.
- El cliente puede acceder a: **juegos**, **encuesta** y **'pedir la cuenta'**.

### Punto 20 — El cliente accede a la **ENCUESTA**
- Ingresa su opinión sobre **diversos temas**.
- Verificar que **sólo se pueda acceder una vez** para agregar una encuesta nueva — **una por estadía**.
- El cliente puede **visualizar los resultados** de las encuestas en **distintos tipos de gráficos (torta, barra, lineal, etc.)**, **un gráfico por pantalla**.
- Recordar el excluyente: la encuesta debe usar **variedad de controles** (sliders, ratings, checkboxes, radios, switches, selects, inputs de texto, etc.), **no siempre los mismos**.

### Punto 21 — El cliente **solicita la cuenta** al mozo **(push notification)**
- Se habilita, **mediante la lectura del QR correspondiente**, el **ingreso de la propina**.
- **NO se puede generar la cuenta sin antes seleccionar el porcentaje de propina.**
- **Detalle de la cuenta:**
  - Los **pedidos realizados (con precios unitarios)** y su **respectivo importe**.
  - Los **descuentos correspondientes a los juegos** (sólo si ganó en el primer intento).
  - El **grado de satisfacción del cliente (propina)**.
  - El **TOTAL a abonar (grande y claro)**.
- **Tomar como modelo a Mercado Pago** (referencia visual explícita del enunciado).
- El cliente **realiza el pago (simulado)** y **espera la confirmación del mozo**. **(push notification)**
- La push notification **la reciben el mozo, el dueño Y el supervisor**.

### Punto 22 — El mozo **confirma el pago y se libera la mesa** *(versión 1ª fecha)*
- Verificar que, luego de la confirmación de pago, la **push notification llegue al dueño y al supervisor**.
- Verificar que la **mesa quede libre nuevamente** (haciendo que el cliente vuelva a escanear el QR de la mesa).
- El cliente, **escaneando el QR de la lista de espera**, puede visualizar los **resultados de las encuestas en distintos tipos de gráficos** (torta, barra, lineal, etc.), **un gráfico por pantalla**.

> **⛳ HITO: PUNTOS APROBADOS PARA PODER PROMOCIONAR (PRIMERA FECHA) → puntos 1–22.**

---

## 7. LISTADO DE FUNCIONALIDADES EXTRAS — SEGUNDA FECHA (punto 22 modificado y 23)

### Punto 22 *(versión ampliada 2ª fecha)* — El mozo confirma el pago, **se emite factura PDF** y se libera la mesa
- Verificar que la **push notification llegue al dueño y al supervisor** tras la confirmación de pago.
- Verificar que **se genere una factura en formato PDF**. La factura debe contener, **al menos**:
  - **Nombre del restaurante, logo y dirección**
  - **Fecha y número de factura**
  - **Datos del cliente**
  - **Número de pedido**
  - **Detalle de lo facturado** (ver punto 21: ítems con precios unitarios, descuentos por juegos, propina, TOTAL)
- **Clientes registrados** → reciben la factura **por correo electrónico automático**.
  - El correo debe cumplir los requisitos de los puntos 7 y 8 (logo, personalización, fuentes/colores/tamaños distintos a los default).
- **Clientes anónimos** → reciben una **push notification** desde donde **pueden descargar la factura**.
  - **Generar un mensaje alusivo y un enlace para descargar directamente el archivo PDF.**
- Verificar que la **mesa esté libre**.
- El cliente, escaneando el **QR de la lista de espera**, puede visualizar los **resultados de las encuestas en distintos gráficos**.

### Punto 23 — **Ingreso a través de redes sociales** (API de login social)
- Verificar que **clientes registrados, empleados, supervisor y dueño** puedan ingresar a la app **a través de distintas redes sociales**. **Elegir al menos una.**

> **⛳ HITO: PUNTOS APROBADOS PARA PROMOCIONAR (SEGUNDA FECHA) y MÍNIMO PARA ENTREGA EN TERCERA FECHA → puntos 1–23.**

---

## 8. LISTADO DE FUNCIONALIDADES EXTRAS — TERCERA FECHA (puntos 24 a 31)

### Punto 24 — Dos **reservas agendadas** por dos clientes registrados *(dispositivo 1 y dispositivo 2)*
- Verificar que las reservas agendadas **sólo las pueden hacer clientes registrados**.
- Verificar que la reserva sea **en un tiempo futuro** (*"el DeLorean está sin nafta"*).
- Las reservas deben ser en **distintos días y horarios**.

### Punto 25 — El dueño o supervisor confirma o no la reserva *(dispositivo 3 y dispositivo 4)*
- Verificar que el **pedido de reserva se visualice en el listado correspondiente**. **(push notification)**
- El **dueño RECHAZA la primera reserva indicando el motivo** → **correo electrónico automático**.
  - El correo cumple los requisitos de los puntos 7, 8 y posteriores.
- El **supervisor APRUEBA la segunda reserva** → **correo electrónico automático** con mensaje de confirmación.
  - El correo cumple los requisitos de los puntos 7, 8 y posteriores.

### Punto 26 — Vigencia y liberación de la reserva
- Con la reserva confirmada, verificar que **la mesa no se le pueda asignar a otro cliente** *(dispositivo 1)*.
- Verificar que, **pasado el tiempo de espera máximo (45 minutos), la mesa se libere**.
- Verificar que el cliente con reserva agendada, **siempre que esté en el lapso válido**, pueda **escanear directamente el QR de la mesa SIN necesidad de escanear antes el de la lista de espera**.

### Punto 27 — Dos **pedidos con entrega a domicilio** por dos clientes registrados *(dispositivo 1 y dispositivo 2)*
- Verificar que **sólo lo puede realizar un cliente registrado**.
- El cliente puede **ingresar una dirección en formato texto** **o** **marcarla en un mapa (Maps API)**.
- Cada cliente *(dispositivo 1 y 2)* **realiza un pedido (punto 12)**.

### Punto 28 — Gestión del pedido a domicilio por dueño/supervisor **(push notification)**
- Verificar que los pedidos **se visualicen en el listado correspondiente** (dueño o supervisor).
- El dueño o supervisor *(dispositivo 3)* **RECHAZA el primer pedido**:
  - Se envía **push notification** **y** **correo electrónico automático** **detallando el motivo**.
  - El correo cumple los requisitos de los puntos 7, 8 y posteriores.
- El dueño o supervisor *(dispositivo 3)* **CONFIRMA el segundo pedido**:
  - Se informa al cliente el **tiempo de espera aproximado** = **tiempo de realización del pedido + tiempo estimado de llegada al destino indicado**. **(push notification)**
  - **Se repiten los pasos 14, 16 y 17** (derivación a sectores, cocina, bar).

### Punto 29 — El **repartidor** *(dispositivo 4)* confirma la recepción del pedido
- Verificar que el pedido **se visualice en el listado del repartidor**. **(push notification)**
- Verificar la **visualización del mapa con la RUTA hacia el domicilio del cliente**.
- Se habilita la **'sala de conversación' entre el repartidor y el cliente**.
- **Adaptar** para que se visualice, además de la fecha con horas y minutos, **la dirección del cliente en lugar del número de mesa**.

> ⚠️ Nota: el enunciado introduce aquí un **rol de repartidor** que **no figura en la lista de
> perfiles de la sección "Preparación inicial"**. Hay que decidir si se modela como un perfil de
> empleado más o como una capacidad del mozo. **Ver sección 12 (Ambigüedades).**

### Punto 30 — El repartidor entrega el pedido
- Se repiten los pasos **19, 20 y 21** (confirmación de recepción, encuesta, cuenta/propina), **adaptados según corresponda**.
- **Generar la factura en PDF** y **enviarla por correo electrónico automático**.
  - El correo cumple los requisitos de los puntos 7, 8 y posteriores.

### Punto 31 — Adaptación del menú con **acelerómetro y giroscopio**
- **Mover el dispositivo hacia la IZQUIERDA** → mostrar la **siguiente fotografía**.
- **Mover el dispositivo hacia la DERECHA** → mostrar la **foto anterior**.
- **Mover el dispositivo hacia ADELANTE** → cambia al **siguiente producto**.
- **Mover el dispositivo hacia ATRÁS** → cambia al **producto anterior**.
- **Movimiento derecha↔izquierda repetidas veces** → **vuelve al principio (primer producto del menú)**.

> **⛳ HITO: PUNTOS APROBADOS PARA PROMOCIONAR (TERCERA FECHA) → puntos 1–31.**

---

## 9. Modelo de datos derivado (propuesta)

> No está en el PDF explícitamente; es la inferencia directa de los requisitos.
> Sirve como punto de partida y debe validarse contra cada punto funcional.

### `usuarios`
`id`, `apellidos`, `nombres`, `dni`, `cuil` (empleados), `email`, `clave`, `perfil`
(`dueño`|`supervisor`|`metre`|`mozo`|`cocinero`|`cantinero`|`repartidor?`|`cliente_registrado`|`cliente_anonimo`),
`fotoUrl`, `estadoAprobacion` (`pendiente`|`aprobado`|`rechazado`) — sólo cliente registrado,
`fechaAlta`, `proveedorAuth` (email | social).

### `productos`
`id`, `nombre`, `descripcion`, `tiempoElaboracionMin`, `precio`, `fotos[3]`,
`sector` (`cocina`|`bar`), `tipo` (`comida`|`bebida`|`postre`), `activo`.

### `mesas`
`id`, `numero`, `cantidadComensales`, `tipo` (`vip`|`estandar`|`movilidad_reducida`),
`estado` (`vacia`|`ocupada`|`reservada`), `fotoUrl`, `qrData`,
`clienteActualId`, `reservaActivaId`.

### `listaEspera`
`id`, `clienteId`, `nombreCliente`, `fotoUrl`, `cantidadPersonas`, `fechaHoraIngreso`, `estado` (`esperando`|`asignado`|`eliminado`).

### `pedidos`
`id`, `numeroPedido`, `mesaId` **o** `direccionEntrega`+`coordenadas` (delivery),
`clienteId`, `items[]` (`productoId`, `cantidad`, `precioUnitario`, `sector`, `estadoItem`),
`estado` (`pendiente_confirmacion` → `rechazado_por_mozo` → `en_preparacion` →
`listo_para_entregar` → `entregado` → `cuenta_solicitada` → `pagado_pendiente_confirmacion` →
`confirmado_cerrado`), `tiempoEstimadoTotal`, `importeSubtotal`, `descuentoJuegoPct`,
`propinaPct`, `total`, `fechaHora`, `mozoId`, `repartidorId`.

### `estadoPorSector`
`pedidoId`, `sector` (`cocina`|`bar`), `estado` (`recibido`|`en_elaboracion`|`listo`).

### `encuestas`
`id`, `clienteId`, `pedidoId`/`estadiaId`, `respuestas{}` (múltiples controles), `fechaHora`.
**Una por estadía.**

### `juegos` / `descuentos`
`id`, `clienteId`, `estadiaId`, `juego` (`j1_10`|`j2_15`|`j3_20`), `intentoNro`,
`ganoEnPrimerIntento` (bool), `descuentoAplicadoPct`, `bloqueadoParaDescuento` (bool).

### `chat`
Sala **global mozos↔clientes** (punto 11) + sala **1:1 repartidor↔cliente** (punto 29).
`salaId`, `mensajes[]` (`autorId`, `nombreAutor`, `perfil`, `texto`, `mesaNro`/`direccion`, `fechaHoraConMinutos`).

### `reservas`
`id`, `clienteId`, `mesaId`, `fechaHoraReserva` (**futura**), `estado`
(`pendiente`|`aprobada`|`rechazada`|`vencida`), `motivoRechazo`, `aprobadaPorId`,
`ventanaToleranciaMin` = **45**.

### `facturas`
`id`, `numero`, `pedidoId`, `clienteId`, `pdfUrl`, `fechaEmision`, `enviadaPorEmail` (bool), `datosRestaurante{}`.

### `historicoSimulado` (seed de 4 semanas)
Consumos, estadías y encuestas para alimentar los gráficos estadísticos.

---

## 10. Máquinas de estado clave

### 10.1 Estado del PEDIDO (visible para el cliente en "estado de mi pedido")
```
[creado por cliente]
   → pendiente de confirmación del mozo        (12)
   → RECHAZADO por mozo → vuelve a edición     (13)
   → CONFIRMADO por mozo → derivado a sectores (14)
       ├─ cocina: recibido → en elaboración → listo   (16, 18)
       └─ bar:    recibido → en elaboración → listo   (17, 18)
   → PEDIDO COMPLETO (solo cuando TODOS los sectores están listos) (18)
   → entregado por el mozo → cliente confirma recepción (19)
   → cuenta solicitada (21)  [requiere QR de propina]
   → pago simulado → pendiente confirmación del mozo (21)
   → pago confirmado → factura PDF + mesa liberada  (22)
```

### 10.2 Estado de la MESA
```
vacia → (metre asigna) → ocupada → (mozo confirma pago) → vacia
vacia → (reserva aprobada) → reservada → [45 min de tolerancia] → vacia
```

### 10.3 Estado del CLIENTE REGISTRADO
```
alta → pendiente de aprobación → (dueño/supervisor)
        ├─ aprobado  → email de aceptación → puede ingresar
        └─ rechazado → email de rechazo    → NO puede ingresar (mensaje alusivo)
```

### 10.4 Flujo del CLIENTE en el local
```
QR de ingreso al local → lista de espera → (metre asigna mesa) → QR de mesa
   → menú / consulta al mozo / pedido / estado / juegos / encuesta / cuenta
Restricciones:
 - No puede tomar mesa sin estar en la lista de espera (excepto reserva vigente, punto 26).
 - No puede vincularse a otra mesa distinta de la asignada.
 - Su mesa no puede ser asignada a otro cliente.
```

---

## 11. Matriz de capacidades del dispositivo exigidas

| Capacidad | Puntos donde aparece |
|---|---|
| **Cámara (foto obligatoria del dispositivo)** | 1, 4, 5, 9 |
| **Cámara o galería** | 2, 3 |
| **Lectura de QR** | 1 (DNI), 5 (DNI), 9 (ingreso), 10/11 (mesa), 21 (propina), 22, 26 |
| **Generación de QR** | 4 (mesa, automático), ingreso al local, 5 QR de propina |
| **Push notifications (app abierta y cerrada)** | 6, 9, 10, 11, 12, 13, 14, 16, 17, 18, 21, 22, 25, 28, 29 |
| **Correo electrónico automático (cuenta empresarial)** | 5, 7, 8, 22, 25, 28, 30 |
| **Vibración** | todos los errores (excluyente transversal) |
| **Sonido** | inicio y cierre de la app (distintos) |
| **Gráficos estadísticos** | 20, 22 |
| **Generación de PDF** | 22, 30 |
| **Login social** | 23 |
| **Mapas / geolocalización / ruta** | 27, 28, 29 |
| **Acelerómetro + giroscopio** | 31 |
| **Chat en tiempo real** | 11 (grupal mozos↔clientes), 29 (repartidor↔cliente) |

---

## 12. Ambigüedades detectadas y decisiones a tomar

Estas son las zonas grises del enunciado. **Conviene consultarlas con la cátedra en una
revisión semanal** y dejar la decisión registrada aquí.

1. **Perfil "repartidor" (punto 29):** no figura en la lista de perfiles de "Preparación inicial".
   ¿Se crea como perfil nuevo de empleado, o el mozo asume el rol? → *Decisión pendiente.*
2. **Punto 1 fija "perfil cocinero"** en el alta de empleado. ¿El formulario debe permitir elegir
   cualquier perfil de empleado o específicamente cocinero para la demo? → Lo razonable es
   permitir **todos** los perfiles de empleado y usar cocinero en la demo.
3. **"Postres"** aparecen en el menú (puntos 11, 19) pero no hay un punto de alta de postre
   equivalente a los puntos 2 y 3. → Probablemente el postre sea un **tipo de producto**
   cargado por el cocinero.
4. **Cliente anónimo y juegos:** el punto 14 dice explícitamente que los juegos con descuento son
   **sólo para cliente registrado**, pero el QR de mesa (sección 5.2) lista "acceder a los juegos"
   para **cualquier** cliente. → Interpretación: el anónimo **puede jugar** pero **no obtiene descuento**.
5. **Encuesta "una por estadía":** hay que definir qué constituye una estadía
   (probablemente: desde asignación de mesa hasta liberación de la mesa por pago confirmado).
6. **Cantidad de comensales en la lista de espera:** no está explicitado como campo, pero el metre
   necesita saberlo para asignar una mesa con capacidad suficiente. → Agregarlo.
7. **Chat estilo WhatsApp "todos los mozos y todos los clientes":** es una **sala única global**,
   no conversaciones separadas. Confirmar con cátedra si se acepta una sala global.
8. **Tiempo estimado de llegada al destino (punto 28):** ¿se calcula con la Maps API (Directions)
   o se puede estimar? → Preferir Maps API para cumplir el excluyente de "herramientas de mapas".
9. **Cuenta 'empresarial' de correo:** hay que dar de alta una cuenta/dominio propio del grupo
   (o un servicio transaccional tipo SMTP dedicado). **No sirve el Gmail personal de nadie.**
10. **Login social (punto 23):** "elegir al menos una" red social. Definir cuál y verificar que
    funcione para **todos** los perfiles, no sólo clientes.

---

## 13. Checklist operativo de riesgos (lo que suele hacer fallar la entrega)

- [ ] **Espacios neutros en pantalla** → revisar cada pantalla contra el ejemplo de la cátedra.
- [ ] **Fondos blancos/claros o negros/oscuros** → paleta con colores saturados de contraste alto. **Sin modo oscuro.**
- [ ] **Alerts nativos** usados en algún lado → reemplazar todos por controles propios y **variados**.
- [ ] **Spinner sin logo** en alguna espera → auditar TODAS las esperas.
- [ ] **Error sin vibración** → centralizar el manejo de errores para que siempre vibre.
- [ ] **Texto en inglés** filtrado desde una librería o un mensaje de error de backend → interceptar y traducir.
- [ ] **Falta de tildes** o **palabras abreviadas** en la UI.
- [ ] **Push notification que no llega con la app cerrada** → probar en dispositivo real, no sólo emulador.
- [ ] **Correo que cae en spam** o sale desde cuenta personal.
- [ ] **README desactualizado** o sin el índice completo de imágenes/QR.
- [ ] **Versiones distintas de la app** entre los 4 dispositivos el día de la presentación.
- [ ] **Falta del histórico de 4 semanas** → los gráficos quedan vacíos.
- [ ] **Gráficos compartiendo pantalla** → debe ser **uno por pantalla**.
- [ ] **Splash animada faltante** (piden estática **Y** animada, con nombres completos del grupo).
- [ ] **Botones de ingreso rápido implementados como combo o botones fijos** → explícitamente prohibido.
- [ ] **Cierre de sesión que no borra credenciales** → verificar storage/token.

---

## 14. Plan de trabajo sugerido por fecha

### Hasta el 17-10-2026 (1ª fecha)
**Obligatorio mínimo:** puntos 1–14. **Para promocionar:** puntos 1–22 + los 19 excluyentes de la sección 3.1.

Orden recomendado:
1. Infraestructura: proyecto, auth, base de datos realtime, storage de imágenes, push, correo empresarial, seed de 4 semanas.
2. Sistema de diseño (paleta de alto contraste, componentes de error/info, spinner con logo, vibración, sonidos, splash).
3. Puntos 1–5 (altas + validaciones + cámara + QR de DNI).
4. Puntos 6–8 (aprobación de clientes + correos).
5. Puntos 9–11 (lista de espera, asignación de mesa, menú, chat).
6. Puntos 12–14 (pedido, rechazo, confirmación, derivación).
7. Puntos 15–19 (juegos, cocina, bar, entrega).
8. Puntos 20–22 (encuesta, gráficos, propina QR, cuenta estilo Mercado Pago, pago, liberación de mesa).

### Hasta el 07-11-2026 (2ª fecha)
Punto 22 ampliado (**factura PDF**, envío por correo a registrados / descarga por push a anónimos) + punto 23 (**login social**).

### Hasta el 28-11-2026 (3ª fecha)
Puntos 24–31: **reservas** (con tolerancia de 45 min), **delivery con mapas y ruta**, **chat repartidor↔cliente**,
**factura de delivery**, y **navegación del menú por acelerómetro/giroscopio**.

---

## 15. Decisiones técnicas del proyecto

> **Sección viva.** Última actualización: 29-08-2026.
> El código de la aplicación vive en `TFI/restaurante/`.

| Tema | Decisión | Fecha |
|---|---|---|
| Framework móvil | **Ionic 9 + Angular 22** (componentes standalone, sin NgRx) | 28-08-2026 |
| Empaquetado nativo | **Capacitor 8** | 28-08-2026 |
| Backend / base de datos | **Supabase** (PostgreSQL + Auth + Storage + Realtime) | 28-08-2026 |
| Autenticación | **Supabase Auth** (correo y contraseña). Login social en 2ª fecha (punto 23) | 28-08-2026 |
| Vibración / sensores | **@capacitor/haptics**, con reserva a `navigator.vibrate` en navegador | 28-08-2026 |
| Sonidos | **Web Audio API** generados por código (sin archivos en el repositorio) | 28-08-2026 |
| Push notifications | *pendiente* — evaluar `@capacitor/push-notifications` + Firebase | |
| Servicio de correo empresarial | *pendiente* — evaluar Resend o Brevo con dominio propio | |
| Librería de QR (lectura/generación) | *pendiente* | |
| Librería de gráficos | *pendiente* | |
| Generación de PDF | *pendiente* | |
| Mapas | *pendiente* | |
| Nombre del grupo / repo | **La Brasa Brava** — repositorio privado `acostaamericonicolas/LaBrasaBrava-2026` | 29-08-2026 |
| Flujo de trabajo con Git | Una rama por integrante, `main` siempre compilando, unión semanal por Pull Request (ver `restaurante/FLUJO-DE-TRABAJO.md`) | 29-08-2026 |
| Integrantes y roles | *pendiente* (marcador en `src/app/nucleo/marca.ts`) | |
| Líder del grupo | *pendiente* | |

### 15.1 Convenciones de código
- **Todo en español**: nombres de carpetas, clases, métodos, variables y comentarios.
- Carpetas: `nucleo/` (servicios, modelos, guardas), `compartido/` (componentes reutilizables),
  `paginas/` (una carpeta por pantalla).
- Los **errores nunca se manejan sueltos**: se pasan por `MensajesService`, que garantiza
  el control visual y la vibración obligatoria.
- Las **esperas nunca se manejan sueltas**: se envuelven con `CargandoService.durante()`,
  que garantiza el spinner con logo.
- El archivo `src/app/nucleo/marca.ts` es el **único lugar** con datos del grupo y del
  restaurante; todas las pantallas leen de ahí.

### 15.2 Estado del proyecto al 29-08-2026
**Hecho:**
- Proyecto Ionic + Angular creado y compilando.
- Paleta de marca sin blancos, sin negros y sin modo oscuro.
- Isotipo vectorial animado (`LogoMarcaComponent`).
- Pantalla de presentación animada con ícono centrado e integrantes.
- Spinner con logo, servicio de mensajes con vibración y servicio de sonidos.
- Pantalla de ingreso con validación de correo y clave, y accesos rápidos leídos de la base.
- Pantalla principal con cierre de sesión que verifica el borrado de credenciales.
- Esquema SQL y script de carga de los siete usuarios de prueba.
- Repositorio privado creado con los seis docentes como colaboradores, y flujo de ramas acordado
  (`restaurante/FLUJO-DE-TRABAJO.md` y `restaurante/REPARTO-DE-TAREAS.md`).

**Falta para la próxima clase:**
- Completar `marca.ts` con apellidos y nombres de los otros tres integrantes (el nombre del grupo ya está).
- Crear el proyecto en Supabase y completar `nucleo/configuracion.ts`.
- Instalar Android Studio y generar el proyecto nativo.
- Generar el ícono en mapa de bits y la pantalla de presentación estática de Capacitor.
- Volcar el reparto de tareas al README con la tabla que pide la cátedra.
- Inicializar el repositorio local y subir la base a `main`.

## 16. Referencias del enunciado

- PDF original: `C:\Users\enrum\Desktop\Facu\TFI\Trabajo práctico - 2026 - TFI.pdf` (22 páginas)
- Formulario de inscripción: https://forms.cloud.microsoft/r/gFbFTZjPeN?origin=lprLink
- Referencia UX citada: https://es.wikipedia.org/wiki/Diseño_de_experiencia_de_usuario
- Referencia visual para la cuenta/pago: **Mercado Pago** (punto 21)
- Imágenes de ejemplo de la cátedra: ver sección 3.1
