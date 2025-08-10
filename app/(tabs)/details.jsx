import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { authConfig } from "../../Constants/authConfig";
import { AuthContext } from "../../context/AuthContext";


export default function HomeIndex() {



  const navigation = useNavigation();
  const flatListRef = useRef(0);


const obj_ads = [
     {
        id:4 ,
        name : 'Cuarta publicidad',
        url:'https://cdn.shopify.com/s/files/1/0840/8370/3830/files/1624033822-anuncios-publicitarios-ejemplos-propuesta-de-valor.png'
    }
]


  // Get Dimensions
  const screenWidth = Dimensions.get('window').width;

  // const image = { uri: 'https://legacy.reactjs.org/logo-og.png' };

  const scroll_data = [1];

  const [active_index, set_active_index] = useState(0)

  const [modal_visible, set_modal_visible] = useState(false);
  const [modal_rating, set_modal_rating] = useState(false);
  const [current_ad, set_current_ad] = useState({});

  const { user , token } = useContext( AuthContext );




  useEffect(() => {
    
    load_ads();
    load_events();

  }, [])

  const load_events = ()  => {

  }


  const load_ads = () => {


    axios.get(authConfig.business_api+'publicidad/perfil/Usuario', {
         headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`,
         'Accept': "application/json",
       }
    }).
      then((response) => {

        // //console.log('Response from index EVENTOS PUBLICIDAD', response);

      }).catch((error) => {


        //console.log('Error en Index tabs', error)
      })

  }

  useEffect(() => {

    // if activeIndex === last item carrousel so return to initial point

    // else activeIndex++

    // let interval = setInterval(() => {
    //   if (active_index == obj_ads.length - 1) {

    //     flatListRef.current.scrollToIndex({
    //       index: 0,
    //       animation: true
    //     });
    //   }
    //   else {

    //     flatListRef.current.scrollToIndex({
    //       index: active_index + 1,
    //       animation: true
    //     })


    //   }
    // }, 2000)

    // return () => clearInterval(inte  rval);

  })

  const open_rating_modal = (item) => {

    set_modal_rating(true);

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
  const renderDotIndicators = () => {

    return (
      obj_ads.map((dot, index) => {

        // if the active index == index 

        if (active_index == index) {
          return (<Text
            key={index}
            style={{
              backgroundColor: '#1FFF62',
              height: 10,
              width: 10,
              borderRadius: 5,
              marginHorizontal: 2,
              // opacity:0.5
            }}> </Text>)
        } else {
          return (<Text
            key={index}
            style={{
              backgroundColor: '#000000',
              height: 10,
              width: 10,
              borderRadius: 5,
              marginHorizontal: 2,
              // opacity:0.5
            }}> </Text>)

        }

      })
    )
  }

  const set_rating = (element) => {

    // //console.log(' ELEMENT', element);
  }

  const send_rating = () => {

    // URL - API UPDATING RATING

    set_modal_rating(false);
  }
  // Scroll carrousel horizontal
  const scroll_carrousel = (event) => {

    const scroll_position = event.nativeEvent.contentOffset.x;

    const index = Math.round(scroll_position / screenWidth);


    set_active_index(index)

  }

  return (
    <View style={styles.container}>
        <View>
          <Image source={require('../../assets/images/pal_norte_background.jpg')}
           style={{ height: '70%',marginBottom:0,paddingBottom:0, width: screenWidth, resizeMode: 'cover' }} />
        </View>
        <View style={{
            position:'absolute',
            top:'30%',
            borderRadius:20,
            height:Dimensions.get('window').height/1.5,
            backgroundColor:'#000',width:Dimensions.get('window').width/1.5}}>
             <Image source={require('../../assets/images/femsa.png')}
           style={{ width:90,height:90,borderRadius:100, top:'-30',left:'-10', resizeMode: 'contain' }} />
                <View style={{justifyContent:'flex-end', marginLeft:90,top:-90, alignItems:'flex-end' , width:'62%'}}>
                    <Text style={{fontSize:24, color:'white'}}>Organizado por grupo femsa</Text>
                    
                </View>
        </View>


    </View>
  )




}


// Adding styles
const styles = StyleSheet.create({

  

  // end modal styles


  details_bottom: {
    backgroundColor: '#000000',
    width: '75%',
    height: '40%',
    alignItems:'center',
    justifyContent:'center',
    overflow:"hidden",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  ranking_top: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '15%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'centespar',
    gap: '2',
    flexDirection: 'row',

  },
  background_img: {
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height /2,
    overflow: 'hidden',
    // borderRadius: 15,
    //  paddingLeft:2,
    //  paddingRight:2

  },
  card: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
    // backgroundColor: ' rgba(31, 255, 98, 0.66)',
    // boxShadow: '0px 0px 10px 10px rgba(31, 255, 98, 0.66)',
    // borderRadius: 15,
    // paddingLeft: 5,
    // paddingRight: 5

  },

  container: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    alignItems: 'center',

    // justifyContent:'center'
  }
})