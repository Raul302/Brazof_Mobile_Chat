import { Slot } from "expo-router";
import FlashMessage from "react-native-flash-message";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <Slot /> 
            {/* FlashMessage debe ir aquí para estar disponible globalmente */}
          <FlashMessage position="top" />
        </SafeAreaView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}