import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class Camara {

  // Tomar foto SOLO desde la cámara (para empleados y clientes, según consigna)
  async tomarFoto(): Promise<string | null> {
    try {
      const foto = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera // fuerza cámara, no permite galería
      });
      return foto.dataUrl ?? null;
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      return null;
    }
  }

  // Elegir foto de cámara O galería (para platos y bebidas, según consigna)
  async elegirFoto(): Promise<string | null> {
    try {
      const foto = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt // le da a elegir cámara o galería
      });
      return foto.dataUrl ?? null;
    } catch (error) {
      console.error('Error al elegir la foto:', error);
      return null;
    }
  }
}