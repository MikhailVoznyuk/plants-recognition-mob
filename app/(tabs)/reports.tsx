import { useState, useCallback, useEffect } from 'react';
import { View, Text, DeviceEventEmitter } from 'react-native';
import { useFocusEffect } from 'expo-router';
import ReportsContainer from '@/components/ReportsContainer/ReportsContainer';
import MainBackground from '@/ui/MainBackground/MainBackground';
import { getAllReports } from '@/lib/storage/reports';
import type { Report } from '@/types/Report';
import { REPORTS_UPDATED_EVENT } from '@/lib/storage/reports';
import { clearReports } from '@/lib/storage/reports';

export default function ReportScreen() {
    const [reports, setReports] = useState<Report[]>([]);

    const load = useCallback(async () => {
        console.log('list of reports fst');
        const list = await getAllReports();
        console.log('list of reports', list);
        setReports(Array.isArray(list) ? list : []);
    }, []);

    // Подгружаем при первом фокусе/возврате на таб
    useFocusEffect(useCallback(() => {

        console.log('useFocusEffect is called');
        let active = true;
        getAllReports().then(r => {
            if (active) setReports(Array.isArray(r) ? r : []);
            console.log('reports', r)
        });
        return () => { active = false; };
    }, []));

    // Обновляем список сразу после сохранения из другого экрана
    useEffect(() => {
        const sub = DeviceEventEmitter.addListener(REPORTS_UPDATED_EVENT, load);
        return () => { sub.remove(); };
    }, [load]);

    return (
        <MainBackground>
            <ReportsContainer reports={reports} />
            {reports.length === 0 && (
                <View style={{ padding: 16 }}>
                    <Text style={{ opacity: 0.7 }}>Отчётов пока нет</Text>
                </View>
            )}
        </MainBackground>
    );
}
