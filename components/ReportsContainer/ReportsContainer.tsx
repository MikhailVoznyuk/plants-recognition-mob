import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import ReportPreview from "@/components/ReportPreview/ReportPreview";

import type Report from "@/types/Report";

export default function ReportContainer({reports}: {reports: Report[]}) {
    const insets = useSafeAreaInsets();
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.reportsContainer, {paddingBottom: insets.bottom + 100}]}>
            {reports.map((report) => (
                <ReportPreview key={report.id}/>
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    reportsContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10
    }
})