import axios from 'axios';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import { authConfig } from "../../Constants/authConfig";
import { AuthContext } from "../../context/AuthContext";



export default function NFCIndex() {

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

      save_nfc_to_user( codigo_pulsera );

    }



  },[ codigo_pulsera])

  useEffect(() => {


    NfcManager.start()
      .then(() => console.log('NFC Manager started'))
      .catch(err => console.warn('NFC start error', err));
  }, []);

  

  const save_nfc_to_user =  ( codigo ) => {

    const obj = { uuid : codigo , status : 'activo' , id_usuario : user.id_usuario}



    try {

       axios.post(authConfig.business_api+'pulseras',{
      uuid : "01 8B 10 50" , status : 'activo' , id_usuario : user.id_usuario
     }, {
         headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`,
         'Accept': "application/json",
       }
    }).
      then((response) => {

        console.log('RESPONSE nfc', response.data);

      }).catch((error) => {


        console.log('Error en nfc', error.response.data)
      })

    } catch ( error ) {
      console.log('ERROR EN NFC',error);
    }


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

      if(tag.ndefMessage == undefined){
        set_scanning(false)
      }

      if (tag) {
        // Alert.alert('NFC Tag Detected', JSON.stringify(tag));

        if (tag.ndefMessage) {
          tag.ndefMessage.forEach((record) => {
            const payload = Uint8Array.from(record.payload);
            const text = Ndef.text.decodePayload(payload);
            // console.log('Decoded:', text);
            // console.log('PAYLOAD:', payload);

            try {
              const json = JSON.parse(text);
              if (json.uid) {
                set_codigo_pulsera(json.uid)
              }
            } catch (err) {
              console.warn('Payload is not valid JSON:', err);
            }
          });
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
            <Text style={styles.text}>
              PULSERA DE EVENTO NO DETECTADA ...
            </Text>

            <Image
              source={require('../../assets/images/central_nfc_prohibited.png')
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
            onPress={(e) =>  set_codigo_pulsera(12)}
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
