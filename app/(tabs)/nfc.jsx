import { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import NfcManager, { NfcTech } from 'react-native-nfc-manager';




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
    if (scanning) {
      read_nfc();
    } else {
      NfcManager.unregisterTagEvent().catch(() => null);

    }

    () => NfcManager.cancelTechnologyRequest(); // unmount the scanner on navigate away.
  }, [nfcReader]);



  const read_nfc = async () => {

    set_scanning(true)
    try {
      const supported = await NfcManager.isSupported();
      const nfcEnabled = await NfcManager.isEnabled();

      set_nfc_status({ supported: supported, enabled: nfcEnabled })


      if (!supported || !nfcEnabled) {
        console.warn('NFC not supported or not enabled');
        alert('NFC not supported or not enabled');
        return;
      }

      await NfcManager.start();

      await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'Hold your device over the NFC tag',
      });

      const tag = await NfcManager.getTag();
      console.log('NFC Tag:', tag.id);

      if (tag) {
        try {
          setNfcData(tag)
          const status = await NfcManager.ndefHandler.getNdefStatus();
          console.log('NDEF status:', status);
          tag.ndefStatus = status;

          if (tag.ndefMessage && tag.ndefMessage[0]) {
            const payload = tag.ndefMessage[0].payload;
            const decoded = Ndef.uri.decodePayload(payload);
            console.log('Decoded NFC Data:', decoded);
          } else {
            console.warn('No NDEF message found.');
          }

          set_scanning(false);
        } catch (innerError) {
          console.warn('Failed to decode NDEF:', innerError);
        }
      }

      await NfcManager.cancelTechnologyRequest();
      updateNfc(!nfcReader);
    } catch (error) {
      // console.warn('NFC ERROR:', error);
      await NfcManager.cancelTechnologyRequest().catch(() => null);
      updateNfc(!nfcReader);
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
            onPress={(read_nfc)}
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
