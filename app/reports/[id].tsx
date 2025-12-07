import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import MainBackground from '@/ui/MainBackground/MainBackground';
import GlassContainer from '@/ui/GlassContainer/GlassContainer';
import { getReport } from '@/lib/storage/reports';
import type { Report, Instance, ServerResponse } from '@/types/Report';
import PlantCard from '@/components/PlantCard/PlantCard';

function sevBucket(x?: number): 'ok'|'med'|'bad'|'none' {
  if (x == null) return 'none';
  if (x < 0.34) return 'ok';
  if (x < 0.67) return 'med';
  return 'bad';
}

// Поддержка старого формата на случай, если он есть в хранилище
function normalizeInstances(payload: any): Instance[] {
  if (Array.isArray(payload?.instances)) return payload.instances as Instance[];
  const plants = Array.isArray(payload?.plants) ? payload.plants : [];
  const defects = Array.isArray(payload?.defects) ? payload.defects : [];
  const byPlant: Record<number, any[]> = {};
  for (const d of defects) {
    const pid = Number(d.plant_id ?? d.id ?? -1);
    if (!byPlant[pid]) byPlant[pid] = [];
    byPlant[pid].push({
      label: String(d.cls ?? d.label ?? 'дефект'),
      score: typeof d.conf === 'number' ? d.conf : (typeof d.score === 'number' ? d.score : 0),
      bbox: Array.isArray(d.bbox) ? d.bbox : undefined,
    });
  }
  return plants.map((p: any) => {
      console.log(Object.keys(p))
      return {

        id: Number(p.id ?? 0),
        type: String(p.cls ?? p.type ?? 'tree'),
        bbox: Array.isArray(p.bbox) ? p.bbox : [0,0,0,0],
        conf: p.species_conf,
        healthScore: p.health_score,
        mask_rle: p.mask_rle ?? null,
        species: p.species ? (

        typeof p.species === 'string'
            ? { label: p.species, score: 0 }
            : { label: String(p.species?.label ?? 'не определено'), score: Number(p.conf ?? 0) }
        ) : undefined,
        defects: byPlant[Number(p.id ?? 0)] ?? [],
        dry_branches_pct: typeof p.dry_ratio === 'number' ? Math.round(p.dry_ratio * 100) : undefined,
        severity_score: typeof p.severity_score === 'number'
            ? p.severity_score
            : (typeof p.health_score === 'number' ? (1 - (p.health_score / 100)) : undefined),
      }}) as Instance[];
}

export default function ReportDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      const rep = await getReport(String(id));

      if (!cancelled) setReport(rep);
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (!report) {
    return (
        <MainBackground>
          <View style={{ padding: 20 }}>
            <Text style={{ opacity: 0.7 }}>Загружаю отчёт…</Text>
          </View>
        </MainBackground>
    );
  }

  const payload: ServerResponse | any = report.payload;
  const instances: Instance[] = normalizeInstances(payload);
  const defectsTotal = instances.reduce((acc, it) => acc + (it.defects?.length || 0), 0);

  // Без useMemo: считаем синхронно — надёжно и быстро
  let ok = 0, med = 0, bad = 0;
  for (const it of instances) {
    const b = sevBucket(it.severity_score);
    if (b === 'ok') ok++;
    else if (b === 'med') med++;
    else if (b === 'bad') bad++;
  }

  return (
      <MainBackground>
        <Modal
            visible={isFullscreen}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={() => setIsFullscreen(false)}
        >
          <View style={styles.fullscreenOverlay}>
            <Image
                source={{ uri: report.imageFile }}
                style={styles.fullscreenImage}
                contentFit="contain"
            />
            <TouchableOpacity
                style={styles.closeButton}
                activeOpacity={0.8}
                onPress={() => setIsFullscreen(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          <View style={styles.imageWrapper}>
            <Image
                source={{ uri: report.imageFile }}
                style={styles.mainImage}
                contentFit="contain"
            />
            <TouchableOpacity
                style={styles.imageButton}
                activeOpacity={0.8}
                onPress={() => setIsFullscreen(true)}
            >
              <Text style={styles.imageButtonText}>⤢</Text>
            </TouchableOpacity>
          </View>
          <GlassContainer contentContainerStyle={styles.cardContainer}>
            <View style={{ gap: 6 }}>
              <Text>Отчёт: <Text style={styles.mono}>{payload.request_id}</Text></Text>
              <Text>Дата: {new Date(report.date).toLocaleString()}</Text>
              {
                //<Text>Время обработки: {Math.round((payload.time_ms ?? 0) / 1000)} c</Text>
                //<Text>Изображение: {payload.image?.width} × {payload.image?.height}</Text>
              }

            </View>

            <View style={styles.counters}>
              <View style={styles.scoreLabel}><Text style={styles.label}>Растения</Text><Text style={styles.num}>{instances.length}</Text></View>
              <View style={styles.scoreLabel}><Text style={styles.label}>Дефекты</Text><Text style={styles.num}>{defectsTotal}</Text></View>
              <View style={[styles.scoreLabel, styles.ok]}><Text style={[styles.label, styles.scoreText]}>Норм.</Text><Text style={[styles.num, styles.scoreText]}>{ok}</Text></View>
              <View style={[styles.scoreLabel, styles.warn]}><Text style={[styles.label, styles.scoreText]}>Сред.</Text><Text style={[styles.num, styles.scoreText]}>{med}</Text></View>
              <View style={[styles.scoreLabel, styles.bad]}><Text style={[styles.label, styles.scoreText]}>Плохо</Text><Text style={[styles.num, styles.scoreText]}>{bad}</Text></View>
            </View>

            <View style={styles.plants}>
              {instances.map((inst) => <PlantCard key={inst.id} inst={inst} />)}
            </View>

            {Array.isArray(payload.table) && payload.table.length > 0 && (
                <View style={{ marginTop: 8, gap: 6 }}>
                  <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 6 }}>Сводная таблица</Text>
                  {payload.table.map((row: any) => (
                      <View key={row.id} style={styles.defectRow}>
                        <Text style={{ width: 56 }}>#{row.id}</Text>
                        <Text style={{ flex: 1 }}>{row.kind}</Text>
                        <Text style={{ flex: 1.2 }}>{row.species}</Text>
                        <Text style={{ flex: 1.8 }}>{row.defects}</Text>
                        <Text style={{ width: 70, textAlign: 'right' }}>{Math.round(row.dry_branches_pct)}%</Text>
                        {!!row.notes && <Text style={{ flex: 1.2, textAlign: 'right' }}>{row.notes}</Text>}
                      </View>
                  ))}
                </View>
            )}
          </GlassContainer>
        </ScrollView>
      </MainBackground>
  );
}

const styles = StyleSheet.create({
  cardContainer: { alignItems: 'flex-start', gap: 12 },
  mono: { fontFamily: 'Courier' },
  counters: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  label: { opacity: 1 },
  num: { fontWeight: '700' },
  scoreLabel: { paddingHorizontal: 4, paddingVertical: 2, borderRadius: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  scoreText: { color: '#FFF' },
  ok: { backgroundColor: '#00c864' },
  warn: { backgroundColor: '#ffc200' },
  bad: { backgroundColor: '#ff3654' },
  plants: { gap: 12, width: '100%' },
  defectRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  imageWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    height: 240,
    marginTop: 80,
    marginBottom: 20
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageButton: {
    position: 'absolute',
    width: 40,
    height: 40,
    bottom: 12,     // отступ от нижнего края
    right: 12,      // отступ от правого края

    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtonText: {
    position: 'absolute',
    top: -15,

    color: '#fff',
    fontSize: 40,
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,       // отступ от верхнего края
    right: 20,     // отступ от правого края
    padding: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

});
