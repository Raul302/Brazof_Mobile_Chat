import AsyncStorage from '@react-native-async-storage/async-storage';
import { authConfig } from '../Constants/authConfig'; // o donde tengas esa config

export async function responseData(response) {
  const json = await response.json();
  return json.data;
}

export async function apiFetch(endpoint, options = {}) {
  const token = await AsyncStorage.getItem('access_token');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  return fetch(`${authConfig.api_server}${endpoint}`, config);
}

export async function oauthFetch(endpoint, options = {}) {
  const token = await AsyncStorage.getItem('access_token');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  return fetch(`${authConfig.oauth_server}${endpoint}`, config);
}

export async function apiNegocioFetch(endpoint, options = {}) {
  const token = await AsyncStorage.getItem('access_token');

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  return fetch(`${authConfig.api_negocio_server}${endpoint}`, config);
}