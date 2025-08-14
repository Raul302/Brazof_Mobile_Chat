import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import io from 'socket.io-client';

// Cambia esto por la IP o dominio de tu servidor WebSocket
const SOCKET_URL = 'http://138.68.43.245:3000/';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del almacenamiento al iniciar la app
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUser = await AsyncStorage.getItem('user');

        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error loading from storage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  // Establecer conexión WebSocket cuando el usuario esté logueado
  useEffect(() => {
    if (!user?.id_usuario) return;

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ WebSocket conectado');

      // Registrarse en la sala del usuario
      newSocket.emit('register_user', user.id_usuario);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 WebSocket desconectado');
    });

    newSocket.on('connect_error', (err) => {
  console.log('Error de conexión socket:', err.message);
});


    newSocket.on('cambios_eventos', (mensaje) => {
      console.log('📨 Mensaje recibido global:', mensaje);
        Alert.alert('Hubo cambios en eventos');

      // Aquí podrías mostrar una notificación local, badge, etc.
    });

    newSocket.on('nuevo_mensaje', (mensaje) => {
      console.log('📨 Mensaje recibido global:', mensaje);
        Alert.alert('Nuevos mensajes');

      // Aquí podrías mostrar una notificación local, badge, etc.
    });


    // return () => {
    //   newSocket.disconnect();
    // };


  }, [user?.id_usuario]);

  // Iniciar sesión y guardar en storage
  const login = async (tokenValue, userData) => {
    try {
      setToken(tokenValue);
      setUser(userData);

      await AsyncStorage.setItem('token', tokenValue);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  // Cerrar sesión y limpiar datos
  const logout = async () => {
    try {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');

      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, socket, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
