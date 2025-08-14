import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Alert, Button, Platform, Text, View } from "react-native";

export default function PushTokenScreen() {
  const [expoPushToken, setExpoPushToken] = useState(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      console.log("Expo Push Token:", token);
      setExpoPushToken(token);
    });
  }, []);

  async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
      Alert.alert("Error", "Debes usar un dispositivo físico para Push Notifications");
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert("Permiso denegado", "No se pudieron obtener permisos de notificación");
      return null;
    }

    const { data } = await Notifications.getExpoPushTokenAsync({
      projectId: "9ee8c087-1fd2-4b70-aa56-f7e227c69f68", // <- reemplaza con tu projectId de Expo
    });

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return data;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>Expo Push Token:</Text>
      <Text selectable style={{ textAlign: "center" }}>
        {expoPushToken || "Cargando token..."}
      </Text>
      <Button
        title="Volver a intentar"
        onPress={() => {
          registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        }}
      />
    </View>
  );
}
