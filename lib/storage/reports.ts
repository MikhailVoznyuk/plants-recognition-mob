import AsyncStorage from '@react-native-async-storage/async-storage';

import type Report from "@/types/Report";

export async function getAllReports(): Promise<Report[]> {
    try {
        const storageValue: string | null = await AsyncStorage.getItem('reports');
        let reports: Report[];
        if (storageValue) {
            reports = JSON.parse(storageValue);
        } else {
            reports = [];
        }
        return reports;
    }
    catch (error) {
        return [];
    }
}

export async function saveReport(report: Report): Promise<boolean> {
    const reports: Report[] = await getAllReports();
    reports.push(report);

    try {
        await AsyncStorage.setItem('reports', JSON.stringify(reports));
        return true;
    }
    catch (error) {
        return false;
    }
}
