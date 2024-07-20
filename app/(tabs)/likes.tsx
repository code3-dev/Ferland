import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const getImageUri = () => {
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 10000000);
  return `https://cataas.com/cat?${timestamp}-${randomNumber}`;
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

export default function LikedMemesScreen() {
  const [likedMemes, setLikedMemes] = useState<Meme[]>([]);
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    const fetchLikedMemes = async () => {
      try {
        const storedLikedMemes = await AsyncStorage.getItem("@likedMemes");
        if (storedLikedMemes) {
          setLikedMemes(JSON.parse(storedLikedMemes));
        }
      } catch (error) {
        console.error("Failed to load liked memes:", error);
      }
    };

    fetchLikedMemes();

    const intervalId = setInterval(fetchLikedMemes, 6000);

    return () => clearInterval(intervalId);
  }, []);

  const handleMemeClick = async (item: Meme) => {
    try {
      await AsyncStorage.setItem("@selectedMeme", JSON.stringify(item));
      router.push("/meme");
    } catch (error) {
      console.error("Failed to save meme data:", error);
    }
  };

  const handleRemoveLike = async (item: Meme) => {
    const updatedMemes = likedMemes.filter((meme) => meme.image !== item.image);
    setLikedMemes(updatedMemes);
    try {
      await AsyncStorage.setItem("@likedMemes", JSON.stringify(updatedMemes));
    } catch (error) {
      console.error("Failed to update liked memes:", error);
    }
  };

  const renderItem = ({ item }: { item: Meme }) => (
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
          <TouchableOpacity onPress={() => handleRemoveLike(item)}>
            <Ionicons
              name="heart"
              size={24}
              color={Colors[colorScheme ?? "light"].tint}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image source={{ uri: getImageUri() }} style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Liked Memes</ThemedText>
      </ThemedView>
      <FlatList
        data={likedMemes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
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
    flexDirection: "row",
    gap: 8,
    padding: 16,
    justifyContent: "center",
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
    justifyContent: "flex-end",
    padding: 6,
  },
});
