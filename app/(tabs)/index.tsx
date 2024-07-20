import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import Constants from "expo-constants";

const getImageUri = () => {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 10000000);
  return `https://cataas.com/cat?${timestamp}-${randomNumber}`;
};

const getMemeUri = (page: number) => {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 10000000);
  const nuxtApiUrl = Constants?.expoConfig?.extra?.apiUrl;
  const baseURL = `${nuxtApiUrl}/api/memes?page=${page}&${timestamp}-${randomNumber}`;
  return `https://api.allorigins.win/get?url=${encodeURIComponent(baseURL)}`;
};

type Meme = {
  type: "image" | "video";
  image: string;
  title: string;
  description: string;
  video?: string;
  height: number;
  padding: number;
};

type LikedMeme = Meme & {
  likedAt: string;
};

export default function HomeScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [likedMemes, setLikedMemes] = useState<LikedMeme[]>([]);
  const [showLoadMore, setShowLoadMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const retryLimit = 5;
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    const fetchMemes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(getMemeUri(currentPage));
        const parseData = JSON.parse(response.data.contents);
        const { memes: newMemes } = parseData.body;
        const updatedMemes = [
          ...memes,
          ...newMemes.map((meme: Meme) => ({
            type: meme.type,
            image: meme.image,
            title: meme.title,
            description: meme.description,
            video: meme.video || "",
            height: meme.height || 300,
            padding: meme.padding || 12,
          })),
        ];

        setMemes(updatedMemes);
        setTotalPages(parseData.totalPages);
        setShowLoadMore(currentPage < parseData.totalPages);
      } catch (error) {
        console.error("Failed to fetch memes:", error);
        if (retryCount < retryLimit) {
          setShowLoadMore(false);
          setRetryCount(retryCount + 1);
          setTimeout(fetchMemes, 5000);
        } else {
          console.error("Reached maximum retry limit");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchLikedMemes = async () => {
      try {
        const storedLikedMemes = await AsyncStorage.getItem("@likedMemes");
        if (storedLikedMemes) {
          setLikedMemes(JSON.parse(storedLikedMemes));
        } else {
          setLikedMemes([]);
        }
      } catch (error) {
        console.error("Failed to load liked memes:", error);
      }
    };

    fetchMemes();
    fetchLikedMemes();
    const intervalId = setInterval(fetchLikedMemes, 6000);

    return () => clearInterval(intervalId);
  }, [currentPage]);

  const handleDownload = (item: Meme) => {
    const url = item.type === "image" ? item.image : item.video;
    if (url) {
      Linking.openURL(url);
    }
  };

  const handleMemeClick = async (item: Meme) => {
    try {
      await AsyncStorage.setItem("@selectedMeme", JSON.stringify(item));
      router.push("/meme");
    } catch (error) {
      console.error("Failed to save meme data:", error);
    }
  };

  const handleLikeMeme = async (item: Meme) => {
    try {
      const timestamp = new Date().toISOString();
      let updatedLikedMemes: LikedMeme[];
      if (likedMemes.some((likedMeme) => likedMeme.image === item.image)) {
        updatedLikedMemes = likedMemes.filter(
          (likedMeme) => likedMeme.image !== item.image
        );
      } else {
        updatedLikedMemes = [...likedMemes, { ...item, likedAt: timestamp }];
      }

      setLikedMemes(updatedLikedMemes);
      await AsyncStorage.setItem(
        "@likedMemes",
        JSON.stringify(updatedLikedMemes)
      );
    } catch (error) {
      console.error("Failed to update liked memes:", error);
    }
  };

  const renderItem = ({ item }: { item: Meme }) => {
    const isLiked = likedMemes.some(
      (likedMeme) => likedMeme.image === item.image
    );

    return (
      <TouchableOpacity onPress={() => handleMemeClick(item)}>
        <View style={[styles.card, { padding: item.padding }]}>
          <Image
            source={{ uri: item.image }}
            style={[styles.image, { height: item.height }]}
          />
          <ThemedText style={{ padding: 6 }} type="title">
            {item.title}
          </ThemedText>
          <ThemedText style={styles.description}>{item.description}</ThemedText>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => handleLikeMeme(item)}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={24}
                color={Colors[colorScheme ?? "light"].tint}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDownload(item)}>
              <Ionicons
                name="download-outline"
                size={24}
                color={Colors[colorScheme ?? "light"].tint}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image source={{ uri: getImageUri() }} style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hello!</ThemedText>
        <HelloWave />
      </ThemedView>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors[colorScheme ?? "light"].tint}
        />
      ) : (
        <FlatList
          data={memes}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
        />
      )}
      {showLoadMore && !loading && (
        <TouchableOpacity
          onPress={handleLoadMore}
          style={styles.loadMoreButton}
        >
          <Text style={styles.loadMoreButtonText}>Load More</Text>
        </TouchableOpacity>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  card: {
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  image: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 8,
  },
  description: {
    marginBottom: 8,
    padding: 6,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 6,
  },
  loadMoreButton: {
    alignSelf: "center",
    marginVertical: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#007BFF",
  },
  loadMoreButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
