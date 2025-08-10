import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch, responseData } from '../contexts/apiClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [profile, setProfile] = useState(null);
	const [pulsera, setPulsera] = useState(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	async function loadProfile() {
		try {
			const response = await apiFetch('/api/usuarios/me');
			if (response.ok) {
				const data = await responseData(response);
				console.log('Perfil cargado:', data.nombre_completo);
				setProfile(data);
			}
		} catch (error) {
			console.error('Error cargando perfil:', error);
		} finally {
			setLoading(false);
		}
	}

	async function loadPulsera() {
		try {
			const response = await apiFetch('/api/usuarios/me/pulseras');
			if (response.ok) {
				const data = await responseData(response);
				console.log('Pulsera cargada:', data ? 'Sí' : 'No');
				setPulsera(data.length > 0 ? data[0] : null);
			}
		} catch (error) {
			console.error('Error cargando pulsera:', error);
		}
	}

	// Función para login: guarda tokens y carga perfil
	async function login(accessToken, refreshToken) {
		try {
			await AsyncStorage.setItem('access_token', accessToken);
			await AsyncStorage.setItem('refresh_token', refreshToken || '');
			await loadProfile();
			await loadPulsera();
			router.replace('/');
		} catch (error) {
			console.error('Error en login:', error);
		}
	}

	// Función para logout: limpia tokens y perfil
	async function logout() {
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
		loadPulsera();
	}, []);

	return (
		<AuthContext.Provider
			value={{ profile, pulsera, loading, loadPulsera, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
