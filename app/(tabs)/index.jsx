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
	TouchableOpacity,
	View,
} from 'react-native';
import { Rating } from 'react-native-ratings';
import { obj_ads } from '../../Constants/data_carrousel';
import { fetchData } from '../../contexts/apiClient';

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
	const navigation = useNavigation();
	const flatListRef = useRef(0);
	const STAR_IMAGE = require('../../assets/images/star_fill.png');
	const screenWidth = Dimensions.get('window').width;

	const [active_index, set_active_index] = useState(0);
	const [modal_visible, set_modal_visible] = useState(false);
	const [modal_rating, set_modal_rating] = useState(false);
	const [current_ad, set_current_ad] = useState({});

	useEffect(() => {
		async function cargarDatos() {
			try {
				const eventos = await fetchData(
					`/api/registro_acceso/mis-eventos`,
				);

				for (const evento of eventos) {
					const imagenes = await fetchData(
						`/api/imagenes?tipo_entidad=evento&id_entidad=${evento.id_evento}`,
					);
					if (imagenes.ok && imagenes.length > 0) {
						evento.image_url = imagenes[0].url;
						try {
							const response = await fetch(evento.image_url);
							if (!response.ok)
								throw new Error('Imagen no encontrada');
						} catch {
							evento.image_url = 'https://picsum.photos/300/200';
						}
					} else {
						evento.image_url = 'https://picsum.photos/300/200';
					}
				}

				setEventos(eventos);
				console.log('Eventos cargados:', eventos);
			} catch (err) {
				console.error(err);
			}
		}
		cargarDatos();
	}, []);

	useEffect(() => {
		let interval = setInterval(() => {
			if (active_index === obj_ads.length - 1) {
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
		}, 2000);

		return () => clearInterval(interval);
	});

	function open_rating_modal(item) {
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
							resizeMode: 'stretch',
						}}
					/>
				</Pressable>
			</View>
		);
	}

	// Render dot Indicador
	function renderDotIndicators() {
		return obj_ads.map((dot, index) => {
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
							style={[styles.button, styles.buttonClose]}
							onPress={() => set_modal_visible(!modal_visible)}
						>
							<Text style={styles.textStyle}>X</Text>
						</Pressable>
						<Pressable
							onPress={() => set_modal_visible(!modal_visible)}
						>
							<Image
								source={{ uri: current_ad.url }}
								style={{
									height: '70%',
									width: screenWidth,
									resizeMode: 'stretch',
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
					data={obj_ads}
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
												open_rating_modal(scroll)
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
													4.1 (25,000){' '}
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
});
