import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, responseData } from "../contexts/apiClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [pulseras, setPulseras] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadProfile = async () => {
    try {
      const response = await apiFetch('/api/usuarios/me');
      if (response.ok) {
        const data = await responseData(response);
        console.log('Perfil cargado:', data.nombre_completo);
        setProfile(data);
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPulseras = async () => {
    try {
      const response = await apiFetch('/api/usuarios/me/pulseras');
      if (response.ok) {
        const data = await responseData(response);
        console.log('Pulseras cargadas:', data.length);
        setPulseras(data);
      }
    } catch (error) {
      console.error("Error cargando pulseras:", error);
    }
  };

  // Función para login: guarda tokens y carga perfil
  const login = async (accessToken, refreshToken) => {
    try {
      await AsyncStorage.setItem('access_token', accessToken);
      await AsyncStorage.setItem('refresh_token', refreshToken || '');
      await loadProfile();
      await loadPulseras();
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
    loadPulseras();
  }, []);

  return (
    <AuthContext.Provider value={{ profile, pulseras, loading, loadPulseras, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
