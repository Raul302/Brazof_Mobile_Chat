import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { createContext, useEffect, useState } from 'react';



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const router = useRouter();

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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



  const logout = async () => {
    try {
      setToken(null);
      setUser(null);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');


    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
