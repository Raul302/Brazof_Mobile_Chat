import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileIndex() {
  const { profile, pulseras, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#1FFA60" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.emptyText}>No hay datos de usuario</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.profileContainer}>
        <Text style={styles.title}>Perfil</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{profile.nombre_completo}</Text>

          <Text style={styles.label}>Correo:</Text>
          <Text style={styles.value}>{profile.email}</Text>

          <Text style={styles.label}>Rol:</Text>
          <Text style={styles.value}>{profile.rol}</Text>

          <Text style={styles.label}>Verificado:</Text>
          <Text style={styles.value}>{profile.verificado ? "Sí" : "No"}</Text>

          <Text style={styles.label}>Pulsera:</Text>
          <Text style={styles.value}>
            {pulseras?.length === 1 ? `TAG(${pulseras[0].id_pulsera}) ${pulseras[0]?.uuid}` : "Sin TAG asociado"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 20
  },
  profileContainer: {
    paddingHorizontal: 20,
    paddingTop: 10
  },
  title: {
    color: "#1FFA60",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20
  },
  infoBox: {
    backgroundColor: "#3b3b3bff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20
  },
  label: {
    fontWeight: "bold",
    color: "#1FFA60",
    marginTop: 10
  },
  value: {
    color: "#E0E0E0",
    marginBottom: 5
  },
  logoutBtn: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center"
  },
  logoutText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
    flexShrink: 1,
  },
  emptyText: {
    color: "#AAA",
    textAlign: "center",
    marginTop: 40
  }
});
