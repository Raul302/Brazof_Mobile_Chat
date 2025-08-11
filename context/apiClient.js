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
	const token = await AsyncStorage.getItem('token');
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

/**
 * Extrae y asigna imágenes para una entidad (evento o publicidad)
 * @param {Object} entidad - El objeto entidad (evento o publicidad)
 * @param {string} tipoEntidad - 'evento' o 'publicidad'
 * @param {string} idField - Campo que contiene el ID ('id_evento' o 'id_publicidad')
 * @param {string} urlField - Campo donde asignar la URL ('image_url' o 'url')
 * @param {Object} fallbackConfig - Configuración para imagen de fallback
 * @returns {Promise<void>}
 */
export async function extraerImagenEntidad(
	entidad,
	tipoEntidad,
	idField,
	urlField,
	fallbackConfig,
) {
	const fallbackUrl = `https://picsum.photos/${fallbackConfig.width}/${fallbackConfig.height}?random=${entidad[idField]}`;

	try {
		const imagenes = await fetchData(
			`/api/imagenes?tipo_entidad=${tipoEntidad}&id_entidad=${entidad[idField]}`,
		);

		// Si hay imágenes, intentar usar la primera
		if (imagenes?.length > 0) {
			const imageUrl = `${authConfig.api_url}/api${imagenes[0].url}`;

			// Verificar que la imagen existe
			try {
				const response = await fetch(imageUrl);
				if (response.ok) {
					entidad[urlField] = imageUrl;
					return;
				}
			} catch {
				// Si falla la verificación, usar fallback
			}
		}
	} catch (error) {
		console.error(`Error extrayendo imagen para ${tipoEntidad}:`, error);
	}

	// Usar imagen de fallback en todos los casos de error o falta de imagen
	entidad[urlField] = fallbackUrl;
}

/**
 * Procesa múltiples entidades para extraer sus imágenes
 * @param {Array} entidades - Array de entidades
 * @param {string} tipoEntidad - 'evento' o 'publicidad'
 * @param {string} idField - Campo que contiene el ID
 * @param {string} urlField - Campo donde asignar la URL
 * @param {Object} fallbackConfig - Configuración para imagen de fallback
 * @returns {Promise<void>}
 */
export async function procesarImagenesEntidades(
	entidades,
	tipoEntidad,
	idField,
	urlField,
	fallbackConfig,
) {
	if (!entidades || entidades.length === 0) return;

	// Procesar todas las entidades en paralelo para mejor performance
	await Promise.all(
		entidades.map((entidad) =>
			extraerImagenEntidad(
				entidad,
				tipoEntidad,
				idField,
				urlField,
				fallbackConfig,
			),
		),
	);
}