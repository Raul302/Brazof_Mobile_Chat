import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  // return <Stack />;

  return (
        <AuthProvider>

    <SafeAreaProvider>
      <SafeAreaView style={{ flex:1 }}>
    <Stack screenOptions={{ headerShown:false }} >
            <Stack.Screen name="(auth)/login" options={ { headerShown:false , title:'Login' } }></Stack.Screen>
            <Stack.Screen name="(tabs)" options={ { headerShown:false , title:'Tabs' } }></Stack.Screen>
            {/* <Stack.Screen name="../app/details/index.jsx" options={ { headerShown:false , title:'Details' } }></Stack.Screen> */}
    </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
        </AuthProvider>
  )
}
