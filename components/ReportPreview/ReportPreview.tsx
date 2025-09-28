import react from 'react';


import {Image, View, Text, StyleSheet} from 'react-native';

import GlassContainer from "@/ui/GlassContainer/GlassContainer";
import Button from "@/ui/Button/Button";

import type Report from "@/types/Report";

export default function ReportPreview(props: any) {
    return (
        <GlassContainer style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Отчет № 1</Text>
            </View>
            <View style={styles.content}>
                <Image style={styles.contentImage}  source={require('@/assets/images/background.jpg')} />
                <View style={styles.textContainer}>
                    <Text style={styles.contentText}>Дата: 27.09.2025 17.33</Text>
                    <Text style={styles.contentText}>Объектов на фото: 4</Text>
                </View>
            </View>
        </GlassContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 320,
        height: 140,
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    contentContainer: {
        position: "relative",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: 0,

    },
    header: {
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: '#03C317',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 20,
    },
    headerText: {
        color: "#FFF",
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
    },
    content: {
        width: 320,
        marginTop: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 0,
        paddingHorizontal: 10
    },
    textContainer: {

    }

})
