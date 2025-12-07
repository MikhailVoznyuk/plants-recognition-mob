
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import GlassContainer from '@/ui/GlassContainer/GlassContainer';
import type { Report } from '@/types/Report';

export default function ReportPreview({ reportData }: { reportData: Report }) {
  const plants = reportData.payload?.plants ?? [];
  const defects = reportData.payload?.defects ?? [];
  const grades = plants.map(p => (p.health_grade || '').toLowerCase());
  const good = grades.filter(g => g === 'good').length;
  const med  = grades.filter(g => g === 'medium' || g === 'ok').length;
  const bad  = grades.filter(g => g === 'bad' || g === 'poor').length;

  return (
    <GlassContainer style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.head}>

        <Text style={styles.request}>Отчет: {(reportData.payload.request_id.slice(0,8) + ((reportData.payload.request_id.length > 8) ? '…' : ''))}</Text>
        <Text style={styles.status}>{reportData.payload.status}</Text>
        <Text style={styles.date}>{new Date(reportData.date).toLocaleString()}</Text>
      </View>
      <View style={styles.main}>
        <Image source={{ uri: reportData.imageFile }} style={styles.image} contentFit="cover" />
        <View style={styles.summary}>
          <View style={styles.row}><Text style={styles.label}>Обнар. растения:</Text><Text style={styles.value}>{plants.length}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Обнар. дефекты</Text><Text style={styles.value}>{defects.length}</Text></View>
          {
            /*
            <View style={styles.row}><Text style={[styles.label, styles.ok]}>good</Text><Text style={[styles.value, styles.ok]}>{good}</Text></View>
            <View style={styles.row}><Text style={[styles.label, styles.warn]}>medium</Text><Text style={[styles.value, styles.warn]}>{med}</Text></View>
            <View style={styles.row}><Text style={[styles.label, styles.bad]}>bad</Text><Text style={[styles.value, styles.bad]}>{bad}</Text></View>
             */
          }
        </View>
      </View>
      <Link href={{ pathname: '/reports/[id]', params: { id: reportData.id } }} style={styles.open}>Открыть</Link>
    </GlassContainer>
  );
}

const styles = StyleSheet.create({
  container: { width: '92%', justifyContent: 'flex-start' },
  contentContainer: { padding: 12, gap: 10, paddingBottom: 20 },
  head: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between' },
  status: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,  backgroundColor: 'rgba(0,200,100,0.18)' },
  request: { backgroundColor: '#03C317', color: '#FFF', paddingHorizontal: 8, fontSize: 16, fontWeight: 'bold', borderRadius: 14, paddingVertical: 4,  opacity: 1, fontFamily: 'Courier' },
  date: { opacity: 0.8 },
  main: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  image: { width: 160, height: 110, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  summary: { flex: 1, gap: 6, justifyContent: 'flex-start' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { opacity: 0.7 },
  value: { fontWeight: '700' },
  ok: { color: '#00c864' },
  warn: { color: '#ffc200' },
  bad: { color: '#ff3654' },
  open: { position: 'absolute', right: 12, bottom: 16, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: '#03C317', borderRadius: 20, color: '#fff', overflow: 'hidden' },
});
