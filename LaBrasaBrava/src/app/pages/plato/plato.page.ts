import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder, ReactiveFormsModule,
  Validators, AbstractControl, ValidationErrors, ValidatorFn,
} from '@angular/forms';
import { IonContent, ActionSheetController } from '@ionic/angular';
import { Camera } from '@capacitor/camera';
import { SupabaseService } from '../../nucleo/servicios/supabase.service';
import { Almacenamiento } from '../../services/almacenamiento';
import { LogoMarcaComponent } from '../../componentes/logo-marca/logo-marca.component';
import { RESTAURANTE } from '../../nucleo/marca';

interface Plato {
  id: string;
  nombre: string;
  descripcion: string;
  tiempo_elaboracion: string;
  precio: string;
  fotos: string[] | null;
  activo: boolean;
}

function numeroPositivo(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const valor = parseFloat(control.value);
    return valor > 0 ? null : { numeroPositivo: true };
  };
}

const POR_PAGINA = 5;

@Component({
  selector: 'app-plato',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plato.page.html',
  styleUrls: ['./plato.page.scss'],
  imports: [CommonModule, ReactiveFormsModule, IonContent, LogoMarcaComponent],
})
export class PlatoPage {
  private constructorFormulario = inject(FormBuilder);
  private actionSheetCtrl = inject(ActionSheetController);
  private supabase = inject(SupabaseService);
  private almacenamiento = inject(Almacenamiento);
  private location = inject(Location);

  protected readonly restaurante = RESTAURANTE;

  // ---- Vista: lista o formulario ----
  vista = signal<'lista' | 'formulario'>('lista');

  // ---- Listado ----
  platos = signal<Plato[]>([]);
  cargandoLista = signal(true);
  busqueda = signal('');
  paginaActual = signal(1);

  platosFiltrados = computed(() => {
    const termino = this.busqueda().trim().toLowerCase();
    if (!termino) return this.platos();
    return this.platos().filter(p => p.nombre.toLowerCase().includes(termino));
  });

  totalPaginas = computed(() => Math.max(1, Math.ceil(this.platosFiltrados().length / POR_PAGINA)));

  platosPagina = computed(() => {
    const inicio = (this.paginaActual() - 1) * POR_PAGINA;
    return this.platosFiltrados().slice(inicio, inicio + POR_PAGINA);
  });

  // ---- Carrusel flotante ----
  carrusel = signal<{ fotos: string[]; indice: number } | null>(null);

  // ---- Confirmación de borrado ----
  platoAEliminar = signal<Plato | null>(null);

  // ---- Formulario (alta/edición) ----
  platoEditandoId: string | null = null;
  guardando = false;
  mensaje = '';
  mensajeEsError = false;

  formulario = this.constructorFormulario.group({
    nombre: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(40),
      Validators.pattern(/^[a-zA-ZÁÉÍÓÚÜÑáéíóúüñ0-9\s]+$/),
    ]],
    descripcion: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(150),
    ]],
    tiempo_elaboracion: ['', [
      Validators.required,
      Validators.pattern(/^\d+$/),
      numeroPositivo(),
    ]],
    precio: ['', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d{1,2})?$/),
      numeroPositivo(),
    ]],
  });

  fotos: (string | null)[] = [null, null, null];

  constructor() {
    this.cargarPlatos();
  }

  volver() {
    this.location.back();
  }

  mostrarInactivos = signal(false);

  // ---- Cargar listado ----
  async cargarPlatos() {
    this.cargandoLista.set(true);
    this.mensaje = '';

    const { data, error } = await this.supabase.cliente
      .from('platos')
      .select('id, nombre, descripcion, tiempo_elaboracion, precio, fotos, activo')
      .eq('activo', !this.mostrarInactivos())
      .order('id', { ascending: false });

    if (error) {
      this.mensaje = 'No se pudieron cargar los platos: ' + error.message;
      this.mensajeEsError = true;
      return;
    } else {
      this.platos.set(data ?? []);
    }

    this.cargandoLista.set(false);

  }

  toggleVistaInactivos() {
    this.mostrarInactivos.update(v => !v);
    this.cargarPlatos();
  }

  async cambiarEstadoPlato(plato: any) {
    const { error } = await this.supabase.cliente
      .from('platos')
      .update({ activo: !plato.activo })
      .eq('id', plato.id);

    if (!error) {
      this.cargarPlatos(); // refresca la lista
    }
  }

  buscar(texto: string) {
    this.busqueda.set(texto);
    this.paginaActual.set(1); // vuelve a la primera página al filtrar
  }

  irPagina(n: number) {
    this.paginaActual.set(n);
  }
  paginaAnterior() {
    if (this.paginaActual() > 1) this.paginaActual.update(p => p - 1);
  }
  paginaSiguiente() {
    if (this.paginaActual() < this.totalPaginas()) this.paginaActual.update(p => p + 1);
  }

  // ---- Carrusel ----
  abrirCarrusel(plato: Plato) {
    this.carrusel.set({ fotos: plato.fotos ?? [], indice: 0 });
  }
  cerrarCarrusel() {
    this.carrusel.set(null);
  }
  fotoAnterior() {
    this.carrusel.update(c => {
      if (!c) return c;
      const total = c.fotos.length;
      return { ...c, indice: (c.indice - 1 + total) % total };
    });
  }
  fotoSiguiente() {
    this.carrusel.update(c => {
      if (!c) return c;
      const total = c.fotos.length;
      return { ...c, indice: (c.indice + 1) % total };
    });
  }

  // ---- Alta / edición ----
  mostrarFormularioNuevo() {
    this.platoEditandoId = null;
    this.formulario.reset();
    this.fotos = [null, null, null];
    this.mensaje = '';
    this.vista.set('formulario');
  }

  editarPlato(plato: Plato) {
    this.platoEditandoId = plato.id;
    this.formulario.reset({
      nombre: plato.nombre,
      descripcion: plato.descripcion,
      tiempo_elaboracion: String(plato.tiempo_elaboracion),
      precio: String(plato.precio),
    });
    const fotosExistentes = plato.fotos ?? [];
    this.fotos = [0, 1, 2].map(i => fotosExistentes[i] ?? null);
    this.mensaje = '';
    this.vista.set('formulario');
  }

  cancelarFormulario() {
    this.vista.set('lista');
    this.mensaje = '';
  }

  // ---- Borrado (BAJA LOGICA)----
  pedirEliminar(plato: Plato) {
    this.platoAEliminar.set(plato);
  }
  cancelarEliminar() {
    this.platoAEliminar.set(null);
  }
  async confirmarEliminar() {
    const plato = this.platoAEliminar();
    if (!plato) return;

    const { error } = await this.supabase.cliente
      .from('platos')
      .update({ activo: false })
      .eq('id', plato.id);

    this.platoAEliminar.set(null);

    if (error) {
      this.mensaje = 'No se pudo dar de baja el plato: ' + error.message;
      this.mensajeEsError = true;
      return;
    }

    this.mensaje = 'Plato dado de baja correctamente.';
    this.mensajeEsError = false;
    this.platos.update(lista => lista.filter(p => p.id !== plato.id));
  }

  // ---- Fotos (cámara / galería) ----
  async elegirFoto(indice: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Foto del plato',
      buttons: [
        { text: 'Tomar foto', handler: () => this.tomarConCamara(indice) },
        { text: 'Elegir de galería', handler: () => this.elegirDeGaleria(indice) },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await actionSheet.present();
  }

  private async tomarConCamara(indice: number) {
    try {
      const resultado = await Camera.takePhoto({ quality: 80, includeMetadata: true });
      this.fotos[indice] = `data:image/${resultado.metadata?.format ?? 'jpeg'};base64,${resultado.thumbnail}`;
    } catch { }
  }

  private async elegirDeGaleria(indice: number) {
    try {
      const { results } = await Camera.chooseFromGallery({ quality: 80, includeMetadata: true });
      if (results[0]) {
        this.fotos[indice] = `data:image/${results[0].metadata?.format ?? 'jpeg'};base64,${results[0].thumbnail}`;
      }
    } catch { }
  }

  fotosCompletas(): boolean {
    return this.fotos.every(f => f !== null);
  }
  fotosFaltantes(): number {
    return this.fotos.filter(f => f === null).length;
  }

  // ---- Validación ----
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

  soloNumerosConPunto(evento: KeyboardEvent) {
    const teclasPermitidas = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (teclasPermitidas.includes(evento.key)) return;
    if (evento.ctrlKey || evento.metaKey) return;
    const valorActual = (evento.target as HTMLInputElement).value;
    if (evento.key === '.' && valorActual.includes('.')) {
      evento.preventDefault();
      return;
    }
    if (!/^[0-9.]$/.test(evento.key)) evento.preventDefault();
  }

  mensajeError(campo: string): string {
    const control = this.formulario.get(campo);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Este dato es requerido.';
    if (control.errors['minlength']) return `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`;
    if (control.errors['maxlength']) return `No puede superar los ${control.errors['maxlength'].requiredLength} caracteres.`;
    if (control.errors['pattern']) {
      switch (campo) {
        case 'nombre': return 'Solo se permiten letras, números y espacios.';
        case 'tiempo_elaboracion': return 'Ingresá solo números enteros (minutos).';
        case 'precio': return 'Ingresá un precio válido, ej: 4500 o 4500.50';
        default: return 'El formato ingresado no es válido.';
      }
    }
    if (control.errors['numeroPositivo']) return 'El valor debe ser mayor a 0.';
    return 'Dato inválido.';
  }
  // ---- Guardar (alta o edición) ----
  async guardar() {
    this.mensaje = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.mensaje = 'Revisá los campos marcados.';
      this.mensajeEsError = true;
      return;
    }
    if (this.fotos.some(f => f === null)) {
      this.mensaje = 'Faltan cargar las 3 fotos del plato.';
      this.mensajeEsError = true;
      return;
    }

    try {
      this.guardando = true;

      // Solo sube las fotos nuevas (dataUrl); las que ya son URL de Supabase se reutilizan tal cual.
      const urlsFotos: string[] = [];
      for (const foto of this.fotos) {
        if (foto!.startsWith('data:')) {
          const url = await this.almacenamiento.subirImagen(foto as string, 'platos');
          if (!url) {
            this.guardando = false;
            this.mensaje = 'No se pudo subir una de las fotos, intentá nuevamente.';
            this.mensajeEsError = true;
            return;
          }
          urlsFotos.push(url);
        } else {
          urlsFotos.push(foto as string);
        }
      }

      const datosPlato = { ...this.formulario.value, fotos: urlsFotos };

      const { error } = this.platoEditandoId
        ? await this.supabase.cliente.from('platos').update(datosPlato).eq('id', this.platoEditandoId)
        : await this.supabase.cliente.from('platos').insert(datosPlato);

      this.guardando = false;

      if (error) {
        this.mensaje = 'Error al guardar: ' + error.message;
        this.mensajeEsError = true;
        return;
      }

      this.mensaje = this.platoEditandoId ? 'Plato actualizado correctamente.' : 'Plato guardado correctamente.';
      this.mensajeEsError = false;
      await this.cargarPlatos();
      this.vista.set('lista');
    } catch (err: any) {
      this.guardando = false;
      this.mensaje = 'ERROR: ' + (err.message || JSON.stringify(err));
      this.mensajeEsError = true;
    }
  }
}