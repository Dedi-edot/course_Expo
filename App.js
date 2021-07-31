import Axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
    };
  },
});

export default function App() {
  const [expoToken, setExpoToken] = useState("");
  const notifyMeBtnHandler = () => {
    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "The First Notification",
    //     body: "Assalamualaikum",
    //   },
    //   trigger: {
    //     seconds: 5,
    //   },
    // });

    // Push Notifications
    const EXPO_URL = "https://exp.host/--/api/v2/push/send";
    Axios.post(
      EXPO_URL,
      {
        to: expoToken, //expo push token
        title: "Salam",
        body: "Assalamualaikum",
      },
      {
        headers: {
          Accept: "Application/json",
          "Accept-Encoding": "gzip, deflate",
          "Content-Type": "Application/json",
        },
      }
    )
      .then(() => {
        console.log("Notif Sent");
      })
      .catch(() => {
        console.log("error");
      });
  };

  // Get Permissions
  useEffect(() => {
    Permissions.getAsync(Permissions.NOTIFICATIONS)
      .then((permObj) => {
        if (permObj.status !== "granted") {
          return Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        return permObj;
      })
      .then((permObj) => {
        if (permObj.status !== "granted") {
          throw new Error("No Notifications Permission");
        }
      })
      .then(() => {
        return Notifications.getExpoPushTokenAsync();
      })
      .then((responsePushToken) => {
        console.log(responsePushToken);
        setExpoToken(responsePushToken.data);
      })
      .catch();
  }, []);

  // Set Notifications Listener
  useEffect(() => {
    const subNotifForeground = Notifications.addNotificationReceivedListener(
      (notifData) => {
        return console.log("Foreground", notifData);
      }
    );

    const subNotifBackground =
      Notifications.addNotificationResponseReceivedListener((res) => {
        return console.log("Background", res);
      });

    return () => {
      subNotifForeground.remove();
      subNotifBackground.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={notifyMeBtnHandler}>
        <Text>Notify Me</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
