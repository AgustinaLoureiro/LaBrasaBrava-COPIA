import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class Camara {

  async tomarFoto(): Promise<string | null> {
    try {
      const foto = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });
      return foto.dataUrl ?? null;
    } catch (error) {
      console.error('Error al tomar la foto:', error);
      return null;
    }
  }

  async elegirFoto(): Promise<string | null> {
    try {
      const foto = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });
      return foto.dataUrl ?? null;
    } catch (error) {
      console.error('Error al elegir la foto:', error);
      return null;
    }
  }
}