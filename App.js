import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
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
  const notifyMeBtnHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "The First Notification",
        body: "Assalamualaikum",
      },
      trigger: {
        seconds: 5,
      },
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
          return permObj;
        }
      })
      .catch(() => {
        console.log("error");
      });
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
