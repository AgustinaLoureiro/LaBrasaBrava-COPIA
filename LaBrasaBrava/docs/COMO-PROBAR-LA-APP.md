# Cómo probar la aplicación — La Brasa Brava 2026

> Las tres formas de ver la app funcionando, qué alcanza cada una y dónde está el límite.

---

## Lo primero que hay que entender

Esta aplicación es **Ionic + Angular + Capacitor**, y Capacitor **no traduce el código a
Android**. Lo que hace es crear una aplicación Android mínima cuya única pantalla es un navegador
sin bordes (un *WebView*), y adentro carga exactamente el mismo HTML, CSS y JavaScript que corre
en Chrome.

Es decir: **la aplicación y la página web son el mismo programa.** Lo que se ve en el navegador
no es una aproximación, es la cosa misma. Lo único que cambia entre una y otra son los **plugins
nativos**: los puentes que le dan al JavaScript acceso a partes del teléfono que un navegador no
puede tocar (la cámara, la vibración, las notificaciones).

---

## Las tres formas, de menor a mayor fidelidad

### 1. Chrome en la computadora — el día a día

```bash
cd LaBrasaBrava
npm start
```

Abrir `http://localhost:4200/`. Con **F12** y después **Ctrl+Shift+M** se pasa a vista de celular
y se elige un modelo. Recarga sola con cada archivo que se guarda. Acá se hace el 95% del trabajo.

### 2. El celular real, por WiFi — sin instalar nada

Con el teléfono en la misma red que la computadora:

```bash
cd LaBrasaBrava
npx ng serve --host 0.0.0.0
```

Sacar la dirección de la máquina con `ipconfig` y entrar desde el Chrome del celular a
`http://TU-IP:4200`. Windows pide permiso de firewall la primera vez.

Esto da la aplicación en la pantalla real, con el dedo real. Y como es un WebView, es
prácticamente idéntico a tenerla instalada.

### 3. El APK instalado — lo que evalúa la cátedra

```bash
cd LaBrasaBrava
npm run build
npx cap sync android
npx cap open android
```

Requiere tener instalados el **JDK** y el **SDK de Android** (ver más abajo).

---

## Dónde está el límite

**Lo que ya se puede probar sin compilar nada.** El único plugin nativo que el código usa hoy es
`@capacitor/haptics`, en `src/app/nucleo/servicios/mensajes.service.ts`, para la vibración de los
errores. En el navegador ese plugin cae solo en la vibración que Chrome de Android ya sabe hacer.
Así que **todo lo construido hasta ahora se prueba entero con la forma 2**.

**Lo que va a fallar más adelante.** El navegador solo habilita la cámara y las notificaciones en
sitios *seguros* (HTTPS), y `http://192.168.x.x:4200` no lo es. Cuando lleguemos a los **códigos
QR** y a las **notificaciones push**, el teléfono va a bloquear la cámara sin dar ninguna
explicación. Ahí no hay vuelta: hace falta el APK de verdad.

---

## Para qué sirven el JDK y Android Studio

Ninguno de los dos sirve para *ejecutar* la aplicación, sino para *fabricar* el archivo `.apk`,
que es el instalador.

- **JDK (Java).** Android compila a bytecode de Java, y además Gradle, el sistema que arma el
  paquete, es un programa Java. Sin JDK no arranca ni el primer paso.
- **Android Studio.** Lo que realmente hace falta de él es el **SDK de Android**: las librerías
  de la plataforma, las herramientas de compilación y `adb`, el programa que instala el APK en el
  teléfono por cable. El editor no se usa —se programa donde cada uno prefiera— y el emulador es
  opcional, por si alguien quiere probar sin celular.

Son unos 8 a 12 GB entre los dos.

---

## Una cuarta forma, para revisar el diseño

```bash
npm run build
npx http-server www -p 4300     # en otra terminal
node revision-visual.mjs docs/pantallas
```

`revision-visual.mjs` abre la aplicación en un Chrome sin ventana, con la pantalla de un
teléfono de 390 × 844, recorre las pantallas y hace dos cosas:

- **Avisa si algo se sale del ancho de la pantalla**, que es uno de los excluyentes que más
  fácil se rompe sin darse cuenta («ninguna imagen o texto cortado»).
- **Guarda las capturas** en `docs/pantallas`, que son las que el README enlaza en su índice
  de imágenes. Así el índice se mantiene al día sin sacar capturas a mano.

No reemplaza probar en el teléfono: sirve para revisar el diseño rápido y para no llegar a la
entrega con el índice de imágenes desactualizado.

---

## Recomendación

Trabajar en Chrome y revisar en el celular por WiFi mientras se construyen las pantallas, pero
**instalar el JDK y el SDK antes de llegar a los puntos de códigos QR**. La cátedra evalúa la
aplicación instalada en un dispositivo, no la versión web, y dejar la compilación para el final
junta todos los problemas de configuración en la peor semana.

Si hace falta un APK antes de que todos tengan el entorno armado, hay dos atajos: que lo compile
quien ya tenga las herramientas instaladas, o configurar GitHub Actions para que arme el APK solo
en cada subida y lo deje listo para descargar, que es gratis para este repositorio.
