import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import { apiFetch, fetchData } from "../contexts/apiClient";
import { useAuth } from "../contexts/AuthContext";

export default function NFCIndex() {
  const navigation = useNavigation();
  const [scanning, set_scanning] = useState(false);
  const { profile, pulseras, loadPulseras } = useAuth();

  useEffect(() => {
    NfcManager.start()
      .then(() => console.log("NFC Manager started"))
      .catch(err => console.warn("NFC start error", err));
  }, []);

  const read_nfc = async () => {
    set_scanning(true);
    console.log("Requesting NFC tech...");

    try {
      await NfcManager.requestTechnology([NfcTech.Ndef, NfcTech.NfcA]);
      console.log("NFC tech acquired.");
      const tag = await NfcManager.getTag();

      if (!tag) {
        Alert.alert("No se encontró el tag NFC");
        return;
      }

      const uid = tag.id
        ? tag.id.toUpperCase().match(/.{1,2}/g).join(" ")
        : null;
      console.log("UID leído:", uid);

      if (!uid) throw new Error("No se pudo leer el UID");

      // Se busca la pulsera por UID
      const consulta = await fetchData(`/api/pulseras/uuid/${encodeURIComponent(uid)}`);
      console.log("Pulsera encontrada: ", consulta.ok ? "Sí" : "No");

      // Se comprueba si la pulsera ya está asociada al usuario
      const asociada = pulseras.some(p => p.uuid === uid);
      console.log("Pulsera asociada: ", asociada ? "Sí" : "No");

      // La pulsera no está asociada a ningún usuario y el usuario actual no tiene pulsera
      if (pulseras.length == 0 && !consulta.ok) {
        let response = await apiFetch('/api/pulseras', {
          method: 'POST',
          body: { uuid: uid, id_usuario: profile.id }
        });

        if (response.ok) {
          Alert.alert("Pulsera creada", "Pulsera asociada correctamente");
        }
        else {
          Alert.alert("Error", "No se pudo crear la pulsera");
        }
        return;
      }

      // La pulsera no está asociada a ningún usuario y el usuario actual tiene pulsera
      if (!consulta.ok && pulseras.length > 0) {
        Alert.alert(
          "Pulsera no asociada",
          "Esta pulsera no está asociada a ningún usuario. Por favor, contacta con el administrador."
        );
        return;
      }

      // 1) usuario conectado consulta sus eventos [2, 4] (ejemplo)
      // 2) por cada evento [2, 4], se listan los usuarios de dicho evento /usuarios/{evento_id}
      // 3) se encuentra el >>>evento_id<<< que contenga al usuario consulta.usuario.id
      // 4) si no se encuentra al usuario consulta.usuario.id, entonces no se abre nada

      // El usuario escaneó una pulsera de otro usuario, se crea un chat
      const nuevoChat = await fetchData("/api/chats/open-or-create", {
        method: "POST",
        body: {
          usuario_a: profile.id,
          usuario_b: consulta.usuario.id,
          evento_id: 1
        }
      });

      if (!nuevoChat.ok) {
        // Error de evento con if...
        Alert.alert("Error", "No se pudo crear el chat");
        return;
      }
      console.log("Chat creado:", nuevoChat);

      // Se navega al inbox y al chat
      navigation.navigate("inbox");
      navigation.navigate("chat", {
        chat: {
          id: nuevoChat.id_chat,
          name: consulta.usuario.nombre_completo,
          user_a: profile.id,
          user_b: consulta.usuario.id
        }
      });
    } catch (ex) {
      console.warn("NFC Scan failed", ex);
      Alert.alert("Scan Failed", ex?.message || "Unknown error");
    } finally {
      try {
        await NfcManager.cancelTechnologyRequest();
        set_scanning(false);
        loadPulseras();
        console.log("NFC tech released.");
      } catch (cancelEx) {
        console.warn(
          "Error cancelling NFC tech request",
          cancelEx
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.view_separator}>
        {scanning ? (
          <View style={styles.view_card}>
            <Text style={styles.text}>ESCANEANDO...</Text>
            <ActivityIndicator />
          </View>
        ) : (
          pulseras.length > 0 ? (
            <View style={styles.view_card}>
              <Text style={styles.text}>
                PULSERA ASOCIADA
              </Text>
              <Text style={styles.text}>
                TAG {pulseras[0].uuid}
              </Text>
              <Image
                source={require("../assets/images/central_nfc.png")}
                resizeMode="contain"
                style={{ width: 50, height: 50 }}
              />
            </View>
          ) : (
            <View style={styles.view_card}>
              <Text style={styles.text}>
                NO HAY PULSERA ASOCIADA
              </Text>
              <Image
                source={require("../assets/images/central_nfc_prohibited.png")}
                resizeMode="contain"
                style={{ width: 50, height: 50 }}
              />
            </View>
          )
        )}
      </View>

      <View style={styles.view_separator}>
        {scanning ? (
          <TouchableOpacity
            onPress={() => set_scanning(false)}
            style={{
              boxShadow: "0px 0px 5px 5px #1FFF62",
              backgroundColor: "#000000",
              width: 300,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 15
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: 600 }}>
              Detener
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={read_nfc}
            style={{
              boxShadow: "0px 0px 5px 5px #1FFF62",
              backgroundColor: "#000000",
              width: 300,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 15
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: 600 }}>
              Escanear
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    justifyContent: "center",
    textAlign: "center",
    color: "#ffffffff",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 3,
    marginBottom: 15,
    width: "100%"
  },
  view_card: {
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#1FFF62",
    width: "100%",
    padding: 30,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#1fff626b",
    boxShadow: "0px 0px 5px 5px #1FFF62"
  },
  view_separator: {
    marginTop: "15%",
    width: "75%",
    alignItems: "center"
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    width: "100%",
    height: "100%",
    paddingBottom: 100
  }
});
