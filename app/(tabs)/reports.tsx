import {useState} from "react";

import {View, Text} from 'react-native'
import ReportsContainer from "@/components/ReportsContainer/ReportsContainer";
import MainBackground from "@/ui/MainBackground/MainBackground";

import {getAllReports} from "@/lib/storage/reports";
import type Report from "@/types/Report";
import {useFocusEffect} from "expo-router";

export default function ReportScreen() {
    const [reports, setReports] = useState<Report[]>([]);

    useFocusEffect(() => {
        getAllReports().then(reports => {

            setReports(reports)});
    });
    console.log('im here');
    return (
        <MainBackground>
            <ReportsContainer reports={reports}/>

        </MainBackground>
    )
}