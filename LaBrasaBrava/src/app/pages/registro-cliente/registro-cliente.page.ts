import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
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
    private supabase: SupabaseService
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
      ]]

    });
  }

  get f() {
    return this.form.controls;
  }


  // =========================================================
  // FOTO PERSONAL
  // =========================================================

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
        this.errorGeneral =
          'No se pudo obtener la foto. Intentá nuevamente.';

        return;
      }

      this.foto_url = foto.dataUrl;

      await Haptics.impact({
        style: ImpactStyle.Light
      });

    } catch (error) {

      console.error(
        'Error al tomar la foto:',
        error
      );

      this.errorGeneral =
        'No se pudo tomar la foto. Intentá nuevamente.';
    }
  }


  // =========================================================
  // ESCANEAR DNI
  // =========================================================

  async escanearDni() {

    this.errorGeneral = null;

    try {

      const { camera } =
        await BarcodeScanner.requestPermissions();

      if (
        camera !== 'granted' &&
        camera !== 'limited'
      ) {

        this.errorGeneral =
          'Necesitamos permiso de cámara para escanear el DNI.';

        return;
      }


      const { barcodes } =
        await BarcodeScanner.scan({

          formats: [
            BarcodeFormat.Pdf417
          ]

        });


      if (barcodes.length === 0) {

        this.errorGeneral =
          'No se detectó ningún código PDF417.';

        return;
      }


      const codigo = barcodes[0];


      this.formatoDetectado =
        codigo.format;

      this.codigoDetectado =
        codigo.rawValue ?? null;


      console.log(
        'Formato detectado:',
        codigo.format
      );

      console.log(
        'Contenido detectado:',
        codigo.rawValue
      );


      if (!codigo.rawValue) {

        this.errorGeneral =
          'El código no contiene datos legibles.';

        return;
      }


      // El PDF417 del DNI devuelve los datos separados por @
      const datos =
        codigo.rawValue.split('@');


      console.log(
        'Datos separados:',
        datos
      );


      if (datos.length < 5) {

        this.errorGeneral =
          'El formato del DNI no pudo ser interpretado.';

        return;
      }


      const apellido =
        datos[1]?.trim();

      const nombres =
        datos[2]?.trim();

      const dni =
        datos[4]?.trim();


      console.log(
        'Apellido:',
        apellido
      );

      console.log(
        'Nombres:',
        nombres
      );

      console.log(
        'DNI:',
        dni
      );


      if (
        !apellido ||
        !nombres ||
        !dni
      ) {

        this.errorGeneral =
          'No se pudieron obtener correctamente los datos del DNI.';

        return;
      }


      this.form.patchValue({

        nombres: nombres,

        apellidos: apellido,

        dni: dni

      });


      this.qrEscaneado = true;


      await Haptics.impact({
        style: ImpactStyle.Light
      });


    } catch (error) {

      console.error(
        'Error al escanear:',
        error
      );

      this.errorGeneral =
        'No se pudo leer el DNI. Intentá nuevamente.';

      await Haptics.impact({
        style: ImpactStyle.Medium
      });
    }
  }


  // =========================================================
  // REGISTRO COMPLETO
  // =========================================================

  async onSubmit() {

    console.log(
      '========== INICIO REGISTRO =========='
    );

    this.errorGeneral = null;
    this.registroExitoso = false;

    // -------------------------------------------------------
    // VALIDAR FORMULARIO
    // -------------------------------------------------------

    if (this.form.invalid) {

      this.form.markAllAsTouched();
      this.errorGeneral =
        'Completá correctamente todos los campos.';

      console.log(
        'Formulario inválido:',
        this.form.value
      );

      return;
    }


    // -------------------------------------------------------
    // VALIDAR FOTO
    // -------------------------------------------------------

    if (!this.foto_url) {

      this.errorGeneral =
        'Tenés que tomar una foto personal antes de registrarte.';

      return;
    }


    this.enviando = true;
    console.log('🔵 REGISTRO: iniciando proceso');


    try {

      const datosFormulario =
        this.form.value;

      const nombres =
        datosFormulario.nombres.trim();

      const apellidos =
        datosFormulario.apellidos.trim();

      const dni =
        datosFormulario.dni.trim();

      const email =
        datosFormulario.email.trim();

      const password =
        datosFormulario.password;


      console.log(
        '1. Datos del formulario:',
        {
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


      if (errorInsert) {

        console.error(
          'Error insertando cliente:',
          errorInsert
        );

        throw new Error(
          `No se pudo guardar el cliente: ${errorInsert.message}`
        );
      }


      // =====================================================
      // CONFIRMACIÓN
      // =====================================================

      console.log(
        '9. CLIENTE GUARDADO CORRECTAMENTE:',
        nuevoCliente
      );


      console.log(
        '========== REGISTRO FINALIZADO =========='
      );


      this.registroExitoso = true;


      this.form.reset();

      this.foto_url = null;

      this.qrEscaneado = false;

      this.codigoDetectado = null;

      this.formatoDetectado = null;


      await Haptics.impact({
        style: ImpactStyle.Light
      });


    } catch (error: any) {

      console.error(
        '========== ERROR REGISTRO =========='
      );

      console.error(
        error
      );


      this.errorGeneral =
        error?.message ??
        'Ocurrió un error durante el registro.';


    } finally {

      console.log(
        '10. Finalizando proceso de registro.'
      );

      this.enviando = false;
    }
  }
}