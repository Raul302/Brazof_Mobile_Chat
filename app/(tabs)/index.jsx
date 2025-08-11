import { useIsFocused, useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { useRouter } from "expo-router";
import { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, FlatList, Image, ImageBackground, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Rating } from "react-native-ratings";
import { authConfig } from "../../Constants/authConfig";
import { AuthContext } from "../../context/AuthContext";
import { fetchData, procesarImagenesEntidades } from "../../context/apiClient";



export default function HomeIndex() {



  const navigation = useNavigation();
  const flatListRef = useRef(0);
  const STAR_IMAGE = require('../../assets/images/star_fill.png')
  const [publicidades, setPublicidades] = useState([]);
  const [ratingsData, setRatingsData] = useState({});


  // Get Dimensions
  const screenWidth = Dimensions.get('window').width;

  // const image = { uri: 'https://legacy.reactjs.org/logo-og.png' };

  const scroll_data = [1, 2, 3, 4, 5, 6, 7, 8];

  const [active_index, set_active_index] = useState(0)

  const [modal_visible, set_modal_visible] = useState(false);
  const [modal_rating, set_modal_rating] = useState(false);
  const [current_ad, set_current_ad] = useState({});
  const [selected_event, set_selected_event] = useState(null);
  const [current_rating, set_current_rating] = useState(0);
  const [userRating, set_userRating] = useState(null);
  const [loadingUserRating, set_loadingUserRating] = useState(false);
  const ratingOpacity = useRef(new Animated.Value(0)).current;

  const [rating_to_detail,set_rating_to_detail] = useState([])

  const { user, token } = useContext(AuthContext);

  const [my_events, set_my_events] = useState([{}])

  const [ loading , set_loading ] = useState(true); 

  
const isFocused = useIsFocused()
const router = useRouter()

useEffect(() => {
  if (!isFocused) return;

  // Verificar que user y brand estén definidos
  if (!user || !user.brand) return;

  // Validar si tiene pulsera/marca
  if (user.brand.length === 0) {
    router.replace('/nfc')
    // Alert.alert(
    //   'Acceso restringido',
    //   'No cumples con los requisitos para acceder a esta sección.',
    // )
    return;
  }
  set_my_events([])
  // Si todo bien, cargar datos
  load_events();
  load_ratings()


}, [isFocused])

	// Función para cargar ratings de eventos
	async function cargarRatingsEventos(eventos) {
		// Validar que eventos no esté vacío y tenga elementos válidos
		if (!eventos || eventos.length === 0) {
			return;
		}
		
		const ratings = {};
		for (const evento of eventos) {
			// Validar que el evento tenga id_evento
			if (!evento || !evento.id_evento) {
				continue;
			}
			
			try {
				const ratingsResponse = await fetchData(
					`/api/event-ratings/evento/${evento.id_evento}`,
				);

        set_rating_to_detail(ratingsResponse)
        // console.log('rating Response',ratingsResponse);
				if (ratingsResponse.ok && ratingsResponse.statistics) {
					ratings[evento.id_evento] = {
						average: ratingsResponse.statistics.average_rating || 0,
						total: ratingsResponse.statistics.total_ratings || 0,
            // distribution:ratingsResponse.statistics.distribution || 0,
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
    set_loading(false)
	}

	// Refrescar rating de un único evento desde la API
	async function recargarRatingEvento(id_evento) {
		if (!id_evento) return;
		try {
			const ratingsResponse = await fetchData(
				`/api/event-ratings/evento/${id_evento}`,
			);
			if (ratingsResponse.ok && ratingsResponse.statistics) {
				setRatingsData((prev) => ({
					...prev,
					[id_evento]: {
						average: ratingsResponse.statistics.average_rating || 0,
						total: ratingsResponse.statistics.total_ratings || 0,
					},
				}));
			}
		} catch (error) {
			console.error(`Error recargando rating para evento ${id_evento}:`, error);
		}
	}

	// Cargar rating del usuario para un evento específico
	async function cargarMiRating(id_evento) {
		if (!id_evento || !user?.id_usuario) return;
		try {
			const url = `/api/event-ratings/evento/${id_evento}/user?user_id=${user.id_usuario}`;
			const res = await fetchData(url);
			if (res?.ok) {
				const valor = typeof res.rating === 'number' ? res.rating : 0;
				set_userRating(res);
				set_current_rating(valor);
			} else {
				set_userRating(null);
				set_current_rating(0);
			}
		} catch (e) {
			console.error(`Error cargando mi rating para evento ${id_evento}:`, e);
		}
	}

  
  const load_ratings  = async () => {

    	try {
					// Solo cargar ratings si hay eventos válidos
					if (my_events && my_events.length > 0 && my_events[0].id_evento) {
						cargarRatingsEventos(my_events);
					} else {
						console.log('Esperando eventos válidos antes de cargar ratings');
					}

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
          // set_loading(false)
				} else {
					// Si no hay publicidades, usar array vacío
					setPublicidades([]);
          set_loading(false)
				}
			} catch (err) {
				console.error('Error cargando datos:', err);
				// En caso de error, usar array vacío para publicidades
				setPublicidades([]);
        set_loading(false)
			}

    	
  }



	// useEffect separado para cargar ratings cuando my_events cambie
	// useEffect(() => {
	// 	if (my_events && my_events.length > 0 && my_events[0].id_evento) {
	// 		cargarRatingsEventos(my_events);
	// 	}
	// }, [my_events]);


  const load_events = () => {



    axios.get(authConfig.business_api + 'registro_acceso/mis-eventos', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': "application/json",
      }
    }).
      then((response) => {
        if (response.data.data) {
          set_my_events(response.data.data);
          cargarRatingsEventos( response.data.data)
          // load_ratings()
          // //console.log('Response',response.data.data)
        }

        // //console.log('Response from index EVENTOS PUBLICIDAD', response.data);

      }).catch((error) => {
        console.log('Axios index ERROR ',error.response.data);


        //console.log('Error en Index tabs', error)
      })


    // https://api.brazof.space/api/registro_acceso/mis-eventos

  }




  // UseEffect to move carrousel automatic

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
		}, 4000);

		return () => clearInterval(interval);



	}, [active_index, publicidades.length]);

  const open_rating_modal = async (item) => {
    set_selected_event(item);
    set_modal_rating(true);
    set_userRating(null);
    set_current_rating(0);
    // Reset fade and show loader
    ratingOpacity.setValue(0);
    set_loadingUserRating(true);
    // Fetch user's rating
    await cargarMiRating(item?.id_evento);
    // Ensure a minimal loader time to avoid flicker
    const MIN_DELAY_MS = 100;
    setTimeout(() => {
      set_loadingUserRating(false);
      Animated.timing(ratingOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }, MIN_DELAY_MS);
  }
  const open_modal = (item) => {
    set_current_ad(item);
    set_modal_visible(true)
  }

  // Display images / ads
  const renderItem = ({ item, index }) => {

    return (
      <View >
        <Pressable onPress={(e) => open_modal(item)}>
          <Image source={{ uri: item.url }} style={{ height: '100%', width: screenWidth, resizeMode: 'stretch' }} />
        </Pressable>
      </View>
    )

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

  
  const set_rating = (rating) => {
    set_current_rating(rating);
    console.log('Rating seleccionado:', rating);
  }

  const send_rating = async () => {
    if (!selected_event || !current_rating) {
      console.log('No hay evento seleccionado o rating');
      return;
    }

    try {
      console.log('Enviando rating:', current_rating, 'para evento:', selected_event.id_evento);
      
      const response = await fetchData('/api/event-ratings/', {
        method: 'POST',
        body: {
          id_evento: selected_event.id_evento,
          id_usuario: user.id_usuario,
          rating: current_rating,
          comentario: '', // Puedes agregar un campo de comentario después si quieres
        },
      });

      if (response.ok) {
        console.log('Rating enviado exitosamente');
        // Re-cargar el rating real desde la API para este evento
        await recargarRatingEvento(selected_event.id_evento);
        // Re-cargar mi propio rating para reflejar cambios inmediatos
        await cargarMiRating(selected_event.id_evento);

        // Cerrar modal y resetear
        set_modal_rating(false);
        set_current_rating(0);
        set_selected_event(null);
        
      } else {
        console.error('Error al enviar rating:', response);
        alert('Error al enviar el rating. Inténtalo de nuevo.');
      }
      
    } catch (error) {
      console.error('Error enviando rating:', error);
      alert('Error de conexión. Inténtalo de nuevo.');
    }
  }
  // Scroll carrousel horizontal
  const scroll_carrousel = (event) => {

    const scroll_position = event.nativeEvent.contentOffset.x;

    const index = Math.round(scroll_position / screenWidth);


    set_active_index(index)

  }

  return (
    <View style={styles.container}>

      {
        loading ?

        <ActivityIndicator />

        :
        <View style={styles.container}>


      {/* Modal rating  */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modal_rating}
        onRequestClose={() => {
          set_modal_rating(!modal_rating);
        }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#000000', borderWidth: 0.5, borderColor: '#1FFF62', borderRadius: 10, height: '15%', width: '50%', alignItems: 'center', justifyContent: 'center' }}>
            <Pressable
              onPress={() => set_modal_rating(false)}
              style={{ position: 'absolute', top: 6, right: 8, padding: 6 }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>X</Text>
            </Pressable>
            {loadingUserRating ? (
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 12 }}>
                <ActivityIndicator color="#1FFF62" size="small" />
                <Text style={{ color: '#FFFFFF', marginTop: 6, fontSize: 12 }}>Cargando...</Text>
              </View>
            ) : (
              <Animated.View style={{ opacity: ratingOpacity }}>
                <Rating
                  type='custom'
                  ratingImage={STAR_IMAGE}
                  ratingColor='#37F4FA'
                  // ratingBackgroundColor='#000000'
                  selectedColor='#000cb6ff'
                  tintColor="#000000"
                  // tintColor="red"
                  // ratingTextColor=""
                  ratingCount={5}
                  imageSize={18}
                  showRating
                  key={`${selected_event?.id_evento ?? 'none'}-${userRating?.rating ?? 0}`}
                  startingValue={userRating?.rating ?? 0}
                  onFinishRating={set_rating}
                // onFinishRating={this.ratingCompleted}
                // style={{ paddingVertical: 10 }}
                />
              </Animated.View>
            )}
            <View style={{
              boxShadow: '0px 0px 5px 5px #1FFF62',
              borderRadius: 15,
              marginTop: '5%', marginBottom: '5%'
            }}>

              {/* <Shadow distance={5} startColor={'#1FFF62'} endColor={'#ff00ff10'} offset={[0, 0]}> */}
              <TouchableOpacity
                onPress={send_rating}
                style={{ backgroundColor: '#000000', width: screenWidth / 5, height: undefined, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
                <Text style={{ color: '#FFFFFF', fontWeight: 600 }}>Enviar</Text>
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
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => set_modal_visible(!modal_visible)}>
              <Text style={styles.textStyle}>X</Text>
            </Pressable>
            <Pressable
              onPress={() => set_modal_visible(!modal_visible)}>
              <Image source={{ uri: current_ad.url }} style={{ height: '70%', width: screenWidth, resizeMode: 'stretch' }} />
            </Pressable>

          </View>
        </View>
      </Modal>
      {/* End modal ad */}

      <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>Promociones</Text>

        <FlatList
			ref={flatListRef}
			onScroll={scroll_carrousel}
			pagingEnabled={true}
			horizontal
			data={publicidades}
			renderItem={renderItem}
		></FlatList>

        <View style={{ backgroundColor: '#676D75', opacity: 0.7, padding: 2, borderRadius: 20, flexDirection: 'row', position: 'absolute', top: '85%' }}>
          {renderDotIndicators()}
        </View>
      </View>


      <ScrollView style={{ marginTop: '10%' }}>

        {my_events.map((scroll, index) => (

          <View key={'view_' + index}>
            {/* Card  */}
            <View
              key={'card_' + index} style={styles.card}>



              <Pressable onPress={() => {
                navigation.navigate('details_event', { item: scroll , rating: rating_to_detail.statistics });
              }}>
                {/* View image background */}
                <ImageBackground
                  key={'imagebackground_' + index} 
                  source={
                  scroll.cha
                    ? { uri: scroll.imagenes[0].url }
                    : require('../../assets/images/baile.jpg')
                }
 resizeMode="cover" style={styles.background_img}>

                    { scroll.status_calculado == "inactivo"&&

                    
               <View
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 100,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <View style={{ position: 'relative' }}>
    <Text style={[styles.comingSoonText, { position: 'absolute', color: 'black', left: 1, top: 1 }]}>
      Coming Soon
    </Text>
    <Text style={[styles.comingSoonText, { position: 'absolute', color: 'black', left: -1, top: -1 }]}>
      Coming Soon
    </Text>
    <Text style={styles.comingSoonText}>Coming Soon</Text>
  </View>
</View>

                    }


                  {/* View top ranking */}

                  <View key={'ranking_' + index} style={styles.ranking_top}>
                    <Pressable
                      key={'pressable_' + index}
                      onPress={(e) => open_rating_modal(scroll)}
                      style={{ width: '100%', height: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                      <View key={'view_2_' + index}>
                        <Image
                          key={'image_' + index}
                          source={require('../../assets/images/star.png')
                          }
                          style={{
                            width: 18,
                            height: 18,
                            top: -1,
                            zIndex: 99
                          }}
                        />
                      </View>
                      <View key={'view_3_' + index}>
                        <Text style={{ color: '#FFFFFF' }}>
			{ratingsData[scroll.id_evento]?.average || '0.0'} ({ratingsData[scroll.id_evento]?.total || '0'})
                        </Text>
                      </View>
                    </Pressable>
                  </View>

               <View style={[styles.details_bottom, { width: screenWidth * 0.9 }]}>
  <View style={{ flexDirection: 'column', paddingTop: 10, paddingHorizontal: 10 }}>
    <Text
      style={{
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        flexWrap: 'wrap',
        flexShrink: 1,
        maxWidth: screenWidth * 0.8,
      }}
      numberOfLines={2}
      ellipsizeMode="tail"
    >
      {scroll.ubicacion}
    </Text>

    <View
      style={{
        flexDirection: "row",
        paddingTop: 10,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10,
      }}
    >
      {/* COST */}
      <View style={{ flex: 1, paddingRight: 5, borderRightWidth: 0.5, borderColor: '#676D75' }}>
        <Text style={{ color: '#676D75' }}>COST</Text>
        <Text style={{ color: '#FFFFFF', paddingTop: 5 }}>$300 - 1800</Text>
      </View>

      {/* PLACE */}
      <View style={{ flex: 1, paddingHorizontal: 5, borderRightWidth: 0.5, borderColor: '#676D75' }}>
        <Text style={{ color: '#676D75' }}>PLACE</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
          <Image
            source={require('../../assets/images/position.png')}
            style={{ width: 20, height: 20, tintColor: '#37F4FA', marginRight: 5 }}
          />
          <Text
            style={{
              color: '#FFFFFF',
              flexShrink: 1,
              flex: 1,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {scroll.ubicacion}
          </Text>
        </View>
      </View>

      {/* AVAILABLE */}
      <View style={{ flex: 1, paddingLeft: 5 }}>
        <Text style={{ color: '#676D75' }}>AVAILABLE</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
          <Image
            source={require('../../assets/images/calender-check.png')}
            style={{ width: 20, height: 20, tintColor: '#37F4FA', marginRight: 5 }}
          />
          <Text
            style={{
              color: '#FFFFFF',
              flexShrink: 1,
              flex: 1,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {scroll.fecha_inicio}
          </Text>
        </View>
      </View>
    </View>
  </View>
</View>



                </ImageBackground >
              </Pressable>
              {/* End View image background */}



            </View>
            {/* End Card */}

            <View style={{ marginTop: '5%' }}>

            </View>

          </View>

        ))}

      </ScrollView>






        </View>
        
      }
    </View>
  )




}


// Adding styles
const styles = StyleSheet.create({

  comingSoonText: {
  color: '#FFFFFF',
  fontSize: 32,
  fontWeight: 'bold',
  textAlign: 'center',
  textTransform: 'uppercase',
  textShadowColor: '#1FFF62',

  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 4,
  maxWidth: Dimensions.get('window').width * 0.9,
},

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
    paddingTop: 50
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
    // width: Dimensions.get('window').width / 1.2,
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
    height: Dimensions.get('window').height / 3,
    marginTop: '20%',
    backgroundColor: ' rgba(31, 255, 98, 0.66)',
    boxShadow: '0px 0px 10px 10px rgba(31, 255, 98, 0.66)',
    borderRadius: 15,
    paddingLeft: 5,
    paddingRight: 5

  },

  container: {
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
    alignItems: 'center',

    // justifyContent:'center'
  }
})