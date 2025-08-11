import axios from 'axios';
import { useNavigation, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { authConfig } from "../../Constants/authConfig";
import { AuthContext } from "../../context/AuthContext";



export default function NFCIndex() {
  const navigation = useNavigation();

  const router = useRouter();

  const { token, user, login } = useContext(AuthContext);

  const [nfcData, setNfcData] = useState(null);
  const [codigo_pulsera, set_codigo_pulsera] = useState();
  const [nfcReader, updateNfc] = useState(false);
  const [scanning, set_scanning] = useState(false);
  const [ message_loading  , set_message_loading ] = useState('Buscando dispositivo');

  const [nfc_status, set_nfc_status] = useState(
    {
      supported: false,
      enabled: false
    }
  )




  const get_brands = async () => {
    try {
      const response = await fetch(`${authConfig.server_uri_business}pulseras`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': "application/json",
        },
        // body: JSON.stringify({
        //   client_id: authConfig.clientId,
        //   client_secret: authConfig.clientSecret,
        //   grant_type: 'authorization_code',
        //   // code: code,
        //   redirect_uri: redirectUri,
        // }),
      });
      // console.log('RESPONSE',await response.json());
      const { data } = await response.json();
      // console.log('DATA NFC SCREEN',data);

      // return { id : data.id , name: data.nombre_completo}
      // await login(token, {id:data.id,name:data.nombre_completo});
    } catch (error) {
      console.error('Error exchanging code:', error);

    }

  }


  useEffect( ()=>{

    if( codigo_pulsera ) {
      set_message_loading('Emparejando...');

      // Formatear pulsera y formato
      const formatted_pulsera = formatBraceletCode(codigo_pulsera)
      if(user.rol){
        if(user.rol !='Usuario'){
          
          show_info(formatted_pulsera)

        } else {
          save_nfc_to_user( formatted_pulsera );
        }
      }

    }



  },[ codigo_pulsera])

 useEffect(() => {
  NfcManager.start()
  // NfcManager.registerTagEvent(callback)

  return () => {
    NfcManager.unregisterTagEvent().catch(() => {})
  }
}, [])

  
function formatBraceletCode(code) {
  // Asegura que sea string y en mayúsculas
  const clean = code.toUpperCase().trim()

  // Separa de 2 en 2
  return clean.match(/.{1,2}/g).join(' ')
}


const show_info = async ( codigo_pulsera ) => {

  try {

      const ruta = authConfig.business_api + 'pulseras/uuid/' + codigo_pulsera
      
      const get_user_info = await axios.get(ruta, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': "application/json",
        },
      });
      

      // action to get ID 
      const result_info_user = get_user_info.data?.data ?? null;


      console.log('USERINFO',result_info_user)
    navigation.navigate('usuario_info',{
      contacto_emergencia : result_info_user.usuario.contacto_emergencia,
      direccion : result_info_user.usuario.direccion,
      email : result_info_user.usuario.email,
      nombre_completo : result_info_user.usuario.nombre_completo,
      rol : result_info_user.usuario.rol,
      uuid : result_info_user.uuid,
      telefono: result_info_user.usuario.telefono
    }
    );
      

      console.log('result_info_user',result_info_user);


  } catch ( error ) {
    console.log('ERROR',error);
    console.log('Error' , error.response.data.message)
    Alert.alert(error.response.data.message)
    set_scanning(false)
    set_codigo_pulsera()
  }
}
  const save_nfc_to_user =  ( codigo ) => {

    const obj = { uuid : codigo , status : 'activo' , id_usuario : user.id_usuario}


    try {

       axios.post(authConfig.business_api+'pulseras',{
      uuid : codigo, status : 'activo' , id_usuario : user.id_usuario
     }, {
         headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`,
         'Accept': "application/json",
       }
    }).
      then( (response) => {

        console.log('RESPONSE nfc', response.data.data.pulsera)  ;
             
        login( token , {...user,brand:response.data.data.pulsera})
        // set_scanning(false)

        router.replace('/loader')

      }).catch((error) => {

        Alert.alert(error.response.data.message)
        console.log('Error en nfc', error.response.data.message)
      })

    } catch ( error ) {
      console.log('ERROR EN NFC',error);
    }

            set_scanning(false)


  } 


  const read_nfc = async () => {

    set_scanning(true)
    // console.log('Requesting NFC tech...');

    try {
      // Wait for NDEF-compatible tag
      await NfcManager.requestTechnology([NfcTech.Ndef, NfcTech.NfcA]);

      // console.log('NFC tech acquired.');

      const tag = await NfcManager.getTag();
      // console.log('Tag received:', tag);
      // console.log(' PAY ', tag.ndefMessage);
      console.log('TAG',tag.id)

      // if(tag.ndefMessage == undefined){
      //   set_scanning(false)
      // }

      if (tag) {
        // Alert.alert('NFC Tag Detected', JSON.stringify(tag));

         if (tag.id) {
                set_codigo_pulsera(tag.id)
              }
      } else {
        Alert.alert('No Tag Found', 'Tag is null');
      }
    } catch (ex) {
      console.warn('NFC Scan failed', ex);

      // Optional: Display a friendlier message to the user
      Alert.alert('Scan Failed', ex?.message || 'Unknown error');
    } finally {
      try {
        
          await NfcManager.cancelTechnologyRequest(); // Clean up
          // set_scanning(false)
     
      } catch (cancelEx) {
        console.warn('Error cancelling NFC tech request', cancelEx);
      }
    }
  }

  return (

    // View container
    <View
      style={styles.container}
    >


      <View style={styles.view_separator}>
        {/* <Shadow distance={20} paintInside={true} startColor={'#1fff62a2'} offset={[0, 5]}> */}

        {scanning ?



          <View style={styles.view_card}>
            <Text style={styles.text}>
              {codigo_pulsera &&
                [codigo_pulsera]
              }
            </Text>
            <Text style={styles.text}>
             { message_loading }
            </Text>

            <ActivityIndicator color={'#FFF'} />
          </View>

          :

          <View style={styles.view_card}>

            { user?.brand[0]?.uuid ?
            <Text style={styles.text}>
              PULSERA DE EVENTO { user?.brand[0]?.uuid} VINCULADA ...
            </Text>
          :
            <Text style={styles.text}>
              PULSERA DE EVENTO NO DETECTADA ...
            </Text>
          
          }

            <Image
            
              source={
                user?.brand[0]?.uuid ?
                require('../../assets/images/central_nfc.png')
              :
                              require('../../assets/images/central_nfc_prohibited.png')
             }
              resizeMode='contain'
              style={{
                width: 50,
                height: 50,
              }}
            />
          </View>
        }





        {/* </Shadow> */}


      </View>


      {/* Another view separator */}
      <View style={styles.view_separator}>
        {/* { nfcData &&
        <Text style={styles.text}>
          Pulsera vinculada : {nfcData.uid}
          </Text>
       } */}


        {scanning ?

         
          <TouchableOpacity
          disabled = { codigo_pulsera  ? true : false }
            onPress={(e) => set_scanning(false)}
            style={{ boxShadow: '0px 0px 5px 5px #1FFF62', backgroundColor: '#000000', width: 300, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
            <Text style={{ color: '#FFFFFF', fontWeight: 600 }}>{ codigo_pulsera  ? 'Emparejando . . .' : 'Detener' }</Text>
          </TouchableOpacity>

          :
          <TouchableOpacity
          disabled={  user?.brand[0]?.uuid ? true : false}
            onPress={read_nfc}
            style={{ boxShadow: '0px 0px 5px 5px #1FFF62', backgroundColor: '#000000', width: 300, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
            <Text style={{ color: '#FFFFFF', fontWeight: 600 }}>Buscar dispositivo</Text>
          </TouchableOpacity>
        }

      </View>
      {/* End view separator */}



    </View>


    // End view Container
  );
}


// Styles

const styles = StyleSheet.create({

  text: {
    justifyContent: 'center',
    textAlign: 'center',
    color: '#ffffffff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 15
  },
  view_card: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#1FFF62',
    width: '100%',
    padding: 30,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#1fff626b',
    boxShadow: '0px 0px 5px 5px #1FFF62'


  },

  view_separator: {
    marginTop: '15%',
    width: '70%',
    alignItems: 'center',
    // height:'5%'
  },

  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  }
})
