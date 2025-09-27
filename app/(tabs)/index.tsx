import {useState} from "react";

import { Text, View, ScrollView, StyleSheet, ImageBackground } from "react-native";

import {useSafeAreaInsets} from "react-native-safe-area-context";

import ToggleBar from "@/components/toggleBar/ToggleBar";
import ImageProvider from "@/components/ImageProvider/ImageProvider";
import LoadedContainer from "@/components/LoadedContainer/LoadedContainer";

import MainBackground from "@/ui/MainBackground/MainBackground";
import Button from "@/ui/Button/Button";

import type PickedImage from "@/types/PickedImage";

export default function Index() {
    const [curTab, setCurTab] = useState<number>(0);
    const [images, setImages] = useState<PickedImage[]>([]);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const insets = useSafeAreaInsets();

    const submit = () => {
        setIsSubmitted(true);
    }

  return (

      <MainBackground>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.contentContainer, {paddingBottom: insets.bottom + 100}]}>
              <ToggleBar callback={setCurTab}></ToggleBar>
              <ImageProvider images={images} setImages={setImages} inputType={curTab}/>
              {(images.length > 0) ?
                  <LoadedContainer images={images} setImages={setImages}/>
                  : null
              }
              {(images.length > 0) ?
                  <Button style={styles.button} callback={submit}>
                      <Text style={styles.buttonText}>Начать анализ</Text>
                  </Button> :
                  null
              }
          </ScrollView>
      </MainBackground>

  );
}

const styles = StyleSheet.create({


    contentContainer: {
        position: "relative",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 16,
        paddingTop: 40,
        paddingHorizontal: 0,
        elevation: 1,
    },

    containerLg: {
        width: 320,
        height: 320,

    },


    text: {
        alignSelf: "center",
        fontSize: 22,
        textAlign: "center",
        flexGrow: 0,
        flexShrink: 0,
        color: '#515151',
        overflow: 'hidden',
    },
    button: {
        borderStyle: 'solid',
        borderColor: 'rgba(255, 255, 255, 0.7)',
        borderWidth: 2,
    },
    buttonText: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        color: '#fff'
    },
    content: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
