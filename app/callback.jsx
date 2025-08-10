import axios from 'axios';
import { useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { authConfig } from '../Constants/authConfig';
import { AuthContext } from '../context/AuthContext';

export default function SearchIndex() {

  const route = useRouter()
  const { token, user , login } = useContext(AuthContext);
  


// console.log('USER',user);
  useEffect(()=>{

    // console.log('TOKEN',token)

    if(token ){
      build_info_user()
    }

  },[token])

  
  useEffect(() => {

    // Validations here after login succesfully
    // build_info_user();

    // const timeout = setTimeout(() => {

    // First check if is Logged 
    // if( !token ){
    //   //console.log(' NO TOKEN ');

    //     route.replace('/(auth)/login')

    // } else if ( token  ){

    //   //console.log('SI TOKEN ');

    //   if( !user.brand ){
    //     //console.log('SI TOKEN NO BRAND')
    //     route.replace('/(tabs)/nfc');

    //   } else {
    //  //console.log('SI TOKEN SI BRAND')
    //     route.replace('/(tabs)');
    //   }

    // }

    // }, 3000); // 5000ms = 5 seconds

    // return () => clearTimeout(timeout); // 🧼 Cleanup if component unmounts

  }, [])


  const build_info_user = async () => {


    try {

      
       const get_event_id_active = await axios.get(authConfig.business_api + 'registro_acceso/mis-eventos', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': "application/json",
        },
      });

      const event_id = get_event_id_active.data.data.find( event => event.status_calculado == 'activo' ?  event : null);
      





      const get_info_brands = await axios.get(authConfig.business_api + 'usuarios/me/pulseras', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': "application/json",
        },
      });
      
      // Check if has brands
      const result_brand = get_info_brands.data?.data ?? null;

      // //console.log('result_brand',result_brand)
      
      
      const get_info_userLogged = await axios.get(authConfig.business_api + 'usuarios/usuarios/me', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        'Accept': "application/json",
      },
    });

    
    // action to get ID 
    const result_users = get_info_userLogged.data?.data?.id ?? null;
    // //console.log('result', result_users)
    
    if (result_users) {
      const ruta = authConfig.business_api + 'usuarios/' + result_users
      
      const get_user_info = await axios.get(ruta, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': "application/json",
        },
      });
      

      // action to get ID 
      const result_info_user = get_user_info.data?.data ?? null;
      
      // //console.log('XXXX', result_info_user)
      
      const new_obj = {
        brand : result_brand,
        id_usuario: result_info_user.id_usuario,
        rol: result_info_user.rol,
        status: result_info_user.status,
        name: result_info_user.nombre_completo,
        email:result_info_user.correo,
        event_id: event_id ? event_id.id_evento : null,
      }

      // console.log('NEW OBJ',new_obj);
      login( token , new_obj );

    

      // console.log('RESULT',result_brand)
      //  Si hay pulseras 
      if (result_brand[0]) {
        // //console.log('RESULT BRAND',result_brand);
        route.push('/(tabs)')
      }
      //  No hay pulseras ligadas
      else {
        route.push('/nfc')
      }

        if( !event_id){
        route.push('/nfc')
      }
      //  //console.log('result_',result_brand)
      
      
     
    }
  } catch ( error ) {


    console.log('Error en callback',error.response.data);
  }
    
    
    
    
  }



  return (
    <View style={{
      backgroundColor: '#000000',
      width: '100%',
      height: '100%',
      alignItems: 'center',


    }}>
      {/* View container SearchBox */}
      <View style={{ height: '40%' }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: '#676D75',
          borderWidth: 0.5,
          borderColor: '#000',
          paddingLeft: 20,
          paddingRight: 20,
          width: '80%',
          // height: 40,
          borderRadius: 20,
          marginTop: 10
        }}>


        </View>
      </View>

      <ActivityIndicator size={100} />
      <Text style={{ color: '#FFFFFF' }}>
        Cargando los recursos del sistema ...
      </Text>
    </View>
  )
}
