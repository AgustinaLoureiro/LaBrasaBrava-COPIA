# Brief de diseño — Requerimientos visuales obligatorios

> Extraído del enunciado `Trabajo práctico - 2026 - TFI.pdf` (UTN FRA, TFI 2026).
> **Todo lo que está acá es exigible y se corrige.** No son preferencias del equipo:
> son condiciones excluyentes para promocionar la materia.
>
> Este documento está pensado para pegarlo tal cual en una herramienta de diseño.

---

## 1. Prohibiciones absolutas

Estas son las que hacen perder el punto de forma directa.

| # | Prohibición | Origen |
|---|---|---|
| 1 | **No se admite el modo oscuro.** La aplicación tiene un único tema. | Excluyentes, pág. 3 |
| 2 | **No se admiten fondos blancos ni "claritos".** | Excluyentes, pág. 3 |
| 3 | **No se admiten fondos negros ni "oscuritos".** | Excluyentes, pág. 3 |
| 4 | **No debe haber espacios neutros.** La totalidad de la superficie de la pantalla tiene que estar ocupada con distintos elementos. | Excluyentes, pág. 3 |
| 5 | **No se admiten palabras abreviadas** en ningún texto de la interfaz. | Excluyentes, pág. 3 |
| 6 | **Ninguna imagen ni texto informativo puede quedar cortado, descentrado o de un tamaño que no se pueda visualizar de forma nítida.** | Excluyentes, pág. 3 |
| 7 | **No se usan `alert` del sistema.** Todo error o información se muestra con controles propios. | Excluyentes, pág. 3 |
| 8 | **No se usan botones fijos, combos ni similares** para el ingreso rápido de perfiles. | Excluyentes, pág. 3 |
| 9 | **No se repiten siempre los mismos controles** para recolectar información en las encuestas. | Excluyentes, pág. 3 |
| 10 | **Una foto no puede mostrar partes de otra foto**, ni de textos ni de elementos vecinos. | Puntos 2, 3, 11 |

> **Advertencia importante sobre el punto 1.** Prohibir el modo oscuro **no significa "hacé
> modo claro"**. Un modo claro convencional tiene fondo blanco o gris muy claro, y eso está
> prohibido por el punto 2. Lo que se pide es **un único tema con colores saturados de
> luminosidad media**: ni cerca del blanco, ni cerca del negro.

---

## 2. Color y contraste

- **Contraste nítido entre textos y fondos**: se tiene que poder leer de forma clara.
- **Contraste nítido entre imágenes, textos y fondos.**
- Un solo tema, sin variante alternativa.
- La paleta tiene que sostener el requisito de "cero espacios neutros": hacen falta
  suficientes colores de superficie para llenar la pantalla sin que quede vacía ni ruidosa.

**Consecuencia práctica para la paleta:** hacen falta al menos cinco familias de color
resueltas — fondo, superficie de tarjeta, acento de acción, confirmación y error — todas
en el rango de luminosidad media.

---

## 3. Identidad y marca

| Elemento | Requisito | Origen |
|---|---|---|
| **Ícono de la aplicación** | Obligatorio. Aparece en las pantallas de presentación. | Excluyentes, pág. 3 |
| **Pantalla de presentación estática** | Obligatoria. Con el ícono, el nombre del grupo y los apellidos y nombres de cada integrante. | Excluyentes, pág. 3 |
| **Pantalla de presentación animada** | Obligatoria, **además** de la estática. Mismo contenido. | Excluyentes, pág. 3 |
| **Logo de la empresa** | Aparece en: los indicadores de espera, los correos electrónicos y la factura en PDF. | Excluyentes pág. 3; puntos 7, 8, 22 |

---

## 4. Estados y respuesta al usuario

| Situación | Requisito | Origen |
|---|---|---|
| **Toda espera** | Indicador visual (spinner) **con el logo de la empresa**. Sin excepción: "TODAS". | Excluyentes, pág. 3 |
| **Todo error** | **Vibración** del dispositivo. Sin excepción: "TODOS LOS ERRORES". | Excluyentes, pág. 3 |
| **Errores e información** | Se muestran con **distintos tipos de controles**, variados entre sí. | Excluyentes, pág. 3 |
| **Inicio de la aplicación** | Sonido propio. | Excluyentes, pág. 3 |
| **Cierre de la aplicación** | Sonido **distinto** al de inicio. | Excluyentes, pág. 3 |
| **Notificaciones push** | Funcionando con la aplicación abierta y cerrada. | Excluyentes, pág. 3 |

---

## 5. Formularios

- **Validación de todos los datos, en todos los formularios.** El enunciado lo repite en
  mayúsculas: *"TODOS LOS DATOS, EN TODOS LOS FORMULARIOS"*.
- Se validan formatos, campos vacíos y tipos de dato.
- Hace falta un **estado de error visible por campo**, no un mensaje único al final.
- **Encuestas:** variedad de controles de recolección. No repetir siempre el mismo tipo de
  control. Esto obliga a diseñar el set completo: deslizadores, selección múltiple, selección
  única, interruptores, puntuación, texto libre.
- **Ingreso rápido de perfiles:** tiene que resolverse con algún control que **no** sea un
  botón fijo ni un combo. Es un requisito de diseño, no solo de programación.

---

## 6. Fotografía de productos

Es la especificación más detallada de todo el enunciado, y se repite en cuatro puntos.

**Cantidad:**
- Platos: **tres fotos** por producto.
- Bebidas: **tres fotos** por producto.
- Mesas: **una foto**.
- Personas (empleados y clientes): **una foto** de perfil.

**Reglas de presentación** (puntos 2, 3, 4, 5, 6 y 11):
- Cada foto en un **contenedor individual**.
- Con **buen tamaño**.
- **Centrada**.
- **Sin que se muestren partes de otras fotos**, textos o elementos similares.
- Con la posibilidad de **ver o seleccionar otra imagen** (navegación entre las tres).
- En los listados de personas, cada foto debe verse **relacionada con los nombres y
  apellidos** de esa persona.

**Consecuencia para el manual:** hace falta definir la relación de aspecto de las fotos, el
tratamiento del recorte, y el componente de galería que permite pasar de una imagen a otra.

---

## 7. Listados

- **Agrupados por número de mesa**, y esos números deben ser **visibles**.
- **Con espacio entre distintos pedidos**, explícitamente "para una fácil manipulación por
  parte del cocinero" y del cantinero.
- Cada ítem del listado muestra: número de mesa, fecha con hora y minutos, nombre y cantidad.

**Consecuencia para el manual:** el ritmo vertical y la separación entre grupos son parte del
requisito, no una decisión estética. La pantalla de cocina se usa de pie y con las manos
ocupadas.

---

## 8. Piezas específicas con diseño exigido

### Correos electrónicos (puntos 7, 8, 22, 25, 28, 30)
Obligatorio en **todos** los correos de la aplicación:
- **Logo de la empresa.**
- **Mensajes personalizados** (con los datos de la persona).
- **Fuentes distintas** a las que vienen por defecto.
- **Colores y tamaños diferentes** a los que vienen por defecto.
- El correo de **rechazo** y el de **aceptación** deben diferenciarse entre sí.

### Pantalla de cuenta y pago (punto 21)
- Muestra: pedidos con precios unitarios e importe, descuentos por juegos, grado de
  satisfacción (propina) y el total.
- **El TOTAL a abonar va "grande y claro".**
- **Referencia visual explícita del enunciado: "Tomar como modelo a Mercado Pago".**

### Factura en PDF (punto 22)
Debe contener, al menos: nombre del restaurante, **logo** y dirección; fecha y número de
factura; datos del cliente; número de pedido; y el detalle facturado.

### Gráficos estadísticos (puntos 20 y 22)
- Distintos tipos: torta, barra, lineal, etc.
- **Cada gráfico en una pantalla distinta.** No se admite un tablero con varios gráficos juntos.

---

## 9. Texto e idioma

- **Todo texto o mensaje en español.** El enunciado insiste: *"¡TODO EN ESPAÑOL, los tildes
  pertenecen al idioma!"*.
- **Con tildes correctas.**
- **Sin palabras abreviadas.**

**Consecuencia para el manual:** las etiquetas de la interfaz van completas. Nada de "Cant.",
"Nro.", "Desc." ni "Config.". Esto impacta directamente en el ancho de los componentes y hay
que preverlo en el espaciado.

---

## 10. Documentación de las imágenes

El README del repositorio debe tener un índice que permita visualizar **todas y cada una** de
las imágenes del proyecto: íconos, pantallas de presentación, formularios, listados, etc.
También deben estar disponibles **todos los códigos QR** del sistema.

**Consecuencia:** cada pieza que se diseñe hay que exportarla y catalogarla.

---

## 11. Alcance de pantallas a diseñar

Para dimensionar el manual, la aplicación tiene ocho perfiles (dueño, supervisor, metre, mozo,
cocinero, cantinero, cliente registrado, cliente anónimo) y 31 puntos funcionales. Las familias
de pantalla son:

1. Presentación (estática y animada)
2. Ingreso y accesos rápidos por perfil
3. Formularios de alta (empleado, plato, bebida, mesa, cliente)
4. Listados de aprobación con foto de la persona
5. Lista de espera y asignación de mesas
6. Menú de productos con galería de tres imágenes
7. Sala de conversación
8. Armado del pedido con importe acumulado siempre visible
9. Comanda de cocina y de bar (listados agrupados)
10. Estado del pedido para el cliente
11. Juegos (tres)
12. Encuesta con variedad de controles
13. Gráficos estadísticos (uno por pantalla)
14. Cuenta, propina y pago (referencia: Mercado Pago)
15. Factura en PDF
16. Reservas, pedidos a domicilio y mapa con ruta
