import react from 'react';

import {Image} from 'expo-image';
import {View, Text} from 'react-native';

import GlassContainer from "@/ui/GlassContainer/GlassContainer";
import Button from "@/ui/Button/Button";

import type {ReportObject} from "@/types/Report";

export default function ReportPreview(props: any) {
    return (
        <GlassContainer>
            <View style={styles.header}>
                <Text>Отчет № 1</Text>
            </View>
            <View style={styles.content}>
                <Image style={styles.contentImage} source={require('@/assets/images/background.jpg')} />
                <View style={styles.textContainer}>
                    <Text style={styles.contentText}>Дата: 27.09.2025 17.33</Text>
                    <Text style={styles.contentText}>Объектов на фото: 4</Text>
                </View>
            </View>
        </GlassContainer>
    )
}

const styles = {
    container: {
        position: "relative",
        width: 320,
        height: 140,
        borderRadius: 20,
    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: '#03C317',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 20,
    },
    headerText: {
        color: "#fff",
        fontSize: 18,
    },
    contentImage: {
        width: 112,
        height: 70,
        borderRadius: 10
    },
    contentText: {
        width: 174,
        justifyContent: 'flex-start',
    }

}
