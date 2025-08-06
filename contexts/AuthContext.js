import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, responseData } from "../contexts/apiClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadProfile = async () => {
    try {
      const response = await apiFetch('/auth/me');
      if (response.ok) {
        setProfile(await responseData(response));
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para login: guarda tokens y carga perfil
  const login = async (accessToken, refreshToken) => {
    try {
      await AsyncStorage.setItem('access_token', accessToken);
      await AsyncStorage.setItem('refresh_token', refreshToken || '');
      await loadProfile(); // carga perfil y actualiza estado
      router.replace('/');
    } catch (error) {
      console.error('Error en login:', error);
    }
  };

  // Función para logout: limpia tokens y perfil
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      setProfile(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error en logout:', error);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ profile, setProfile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
