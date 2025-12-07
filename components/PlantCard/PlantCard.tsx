// components/PlantCard/PlantCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Instance } from '@/types/Report';
import GlassContainer from '@/ui/GlassContainer/GlassContainer';
import { ruDefectLabel } from '@/lib/defectLabels';

function sevGrade(severity?: number) {
  console.log('sev', severity);
  if (severity == null) return { tag: '—', tone: 'unknown' as const };
  if (severity < 34) return { tag: 'Плохо', tone: 'bad' as const };
  if (severity < 67) return { tag: 'Сред.', tone: 'warn' as const };
  return { tag: 'Норм.', tone: 'ok' as const };
}

export default function PlantCard({ inst }: { inst: Instance }) {

  const spec = inst?.species?.label || 'не определено';
  const specScore = inst.conf ?? null;
  const s = (inst.severity_score);
  const healthTag = sevGrade(inst.healthScore);

  console.log(inst.healthScore, healthTag);

  return (
      <GlassContainer contentContainerStyle={styles.card}>
        <View style={styles.header}>
          <Text style={styles.badge}>{inst.type === 'tree' ? 'дерево' : inst.type}</Text>
          <View style={[styles.pill, styles[healthTag.tone]]}>
            <Text style={[styles.pillText]}>{healthTag.tag}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.cell}>
            <Text style={styles.label}>Порода</Text>
            <Text style={styles.value}>{spec}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Уверенность</Text>
            <Text style={styles.value}>{specScore != null ? `${Math.round(specScore*100)}%` : '—'}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Сухие ветви</Text>
            <Text style={styles.value}>{inst.dry_branches_pct != null ? `${Math.round(inst.dry_branches_pct)}%` : '—'}</Text>
          </View>
          <View style={styles.cell}>
            <Text style={styles.label}>Дефекты</Text>
            <Text style={styles.value}>{inst.defects?.length ?? 0}</Text>
          </View>
        </View>

        {Array.isArray(inst.defects) && inst.defects.length > 0 && (
            <View style={{ marginTop: 8, gap: 4 }}>
              {inst.defects.map((d, i) => (
                  <Text key={i} style={styles.defect}>
                    • {d.label} ({Math.round(d.score * 100)}%)
                  </Text>
              ))}
            </View>
        )}
      </GlassContainer>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'flex-start', gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  badge: { backgroundColor: '#03C317', color: '#FFF', paddingHorizontal: 10, fontSize: 16, fontWeight: 'bold', borderRadius: 14, paddingVertical: 4,  opacity: 1, fontFamily: 'Courier' },
  pill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 14 },
  pillText: { color: '#fff', fontWeight: '600' },
  ok: { backgroundColor: '#00c864' },
  warn: { backgroundColor: '#ffc200' },
  bad: { backgroundColor: '#ff3654' },
  unknown: { backgroundColor: 'rgba(255,255,255,0.2)' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cell: { width: '46%' },
  label: { opacity: 0.7 },
  value: { fontWeight: '600' },
  defect: { opacity: 0.9 },
});
