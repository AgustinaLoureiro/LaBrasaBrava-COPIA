import { Component, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonModal,
  AlertController,
} from '@ionic/angular';

import { LogoMarcaComponent } from '../../componentes/logo-marca/logo-marca.component';
import { SupabaseService } from '../../nucleo/servicios/supabase.service';
import { MensajesService } from '../../nucleo/servicios/mensajes.service';
import { CargandoService } from '../../nucleo/servicios/cargando.service';
import { RESTAURANTE } from '../../nucleo/marca';

/**
 * Un cliente registrado esperando que lo aprueben.
 *
 * Los nombres de los campos son los de la tabla public.clientes tal como
 * está en la base: `email` (no `correo`) y `estado`, que admite
 * 'pendiente', 'aceptado' y 'rechazado'. Ojo con el último punto: la
 * base dice 'aceptado' donde la aplicación dice 'aprobado'.
 */
interface ClientePendiente {
  id: string;
  nombres: string;
  apellidos: string;
  dni: string | null;
  email: string;
  foto_url: string | null;
  created_at: string;
}

/**
 * Aprobación de clientes registrados.
 *
 * Puntos 6, 7 y 8 del enunciado: el dueño y el supervisor ven a los
 * clientes que se registraron y todavía están pendientes, revisan su
 * ficha y los aceptan o los rechazan. En los dos casos se le avisa al
 * cliente por correo electrónico con la función `enviar-correo-cliente`.
 */
@Component({
  selector: 'app-aprobacion-clientes',
  templateUrl: './aprobacion-clientes.page.html',
  styleUrls: ['./aprobacion-clientes.page.scss'],
  imports: [
    DatePipe,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonModal,
    LogoMarcaComponent,
  ],
})
export class AprobacionClientesPage implements OnInit {
  private readonly supabase = inject(SupabaseService);
  private readonly mensajes = inject(MensajesService);
  private readonly esperas = inject(CargandoService);
  private readonly alertas = inject(AlertController);
  private readonly detectorDeCambios = inject(ChangeDetectorRef);

  protected readonly restaurante = RESTAURANTE;

  /** Clientes que todavía no fueron aceptados ni rechazados. */
  protected pendientes: ClientePendiente[] = [];

  /** Indica que se están buscando los clientes en la base. */
  protected cargando = true;

  /** Texto del error que impidió mostrar el listado, si hubo uno. */
  protected errorGeneral = '';

  /** Cliente cuya ficha completa se está mirando en la ventana. */
  protected clienteSeleccionado: ClientePendiente | null = null;

  /** Identificador del cliente que se está aceptando o rechazando. */
  protected procesandoId: string | null = null;

  async ngOnInit(): Promise<void> {
    await this.cargarPendientes();
  }

  /**
   * Trae de la base los clientes en estado 'pendiente', del más antiguo
   * al más nuevo: el que primero se registró es el primero que se revisa.
   */
  protected async cargarPendientes(): Promise<void> {
    this.cargando = true;
    this.errorGeneral = '';
    this.detectorDeCambios.detectChanges();

    const { data, error } = await this.supabase.cliente
      .from('clientes')
      .select('id, nombres, apellidos, dni, email, foto_url, created_at')
      .eq('estado', 'pendiente')
      .order('created_at', { ascending: true });

    this.cargando = false;

    if (error) {
      this.errorGeneral = 'No se pudo traer la lista de clientes pendientes.';
      this.detectorDeCambios.detectChanges();
      await this.mensajes.error('No se pudo cargar el listado', error.message);
      return;
    }

    this.pendientes = (data ?? []) as ClientePendiente[];
    this.detectorDeCambios.detectChanges();
  }

  /** Abre la ficha completa del cliente. */
  protected verDetalle(cliente: ClientePendiente): void {
    this.clienteSeleccionado = cliente;
    this.detectorDeCambios.detectChanges();
  }

  /** Cierra la ficha completa. */
  protected cerrarDetalle(): void {
    this.clienteSeleccionado = null;
    this.detectorDeCambios.detectChanges();
  }

  /** Pregunta antes de aceptar, porque la decisión le llega por correo. */
  protected async confirmarAprobacion(cliente: ClientePendiente): Promise<void> {
    await this.preguntarYResolver(
      cliente,
      'aceptado',
      'Aprobar el registro',
      `Se le va a avisar por correo electrónico a ${cliente.nombres} ${cliente.apellidos} que ya puede ingresar.`,
      'Aprobar',
    );
  }

  /** Pregunta antes de rechazar, porque la decisión le llega por correo. */
  protected async confirmarRechazo(cliente: ClientePendiente): Promise<void> {
    await this.preguntarYResolver(
      cliente,
      'rechazado',
      'Rechazar el registro',
      `Se le va a avisar por correo electrónico a ${cliente.nombres} ${cliente.apellidos} que su registro no fue aprobado.`,
      'Rechazar',
    );
  }

  /**
   * Muestra la pregunta de confirmación y, si la respuesta es que sí,
   * guarda el nuevo estado y manda el correo.
   */
  private async preguntarYResolver(
    cliente: ClientePendiente,
    estado: 'aceptado' | 'rechazado',
    encabezado: string,
    detalle: string,
    textoDeConfirmacion: string,
  ): Promise<void> {
    const pregunta = await this.alertas.create({
      header: encabezado,
      message: detalle,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: textoDeConfirmacion,
          handler: () => {
            void this.resolver(cliente, estado);
          },
        },
      ],
    });

    await pregunta.present();
  }

  /**
   * Guarda el estado en la base y después avisa al cliente por correo.
   *
   * El orden importa: si el correo falla, la decisión ya quedó guardada
   * y el listado no vuelve a ofrecer a ese cliente. Se avisa del fallo
   * del correo, pero no se deshace la decisión.
   */
  private async resolver(
    cliente: ClientePendiente,
    estado: 'aceptado' | 'rechazado',
  ): Promise<void> {
    this.procesandoId = cliente.id;
    this.detectorDeCambios.detectChanges();

    const textoDeEspera =
      estado === 'aceptado' ? 'Aprobando el registro' : 'Rechazando el registro';

    const error = await this.esperas.durante(textoDeEspera, async () => {
      const { error: errorAlGuardar } = await this.supabase.cliente
        .from('clientes')
        .update({ estado })
        .eq('id', cliente.id);

      return errorAlGuardar;
    });

    this.procesandoId = null;

    if (error) {
      this.detectorDeCambios.detectChanges();
      await this.mensajes.error('No se pudo guardar la decisión', error.message);
      return;
    }

    // El cliente resuelto sale del listado de pendientes en el acto.
    this.pendientes = this.pendientes.filter((fila) => fila.id !== cliente.id);
    this.clienteSeleccionado = null;
    this.detectorDeCambios.detectChanges();

    const correoEnviado = await this.avisarPorCorreo(cliente, estado);

    if (estado === 'aceptado') {
      await this.mensajes.correcto(
        'Registro aprobado',
        correoEnviado
          ? `${cliente.nombres} ya puede ingresar y le avisamos por correo electrónico.`
          : `${cliente.nombres} ya puede ingresar, pero no se pudo enviar el correo electrónico.`,
      );
      return;
    }

    await this.mensajes.correcto(
      'Registro rechazado',
      correoEnviado
        ? `Le avisamos a ${cliente.nombres} por correo electrónico.`
        : 'Se guardó el rechazo, pero no se pudo enviar el correo electrónico.',
    );
  }

  /**
   * Manda el correo de aprobación o de rechazo con la función
   * `enviar-correo-cliente`, que es la que habla con Resend.
   *
   * Devuelve si el correo salió. Un fallo acá no invalida la decisión ya
   * guardada: solo cambia el mensaje que ve quien está aprobando.
   */
  private async avisarPorCorreo(
    cliente: ClientePendiente,
    estado: 'aceptado' | 'rechazado',
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase.cliente.functions.invoke('enviar-correo-cliente', {
        body: {
          email: cliente.email,
          nombre: cliente.nombres,
          estado,
        },
      });

      return !error;
    } catch {
      return false;
    }
  }
}
