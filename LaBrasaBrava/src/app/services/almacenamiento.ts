import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../nucleo/servicios/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class Almacenamiento {
  private supabase = inject(SupabaseService);

  async subirImagen(dataUrl: string, carpeta: string): Promise<string | null> {
    const respuesta = await fetch(dataUrl);
    const blob = await respuesta.blob();
    const nombreArchivo = `${carpeta}/${crypto.randomUUID()}.jpeg`;

    const { error } = await this.supabase.cliente.storage
      .from('fotos')
      .upload(nombreArchivo, blob, { contentType: 'image/jpeg' });

    if (error) {
      console.error(error.message);
      return null;
    }

    const { data } = this.supabase.cliente.storage
      .from('fotos')
      .getPublicUrl(nombreArchivo);

    return data.publicUrl;
  }
}