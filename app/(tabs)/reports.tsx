import {useState, useEffect} from "react";
import {View, Text} from 'react-native'
import ReportsContainer from "@/components/ReportsContainer/ReportsContainer";
import MainBackground from "@/ui/MainBackground/MainBackground";

import {getAllReports} from "@/lib/storage/reports";
import type Report from "@/types/Report";

export default function ReportScreen() {
    const [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {
        getAllReports().then(reports => {

            setReports(reports)});
    }, []);
    console.log('im here');
    return (
        <MainBackground>
            <ReportsContainer reports={reports}/>

        </MainBackground>
    )
}