// lib/model/process.ts
import 'react-native-get-random-values';
import uuid from 'react-native-uuid';
import * as FS from 'expo-file-system/legacy';
import Constants from 'expo-constants';
import { DeviceEventEmitter } from 'react-native';
import type PickedImage from '@/types/PickedImage';
import type { Report, ServerResponse } from '@/types/Report';
import { saveReport, REPORTS_UPDATED_EVENT } from '@/lib/storage/reports';

function getApiBase(): string {
  const extra = (Constants as any)?.expoConfig?.extra || (Constants as any)?.manifest?.extra || {};
  const base = extra.API_BASE || 'https://labs.timacad.ru/treehealth';
  return base.replace(/\/+$/, ''); // обрежем хвостовые слэши на всякий
}

function ensureFileUri(p: string): string {
  if (!p) return p;
  if (p.startsWith('file://') || p.startsWith('content://')) return p;
  if (p.startsWith('/')) return `file://${p}`;
  // iOS CameraRoll может вернуть "ph://..."
  return p;
}

async function safeMkdir(dir: string) {
  try {
    const info = await FS.getInfoAsync(dir);
    if (!info.exists) {
      await FS.makeDirectoryAsync(dir, { intermediates: true });
    }
  } catch (e) {
    console.warn('[process] safeMkdir failed', dir, e);
    throw e;
  }
}

function extFromPath(p?: string | null): 'jpg' | 'jpeg' | 'png' {
  const m = String(p || '').match(/\.(png|jpe?g)$/i);
  return (m ? (m[1].toLowerCase() as any) : 'jpg');
}

function pickOverlayUrl(base: string, payload: ServerResponse): string | null {
  const any: any = payload as any;
  const id = any?.request_id;
  if (!id) return null;

  // Явный внешний URL (новый формат) — используем как есть
  if (any?.overlay?.mode === 'url' && typeof any.overlay?.value === 'string') {
    return any.overlay.value;
  }

  // Иначе построим artifacts/<id>/overlay.<ext> по исходному пути
  const srcPath =
      (any?.overlay?.value as string | undefined) ||
      (any?.extras?.overlay_url as string | undefined) ||
      (any?.overlay_path as string | undefined);

  const ext = extFromPath(srcPath); // jpg/jpeg/png (по умолчанию jpg)
  return `${base}/artifacts/${id}/overlay.${ext}`;
}

function pickReportUrl(base: string, payload: ServerResponse): string | null {
  const any: any = payload as any;
  const id = any?.request_id;
  if (!id) return null;
  return `${base}/artifacts/${id}/report.json`;
}

export default async function process(
    image: PickedImage
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const API_BASE = getApiBase();
    const UPLOAD_URL = `${API_BASE}/infer`;

    const name = image.filename || `image_${Date.now()}.jpg`;
    const type = image.mime || 'image/jpeg';
    const fileUri = ensureFileUri(image.path);

    const fd = new FormData();
    fd.append('file', { uri: fileUri, name, type } as any);
    console.log('fileUri=', fileUri);
    const info = await FS.getInfoAsync(fileUri);
    console.log('file exists?', info.exists, info);
    console.log('Ща будет запрос', UPLOAD_URL, fd);
    const resp = await fetch(UPLOAD_URL, { method: 'POST', body: fd as any });
    console.log('Ответ получен');
    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw new Error(`upload failed: ${resp.status} ${txt}`);
    }
    const payload: ServerResponse = await resp.json();

    const id = String(uuid.v4());
    const reportsDir = `${FS.documentDirectory}reports/${id}/`;
    await safeMkdir(reportsDir);

    // overlay -> локальный файл (или копируем исходник, если недоступен)
    let imageFile = fileUri;
    const overlayUrl = pickOverlayUrl(API_BASE, payload);
    if (overlayUrl) {
      try {
        const dl = await FS.downloadAsync(overlayUrl, reportsDir + 'overlay.png');
        if (dl.status === 200) {
          imageFile = reportsDir + 'overlay.png';
          console.log('downloaded overlay', imageFile);
        }
      } catch (e) {
        console.warn('[process] overlay download failed', overlayUrl, e);
      }
    } else {
      try {
        const ext = (name.split('.').pop() || 'jpg').toLowerCase();
        await FS.copyAsync({ from: fileUri, to: reportsDir + `source.${ext}` });
        imageFile = reportsDir + `source.${ext}`;
      } catch (e) {
        console.warn('[process] copy source failed', e);
      }
    }

    // сохраняем raw JSON для совместимости/отладки
    try {
      await FS.writeAsStringAsync(reportsDir + 'report.json', JSON.stringify(payload, null, 2));
    } catch (e) {
      console.warn('[process] write report.json failed', e);
    }

    // запись в стор
    const report: Report = { id, date: new Date().toISOString(), imageFile, payload };
    await saveReport(report);
    DeviceEventEmitter.emit(REPORTS_UPDATED_EVENT);

    return { ok: true, id };
  } catch (err: any) {
    console.warn('[process] FAILED', err);
    return { ok: false, error: String(err?.message || err) };
  }
}
