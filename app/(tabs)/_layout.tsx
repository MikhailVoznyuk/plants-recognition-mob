import {useState, useRef} from 'react'

import {Tabs, TabList, TabTrigger, TabSlot} from 'expo-router/ui'
import { View, Text, Animated, Easing, StyleSheet } from 'react-native'
import {useSafeAreaInsets} from "react-native-safe-area-context";
import GlassContainer from "@/ui/GlassContainer/GlassContainer";

import {Ionicons} from "@expo/vector-icons";

const POS = [0, 112, 232]
const DUR = 400;
const INTERPOLATE = {
    inputRange: [0, 1],
    outputRange: ['#000', '#FFF'],
}

export default function Layout() {
    const [curTab, setCurTab] = useState<number>(0);

    const tAnim = useRef(new Animated.Value(POS[0])).current;
    const cAnimFst = useRef(new Animated.Value(1)).current;
    const cAnimSnd = useRef(new Animated.Value(0)).current;
    const cAnimThd = useRef(new Animated.Value(0)).current;

    const colorFst = cAnimFst.interpolate(INTERPOLATE);
    const colorSnd = cAnimSnd.interpolate(INTERPOLATE);
    const colorThd = cAnimThd.interpolate(INTERPOLATE);

    const insets = useSafeAreaInsets();
    const onClick = (ind: number) => {
        if (ind === curTab) return;
        go(ind);
        setCurTab(ind);
    }
    const go = (ind: number) => {

        Animated.parallel([
            Animated.timing(tAnim, {
                toValue: POS[ind],
                duration: DUR,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
            }),
            Animated.timing(cAnimFst, {
                toValue: +(ind === 0),
                duration: DUR,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
            }),
            Animated.timing(cAnimSnd, {
                toValue: +(ind === 1),
                duration: DUR,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
            }),
            Animated.timing(cAnimThd, {
                toValue: +(ind == 2),
                duration: DUR,
                easing: Easing.out(Easing.quad),
                useNativeDriver: false,
            }),
        ]).start();

    }

    return (
        <Tabs >
            <TabSlot />
            <TabList style={[styles.tabList, {bottom: insets.bottom + 10}]} asChild>
                <GlassContainer style={styles.tabsContainer} contentContainerStyle={styles.tabsRow}>
                    <Animated.View style={[styles.toggleBar, {left: tAnim}]}/>
                    <TabTrigger disabled={curTab === 0} onPress={() => onClick(0)} style={styles.tab} name='index'  href='/'>
                        <Animated.Text style={[styles.tabText, {color: colorFst}]}>Анализ</Animated.Text>
                    </TabTrigger>
                    <TabTrigger  disabled={curTab === 1} onPress={() => onClick(1)} style={styles.tab} name='reports' href='/reports'>
                        <Animated.Text style={[styles.tabText, {color: colorSnd}]}>Отчеты</Animated.Text>
                    </TabTrigger>
                    <TabTrigger  disabled={curTab === 2} onPress={() => onClick(2)} style={styles.tab} name='about'  href='/about'>
                        <Animated.Text style={[styles.tabText, {color: colorThd}]}>Инфо</Animated.Text>
                    </TabTrigger>

                </GlassContainer>


            </TabList>
        </Tabs>
    )
}

const styles = StyleSheet.create({
   tabList: {
       position: 'absolute',
       width: 320,
       alignSelf: 'center',
       marginHorizontal: 20,

   },
    tabsContainer: {
       borderRadius: 50,
    },
    tabsRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 0,
        paddingVertical: 0,
        paddingLeft: 10,

    },

    tabText: {
       alignSelf: 'center',
       fontSize: 22,

    },

    tab: {
       width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
    },
    toggleBar: {
       position: 'absolute',
        top: 0,
        height: '100%',
        width: 100,
        backgroundColor: '#03C317',
        borderRadius: 50,
    }
})