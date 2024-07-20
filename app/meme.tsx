import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Button,
  Linking,
  Dimensions,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const { width, height } = Dimensions.get("window");

type Meme = {
  type: "image" | "video";
  image: string;
  title: string;
  description: string;
  video?: string;
  height: number;
  padding: number;
};

export default function MemeScreen() {
  const [meme, setMeme] = useState<Meme | null>(null);

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const storedMeme = await AsyncStorage.getItem("@selectedMeme");
        if (storedMeme) {
          setMeme(JSON.parse(storedMeme));
        }
      } catch (error) {
        console.error("Failed to load meme data:", error);
      }
    };

    fetchMeme();
  }, []);

  const handleDownloadVideo = () => {
    if (meme && meme.video) {
      Linking.openURL(meme.video);
    }
  };

  const handleDownload = () => {
    if (meme && meme.image) {
      Linking.openURL(meme.image);
    }
  };

  if (!meme) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={{ paddingTop: 6, paddingBottom: 6 }} type="title">
          {meme.title}
        </ThemedText>
      </ThemedView>
      <ThemedText style={styles.description}>{meme.description}</ThemedText>
      {meme.type === "image" ? (
        <View style={styles.contentContainer}>
          <Image
            source={{ uri: meme.image }}
            style={[styles.media, { height: meme.height }]}
          />
          <View style={styles.controlsContainer}>
            <Button title="Download Image" onPress={handleDownload} />
          </View>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Video
            source={{ uri: `${meme.video}` }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={false}
            isLooping={false}
            useNativeControls
            style={styles.video}
          />
          <View style={styles.controlsContainer}>
            <Button title="Download Video" onPress={handleDownloadVideo} />
          </View>
        </View>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
  },
  description: {
    padding: 16,
  },
  media: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  controlsContainer: {
    padding: 10,
  },
  touchable: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: width,
    height: height / 3,
  },
});
