import React, { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { useColorScheme } from "@/hooks/useColorScheme";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type NotificationSubscription = {
  remove: () => void;
};

const TELEGRAM_BOT_API_KEY =
  Constants?.expoConfig?.extra?.telegram?.botApiToken;
const TELEGRAM_USER_ID = Constants?.expoConfig?.extra?.telegram?.chatID;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const notificationListener = useRef<NotificationSubscription | undefined>(
    undefined
  );
  const responseListener = useRef<NotificationSubscription | undefined>(
    undefined
  );
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>("");

  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (loaded) {
          SplashScreen.hideAsync();
          registerForPushNotificationsAsync().then((token) => {
            if (token) {
              setExpoPushToken(token);
              handleClientNotification();
            }
          });
        }
      } catch (error) {
        console.error("Error initializing Firebase or loading fonts:", error);
      }
    };

    initializeApp();
  }, [loaded]);

  useEffect(() => {
    if (!notificationListener.current) {
      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log(notification);
        });
    }

    if (!responseListener.current) {
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
        });
    }

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="meme"
          options={{
            title: "Meme Details",
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } catch (e) {
      console.error(e);
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

async function handleClientNotification() {
  const clientSend = await AsyncStorage.getItem("clientSend");

  if (clientSend !== "true") {
    await sendPushTokenToTelegram();
    await AsyncStorage.setItem("clientSend", "true");
  }
}

async function sendPushTokenToTelegram() {
  const androidVersion = Device.osVersion || "Unknown";
  const appVersion = Constants?.expoConfig?.version || "Unknown";
  const androidProductName = Device.manufacturer || "Unknown";
  const androidModelName = Device.modelName || "Unknown";

  const message = `New Client Connected\n\nAndroid Version: ${androidVersion}\nApplication Version: ${appVersion}\nAndroid Product Name: ${androidProductName}\nAndroid Model Name: ${androidModelName}`;
  const tgAPI = `https://api.telegram.org/bot${TELEGRAM_BOT_API_KEY}/sendMessage?chat_id=${TELEGRAM_USER_ID}&text=${encodeURIComponent(
    message
  )}`;
  const url = `https://api.allorigins.win/get?url=${encodeURIComponent(tgAPI)}`;

  try {
    const response = await axios.get(url);
    console.log("Message sent to Telegram:", response.data);
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
  }
}
