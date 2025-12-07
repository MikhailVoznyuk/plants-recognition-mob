
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import type { Report } from '@/types/Report';
import { DeviceEventEmitter } from 'react-native';

export const REPORTS_UPDATED_EVENT = 'reports:updated'; // ← добавь

const KEY = 'reports_v2';

export async function getAllReports(): Promise<Report[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as Report[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function getReport(id: string): Promise<Report | null> {
  const all = await getAllReports();
  console.log('report', all.find(r => r.id === id));
  return all.find(r => r.id === id) || null;

}

export async function saveReport(report: Report): Promise<boolean> {
  const all = await getAllReports();
  // put newest first
  const next = [report, ...all];
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
    console.log('added report')
    DeviceEventEmitter.emit(REPORTS_UPDATED_EVENT);
    return true;
  } catch {
    return false;
  }
}

export async function deleteReport(id: string): Promise<boolean> {
  const all = await getAllReports();
  const remain = all.filter(r => r.id !== id);
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(remain));
    DeviceEventEmitter.emit(REPORTS_UPDATED_EVENT);
  } catch {}
  // remove files
  const dir = FileSystem.documentDirectory + `reports/${id}`;
  try {
    await FileSystem.deleteAsync(dir, { idempotent: true });
  } catch {}
  return true;
}

export async function clearReports(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
  try {
    await FileSystem.deleteAsync(FileSystem.documentDirectory + 'reports', { idempotent: true });
    DeviceEventEmitter.emit(REPORTS_UPDATED_EVENT);
  } catch {}
}
