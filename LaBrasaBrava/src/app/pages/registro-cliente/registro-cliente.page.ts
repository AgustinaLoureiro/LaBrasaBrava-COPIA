import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {IonContent,IonHeader,IonToolbar,IonTitle,IonCard,IonCardContent,IonItem,IonLabel,IonInput,IonNote,IonButton,IonIcon,IonSpinner
} from '@ionic/angular';
import {
  Camera,
  CameraResultType,
  CameraSource
} from '@capacitor/camera';
import {
  Haptics,
  ImpactStyle
} from '@capacitor/haptics';
import {
  BarcodeScanner,
  BarcodeFormat
} from '@capacitor-mlkit/barcode-scanning';
import { SupabaseService } from '../../nucleo/servicios/supabase.service';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.page.html',
  styleUrls: ['./registro-cliente.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonButton,
    IonIcon,
    IonSpinner
  ]
})
export class RegistroClientePage {
  form: FormGroup;
  foto_url: string | null = null;
  qrEscaneado = false;
  enviando = false;
  errorGeneral: string | null = null;
  registroExitoso = false;
  codigoDetectado: string | null = null;
  formatoDetectado: string | null = null;

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      nombres: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      apellidos: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      dni: ['', [
        Validators.required,
        Validators.pattern(/^\d{7,8}$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
    });
  }

  get f() {
    return this.form.controls;
  }

  async tomarFoto() {
    this.errorGeneral = null;
    try {
      const foto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 90,
        width: 800,
        height: 800,
        correctOrientation: true
      });
      if (!foto.dataUrl) {
        this.foto_url = null;
        this.errorGeneral = 'No se pudo obtener la foto. Intentá nuevamente.';
        this.cdr.detectChanges();
        return;
      }
      this.foto_url = foto.dataUrl;
      this.cdr.detectChanges();
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      this.errorGeneral = 'No se pudo tomar la foto. Intentá nuevamente.';
      this.cdr.detectChanges();
    }
  }

  async escanearDni() {
    this.errorGeneral = null;
    try {
      const { camera } = await BarcodeScanner.requestPermissions();
      if (camera !== 'granted' && camera !== 'limited') {
        this.errorGeneral = 'Necesitamos permiso de cámara para escanear el DNI.';
        this.cdr.detectChanges();
        return;
      }
      const { barcodes } = await BarcodeScanner.scan({
        formats: [BarcodeFormat.Pdf417]
      });
      if (barcodes.length === 0) {
        this.errorGeneral = 'No se detectó ningún código PDF417.';
        this.cdr.detectChanges();
        return;
      }
      const codigo = barcodes[0];
      this.formatoDetectado = codigo.format;
      this.codigoDetectado = codigo.rawValue ?? null;
      if (!codigo.rawValue) {
        this.errorGeneral = 'El código no contiene datos legibles.';
        this.cdr.detectChanges();
        return;
      }
      const datos = codigo.rawValue.split('@');
      if (datos.length < 5) {
        this.errorGeneral = 'El formato del DNI no pudo ser interpretado.';
        this.cdr.detectChanges();
        return;
      }
      const apellido = datos[1]?.trim();
      const nombres = datos[2]?.trim();
      const dni = datos[4]?.trim();
      if (!apellido || !nombres || !dni) {
        this.errorGeneral = 'No se pudieron obtener correctamente los datos del DNI.';
        this.cdr.detectChanges();
        return;
      }
      this.form.patchValue({ nombres, apellidos: apellido, dni });
      this.qrEscaneado = true;
      this.cdr.detectChanges();
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      console.error('Error al escanear:', error);
      this.errorGeneral = 'No se pudo leer el DNI. Intentá nuevamente.';
      this.cdr.detectChanges();
      await Haptics.impact({ style: ImpactStyle.Medium });
    }
  }

  async onSubmit() {
    this.errorGeneral = null;
    this.registroExitoso = false;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorGeneral = 'Completá correctamente todos los campos.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.foto_url) {
      this.errorGeneral = 'Tenés que tomar una foto personal antes de registrarte.';
      this.cdr.detectChanges();
      return;
    }

    this.enviando = true;
    this.cdr.detectChanges(); // 👈 para que el spinner aparezca de inmediato

    try {
      const nombres = this.form.value.nombres.trim();
      const apellidos = this.form.value.apellidos.trim();
      const dni = this.form.value.dni.trim();
      const email = this.form.value.email.trim();
      const password = this.form.value.password;

      const { data: authData, error: authError } =
        await this.supabase.cliente.auth.signUp({ email, password });

      if (authError || !authData.user) {
        if (authError?.code === 'user_already_exists') {
          this.errorGeneral = 'Ya existe una cuenta registrada con ese correo electrónico.';
        } else {
          this.errorGeneral = 'No se pudo crear la cuenta. Intentá nuevamente.';
        }
        this.cdr.detectChanges(); // 👈 el que faltaba
        await Haptics.impact({ style: ImpactStyle.Medium });
        return;
      }

      const respuestaFoto = await fetch(this.foto_url);
      if (!respuestaFoto.ok) throw new Error('No se pudo preparar la foto.');
      const blob = await respuestaFoto.blob();
      if (blob.size === 0) throw new Error('La foto está vacía.');

      const nombreArchivo = `${dni}_${Date.now()}.jpg`;
      const rutaFoto = `clientes/${nombreArchivo}`;

      const { error: errorUpload } = await this.supabase.cliente
        .storage.from('fotos-clientes')
        .upload(rutaFoto, blob, { upsert: false });

      if (errorUpload) throw new Error(`No se pudo subir la foto: ${errorUpload.message}`);

      const { data: urlFoto } = this.supabase.cliente
        .storage.from('fotos-clientes')
        .getPublicUrl(rutaFoto);

      if (!urlFoto.publicUrl) throw new Error('No se pudo obtener la URL de la foto.');

      const { error: errorInsert } = await this.supabase.cliente
        .from('clientes')
        .insert({
          id: authData.user.id,
          nombres,
          apellidos,
          dni,

          email
        }
      );


      // =====================================================
      // VERIFICAR DNI EXISTENTE
      // =====================================================

      console.log(
        '2. Verificando DNI existente...'
      );


      const {
        data: clienteDni,
        error: errorDni
      } = await this.supabase.cliente
        .from('clientes')
        .select('id')
        .eq('dni', dni)
        .maybeSingle();

        console.log('🟢 REGISTRO: terminó consulta DNI', {
  clienteDni,
  errorDni
});


      if (errorDni) {

        console.error(
          'Error verificando DNI:',
          errorDni
        );
        throw new Error(
          'No se pudo verificar el DNI.'
        );
      }


      if (clienteDni) {

        this.errorGeneral =
          'Ya existe un cliente registrado con ese DNI.';
        return;
      }


      // =====================================================
      // VERIFICAR EMAIL EXISTENTE
      // =====================================================

      console.log(
        '3. Verificando email existente...'
      );


      const {
        data: clienteEmail,
        error: errorEmail
      } = await this.supabase.cliente
        .from('clientes')
        .select('id')
        .eq('email', email)
        .maybeSingle();

        console.log('🟢 REGISTRO: terminó consulta EMAIL', {
  clienteEmail,
  errorEmail
});


      if (errorEmail) {

        console.error(
          'Error verificando email:',
          errorEmail
        );

        throw new Error(
          'No se pudo verificar el email.'
        );
      }


      if (clienteEmail) {

        this.errorGeneral =
          'Ya existe un cliente registrado con ese email.';

        return;
      }


      // =====================================================
      // CONVERTIR FOTO A BLOB
      // =====================================================

      console.log(
        '4. Preparando foto...'
      );


      const respuestaFoto =
        await fetch(this.foto_url);


      if (!respuestaFoto.ok) {

        throw new Error(
          'No se pudo preparar la foto.'
        );
      }


      const blob =
        await respuestaFoto.blob();

        console.log('🟢 REGISTRO: foto convertida a Blob', {
          size: blob.size,
          type: blob.type
});


      console.log(
        'Tamaño de la foto:',
        blob.size,
        'bytes'
      );


      if (blob.size === 0) {

        throw new Error(
          'La foto está vacía.'
        );
      }


      // =====================================================
      // NOMBRE DEL ARCHIVO
      // =====================================================

      const nombreArchivo =
        `${dni}_${Date.now()}.jpg`;


      const rutaFoto =
        `clientes/${nombreArchivo}`;


      console.log(
        '5. Subiendo foto a Storage...'
      );

      console.log(
        'Bucket:',
        'fotos-clientes'
      );

      console.log(
        'Ruta:',
        rutaFoto
      );


      // =====================================================
      // SUBIR FOTO
      // =====================================================

      const {
        error: errorUpload
      } = await this.supabase.cliente
        .storage
        .from('fotos-clientes')
        .upload(
          rutaFoto,
          blob,
          {
            upsert: false
          }
        );


      if (errorUpload) {

        console.error(
          'Error subiendo foto:',
          errorUpload
        );

        throw new Error(
          `No se pudo subir la foto: ${errorUpload.message}`
        );
      }


      console.log(
        '6. Foto subida correctamente.'
      );


      // =====================================================
      // OBTENER URL
      // =====================================================

      const {
        data: urlFoto
      } =
        this.supabase.cliente
          .storage
          .from('fotos-clientes')
          .getPublicUrl(rutaFoto);


      const fotoUrl =
        urlFoto.publicUrl;


      console.log(
        '7. URL de la foto:',
        fotoUrl
      );


      if (!fotoUrl) {

        throw new Error(
          'No se pudo obtener la URL de la foto.'
        );
      }


      // =====================================================
      // INSERTAR CLIENTE
      // =====================================================

      console.log(
        '8. Guardando cliente en la base de datos...'
      );


      const {
        data: nuevoCliente,
        error: errorInsert
      } =
        await this.supabase.cliente
          .from('clientes')
          .insert({

            nombres: nombres,

            apellidos: apellidos,

            dni: dni,

            email: email,

            password: password,

            foto_url: fotoUrl,

            estado: 'pendiente'

          })
          .select()
          .single();


          email,
          foto_url: urlFoto.publicUrl,
          estado: 'pendiente'
        });

      if (errorInsert) {
        if (errorInsert.code === '23505') {
          this.errorGeneral = 'Ya existe un cliente registrado con ese DNI.';
        } else {
          throw new Error(`No se pudo guardar el cliente: ${errorInsert.message}`);
        }
        this.cdr.detectChanges();
        return;
      }

      this.registroExitoso = true;
      this.form.reset();
      this.foto_url = null;
      this.qrEscaneado = false;
      this.codigoDetectado = null;
      this.formatoDetectado = null;
      this.cdr.detectChanges();
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error: any) {
      console.error('Error en registro:', error);
      this.errorGeneral = error?.message ?? 'Ocurrió un error durante el registro.';
      this.cdr.detectChanges();
    } finally {
      this.enviando = false;
      this.cdr.detectChanges(); // 👈 el más importante: apaga el spinner de verdad
    }
  }
}