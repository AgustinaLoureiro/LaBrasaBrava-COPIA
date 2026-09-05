/**
 * =====================================================================
 * Revisión visual de las pantallas
 * =====================================================================
 * Abre la aplicación en un Chrome sin ventana, con la pantalla de un
 * teléfono, avisa si algo se sale del ancho y guarda una captura de cada
 * pantalla en la carpeta que se le indique.
 *
 * Sirve para dos exigencias del enunciado que son fáciles de romper sin
 * darse cuenta: que ninguna imagen ni texto quede cortado, y que las
 * capturas del índice de imágenes del README estén al día.
 *
 * Uso:
 *   1. npm run build
 *   2. Servir la carpeta www en el puerto 4300, por ejemplo:
 *        npx http-server www -p 4300
 *   3. node revision-visual.mjs docs/pantallas
 *
 * Si Chrome está instalado en otro lado, se le pasa la ruta con la
 * variable de entorno CHROME.
 * =====================================================================
 */
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const CHROME = process.env.CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const DIRECCION = process.env.DIRECCION ?? 'http://localhost:4300/';
const PUERTO = 9222;
const DESTINO = process.argv[2] ?? '.';
// Medidas de un teléfono común, que es donde se corrige la aplicación.
const ANCHO = 390;
const ALTO = 844;

const chrome = spawn(CHROME, [
  '--headless',
  '--disable-gpu',
  '--hide-scrollbars',
  `--remote-debugging-port=${PUERTO}`,
  'about:blank',
]);

await new Promise((r) => setTimeout(r, 2500));

const lista = await (await fetch(`http://localhost:${PUERTO}/json/list`)).json();
const pagina = lista.find((p) => p.type === 'page');
const socket = new WebSocket(pagina.webSocketDebuggerUrl);

let id = 0;
const pendientes = new Map();
socket.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pendientes.has(m.id)) {
    pendientes.get(m.id)(m);
    pendientes.delete(m.id);
  }
});
await new Promise((r) => socket.addEventListener('open', r));

function enviar(metodo, parametros = {}) {
  const propio = ++id;
  return new Promise((r) => {
    pendientes.set(propio, r);
    socket.send(JSON.stringify({ id: propio, method: metodo, params: parametros }));
  });
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

async function evaluar(expresion) {
  const r = await enviar('Runtime.evaluate', { expression: expresion, returnByValue: true });
  return r.result?.result?.value;
}

async function capturar(nombre) {
  const r = await enviar('Page.captureScreenshot', { format: 'png' });
  writeFileSync(`${DESTINO}/${nombre}.png`, Buffer.from(r.result.data, 'base64'));
}

async function revisarDesbordes(pantalla) {
  const salida = await evaluar(`JSON.stringify({
    ancho: innerWidth,
    documento: document.documentElement.scrollWidth,
    cortados: [...document.querySelectorAll('*')]
      .filter((e) => {
        const c = e.getBoundingClientRect();
        return c.width > 0 && (c.right > innerWidth + 1 || c.left < -1);
      })
      .slice(0, 10)
      .map((e) => e.tagName.toLowerCase() + (e.className ? '.' + String(e.className).trim().split(/\\s+/).join('.') : '')),
  })`);
  const datos = JSON.parse(salida);
  const estado = datos.documento > datos.ancho ? 'DESBORDA' : 'entra bien';
  console.log(`  ${pantalla.padEnd(16)} ${estado} (ventana ${datos.ancho}, documento ${datos.documento})`);
  if (datos.cortados.length) console.log(`    elementos fuera de pantalla: ${datos.cortados.join(', ')}`);
}

await enviar('Page.enable');
await enviar('Emulation.setDeviceMetricsOverride', {
  width: ANCHO,
  height: ALTO,
  deviceScaleFactor: 2,
  mobile: true,
});

console.log(`\n  Revisión visual en un teléfono de ${ANCHO} x ${ALTO}\n`);

// 1. Presentación (mientras corre su animación).
await enviar('Page.navigate', { url: DIRECCION });
await esperar(2000);
await revisarDesbordes('presentación');
await capturar('01-presentacion');

// 2. Ingreso (la presentación navega sola a los 4,2 segundos).
await esperar(4500);
await revisarDesbordes('ingreso');
await capturar('02-ingreso');

// 3. El final de la lista de accesos, donde están los clientes con su
//    estado de aprobación.
await evaluar(`(() => {
  const contenido = document.querySelector('ion-content');
  contenido.scrollToBottom(0);
  return true;
})()`);
await esperar(700);
await capturar('03-ingreso-clientes');

// 4. Ingreso con el formulario mal completado, para ver las validaciones.
await evaluar(`(() => {
  document.querySelector('ion-content').scrollToTop(0);
  document.querySelector('button[type=submit]').click();
  return true;
})()`);
await esperar(900);
await capturar('04-ingreso-validaciones');

// 5. Espera con el logo. Se frena la red a propósito para que la espera
//    dure lo suficiente como para poder fotografiarla.
await enviar('Network.enable');
await enviar('Network.emulateNetworkConditions', {
  offline: false,
  latency: 3000,
  downloadThroughput: 20000,
  uploadThroughput: 20000,
});
await evaluar(`(() => { document.querySelector('.ficha').click(); return true; })()`);
await esperar(1400);
await capturar('05-espera-con-logo');
await enviar('Network.emulateNetworkConditions', {
  offline: false,
  latency: 0,
  downloadThroughput: -1,
  uploadThroughput: -1,
});

// 6. Pantalla principal, ya con la sesión iniciada.
await esperar(5000);
await revisarDesbordes('principal');
await capturar('06-principal');

console.log('\n  Capturas guardadas.\n');

socket.close();
chrome.kill();
process.exit(0);
