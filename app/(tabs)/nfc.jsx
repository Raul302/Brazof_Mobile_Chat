import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';



export default function NFCIndex() {


  const [nfcData, setNfcData] = useState(null);
  const [nfcReader, updateNfc] = useState(false);
  const [scanning, set_scanning] = useState(false);

  const [nfc_status, set_nfc_status] = useState(
    {
      supported: false,
      enabled: false
    }
  )

useEffect(() => {
  NfcManager.start()
    .then(() => console.log('NFC Manager started'))
    .catch(err => console.warn('NFC start error', err));
}, []);



  const read_nfc = async () => {

    set_scanning(true)
     console.log('Requesting NFC tech...');

  try {
    // Wait for NDEF-compatible tag
await NfcManager.requestTechnology([NfcTech.Ndef, NfcTech.NfcA]);

console.log('NFC tech acquired.');

    const tag = await NfcManager.getTag();
    // console.log('Tag received:', tag);
    // console.log( ' PAY ', tag.ndefMessage);

    if (tag) {
      // Alert.alert('NFC Tag Detected', JSON.stringify(tag));

      if( tag.ndefMessage ) {
         tag.ndefMessage.forEach((record) => {
    const payload = Uint8Array.from(record.payload);
    const text = Ndef.text.decodePayload(payload);
    // console.log('Decoded:', text);

    try {
      const json = JSON.parse(text);
      console.log('UID:', json.uid);
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
      console.log('NFC tech released.');
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
              ESCANEANDO...
            </Text>

            <ActivityIndicator />
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
       { nfcData &&
        <Text style={styles.text}>
          Pulsera vinculada : {nfcData.id}
          </Text>
       }


        {scanning ?

          <TouchableOpacity
            onPress={(e) =>set_scanning(false)}
            style={{ boxShadow: '0px 0px 5px 5px #1FFF62', backgroundColor: '#000000', width: 300, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
            <Text style={{ color: '#FFFFFF', fontWeight: 600 }}>Detener</Text>
          </TouchableOpacity>

          :
          <TouchableOpacity
            onPress={read_nfc}
            style={{ boxShadow: '0px 0px 5px 5px #1FFF62', backgroundColor: '#000000', width: 300, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
            <Text style={{ color: '#FFFFFF', fontWeight: 600 }}>Escanear</Text>
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
    marginBottom:15
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
