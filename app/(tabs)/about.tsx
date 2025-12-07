// app/(tabs)/about.tsx
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import GlassContainer from '@/ui/GlassContainer/GlassContainer';
import MainBackground from "@/ui/MainBackground/MainBackground";

export default function AboutPage() {
    return (
        <MainBackground>
            <ScrollView contentContainerStyle={styles.containerFluid}>
                <Text style={styles.sectionTitle}>Инструкция по работе с приложением</Text>

                <GlassContainer style={styles.container} contentContainerStyle={styles.inner}>
                    <Text>
                        1. Зайдите во вкладку «Анализ». Нажмите «Выбрать изображение» и укажите фото из галереи
                        (или сделайте снимок камерой). При необходимости можно выбрать несколько изображений.
                    </Text>
                </GlassContainer>

                <GlassContainer style={styles.container} contentContainerStyle={styles.inner}>
                    <Text>
                        2. Выбранные изображения отобразятся в списке. Проверьте набор и удалите лишние файлы,
                        нажав «Удалить».
                    </Text>
                </GlassContainer>

                <GlassContainer style={styles.container} contentContainerStyle={styles.inner}>
                    <Text>
                        3. Нажмите «Начать обработку» и дождитесь завершения. Отчёты по каждому изображению
                        находятся во вкладке «Отчёты». Нажмите «Подробнее», чтобы открыть конкретный отчёт.
                    </Text>
                </GlassContainer>

                <GlassContainer style={styles.container} contentContainerStyle={styles.inner}>
                    <Text>
                        4. В отчёте показано изображение с выделенными найденными деревьями и кустарниками.
                        Ниже представлены основные показатели жизнеспособности для каждого объекта. Нажмите
                        «Подробнее», чтобы открыть развёрнутую информацию по выбранному дереву или кусту.
                    </Text>
                </GlassContainer>
            </ScrollView>
        </MainBackground>

    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        margin: 0,
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#03C317',
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '400',
        borderRadius: 20,
        alignSelf: 'center',
    },
    containerFluid: {
        width: '100%',
        flexDirection: 'column',
        gap: 20,
        alignItems: 'center',
        paddingBottom: 40,
        paddingTop: 40,
    },
    container: {
        borderRadius: 20,
        width: '92%',
        maxWidth: 340,
        alignSelf: 'center',
    },
    inner: {
        padding: 16,
        gap: 6,
    },
});
