import AsyncStorage from '@react-native-async-storage/async-storage';
import { authConfig } from '../Constants/authConfig'; // o donde tengas esa config

export async function fetchData(endpoint, options = {}) {
	return responseData(await apiFetch(endpoint, options));
}

export async function responseData(response, options = { full: false }) {
	const json = await response.json();

	if (!response.ok) {
		return {
			ok: false,
			data: json,
			status: response.status,
			statusText: response.statusText,
		};
	}

	const data = options.full ? json : json.data;
	data.ok = true;
	return data;
}

export async function apiFetch(endpoint, options = {}) {
	const token = await AsyncStorage.getItem('access_token');
	const method = options.method?.toUpperCase() || 'GET';

	let url = `${authConfig.api_url}${endpoint}`;
	let headers = {
		Accept: 'application/json',
		...options.headers,
	};

	let config = { method, headers };

	// Solo mete el Authorization si hay token
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	// Si es GET y hay params, convertirlos en query string
	if (method === 'GET' && options.params) {
		const query = new URLSearchParams(options.params).toString();
		url += `?${query}`;
	}

	// Si es POST/PUT/PATCH y hay body, convertirlo a JSON
	if (['POST', 'PUT', 'PATCH'].includes(method) && options.body) {
		headers['Content-Type'] = 'application/json';
		config.body = JSON.stringify(options.body);
	}

	return fetch(url, config);
}
