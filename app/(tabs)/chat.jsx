import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';
import { authConfig } from '../../Constants/authConfig';
import { AuthContext } from '../../context/AuthContext';

export default function ChatIndex() {

  const screenWidth = Dimensions.get('window').width;



  const { token, user } = useContext(AuthContext);

  const [modal_scan_nfc, set_modal_scan_nfc] = useState(false);
  const [codigo_pulsera, set_codigo_pulsera] = useState()

  const [ conversations_formated , set_conversations_formated ] = useState([])

  const [loading , set_loading ] = useState(false);
  const navigation = useNavigation();

const isFocused = useIsFocused()
useEffect(() => {
  if (isFocused) {
    // El tab está activo
     load_chats();
  }
}, [isFocused])

 


  

 const load_chats = async () => {
  set_loading(true);

  try {
    const ruta = `${authConfig.business_api}chats/?usuario_id=${user.id_usuario}&evento_id=${user.event_id}`;

    const { data: chatResponse } = await axios.get(ruta, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    const conversations = chatResponse.data;

    if (!conversations || conversations.length === 0) {
      set_conversations_formated([]);
      set_loading(false);
      return;
    }

    const chatPromises = conversations.map(async (profile) => {
      try {
        const [nameRes, messageRes] = await Promise.all([
          axios.get(`https://api.brazof.space/api/usuarios/${profile.usuario_b}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          }),
          axios.get(`${authConfig.business_api}mensajes/chat/${profile.id_chat}?chat_id=${profile.id_chat}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          }),
        ]);

        const nombre_completo = nameRes.data.data.nombre_completo;
        const mensajes = messageRes.data.data;
        const last_message = mensajes.length > 0 ? mensajes[mensajes.length - 1].contenido : '';

        return {
          ...profile,
          nombre_completo,
          last_message,
        };
      } catch (err) {
        console.warn(`Error en chat con ID ${profile.id_chat}:`, err);
        return null; // O puedes devolver el `profile` sin last_message
      }
    });

    const settledResults = await Promise.allSettled(chatPromises);
    const chats = settledResults
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value);

    set_conversations_formated(chats);
  } catch (error) {
    console.error('Error cargando chats:', error);
    set_conversations_formated([]);
  } finally {
    set_loading(false);
  }
};


  const open_modal_scan_nfc = async () => {
    set_modal_scan_nfc(true);


    const interval = setInterval(() => {

      if (codigo_pulsera == null) {
        scan_nfc()
      } else {
        return () => clearInterval(interval);
      }
    }, 500)




    // while( codigo_pulsera == null) {

    //   await scan_nfc()
    // }


  }

     const showname = (name) => {

        const array_name = name.split(" ");

        const formated_name = (array_name[0].charAt(0).toUpperCase() + array_name[1].charAt(0).toUpperCase())

        return formated_name ?? 'US'
    }


  const scan_nfc = async () => {
    try {
      // Wait for NDEF-compatible tag
      await NfcManager.requestTechnology([NfcTech.Ndef, NfcTech.NfcA]);

      // console.log('NFC tech acquired.');

      const tag = await NfcManager.getTag();
      // console.log('Tag received:', tag);
      // console.log(' PAY ', tag.ndefMessage);

      if (tag) {
        // Alert.alert('NFC Tag Detected', JSON.stringify(tag));

        if (tag.ndefMessage) {
          tag.ndefMessage.forEach((record) => {
            const payload = Uint8Array.from(record.payload);
            const text = Ndef.text.decodePayload(payload);
            // console.log('Decoded:', text);

            try {
              const json = JSON.parse(text);
              // console.log('UID:', json.uid);
              if (json.uid) {
                set_codigo_pulsera(json.uid)
              }
            } catch (err) {
              console.warn('Payload is not valid JSON:', err);
              console.log('CATCH ERROR')
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
        // console.log('NFC tech released.');
      } catch (cancelEx) {
        console.warn('Error cancelling NFC tech request', cancelEx);
      }
    }

  }

 
  const renderItem = ({ item }) => (
    <TouchableOpacity 
    key={'touchable'+item.id_chat}
     onPress={() => {
      // console.log('ITEMX',item)
        navigation.navigate('individual_chat', { usuario_a: item.usuario_a , usuario_b: item.usuario_b , chat_id : item.id_chat });
                // load_messages_from_conversation(item.usuario_a)
              }}
    style={styles.contactItem}>

      <View
          key={'view_'+item.id_chat}
      style={{
        borderColor: '#1FFF62',
        borderWidth: 3,
        backgroundColor: '#FFFFFF', height: 50, width: 50, borderRadius: 100, justifyContent: 'center', alignItems: 'center'
      }}>
        <Text 
            key={'text'+item.id_chat}
style={{ fontWeight: '600', color: '#000000' }}>
          {item?.nombre_completo &&
            [showname(item?.nombre_completo)]

          }
        </Text>
      </View>

      <Text 
          key={'avatar_'+item.id_chat}
style={styles.avatar}></Text>
      <View 
          key={'view_contact_info'+item.id_chat}

style={styles.contactInfo}>
        <Text 
            key={'fullname_'+item.id_chat}
style={styles.contactName}>{item.nombre_completo}</Text>
        <Text 
            key={'last_message'+item.id_chat}
style={styles.lastMessage}>{item.last_message}</Text>


            {/* { id: '1', name: 'María', lastMessage: '¿Nos vemos mañana?' }, */}



      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* Modal rating  */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modal_scan_nfc}
        onRequestClose={() => {
          set_modal_scan_nfc(!modal_scan_nfc);
        }}>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#000000', borderWidth: 0.5, borderColor: '#1FFF62', borderRadius: 10, height: 280, width: '90%', alignItems: 'center', justifyContent: 'center' }}>

            <Text style={{ textAlign: 'center', marginBottom: 10, color: '#FFF', fontSize: 20 }}>Aproxime su pulsera o ingrese el codigo manualmente</Text>

            <TextInput
              placeholder="Codigo pulsera..."
              style={styles.inputcode}
              value={codigo_pulsera}
              onChangeText={set_codigo_pulsera}
            />

            {!codigo_pulsera &&
              <View>
                <ActivityIndicator style={{ marginTop: 10, marginBottom: 10 }} />
                <Text style={{ color: '#FFFFFF' }}>Escaneando...</Text>
              </View>

            }


            <View style={{
              boxShadow: '0px 0px 5px 5px #1FFF62',
              borderRadius: 15,
              marginTop: '5%', marginBottom: '5%'
            }}>


              {/* <Shadow distance={5} startColor={'#1FFF62'} endColor={'#ff00ff10'} offset={[0, 0]}> */}
              <TouchableOpacity
                onPress={(e) => set_modal_scan_nfc(false)}
                style={{ backgroundColor: '#000000', width: screenWidth / 2, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }}>
                <Text style={{ color: '#FFFFFF', fontWeight: 600 }}>Cerrar</Text>
              </TouchableOpacity>
              {/* </Shadow> */}
            </View>
          </View>
        </View>
      </Modal>

      {/* End modal rating */}
      <Text style={styles.title}>Conversaciones</Text>
      {
        conversations_formated.length > 0 ?

        <FlatList
                data={conversations_formated}
                renderItem={renderItem}
                keyExtractor={(item) => item.usuario_b}
                contentContainerStyle={styles.contactList}
              />
        :
        <ActivityIndicator />


      
      }

      <View style={{ alignItems: 'center', marginBottom: '10%', backgroundColor: '' }}>

        <TouchableOpacity
          onPress={(e) => open_modal_scan_nfc()}
          style={styles.loginBtn}>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.loginText}>+</Text>
            <Text style={styles.loginText}>Chat</Text>
          </View>
        </TouchableOpacity>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  loginBtn: {
    backgroundColor: '#1FFF62',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 80,
  },
  loginText: { color: '#000', fontSize: 24, fontWeight: 'bold' },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 60, // espacio para la TabBar
    backgroundColor: '#000000',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchBar: {
    marginVertical: 20,

  },
  inputcode: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    width: '50%',
    borderColor: '#ddd',
    backgroundColor: '#1FFA60',
  },
  searchInput: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#1FFA60',
  },
  contactList: {
    paddingBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1FFA60',

  },
  avatar: {
    fontSize: 24,
    marginRight: 15,
  },

  contactInfo: {
    flex: 1,
    color: '#FFFFFF',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  lastMessage: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});

