import {View, Text} from 'react-native'
import ReportPreview from "@/components/ReportPreview/ReportPreview";
import MainBackground from "@/ui/MainBackground/MainBackground";

export default function ReportScreen() {
    return (
        <MainBackground>
            <ReportPreview/>
            <ReportPreview/>
            <ReportPreview/>
            <ReportPreview/>

        </MainBackground>
    )
}