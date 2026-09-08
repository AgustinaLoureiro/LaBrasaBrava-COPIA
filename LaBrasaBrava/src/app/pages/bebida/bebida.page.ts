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

interface Bebida {
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
  selector: 'app-bebida',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bebida.page.html',
  styleUrls: ['./bebida.page.scss'],
  imports: [CommonModule, ReactiveFormsModule, IonContent, LogoMarcaComponent],
})
export class BebidaPage {
  private constructorFormulario = inject(FormBuilder);
  private actionSheetCtrl = inject(ActionSheetController);
  private supabase = inject(SupabaseService);
  private almacenamiento = inject(Almacenamiento);
  private location = inject(Location);

  protected readonly restaurante = RESTAURANTE;

  // ---- Vista: lista o formulario ----
  vista = signal<'lista' | 'formulario'>('lista');

  // ---- Listado ----
  bebidas = signal<Bebida[]>([]);
  cargandoLista = signal(true);
  busqueda = signal('');
  paginaActual = signal(1);

  bebidasFiltradas = computed(() => {
    const termino = this.busqueda().trim().toLowerCase();
    if (!termino) return this.bebidas();
    return this.bebidas().filter(b => b.nombre.toLowerCase().includes(termino));
  });

  totalPaginas = computed(() => Math.max(1, Math.ceil(this.bebidasFiltradas().length / POR_PAGINA)));

  bebidasPagina = computed(() => {
    const inicio = (this.paginaActual() - 1) * POR_PAGINA;
    return this.bebidasFiltradas().slice(inicio, inicio + POR_PAGINA);
  });

  // ---- Carrusel flotante ----
  carrusel = signal<{ fotos: string[]; indice: number } | null>(null);

  // ---- Confirmación de borrado ----
  bebidaAEliminar = signal<Bebida | null>(null);

  // ---- Formulario (alta/edición) ----
  bebidaEditandoId: string | null = null;
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
    this.cargarBebidas();
  }

  volver() {
    this.location.back();
  }

  mostrarInactivos = signal(false);

  // ---- Cargar listado ----
  async cargarBebidas() {
    this.cargandoLista.set(true);
    this.mensaje = '';

    const { data, error } = await this.supabase.cliente
      .from('bebidas')
      .select('id, nombre, descripcion, tiempo_elaboracion, precio, fotos, activo')
      .eq('activo', !this.mostrarInactivos())
      .order('id', { ascending: false });

    if (error) {
      this.mensaje = 'No se pudieron cargar los bebidas: ' + error.message;
      this.mensajeEsError = true;
      return;
    } else {
      this.bebidas.set(data ?? []);
    }

    this.cargandoLista.set(false);

  }

  toggleVistaInactivos() {
    this.mostrarInactivos.update(v => !v);
    this.cargarBebidas();
  }

  async cambiarEstadoBebida(bebida: any) {
    const { error } = await this.supabase.cliente
      .from('bebidas')
      .update({ activo: !bebida.activo })
      .eq('id', bebida.id);

    if (!error) {
      this.cargarBebidas(); // refresca la lista
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
  abrirCarrusel(bebida: Bebida) {
    this.carrusel.set({ fotos: bebida.fotos ?? [], indice: 0 });
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
    this.bebidaEditandoId = null;
    this.formulario.reset();
    this.fotos = [null, null, null];
    this.mensaje = '';
    this.vista.set('formulario');
  }

  editarBebida(bebida: Bebida) {
    this.bebidaEditandoId = bebida.id;
    this.formulario.reset({
      nombre: bebida.nombre,
      descripcion: bebida.descripcion,
      tiempo_elaboracion: String(bebida.tiempo_elaboracion),
      precio: String(bebida.precio),
    });
    const fotosExistentes = bebida.fotos ?? [];
    this.fotos = [0, 1, 2].map(i => fotosExistentes[i] ?? null);
    this.mensaje = '';
    this.vista.set('formulario');
  }

  cancelarFormulario() {
    this.vista.set('lista');
    this.mensaje = '';
  }

  // ---- Borrado (BAJA LOGICA)----
  pedirEliminar(bebida: Bebida) {
    this.bebidaAEliminar.set(bebida);
  }
  cancelarEliminar() {
    this.bebidaAEliminar.set(null);
  }
  async confirmarEliminar() {
    const bebida = this.bebidaAEliminar();
    if (!bebida) return;

    const { error } = await this.supabase.cliente
      .from('bebidas')
      .update({ activo: false })
      .eq('id', bebida.id);

    this.bebidaAEliminar.set(null);

    if (error) {
      this.mensaje = 'No se pudo dar de baja la bebida: ' + error.message;
      this.mensajeEsError = true;
      return;
    }

    this.mensaje = 'Bebida dada de baja correctamente.';
    this.mensajeEsError = false;
    this.bebidas.update(lista => lista.filter(b => b.id !== bebida.id));
  }

  // ---- Fotos (cámara / galería) ----
  async elegirFoto(indice: number) {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Foto de la bebida',
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
      this.mensaje = 'Faltan cargar las 3 fotos de la bebida.';
      this.mensajeEsError = true;
      return;
    }

    try {
      this.guardando = true;

      // Solo sube las fotos nuevas (dataUrl); las que ya son URL de Supabase se reutilizan tal cual.
      const urlsFotos: string[] = [];
      for (const foto of this.fotos) {
        if (foto!.startsWith('data:')) {
          const url = await this.almacenamiento.subirImagen(foto as string, 'bebidas');
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

      const datosBebida = { ...this.formulario.value, fotos: urlsFotos };

      const { error } = this.bebidaEditandoId
        ? await this.supabase.cliente.from('bebidas').update(datosBebida).eq('id', this.bebidaEditandoId)
        : await this.supabase.cliente.from('bebidas').insert(datosBebida);

      this.guardando = false;

      if (error) {
        this.mensaje = 'Error al guardar: ' + error.message;
        this.mensajeEsError = true;
        return;
      }

      this.mensaje = this.bebidaEditandoId ? 'Bebida actualizada correctamente.' : 'Bebida guardada correctamente.';
      this.mensajeEsError = false;
      await this.cargarBebidas();
      this.vista.set('lista');
    } catch (err: any) {
      this.guardando = false;
      this.mensaje = 'ERROR: ' + (err.message || JSON.stringify(err));
      this.mensajeEsError = true;
    }
  }
}