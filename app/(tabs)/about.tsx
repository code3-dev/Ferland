import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Icon } from "react-native-elements";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import * as Linking from "expo-linking";
import Constants from "expo-constants";

export default function AboutScreen() {
  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  const appName = Constants?.expoConfig?.name;
  const appVersion = Constants?.expoConfig?.version;
  const appPackage = Constants?.expoConfig?.android?.package;
  const username = Constants?.expoConfig?.extra?.telegram?.username;

  return (
    <ParallaxScrollView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ paddingTop: 25 }}>
          About {appName} <ThemedText>v{appVersion}</ThemedText>
        </ThemedText>
      </ThemedView>
      <ThemedText style={{ textAlign: "center", padding: 16 }}>
        Welcome to {appName}, the ultimate open-source meme application! With
        {appName}, you can easily view and download the latest and most popular
        memes in both video and image formats. Whether you want to laugh, share,
        or simply enjoy the creativity of the meme community, {appName} provides a
        seamless and enjoyable experience. Explore, discover, and save your
        favorite memes all in one place. Join the fun and start your meme
        journey with {appName} today!
      </ThemedText>
      <View style={styles.buttonContainer}>
        <Button
          title="Rate App on Myket"
          icon={
            <Icon
              name="android"
              type="font-awosome"
              color="#fff"
              containerStyle={styles.iconStyle}
            />
          }
          buttonStyle={styles.button}
          onPress={() => openURL(`https://myket.ir/app/${appPackage}`)}
        />
        <Button
          title="Contact to Developer"
          icon={
            <Icon
              name="telegram"
              type="font-awesome"
              color="#fff"
              containerStyle={styles.iconStyle}
            />
          }
          buttonStyle={styles.button}
          onPress={() => openURL(`https://t.me/${username}`)}
        />
        <Button
          title="Open Source Code"
          icon={
            <Icon
              name="github"
              type="font-awesome"
              color="#fff"
              containerStyle={styles.iconStyle}
            />
          }
          buttonStyle={styles.button}
          onPress={() => openURL("https://github.com/code3-dev/Ferland")}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 200,
    backgroundColor: "#6200ee",
    marginBottom: 10,
  },
  iconStyle: {
    marginRight: 10,
  },
});
