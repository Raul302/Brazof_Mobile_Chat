import { useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	Alert,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { apiFetch, fetchData } from '../contexts/apiClient';

export default function ChatScreen() {
	const route = useRoute();
	const { chat } = route.params; // viene de Inbox
	const { profile } = useAuth();
	const flatListRef = useRef(null);
	const lastMessageId = useRef(null);

	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');

	// Cargar mensajes
	const cargarMensajes = useCallback(async () => {
		try {
			const msgs = await fetchData(
				`/api/mensajes/chat/${chat.id}?chat_id=${chat.id}`,
			);
			if (!msgs.ok) {
				console.log(
					'No se pudieron cargar los mensajes del chat:',
					msgs.data.message,
				);
				return;
			}

			// Adaptar formato
			const adaptados = msgs.map((m) => ({
				id: m.id_mensaje,
				text: m.contenido,
				sender: m.id_remitente === profile.id ? 'sent' : 'received',
				id_remitente: m.id_remitente,
				id_destinatario: m.id_destinatario,
			}));

			setMessages(adaptados);
		} catch (err) {
			console.error('Error cargando mensajes de chat', err);
		}
	}, [chat.id, profile.id]);

	// Auto-scroll al final cuando llegan mensajes nuevos
	useEffect(() => {
		const lastMsg = messages[messages.length - 1];
		if (lastMsg?.id !== lastMessageId.current) {
			lastMessageId.current = lastMsg?.id;
			if (flatListRef.current) {
				flatListRef.current.scrollToEnd({ animated: true });
			}
		}
	}, [messages]);

	// Refrescar cada 2 segundos
	useEffect(() => {
		cargarMensajes();
		const interval = setInterval(cargarMensajes, 2000);
		return () => clearInterval(interval);
	}, [cargarMensajes]);

	// Enviar mensaje
	async function handleSend() {
		if (!newMessage.trim() || !chat.user_b) return;

		// swap user_a and user_b if needed
		const user_a = chat.user_a === profile.id ? chat.user_a : chat.user_b;
		const user_b = chat.user_a === profile.id ? chat.user_b : chat.user_a;

		try {
			const res = await fetchData(`/api/mensajes`, {
				method: 'POST',
				body: {
					id_remitente: user_a,
					id_destinatario: user_b,
					contenido: newMessage,
					chat_id: chat.id,
				},
			});

			if (!res.ok) {
				Alert.alert('Error', 'No se pudo enviar el mensaje');
				console.log('Error enviando mensaje: ', res.data.message);
				return;
			}

			// Añadir localmente
			setMessages((prev) => [
				...prev,
				{ id: res.id_mensaje, text: newMessage, sender: 'sent' },
			]);

			console.log('Mensaje enviado:', newMessage);
			setNewMessage('');
		} catch (err) {
			console.error('Error enviando mensaje', err);
		}
	}

	// Eliminar mensaje
	async function handleDelete(id) {
		Alert.alert(
			'Eliminar mensaje',
			'¿Seguro que quieres eliminar este mensaje?',
			[
				{
					text: 'Cancelar',
					style: 'cancel',
				},
				{
					text: 'Eliminar',
					style: 'destructive',
					onPress: async () => {
						try {
							const res = await apiFetch(`/api/mensajes/${id}`, {
								method: 'DELETE',
							});
							if (!res.ok) {
								Alert.alert(
									'Error',
									'No se pudo eliminar el mensaje',
								);
								console.error(
									'Error eliminando mensaje:',
									res.data.message,
								);
								return;
							}
							setMessages((prev) =>
								prev.filter((m) => m.id !== id),
							);
							console.log(`Mensaje ${id} eliminado`);
						} catch (err) {
							console.error('Error eliminando mensaje', err);
						}
					},
				},
			],
		);
	}

	// Render de cada mensaje
	function renderItem({ item }) {
		return (
			<TouchableOpacity
				onLongPress={() => handleDelete(item.id)} // ← Mantener presionado para borrar
				activeOpacity={0.7}
			>
				<View
					style={[
						styles.messageBubble,
						item.sender === 'sent'
							? styles.sentBubble
							: styles.receivedBubble,
					]}
				>
					<Text
						style={{
							color: item.sender === 'sent' ? '#444' : '#333',
						}}
					>
						{item.text}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			<KeyboardAvoidingView
				style={styles.mainContainer}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={100}
			>
				<View style={styles.chatContainer}>
					<Text style={styles.title}>{chat.name}</Text>

					<FlatList
						data={messages}
						ref={flatListRef}
						renderItem={renderItem}
						keyExtractor={(item) => item.id.toString()}
						contentContainerStyle={styles.messagesContainer}
					/>

					<View style={styles.inputArea}>
						<TextInput
							style={styles.input}
							value={newMessage}
							onChangeText={setNewMessage}
							placeholder="Escribe un mensaje..."
							onSubmitEditing={handleSend}
						/>
						<TouchableOpacity
							style={styles.sendButton}
							onPress={handleSend}
							activeOpacity={0.7}
						>
							<Text
								style={{ color: 'black', fontWeight: 'bold' }}
							>
								Enviar
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#000000',
	},
	mainContainer: {
		flex: 1,
		paddingTop: 10, // espacio para que no toque el header
		alignItems: 'center',
	},
	chatContainer: {
		flex: 1,
		width: '100%',
		maxWidth: 500,
		backgroundColor: 'white',
		borderRadius: 12,
		overflow: 'hidden',
	},
	title: {
		backgroundColor: '#1FFA60',
		color: '#444',
		padding: 16,
		fontSize: 20,
		textAlign: 'center',
	},
	messagesContainer: {
		flexGrow: 1,
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 0, // ❌ evita que cree "scroll invisible" extra
		backgroundColor: '#676D75',
	},
	messageBubble: {
		maxWidth: '70%',
		padding: 10,
		borderRadius: 18,
		marginBottom: 10,
	},
	sentBubble: {
		alignSelf: 'flex-end',
		backgroundColor: '#1FFA60',
		borderBottomRightRadius: 4,
	},
	receivedBubble: {
		alignSelf: 'flex-start',
		backgroundColor: '#FFFFFF',
		borderBottomLeftRadius: 4,
	},
	inputArea: {
		flexDirection: 'row',
		padding: 12,
		borderTopWidth: 1,
		borderColor: '#eee',
		backgroundColor: '#FFFFFF',
	},
	input: {
		flex: 1,
		padding: 10,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#ddd',
		backgroundColor: 'white',
	},
	sendButton: {
		marginLeft: 8,
		backgroundColor: '#1FFA60',
		borderRadius: 20,
		paddingVertical: 10,
		paddingHorizontal: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
