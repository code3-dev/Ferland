import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  Button,
  Linking,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";

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

  const handleDownload = (url: string) => {
    Linking.openURL(url);
  };

  if (!meme) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.titleText} type="title">
          {meme.title}
        </ThemedText>
      </ThemedView>
      <ThemedText style={styles.description}>{meme.description}</ThemedText>
      <View style={styles.contentContainer}>
        {meme.type === "image" ? (
          <>
            <Image
              source={{ uri: meme.image }}
              style={[styles.media, { height: meme.height }]}
            />
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownload(meme.image)}
            >
              <Ionicons name="download-outline" size={24} color="white" />
              <ThemedText style={styles.buttonText}>Download Image</ThemedText>
            </TouchableOpacity>
          </>
        ) : (
          <>
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
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownload(`${meme.video}`)}
            >
              <Ionicons name="download-outline" size={24} color="white" />
              <ThemedText style={styles.buttonText}>Download Video</ThemedText>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    padding: 16,
    fontSize: 16,
  },
  media: {
    width: "100%",
    borderRadius: 6,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 18,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  video: {
    width: width - 32,
    height: height / 3,
    borderRadius: 8,
  },
});
