import { Injectable } from '@angular/core';
import {
    CapacitorBarcodeScanner,
    CapacitorBarcodeScannerTypeHint,
    CapacitorBarcodeScannerCameraDirection,
} from '@capacitor/barcode-scanner';
import * as QRCode from 'qrcode';

export type TipoQr = 'ingreso' | 'mesa' | 'propina' | 'desconocido';

export interface QrParseado {
    tipo: TipoQr;
    valor: string;
    payload?: string;
}

const PREFIJO = 'brasabrava';

@Injectable({ providedIn: 'root' })
export class Qr {
    async leerQr(): Promise<string> {
        const resultado = await CapacitorBarcodeScanner.scanBarcode({
            hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
            scanInstructions: 'Apuntá al código QR',
            cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
        });
        return resultado.ScanResult;
    }

    async leerDni(): Promise<string> {
        const resultado = await CapacitorBarcodeScanner.scanBarcode({
            hint: CapacitorBarcodeScannerTypeHint.PDF_417,
            scanInstructions: 'Escaneá el código de barras del dorso del DNI',
            cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
        });
        return resultado.ScanResult;
    }

    async generarDataUrl(valor: string): Promise<string> {
        return QRCode.toDataURL(valor, {
            margin: 1,
            width: 400,
            color: { dark: '#2E2A28', light: '#F0DFC6' },
        });
    }

    valorQrIngreso(): string {
        return `${PREFIJO}:ingreso`;
    }

    valorQrMesa(mesaId: string): string {
        return `${PREFIJO}:mesa:${mesaId}`;
    }

    valorQrPropina(porcentaje: 0 | 5 | 10 | 15 | 20): string {
        return `${PREFIJO}:propina:${porcentaje}`;
    }

    parsear(valorCrudo: string): QrParseado {
        const partes = valorCrudo.split(':');
        if (partes[0] !== PREFIJO) return { tipo: 'desconocido', valor: valorCrudo };
        if (partes[1] === 'ingreso') return { tipo: 'ingreso', valor: valorCrudo };
        if (partes[1] === 'mesa') return { tipo: 'mesa', valor: valorCrudo, payload: partes[2] };
        if (partes[1] === 'propina') return { tipo: 'propina', valor: valorCrudo, payload: partes[2] };
        return { tipo: 'desconocido', valor: valorCrudo };
    }
}