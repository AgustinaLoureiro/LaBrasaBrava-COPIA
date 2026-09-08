import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder, ReactiveFormsModule,
  Validators, AbstractControl, ValidationErrors, ValidatorFn,
} from '@angular/forms';
import { IonContent } from '@ionic/angular';
import { Camera } from '@capacitor/camera';
import { SupabaseService } from '../../nucleo/servicios/supabase.service';
import { Almacenamiento } from '../../services/almacenamiento';
import { Qr } from '../../nucleo/servicios/qr.service';
import { LogoMarcaComponent } from '../../componentes/logo-marca/logo-marca.component';
import { RESTAURANTE } from '../../nucleo/marca';

type TipoMesa = 'vip' | 'estandar' | 'movilidad_reducida';
type Disponibilidad = 'vacía' | 'ocupada';

interface Mesa {
  id: number;
  numero: number;
  cantidad_comensales: number;
  tipo: TipoMesa;
  disponibilidad: Disponibilidad;
  foto_url: string;
  qr_code: string | null;
}

function numeroPositivo(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const valor = parseFloat(control.value);
    return valor > 0 ? null : { numeroPositivo: true };
  };
}

function rangoMaximo(max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const valor = parseFloat(control.value);
    return valor <= max ? null : { rangoMaximo: max };
  };
}

const POR_PAGINA = 5;

const ETIQUETA_TIPO: Record<TipoMesa, string> = {
  vip: 'VIP',
  estandar: 'Estándar',
  movilidad_reducida: 'Movilidad reducida',
};

@Component({
  selector: 'app-mesa',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mesa.page.html',
  styleUrls: ['./mesa.page.scss'],
  imports: [CommonModule, ReactiveFormsModule, IonContent, LogoMarcaComponent],
})
export class MesaPage {
  private constructorFormulario = inject(FormBuilder);
  private supabase = inject(SupabaseService);
  private almacenamiento = inject(Almacenamiento);
  private qr = inject(Qr);
  private location = inject(Location);

  protected readonly restaurante = RESTAURANTE;
  protected readonly etiquetaTipo = ETIQUETA_TIPO;
  protected readonly tipos: TipoMesa[] = ['vip', 'estandar', 'movilidad_reducida'];

  vista = signal<'lista' | 'formulario'>('lista');

  mesas = signal<Mesa[]>([]);
  cargandoLista = signal(true);
  busqueda = signal('');
  paginaActual = signal(1);

  mesasFiltradas = computed(() => {
    const termino = this.busqueda().trim().toLowerCase();
    if (!termino) return this.mesas();
    return this.mesas().filter(m => m.numero.toString().includes(termino) || m.tipo.toLowerCase().includes(termino) || m.disponibilidad.toLowerCase().includes(termino));
  });

  totalPaginas = computed(() => Math.max(1, Math.ceil(this.mesasFiltradas().length / POR_PAGINA)));
  mesasPagina = computed(() => {
    const inicio = (this.paginaActual() - 1) * POR_PAGINA;
    return this.mesasFiltradas().slice(inicio, inicio + POR_PAGINA);
  });

  qrMostrado = signal<{ mesa: Mesa; dataUrl: string } | null>(null);
  mesaABajar = signal<Mesa | null>(null);

  mesaEditandoId: number | null = null;
  foto: string | null = null;
  tipoSeleccionado: TipoMesa | null = null;
  guardando = false;
  mensaje = '';
  mensajeEsError = false;

  formulario = this.constructorFormulario.group({
    numero: ['', [Validators.required, Validators.pattern(/^\d+$/), numeroPositivo()]],
    cantidad_comensales: ['', [Validators.required, Validators.pattern(/^\d+$/), numeroPositivo(), rangoMaximo(20)]],
  });

  constructor() {
    this.cargarMesas();
  }

  volver() {
    this.location.back();
  }

  mostrarInactivos = signal(false);

  async cargarMesas() {
    this.cargandoLista.set(true);
    this.mensaje = '';

    const { data, error } = await this.supabase.cliente
      .from('mesas')
      .select('id, numero, cantidad_comensales, tipo, disponibilidad, foto_url, qr_code')
      .eq('activo', !this.mostrarInactivos())
      .order('numero', { ascending: true });

    if (error) {
      this.mensaje = 'No se pudieron cargar las mesas: ' + error.message;
      this.mensajeEsError = true;
      return;
    } else {
      this.mesas.set(data ?? []);
    }

    this.cargandoLista.set(false);

  }

  toggleVistaInactivos() {
    this.mostrarInactivos.update(v => !v);
    this.cargarMesas();
  }

  irPagina(n: number) { this.paginaActual.set(n); }
  paginaAnterior() { if (this.paginaActual() > 1) this.paginaActual.update(p => p - 1); }
  paginaSiguiente() { if (this.paginaActual() < this.totalPaginas()) this.paginaActual.update(p => p + 1); }

  async cambiarDisponibilidad(mesa: Mesa, nueva: Disponibilidad) {
    if (mesa.disponibilidad === nueva) return;

    const { error } = await this.supabase.cliente
      .from('mesas')
      .update({ disponibilidad: nueva })
      .eq('id', mesa.id);

    if (error) {
      this.mensaje = 'No se pudo cambiar la disponibilidad: ' + error.message;
      this.mensajeEsError = true;
      return;
    }

    this.mesas.update(lista => lista.map(m => (m.id === mesa.id ? { ...m, disponibilidad: nueva } : m)));
  }

  async cambiarEstadoMesa(mesa: any) {
    const { error } = await this.supabase.cliente
      .from('mesas')
      .update({ activo: !mesa.activo })
      .eq('id', mesa.id);

    if (!error) {
      this.cargarMesas(); // refresca la lista
    }
  }

  buscar(texto: string) {
    this.busqueda.set(texto);
    this.paginaActual.set(1); // vuelve a la primera página al filtrar
  }

  // ---- QR ----
  async verQr(mesa: Mesa) {
    // Si ya tiene qr_code guardado, lo reutiliza; si no (mesas viejas creadas antes del QR), lo genera al vuelo.
    const valor = mesa.qr_code ?? this.qr.valorQrMesa(String(mesa.id));
    const dataUrl = await this.qr.generarDataUrl(valor);
    this.qrMostrado.set({ mesa, dataUrl });
  }
  cerrarQr() {
    this.qrMostrado.set(null);
  }

  mostrarFormularioNuevo() {
    this.mesaEditandoId = null;
    this.formulario.reset();
    this.foto = null;
    this.tipoSeleccionado = null;
    this.mensaje = '';
    this.vista.set('formulario');
  }

  editarMesa(mesa: Mesa) {
    this.mesaEditandoId = mesa.id;
    this.formulario.reset({
      numero: String(mesa.numero),
      cantidad_comensales: String(mesa.cantidad_comensales),
    });
    this.tipoSeleccionado = mesa.tipo;
    this.foto = mesa.foto_url;
    this.mensaje = '';
    this.vista.set('formulario');
  }

  cancelarFormulario() {
    this.vista.set('lista');
    this.mensaje = '';
  }

  seleccionarTipo(tipo: TipoMesa) {
    this.tipoSeleccionado = tipo;
  }

  pedirBaja(mesa: Mesa) { this.mesaABajar.set(mesa); }
  cancelarBaja() { this.mesaABajar.set(null); }

  async confirmarBaja() {
    const mesa = this.mesaABajar();
    if (!mesa) return;

    const { error } = await this.supabase.cliente
      .from('mesas')
      .update({ activo: false })
      .eq('id', mesa.id);

    this.mesaABajar.set(null);

    if (error) {
      this.mensaje = 'No se pudo dar de baja la mesa: ' + error.message;
      this.mensajeEsError = true;
      return;
    }

    this.mensaje = 'Mesa dada de baja correctamente.';
    this.mensajeEsError = false;
    this.mesas.update(lista => lista.filter(m => m.id !== mesa.id));
  }

  async tomarFoto() {
    try {
      const resultado = await Camera.takePhoto({ quality: 80, includeMetadata: true });
      this.foto = `data:image/${resultado.metadata?.format ?? 'jpeg'};base64,${resultado.thumbnail}`;
    } catch {
      // usuario canceló
    }
  }

  invalido(campo: string): boolean {
    const control = this.formulario.get(campo);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  soloNumerosEnteros(evento: KeyboardEvent) {
    const teclasPermitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (teclasPermitidas.includes(evento.key)) return;
    if (evento.ctrlKey || evento.metaKey) return;
    if (!/^[0-9]$/.test(evento.key)) evento.preventDefault();
  }

  mensajeError(campo: string): string {
    const control = this.formulario.get(campo);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Este dato es requerido.';
    if (control.errors['pattern']) return 'Ingresá solo números.';
    if (control.errors['numeroPositivo']) return 'El valor debe ser mayor a 0.';
    if (control.errors['rangoMaximo']) return `El máximo permitido es ${control.errors['rangoMaximo']}.`;
    return 'Dato inválido.';
  }

  async guardar() {
    this.mensaje = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensaje = 'Revisá los campos marcados.';
      this.mensajeEsError = true;
      return;
    }
    if (!this.tipoSeleccionado) {
      this.mensaje = 'Elegí el tipo de mesa.';
      this.mensajeEsError = true;
      return;
    }
    if (!this.foto) {
      this.mensaje = 'Falta tomar la foto de la mesa.';
      this.mensajeEsError = true;
      return;
    }

    try {
      this.guardando = true;

      let fotoUrl = this.foto;
      if (this.foto.startsWith('data:')) {
        const url = await this.almacenamiento.subirImagen(this.foto, 'mesas');
        if (!url) {
          this.guardando = false;
          this.mensaje = 'No se pudo subir la foto, intentá nuevamente.';
          this.mensajeEsError = true;
          return;
        }
        fotoUrl = url;
      }

      const datosMesa = {
        numero: Number(this.formulario.value.numero),
        cantidad_comensales: Number(this.formulario.value.cantidad_comensales),
        tipo: this.tipoSeleccionado,
        foto_url: fotoUrl,
      };

      if (this.mesaEditandoId) {
        const { error } = await this.supabase.cliente
          .from('mesas')
          .update(datosMesa)
          .eq('id', this.mesaEditandoId);

        this.guardando = false;
        if (error) {
          this.mensaje = 'Error al guardar: ' + error.message;
          this.mensajeEsError = true;
          return;
        }

        this.mensaje = 'Mesa actualizada correctamente.';
        this.mensajeEsError = false;
        await this.cargarMesas();
        this.vista.set('lista');
      } else {
        // 1. Insertar sin QR todavía, porque el valor del QR usa el id que Supabase recién va a generar.
        const { data, error } = await this.supabase.cliente
          .from('mesas')
          .insert({ ...datosMesa, disponibilidad: 'vacía' })
          .select('id, numero, cantidad_comensales, tipo, disponibilidad, foto_url, qr_code')
          .single();

        if (error || !data) {
          this.guardando = false;
          this.mensaje = 'Error al guardar: ' + (error?.message ?? 'sin datos');
          this.mensajeEsError = true;
          return;
        }

        // 2. Ahora que tenemos el id real, calculamos el valor del QR y lo guardamos en la misma fila.
        const valorQr = this.qr.valorQrMesa(String(data.id));
        const { error: errorQr } = await this.supabase.cliente
          .from('mesas')
          .update({ qr_code: valorQr })
          .eq('id', data.id);

        this.guardando = false;

        if (errorQr) {
          this.mensaje = 'Mesa creada, pero no se pudo guardar el QR: ' + errorQr.message;
          this.mensajeEsError = true;
        } else {
          this.mensaje = 'Mesa creada correctamente.';
          this.mensajeEsError = false;
        }

        await this.cargarMesas();
        this.vista.set('lista');

        // 3. Mostrar el QR recién generado
        await this.verQr({ ...data, qr_code: valorQr } as Mesa);
      }
    } catch (err: any) {
      this.guardando = false;
      this.mensaje = 'ERROR: ' + (err.message || JSON.stringify(err));
      this.mensajeEsError = true;
    }
  }
}