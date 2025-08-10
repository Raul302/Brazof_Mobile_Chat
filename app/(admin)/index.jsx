import { useCallback, useEffect, useRef, useState } from 'react';
import {
	Alert,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { apiFetch, fetchData } from '../../contexts/apiClient';
import { useAuth } from '../../contexts/AuthContext';

export default function UsuariosScreen() {
	const { pulseras: pulserasContext, loadPulseras } = useAuth();
	const [usuarios, setUsuarios] = useState([]);
	const [pulseras, setPulseras] = useState([]);
	const [loading, setLoading] = useState(false);
	const [enlazandoId, setEnlazandoId] = useState(null);
	const lastPulserasRef = useRef([]);

	// Se reacciona a cambios en el contexto de pulseras (la pulsera del usuario actual)
	useEffect(() => {
		function stringify(arr) {
			return JSON.stringify(
				arr.map((p) => ({
					id: p.id_pulsera,
					uuid: p.uuid,
					id_usuario: p.id_usuario,
				})),
			);
		}

		const prev = stringify(lastPulserasRef.current);
		const next = stringify(pulserasContext);

		if (prev !== next) {
			lastPulserasRef.current = pulserasContext;
			cargarDatos();
		}
	}, [pulserasContext, cargarDatos]);

	useEffect(() => {
		cargarDatos();
		NfcManager.start()
			.then(() => console.log('NFC Manager started'))
			.catch((err) => console.warn('NFC start error', err));
	}, [cargarDatos]);

	const cargarDatos = useCallback(async () => {
		setLoading(true);
		try {
			const usuarios = await fetchData('/api/usuarios');
			console.log('Se cargaron usuarios:', usuarios.length);
			setUsuarios(usuarios);
			const pulseras = await fetchData('/api/pulseras');
			console.log('Se cargaron pulseras:', pulseras.length);
			setPulseras(pulseras);
			loadPulseras(); // Actualizar contexto de pulseras
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	}, [loadPulseras]);

	function formatUID(uid) {
		return (
			uid
				.toUpperCase()
				.match(/.{1,2}/g)
				?.join(' ') || ''
		);
	}

	async function leerPulsera(userId) {
		// Si ya estamos enlazando a este usuario => cancelar
		if (enlazandoId === userId) {
			try {
				await NfcManager.cancelTechnologyRequest();
			} catch {}
			setEnlazandoId(null);
			return;
		}

		// Si estamos enlazando a otro usuario => cancelar y cambiar el foco
		if (enlazandoId !== null && enlazandoId !== userId) {
			try {
				await NfcManager.cancelTechnologyRequest();
			} catch {}
		}

		setEnlazandoId(userId);
		console.log('Asociando pulsera al usuario ID:', userId);

		try {
			await NfcManager.cancelTechnologyRequest().catch(() => {}); // cerrar previas
			await NfcManager.requestTechnology(NfcTech.Ndef);

			const tag = await NfcManager.getTag();
			if (!tag || !tag.id) {
				Alert.alert('Error', 'No se pudo leer la pulsera NFC');
				setEnlazandoId(null);
				return;
			}
			const uid = formatUID(tag.id);

			const response = await apiFetch('/api/pulseras', {
				method: 'POST',
				body: { uuid: uid, id_usuario: userId },
			});

			if (!response.ok) {
				Alert.alert('No se pudo asociar la pulsera');
				setEnlazandoId(null);
				return;
			}

			Alert.alert('Pulsera asociada', `UID: ${uid}`);
			setEnlazandoId(null);
			cargarDatos();
		} catch (e) {
			console.warn('Error NFC:', e);
			setEnlazandoId(null);
		} finally {
			try {
				await NfcManager.cancelTechnologyRequest();
			} catch {}
		}
	}

	async function eliminarPulsera(userId) {
		const pulsera = pulseras.find((p) => p.id_usuario === userId);

		if (!pulsera) {
			Alert.alert(
				'Error',
				'No se encontró la pulsera asociada a este usuario',
			);
			return;
		}

		Alert.alert(
			'Confirmar',
			'¿Quieres eliminar la pulsera de este usuario?',
			[
				{ text: 'Cancelar', style: 'cancel' },
				{
					text: 'Eliminar',
					style: 'destructive',
					onPress: async () => {
						const response = await apiFetch(
							`/api/pulseras/${pulsera.id_pulsera}`,
							{ method: 'DELETE' },
						);
						if (!response.ok) {
							Alert.alert(
								'Error',
								'No se pudo eliminar la pulsera',
							);
							return;
						}
						cargarDatos();
					},
				},
			],
		);
	}

	function renderItem({ item }) {
		const isLinking = enlazandoId === item.id_usuario;
		const tienePulsera = pulseras.some(
			(p) => p.id_usuario === item.id_usuario,
		);
		return (
			<View style={styles.item}>
				<Text style={styles.name}>{item.nombre_completo}</Text>
				<Text style={styles.email}>{item.correo}</Text>

				{tienePulsera ? (
					<View>
						<Text style={styles.name}>Pulsera Asociada:</Text>
						<Text style={styles.email}>
							{pulseras.find(
								(p) => p.id_usuario === item.id_usuario,
							)?.uuid || 'Desconocida'}
						</Text>
						<TouchableOpacity
							style={[styles.btn, styles.deleteBtn]}
							onPress={() => eliminarPulsera(item.id_usuario)}
						>
							<Text style={styles.btnText}>Eliminar Pulsera</Text>
						</TouchableOpacity>
					</View>
				) : (
					<TouchableOpacity
						style={[
							styles.btn,
							isLinking ? styles.cancelBtn : styles.linkBtn,
						]}
						onPress={() => leerPulsera(item.id_usuario)}
					>
						<Text style={styles.btnText}>
							{isLinking ? 'Asociando...' : 'Asociar Pulsera'}
						</Text>
					</TouchableOpacity>
				)}
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: '#000', padding: 10 }}>
			<Text style={styles.title}>Usuarios Registrados</Text>
			<FlatList
				data={usuarios}
				contentContainerStyle={{ paddingBottom: 55 }}
				keyExtractor={(item) => item.id_usuario.toString()}
				renderItem={renderItem}
				refreshing={loading}
				onRefresh={cargarDatos}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	title: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	item: {
		backgroundColor: '#3b3b3bff',
		padding: 10,
		marginBottom: 8,
		borderRadius: 8,
	},
	name: { color: '#fff', fontSize: 16 },
	email: { color: '#aaa', fontSize: 14 },
	btn: { padding: 8, borderRadius: 5, marginTop: 5 },
	linkBtn: { backgroundColor: '#1FFF62' },
	cancelBtn: { backgroundColor: '#FFD700' },
	deleteBtn: { backgroundColor: '#ff4d4d' },
	btnText: { color: '#000', fontWeight: 'bold', textAlign: 'center' },
});
