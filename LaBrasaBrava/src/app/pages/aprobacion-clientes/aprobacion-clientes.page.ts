import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonSpinner,
  IonModal,
  IonButtons,
  IonLabel,
  AlertController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  checkmarkOutline, closeOutline, personCircleOutline, mailOutline, idCardOutline, calendarOutline
} from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { SupabaseService } from '../../nucleo/servicios/supabase.service';
import { LogoMarcaComponent } from '../../componentes/logo-marca/logo-marca.component';
import { RESTAURANTE } from '../../nucleo/marca';

interface ClientePendiente {
  id: string;
  nombres: string;
  apellidos: string;
  dni: string;
  email: string;
  foto_url: string | null;
  estado: string;
  created_at: string;
}

@Component({
  selector: 'app-aprobacion-clientes',
  templateUrl: './aprobacion-clientes.page.html',
  styleUrls: ['./aprobacion-clientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    //IonCard,
    //IonCardContent,
    //IonCardHeader,
    //IonCardTitle,
    IonButton,LogoMarcaComponent,
    IonIcon,
    //IonSpinner,
    IonModal,
    IonButtons,
    //IonLabel, 
  ]
})
export class AprobacionClientesPage implements OnInit {
  pendientes: ClientePendiente[] = [];
  clienteSeleccionado: ClientePendiente | null = null;
  cargando = true;
  errorGeneral: string | null = null;
  procesandoId: string | null = null;
  protected readonly restaurante = RESTAURANTE;

  constructor(
    private supabase: SupabaseService,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      checkmarkOutline,
      closeOutline,
      personCircleOutline,
      mailOutline,
      idCardOutline,
      calendarOutline
    });
  }

  async ngOnInit(): Promise<void> {
    await this.cargarPendientes();
  }

  async cargarPendientes(): Promise<void> {
    this.cargando = true;
    this.errorGeneral = null;
    this.cdr.detectChanges();

    try {
      const { data, error } = await this.supabase.cliente
        .from('clientes')
        .select(`
          id,
          nombres,
          apellidos,
          dni,
          email,
          foto_url,
          estado,
          created_at
        `)
        .eq('estado', 'pendiente')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error al cargar clientes pendientes:', error);
        this.errorGeneral = 'No se pudo cargar el listado de clientes pendientes.';
        this.cdr.detectChanges();
        return;
      }

      this.pendientes = data ?? [];
      this.cargando = false;
      this.cdr.detectChanges();
      console.log('Clientes pendientes:', this.pendientes);
      console.log('Cantidad:', this.pendientes.length);
    } catch (error) {
      console.error('Error inesperado al cargar clientes:', error);
      this.errorGeneral = 'Ocurrió un error inesperado al cargar el listado.';
    } finally {
      this.cargando = false;
      console.log('Carga finalizada. Cargando:', this.cargando);
      this.cdr.detectChanges();
    }
  }

  verDetalle(cliente: ClientePendiente): void {
    this.clienteSeleccionado = cliente;
  }

  cerrarDetalle(): void {
    this.clienteSeleccionado = null;
  }

  async confirmarAprobacion(cliente: ClientePendiente): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar aprobación',
      message: `¿Deseás aprobar a ${cliente.nombres} ${cliente.apellidos}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Aprobar',
          role: 'confirm',
          handler: () => {
            void this.actualizarEstado(cliente, 'aceptado');
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarRechazo(cliente: ClientePendiente): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar rechazo',
      message: `¿Deseás rechazar a ${cliente.nombres} ${cliente.apellidos}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Rechazar',
          role: 'confirm',
          handler: () => {
            void this.actualizarEstado(cliente, 'rechazado');
          }
        }
      ]
    });
    await alert.present();
  }

  async aceptar(cliente: ClientePendiente): Promise<void> {
    await this.actualizarEstado(cliente, 'aceptado');
  }

  async rechazar(cliente: ClientePendiente): Promise<void> {
    await this.actualizarEstado(cliente, 'rechazado');
  }

  private async actualizarEstado(
    cliente: ClientePendiente,
    nuevoEstado: 'aceptado' | 'rechazado'
  ): Promise<void> {
    if (this.procesandoId !== null) {
      return;
    }
    this.procesandoId = cliente.id;
    this.errorGeneral = null;

    try {
      console.log(`Actualizando cliente ${cliente.id} a ${nuevoEstado}`);

      const { error } = await this.supabase.cliente
        .from('clientes')
        .update({ estado: nuevoEstado })
        .eq('id', cliente.id);

      if (error) {
        console.error('Error al actualizar estado:', error);
        this.errorGeneral = `No se pudo actualizar el estado de ${cliente.nombres}.`;
        await Haptics.impact({ style: ImpactStyle.Medium });
        return;
      }

      console.log(`Cliente ${cliente.email} → ${nuevoEstado}`);

      // Envío de correo automático — en su propio try/catch para no romper
      // el resto del flujo si el correo falla.
      try {
        await this.supabase.cliente.functions.invoke('enviar-correo-cliente', {
          body: {
            email: cliente.email,
            nombre: cliente.nombres,
            estado: nuevoEstado,
          },
        });
      } catch (emailError) {
        console.error('El estado se actualizó pero el correo no se pudo enviar:', emailError);
      }

      /*
       * Eliminamos el cliente de la lista
       * porque ya no está pendiente.
       */
      this.pendientes = this.pendientes.filter(c => c.id !== cliente.id);

      /*
       * Cerramos el modal si estaba abierto.
       */
      this.clienteSeleccionado = null;
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.error('Error inesperado al actualizar estado:', error);
      this.errorGeneral = `Ocurrió un error al actualizar ${cliente.nombres}.`;
    } finally {
      this.procesandoId = null;
    }
  }
}