import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex:1 }}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown:false }} />
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
