import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import {
	Dimensions,
	FlatList,
	Image,
	ImageBackground,
	Modal,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { Rating } from 'react-native-ratings';

import { fetchData, procesarImagenesEntidades } from '../../contexts/apiClient';

function formatearRangoFecha(fecha_inicio, fecha_fin) {
	const meses = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	const inicio = new Date(fecha_inicio);
	const fin = new Date(fecha_fin);

	// Nombre mes abreviado
	const mesInicio = meses[inicio.getMonth()];
	const diaInicio = inicio.getDate();

	const diaFin = fin.getDate();

	// Resultado: "Oct 24 - 26"
	return `${mesInicio} ${diaInicio} - ${diaFin}`;
}

function recortarUbicacion(ubicacion) {
	if (!ubicacion) return '';

	// Dividir la cadena por coma
	const partes = ubicacion.split(',');

	if (partes.length < 2) {
		// Si no hay coma, devuelve la cadena completa sin cambios o recortada a 10 caracteres
		return ubicacion.length > 10
			? ubicacion.slice(0, 10) + '...'
			: ubicacion;
	}

	// Tomar las dos primeras partes
	let ciudad = partes[0].trim();
	let estado = partes[1].trim();

	// Opcional: recortar palabras a primeras 4 letras
	ciudad = ciudad.length > 4 ? ciudad.slice(0, 4) : ciudad;
	estado = estado.length > 4 ? estado.slice(0, 4) : estado;

	// Retornar formateado con espacio y coma, igual que ejemplo "Torr , Coah"
	return `${ciudad} , ${estado}`;
}

export default function HomeIndex() {
	const [eventos, setEventos] = useState([]);
	const [publicidades, setPublicidades] = useState([]);
	const [ratingsData, setRatingsData] = useState({});
	const navigation = useNavigation();
	const flatListRef = useRef(0);
	const STAR_IMAGE = require('../../assets/images/star_fill.png');
	const screenWidth = Dimensions.get('window').width;

	const [active_index, set_active_index] = useState(0);
	const [modal_visible, set_modal_visible] = useState(false);
	const [modal_rating, set_modal_rating] = useState(false);
	const [current_ad, set_current_ad] = useState({});
	const [current_evento, set_current_evento] = useState({});
	const [user_rating, set_user_rating] = useState(0);
	const [user_rating_id, set_user_rating_id] = useState(null);
	const [rating_comment, set_rating_comment] = useState('');

	// Función para cargar ratings de eventos
	async function cargarRatingsEventos(eventos) {
		const ratings = {};
		for (const evento of eventos) {
			try {
				const ratingsResponse = await fetchData(
					`/api/event-ratings/evento/${evento.id_evento}`,
				);
				if (ratingsResponse.ok && ratingsResponse.statistics) {
					ratings[evento.id_evento] = {
						average: ratingsResponse.statistics.average_rating || 0,
						total: ratingsResponse.statistics.total_ratings || 0,
					};
				}
			} catch (error) {
				console.error(
					`Error cargando ratings para evento ${evento.id_evento}:`,
					error,
				);
				ratings[evento.id_evento] = { average: 0, total: 0 };
			}
		}
		setRatingsData(ratings);
	}

	// Función para obtener el rating del usuario para un evento específico
	async function getUserEventRating(eventoId) {
		try {
			const response = await fetchData(
				`/api/event-ratings/evento/${eventoId}/user`,
			);
			if (response.ok && response.rating) {
				return {
					id: response.rating.id,
					rating: response.rating.rating,
					comentario: response.rating.comentario || '',
				};
			}
			return null;
		} catch (error) {
			console.error('Error obteniendo rating del usuario:', error);
			return null;
		}
	}

	// Función para enviar/actualizar rating
	async function submitEventRating(eventoId, rating, comentario = '') {
		try {
			const response = await fetchData('/api/event-ratings/', {
				method: 'POST',
				body: {
					evento_id: eventoId,
					rating: rating,
					comentario: comentario,
				},
			});
			return response;
		} catch (error) {
			console.error('Error enviando rating:', error);
			return null;
		}
	}

	// Función para eliminar rating
	async function deleteEventRating(ratingId) {
		try {
			const response = await fetchData(`/api/event-ratings/${ratingId}`, {
				method: 'DELETE',
			});
			return response;
		} catch (error) {
			console.error('Error eliminando rating:', error);
			return null;
		}
	}

	// Función para manejar envío de rating
	async function handleRatingSubmit() {
		if (user_rating === 0) {
			alert('Por favor selecciona una calificación');
			return;
		}

		const result = await submitEventRating(
			current_evento.id_evento,
			user_rating,
			rating_comment,
		);

		if (result && result.ok) {
			alert('Rating enviado correctamente');
			set_modal_rating(false);
			// Recargar ratings para actualizar la vista
			await cargarRatingsEventos([current_evento]);
		} else {
			alert('Error al enviar rating');
		}
	}

	// Función para eliminar rating
	async function handleRatingDelete() {
		if (!user_rating_id) return;

		const result = await deleteEventRating(user_rating_id);
		if (result && result.ok) {
			alert('Rating eliminado correctamente');
			set_modal_rating(false);
			set_user_rating(0);
			set_user_rating_id(null);
			set_rating_comment('');
			// Recargar ratings para actualizar la vista
			await cargarRatingsEventos([current_evento]);
		} else {
			alert('Error al eliminar rating');
		}
	}

	useEffect(() => {
		async function cargarDatos() {
			try {
				// Cargar eventos
				const eventos = await fetchData(
					`/api/registro_acceso/mis-eventos`,
				);

				// Procesar imágenes de eventos usando la función optimizada
				await procesarImagenesEntidades(
					eventos,
					'evento',
					'id_evento',
					'image_url',
					{ width: 300, height: 200 },
				);

				setEventos(eventos);

				// Cargar ratings para cada evento
				await cargarRatingsEventos(eventos);

				// Cargar publicidades
				const ads = await fetchData('/api/publicidad');

				if (ads && ads.length > 0) {
					// Asegurar compatibilidad de IDs antes de procesar imágenes
					ads.forEach((ad) => {
						ad.id = ad.id_publicidad;
					});

					// Procesar imágenes de publicidades usando la función optimizada
					await procesarImagenesEntidades(
						ads,
						'publicidad',
						'id_publicidad',
						'url',
						{ width: 400, height: 200 },
					);

					setPublicidades(ads);
				} else {
					// Si no hay publicidades, usar array vacío
					setPublicidades([]);
				}
			} catch (err) {
				console.error('Error cargando datos:', err);
				// En caso de error, usar array vacío para publicidades
				setPublicidades([]);
			}
		}
		cargarDatos();
	}, []);

	useEffect(() => {
		if (publicidades.length === 0) return;

		let interval = setInterval(() => {
			if (active_index === publicidades.length - 1) {
				flatListRef.current.scrollToIndex({
					index: 0,
					animation: true,
				});
			} else {
				flatListRef.current.scrollToIndex({
					index: active_index + 1,
					animation: true,
				});
			}
		}, 4000); // Aumentado de 2s a 4s para mejor UX

		return () => clearInterval(interval);
	}, [active_index, publicidades.length]);

	// Función para abrir modal de rating
	async function open_rating_modal(evento) {
		set_current_evento(evento);

		// Obtener rating actual del usuario
		const userRating = await getUserEventRating(evento.id_evento);
		if (userRating) {
			set_user_rating(userRating.rating);
			set_user_rating_id(userRating.id);
			set_rating_comment(userRating.comentario);
		} else {
			set_user_rating(0);
			set_user_rating_id(null);
			set_rating_comment('');
		}

		set_modal_rating(true);
	}
	function open_modal(item) {
		set_current_ad(item);
		set_modal_visible(true);
	}

	// Display images / ads
	function renderItem({ item, index }) {
		return (
			<View>
				<Pressable onPress={(e) => open_modal(item)}>
					<Image
						source={{ uri: item.url }}
						style={{
							height: '100%',
							width: screenWidth,
							resizeMode: 'cover', // Cambiado de 'stretch' a 'cover' para mantener aspecto
						}}
					/>
				</Pressable>
			</View>
		);
	}

	// Render dot Indicador
	function renderDotIndicators() {
		return publicidades.map((dot, index) => {
			// if the active index == index
			if (active_index === index) {
				return (
					<Text
						key={index}
						style={{
							backgroundColor: '#1FFF62',
							height: 10,
							width: 10,
							borderRadius: 5,
							marginHorizontal: 2,
							// opacity:0.5
						}}
					>
						{' '}
					</Text>
				);
			} else {
				return (
					<Text
						key={index}
						style={{
							backgroundColor: '#000000',
							height: 10,
							width: 10,
							borderRadius: 5,
							marginHorizontal: 2,
							// opacity:0.5
						}}
					>
						{' '}
					</Text>
				);
			}
		});
	}

	function set_rating(element) {
		console.log(' ELEMENT', element);
	}

	function send_rating() {
		// URL - API UPDATING RATING
		set_modal_rating(false);
	}
	// Scroll carrousel horizontal
	function scroll_carrousel(event) {
		const scroll_position = event.nativeEvent.contentOffset.x;

		const index = Math.round(scroll_position / screenWidth);

		set_active_index(index);
	}

	return (
		<View style={styles.container}>
			{/* Modal rating  */}

			<Modal
				animationType="slide"
				transparent={true}
				visible={modal_rating}
				onRequestClose={() => {
					set_modal_rating(!modal_rating);
				}}
			>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<View
						style={{
							backgroundColor: '#000000',
							borderWidth: 0.5,
							borderColor: '#1FFF62',
							borderRadius: 10,
							height: '15%',
							width: '50%',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Rating
							type="custom"
							ratingImage={STAR_IMAGE}
							ratingColor="#37F4FA"
							// ratingBackgroundColor='#000000'
							selectedColor="#000cb6ff"
							tintColor="#000000"
							// tintColor="red"
							// ratingTextColor=""
							ratingCount={5}
							imageSize={18}
							showRating
							onFinishRating={set_rating}
							// onFinishRating={this.ratingCompleted}
							// style={{ paddingVertical: 10 }}
						/>
						<View
							style={{
								boxShadow: '0px 0px 5px 5px #1FFF62',
								borderRadius: 15,
								marginTop: '5%',
								marginBottom: '5%',
							}}
						>
							{/* <Shadow distance={5} startColor={'#1FFF62'} endColor={'#ff00ff10'} offset={[0, 0]}> */}
							<TouchableOpacity
								onPress={send_rating}
								style={{
									backgroundColor: '#000000',
									width: screenWidth / 5,
									height: undefined,
									justifyContent: 'center',
									alignItems: 'center',
									borderRadius: 15,
								}}
							>
								<Text
									style={{
										color: '#FFFFFF',
										fontWeight: 600,
									}}
								>
									Enviar
								</Text>
							</TouchableOpacity>
							{/* </Shadow> */}
						</View>
					</View>
				</View>
			</Modal>

			{/* End modal rating */}
			{/* Modal to show ad */}
			<Modal
				animationType="slide"
				presentationStyle="overFullScreen"
				transparent={true}
				visible={modal_visible}
				onRequestClose={() => {
					set_modal_visible(!modal_visible);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Pressable
							style={styles.closeButton}
							onPress={() => set_modal_visible(!modal_visible)}
						>
							<Text style={styles.closeButtonText}>✕</Text>
						</Pressable>
						<Pressable
							onPress={() => set_modal_visible(!modal_visible)}
						>
							<Image
								source={{ uri: current_ad.url }}
								style={{
									height: '70%',
									width: screenWidth * 0.9, // Reducido para mejor visualización
									resizeMode: 'contain', // Cambiado para mantener aspecto completo
									borderRadius: 10,
								}}
							/>
						</Pressable>
					</View>
				</View>
			</Modal>
			{/* End modal ad */}

			<View
				style={{
					height: 100,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Text style={{ color: 'white' }}>Promociones</Text>

				<FlatList
					ref={flatListRef}
					onScroll={scroll_carrousel}
					pagingEnabled={true}
					horizontal
					data={publicidades}
					renderItem={renderItem}
				></FlatList>

				<View
					style={{
						backgroundColor: '#676D75',
						opacity: 0.7,
						padding: 2,
						borderRadius: 20,
						flexDirection: 'row',
						position: 'absolute',
						top: '85%',
					}}
				>
					{renderDotIndicators()}
				</View>
			</View>

			<ScrollView style={{ marginBottom: 60 }}>
				{eventos.map((evento, index) => (
					<View key={'view_' + index}>
						{/* Card  */}
						<View key={'card_' + index} style={styles.card}>
							<Pressable
								onPress={(e) =>
									navigation.navigate('details', {
										item: scroll,
									})
								}
							>
								{/* View image background */}
								<ImageBackground
									key={'imagebackground_' + index}
									source={{ uri: evento.image_url }}
									resizeMode="cover"
									style={styles.background_img}
								>
									{/* View top ranking */}

									<View
										key={'ranking_' + index}
										style={styles.ranking_top}
									>
										<Pressable
											key={'pressable_' + index}
											onPress={(e) =>
												open_rating_modal(evento)
											}
											style={{
												width: '100%',
												height: '100%',
												flexDirection: 'row',
												alignItems: 'center',
												justifyContent: 'center',
											}}
										>
											<View key={'view_2_' + index}>
												<Image
													key={'image_' + index}
													source={require('../../assets/images/star.png')}
													style={{
														width: 18,
														height: 18,
														top: -1,
														zIndex: 99,
													}}
												/>
											</View>
											<View key={'view_3_' + index}>
												<Text
													style={{ color: '#FFFFFF' }}
												>
													{ratingsData[
														evento.id_evento
													]
														? `${ratingsData[
																evento.id_evento
															].average.toFixed(
																1,
															)} (${ratingsData[
																evento.id_evento
															].total.toLocaleString()})`
														: '-- (0)'}
												</Text>
											</View>
										</Pressable>
									</View>

									<View style={styles.details_bottom}>
										<View
											style={{
												flexDirection: 'column',
												paddingTop: 10,
												paddingLeft: 10,
											}}
										>
											<Text
												style={{
													color: '#FFFFFF',
													fontSize: 18,
													fontWeight: 'bold',
												}}
											>
												{evento.nombre}
											</Text>
											<View
												style={{
													flexDirection: 'row',
													paddingTop: 10,
													paddingRight: 20,
													justifyContent:
														'space-between',
												}}
											>
												<View
													style={{
														paddingRight: 10,
														borderColor: '#676D75',
														borderRightWidth: 0.5,
													}}
												>
													<Text
														style={{
															color: '#676D75',
														}}
													>
														{' '}
														COST{' '}
													</Text>
													<Text
														style={{
															color: '#FFFFFF',
															paddingTop: 5,
														}}
													>
														{' '}
														$ 300 - 1800{' '}
													</Text>
												</View>

												<View
													style={{
														paddingRight: 10,
														paddingLeft: 10,
														borderColor: '#676D75',
														borderRightWidth: 0.5,
													}}
												>
													<Text
														style={{
															color: '#676D75',
														}}
													>
														{' '}
														PLACE{' '}
													</Text>

													<View
														style={{
															flexDirection:
																'row',
															paddingTop: 5,
															justifyContent:
																'center',
															alignItems:
																'center',
														}}
													>
														<Image
															source={require('../../assets/images/position.png')}
															// resizeMode='contain'
															style={{
																width: 20,
																height: 20,
																tintColor:
																	'#37F4FA',
															}}
														/>

														<Text
															style={{
																color: '#FFFFFF',
															}}
														>
															{' '}
															{recortarUbicacion(
																evento.ubicacion,
															)}{' '}
														</Text>
													</View>
												</View>

												<View
													style={{
														paddingLeft: 10,
														borderColor: '#676D75',
													}}
												>
													<Text
														style={{
															color: '#676D75',
														}}
													>
														{' '}
														AVAILABLE{' '}
													</Text>
													<View
														style={{
															flexDirection:
																'row',
															paddingTop: 5,
															justifyContent:
																'center',
															alignItems:
																'center',
														}}
													>
														<Image
															source={require('../../assets/images/calender-check.png')}
															// resizeMode='contain'
															style={{
																width: 20,
																height: 20,
																tintColor:
																	'#37F4FA',
															}}
														/>
														<Text
															style={{
																color: '#FFFFFF',
																paddingTop: 5,
															}}
														>
															{formatearRangoFecha(
																evento.fecha_inicio,
																evento.fecha_fin,
															)}
														</Text>
													</View>
												</View>
											</View>
										</View>
									</View>
								</ImageBackground>
							</Pressable>
							{/* End View image background */}
						</View>
						{/* End Card */}

						<View style={{ marginTop: '5%' }}></View>
					</View>
				))}
			</ScrollView>

			{/* Rating Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modal_rating}
				onRequestClose={() => set_modal_rating(false)}
			>
				<View style={styles.centeredView}>
					<View
						style={[
							styles.modalView,
							{ backgroundColor: '#1a1a1a' },
						]}
					>
						<Text style={styles.modalTitle}>
							Calificar Evento: {current_evento.nombre}
						</Text>

						{/* Star Rating */}
						<View style={styles.starContainer}>
							{[1, 2, 3, 4, 5].map((star) => (
								<Pressable
									key={star}
									onPress={() => set_user_rating(star)}
									style={styles.starButton}
								>
									<Image
										source={
											star <= user_rating
												? require('../../assets/images/star_fill.png')
												: require('../../assets/images/star.png')
										}
										style={styles.starImage}
									/>
								</Pressable>
							))}
						</View>

						<Text style={styles.ratingText}>
							{user_rating > 0
								? `${user_rating} estrella${user_rating > 1 ? 's' : ''}`
								: 'Selecciona una calificación'}
						</Text>

						{/* Comment Input */}
						<TextInput
							style={styles.commentInput}
							placeholder="Comentario (opcional)"
							placeholderTextColor="#999"
							value={rating_comment}
							onChangeText={set_rating_comment}
							multiline={true}
							numberOfLines={3}
						/>

						{/* Buttons */}
						<View style={styles.buttonContainer}>
							{user_rating_id && (
								<Pressable
									style={[styles.button, styles.deleteButton]}
									onPress={handleRatingDelete}
								>
									<Text style={styles.buttonText}>
										Eliminar
									</Text>
								</Pressable>
							)}

							<Pressable
								style={[styles.button, styles.submitButton]}
								onPress={handleRatingSubmit}
							>
								<Text style={styles.buttonText}>
									{user_rating_id ? 'Actualizar' : 'Enviar'}
								</Text>
							</Pressable>

							<Pressable
								style={[styles.button, styles.cancelButton]}
								onPress={() => set_modal_rating(false)}
							>
								<Text style={styles.buttonText}>Cancelar</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

// Adding styles
const styles = StyleSheet.create({
	// Modal styles
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		margin: 20,
		borderRadius: 20,
		padding: 35,
		alignItems: 'flex-end',
	},
	button: {
		borderRadius: 20,
		paddingTop: 50,
		// elevation: 2,
	},
	buttonOpen: {
		// backgroundColor: '#F194FF',
	},

	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},

	// Rating modal styles
	modalTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginBottom: 20,
		textAlign: 'center',
	},
	starContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 15,
	},
	starButton: {
		padding: 5,
		marginHorizontal: 5,
	},
	starImage: {
		width: 30,
		height: 30,
		tintColor: '#FFD700',
	},
	ratingText: {
		color: '#FFFFFF',
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 20,
	},
	commentInput: {
		backgroundColor: '#2a2a2a',
		color: '#FFFFFF',
		borderRadius: 10,
		padding: 15,
		width: '100%',
		minHeight: 80,
		marginBottom: 20,
		textAlignVertical: 'top',
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		width: '100%',
	},
	submitButton: {
		backgroundColor: '#37F4FA',
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		minWidth: 80,
	},
	deleteButton: {
		backgroundColor: '#FF4444',
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		minWidth: 80,
	},
	cancelButton: {
		backgroundColor: '#666666',
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		minWidth: 80,
	},
	buttonText: {
		color: '#FFFFFF',
		fontWeight: 'bold',
		textAlign: 'center',
	},

	// end modal styles

	details_bottom: {
		backgroundColor: '#000000',
		width: '100%',
		height: '40%',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	ranking_top: {
		backgroundColor: '#000000',
		width: '50%',
		height: '15%',
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		alignItems: 'center',
		justifyContent: 'center',
		gap: '2',
		flexDirection: 'row',
	},
	background_img: {
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: 'red',
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		borderRadius: 15,
		//  paddingLeft:2,
		//  paddingRight:2
	},
	card: {
		width: '100%',
		maxWidth: '100%',
		height: Dimensions.get('window').height / 3,
		marginTop: '10%',
		backgroundColor: ' rgba(31, 255, 98, 0.66)',
		boxShadow: '0px 0px 10px 10px rgba(31, 255, 98, 0.66)',
		borderRadius: 15,
		paddingLeft: 5,
		paddingRight: 5,
	},

	container: {
		backgroundColor: '#000000',
		width: '100%',
		height: '100%',
		alignItems: 'center',

		// justifyContent:'center'
	},

	// Estilos mejorados para el botón de cerrar
	closeButton: {
		position: 'absolute',
		top: 20,
		right: 20,
		backgroundColor: 'rgba(0, 0, 0, 0.8)',
		borderRadius: 20,
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
		borderWidth: 2,
		borderColor: '#1FFF62',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 4,
		elevation: 5,
	},
	closeButtonText: {
		color: '#1FFF62',
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
	},
});
