# Manual de marca — Brasa Brava · versión 3

Transcripción a texto del archivo `Manual de identidad V3 - Brasa Brava.pdf`, para que el
sistema de diseño se pueda consultar y programar sin abrir el PDF.

> Sistema de identidad visual para la aplicación de gestión de restaurante. Define paleta,
> tipografías y variaciones de logo para que todas las pantallas del equipo se vean como
> un mismo producto.

**Producto:** aplicación móvil de gestión de restaurante · **Año:** 2026, primera entrega.

> **Qué cambió respecto de la versión 2 (04-09-2026):** solamente el modelo de superficies.
> **Crema trigo pasó a ser el fondo principal de toda pantalla**, con texto carbón. Terracota,
> ladrillo y naranja bajaron a encabezados, tarjetas de énfasis y botones, y **nunca** se usan
> como fondo completo de pantalla. Los ocho colores de marca, los semánticos, las tipografías
> y la escala tipográfica **no cambiaron**.

---

## 1. Logo

El isotipo es una **llama dentro de una gota** (la gota está formada por un semicírculo
inferior con dos hojas caladas y una llama que sale por arriba). El imagotipo suma el
texto **BRASA BRAVA** en Montserrat 800, en mayúsculas.

| Variación | Uso |
|---|---|
| **Principal — horizontal** (isotipo + texto al lado) | Encabezados, splash horizontal, documentación. |
| **Vertical** (isotipo arriba, texto debajo en dos líneas) | Splash vertical, pantallas angostas. |
| **Isotipo solo** | Spinners y favicon. |
| **Ícono de aplicación** | Launcher de Android, con esquinas redondeadas. |
| **Monocromo claro** (crema) | Sobre fondos de color. |
| **Monocromo carbón** | Impresión y códigos QR. |

En esta misma carpeta están `logo-bb-manual.jpg` (la hoja de variaciones completa, tal como
la entregó el manual) y las tres variantes ya recortadas y con fondo transparente:
`logo-bb.png`, `logo-bb-crema.png` y `logo-bb-carbon.png`.

**Es el logo que usa la aplicación**: los mismos tres PNG están copiados en
`restaurante/src/assets/marca/`. No se dibuja a mano ni se reemplaza por un vector propio.

---

## 2. Paleta de colores

> Crema Trigo es el fondo principal de toda pantalla de la aplicación; oliva se usa como
> fondo alterno para separar módulos. Terracota, ladrillo y naranja quedan para encabezados,
> tarjetas y acentos — **no como fondo completo**. No se usan fondos blancos, grises claros,
> negros ni modo oscuro.

### Colores de marca

| Nombre | Código | Uso definido en el manual |
|---|---|---|
| **Crema trigo** | `#F0DFC6` | **Fondo principal de la aplicación**: ingreso, listados y formularios. |
| Oliva ahumada | `#5C6B46` | Fondo alterno para separar módulos. |
| Naranja brasa | `#E2622C` | Primario. Botones de acción, íconos activos, progreso. |
| Ámbar ceniza | `#F2A63B` | Secundario. Destacados, etiquetas y títulos. |
| Terracota | `#8E3418` | Encabezados y superficies de énfasis. |
| Ladrillo | `#A83E1E` | Acentos y tarjetas destacadas. |
| Brasa profunda | `#6B2A13` | Barras de navegación. |
| Carbón parrilla | `#2E2A28` | **Texto** sobre crema y ámbar. |

### Colores semánticos

| Nombre | Código | Uso definido en el manual |
|---|---|---|
| Éxito | `#3F8F5B` | Pedido listo, alta confirmada. |
| Alerta | `#E0A72E` | Pendiente de aprobación, demora en cocina. |
| Error | `#C2352A` | Validación fallida. **Acompañar con vibración.** |
| Información | `#3C7E92` | Avisos, notificaciones y estados de espera. |

---

## 3. Tipografías

**Montserrat** — títulos, botones, números de mesa y precios. Pesos 700 / 800 / 900,
mayúsculas con espaciado entre letras leve.

**Source Sans 3** — cuerpo de texto, descripciones de platos, mensajes de validación y
encuestas. Pesos 400 / 600 / 700.

### Escala tipográfica de la aplicación móvil

| Estilo | Especificación | Ejemplo del manual |
|---|---|---|
| Display / Splash | 40 / 44 · peso 900 | BRASA BRAVA |
| Título de pantalla | 28 / 34 · peso 800 | |
| Subtítulo / Tarjeta | 21 / 26 · peso 700 | Gestión de mesas |
| Cuerpo | 18 / 26 · peso 400 | |
| Botón | 18 · peso 800 · alto 56 píxeles | CONFIRMAR PEDIDO |
| Ayuda / Validación | 16 / 22 · peso 600 | Ingresá un correo electrónico válido. |

> Ningún texto de la aplicación baja de 16 píxeles. Todo en español, con tildes y sin
> abreviaturas: se escribe «Cantidad de comensales», nunca «Cant. com.».

---

## 4. Marca aplicada

### Reglas de fondo y contraste

- **Fondos crema trigo con texto carbón: es la superficie por defecto de toda pantalla.**
  Oliva, como alterno para separar módulos.
- **Terracota, ladrillo y naranja se reservan para encabezados, tarjetas de énfasis y
  botones — nunca como fondo completo de pantalla.**
- Spinners de espera **con el isotipo en crema sobre naranja brasa**.
- Los errores combinan **color error + mensaje en pantalla + vibración del dispositivo**.

### Color por perfil de usuario

El manual muestra una muestra de color para cada perfil (Dueño, Supervisor, Metre, Mozo,
Cocinero, Cantinero, Cliente registrado y Cliente anónimo) pero **no publica los códigos**.
Los que usa la aplicación están **derivados de la paleta oficial**, eligiendo un color de
marca distinto para cada perfil de manera que se distingan entre sí y mantengan contraste
con el texto. Viven en `restaurante/src/app/nucleo/diseno.ts`:

| Perfil | Código | De dónde sale |
|---|---|---|
| Dueño | `#A83E1E` | Ladrillo |
| Supervisor | `#6B2A13` | Brasa profunda |
| Metre | `#5C6B46` | Oliva ahumada |
| Mozo | `#3C7E92` | Información |
| Cocinero | `#E2622C` | Naranja brasa |
| Cantinero | `#3F8F5B` | Éxito |
| Cliente registrado | `#F2A63B` | Ámbar ceniza |
| Cliente anónimo | `#8A7458` | Crema trigo oscurecida |

Sobre ámbar y sobre la crema oscurecida el texto va en **carbón**; sobre el resto, en **crema**.

---

## 5. Dónde está programado esto

| Qué | Archivo |
|---|---|
| Paleta y escala tipográfica como variables CSS | `restaurante/src/theme/variables.scss` |
| Tipografías, clases de texto y componentes base | `restaurante/src/global.scss` |
| Paleta y colores por perfil desde TypeScript | `restaurante/src/app/nucleo/diseno.ts` |
| Logo en sus tres variantes de color | `restaurante/src/assets/marca/` |
| Componente que elige la variante del logo | `restaurante/src/app/compartido/logo-marca/logo-marca.component.ts` |
| Datos del restaurante y del grupo | `restaurante/src/app/nucleo/marca.ts` |

**Ningún color ni tamaño se escribe suelto dentro de una pantalla**: todo sale de las
variables de `variables.scss`. Si el manual cambia, se toca ese archivo y se actualiza la
aplicación entera.

Dos tonos **derivados**, que el manual no publica pero la aplicación necesita para separar
las tarjetas del fondo crema sin recurrir al blanco: `--superficie: #E6D3B4` (tarjetas) y
`--superficie-hundida: #E1CCA8` (campos de formulario). Los textos secundarios usan
`#6F6257`, que es el carbón aclarado.
