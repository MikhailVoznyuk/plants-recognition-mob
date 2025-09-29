import {useState, useEffect, useMemo} from 'react';
import {ScrollView, View, Text, StyleSheet} from "react-native";
import {Image} from 'expo-image'
import {useLocalSearchParams} from "expo-router";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import MainBackground from "@/ui/MainBackground/MainBackground";
import BlurLayer from "@/ui/BlurContainer/BlurLayer";
import SectionLabel from "@/ui/SectionLabel/SectionLabel";
import {getReport} from "@/lib/storage/reports";
import type Report from "@/types/Report";

import ReportObjectBlock from "@/components/ReportObjectBlock/ReportObjectBlock";


export default function ReportScreen({}) {
    const [report, setReport] = useState<Report | null>(null);
    const params = useLocalSearchParams();
    const reportId: string = Array.isArray(params.id) ? params.id[0] : params.id;
    const insets = useSafeAreaInsets();

    useEffect(() => {
        getReport(reportId).then(res => {
            setReport(res)
        });
    }, []);

    return (
        <MainBackground>
            <BlurLayer />
            <ScrollView  showsVerticalScrollIndicator={false} style={[{alignSelf: 'flex-start', width: '100%'}]} contentContainerStyle={[styles.scrollContainer, {paddingTop: insets.top + 60, paddingBottom: insets.bottom + 30}]}>
                <SectionLabel text={`Отчет от ${report?.date}`}/>
                <View style={styles.contentSection}>
                    <View>
                        <Image style={styles.reportImage} source={report?.imageFile}/>
                    </View>

                </View>
                <SectionLabel text={'Обнаруженные объекты'}/>
                <View style={[styles.contentSection, styles.centerContainer]}>
                    {report?.objects?.map((obj, index) => (
                        <ReportObjectBlock key={index} data={obj} id={index + 1}/>
                    ))}
                </View>
            </ScrollView>
        </MainBackground>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        position: 'relative',
        flex: 0,
        width: "100%",

        gap: 30,
    },
    contentSection: {
        marginVertical: 30,
        paddingHorizontal: 10,
        gap: 14
    },
    centerContainer: {
        alignItems: "center",
    },
    reportImage: {
        alignSelf: 'center',
        width: 320,
        height: 200,
        borderRadius: 20,
    }
})