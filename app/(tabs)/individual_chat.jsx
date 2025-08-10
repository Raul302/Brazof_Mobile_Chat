import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { authConfig } from '../../Constants/authConfig';
import { AuthContext } from '../../context/AuthContext';
var _ = require('lodash');

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';


export default function individual_chat() {

  dayjs.extend(relativeTime)

  const { token, user, login, logout } = useContext(AuthContext)

  const { usuario_a, usuario_b, chat_id } = useLocalSearchParams();

  const [messages, set_messages] = useState([{}])

  useEffect(() => {

    load_messages_from_conversation(usuario_a)

  }, [])



  const load_messages_from_conversation = async (usuario_a = 0) => {

    try {
      const ruta = `${authConfig.business_api}mensajes?usuario=${usuario_a}`;

      const { data: chatResponse } = await axios.get(ruta, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const conversatmessages = _.orderBy(chatResponse.data, 'timestamp', 'ASC');


      set_messages(conversatmessages);


    } catch (error) {
      console.log('ERROR INDIVIDUAL CHATS', error)
    }



  }

  //  const [messages, setMessages] = useState([
  //   { id: '1', text: 'Hola, ¿cómo estás?', sender: 'otro' },
  //   { id: '2', text: '¡Todo bien! ¿Y tú?', sender: 'yo' },
  // ]);

  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  const sendMessage = async () => {

    try {

      const obj = {
        id_remitente: user.id_usuario,
        id_destinatario: user.id_usuario == usuario_a ? usuario_b : usuario_a,
        contenido: newMessage,
        chat_id: chat_id
      }
      const sending_message = await axios.post(authConfig.business_api + 'mensajes', obj, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!newMessage.trim()) return;

      const message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: 'yo',
      };

      // setMessages(prev => [...prev, message]);
      setNewMessage('');
      Keyboard.dismiss();

      load_messages_from_conversation(usuario_a)
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (error) {
      console.log('ERRROR', error)
    }
  };

  const renderItem = ({ item , index }) => {

    const isMe = item.id_remitente === user.id_usuario;
    return (
      <View
        key={'view_'+index+item.id_mensaje}
        style={[
          styles.messageContainer,
          isMe ? styles.messageRight : styles.messageLeft,
        ]}
      >
        <Text key={'_contenido' +index+ item.id_mensaje} style={styles.messageText}>{item.contenido}</Text>
        <Text key={'_contenido_fecha' + index+item.id_mensaje} style={{
          fontSize: 11,
          color: '#1a3c26',
        }}>
          {dayjs(item.timestamp).subtract(6, 'hour').fromNow()}

          {/* {dayjs(item.timestamp).fromNow()} */}

        </Text>
      </View>
    );
  };


  return (

    <View style={styles.container_father}>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={80}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id_mensaje}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#888"
            value={newMessage}
            onChangeText={setNewMessage}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

    </View>

  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e6f9ec', // fondo verde muy claro
  },
  container_father: {
    backgroundColor: '#2E2E2F',
    height: (Dimensions.get('window').height - 100)
  },
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 10,
    flexGrow: 1,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
    maxWidth: '75%',
  },
  messageLeft: {
    backgroundColor: '#c5f1d3', // verde claro para "otro"
    alignSelf: 'flex-start',
  },
  messageRight: {
    backgroundColor: '#a3e4b3', // verde un poco más fuerte para "yo"
    alignSelf: 'flex-end',
    borderColor: '#1FFF62',
    borderWidth: 2
  },
  messageText: {
    fontSize: 16,
    color: '#1a3c26',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    height: 100,
    borderTopWidth: 1,
    borderTopColor: '#b0e6c1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    // top:-50,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1fdf5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 16,
    color: '#1a3c26',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#34C759', // verde botón
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});




