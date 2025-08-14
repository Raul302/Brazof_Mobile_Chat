import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useLocalSearchParams } from 'expo-router';
import _ from 'lodash';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { authConfig } from '../../Constants/authConfig';
import { AuthContext } from '../../context/AuthContext';

dayjs.extend(relativeTime);

export default function individual_chat() {
  const { token, user, socket } = useContext(AuthContext);
  const { usuario_a, usuario_b, chat_id } = useLocalSearchParams();
  const [messages, set_messages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);
  const tabBarHeight = useBottomTabBarHeight();
  const isFocused = useIsFocused();

  // Cargar mensajes cuando el chat está enfocado
  useEffect(() => {
    load_messages_from_conversation(chat_id);
  }, [isFocused]);

  // Escuchar mensajes entrantes por socket
  useEffect(() => {
    if (!socket) return;

    socket.on('nuevo_mensaje', (mensaje) => {
      set_messages((prev) => [...prev, mensaje]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      socket.off('nuevo_mensaje');
    };
  }, [socket]);

  const load_messages_from_conversation = async (chat_id) => {
    try {
      const ruta = `${authConfig.business_api}mensajes/chat/${chat_id}?chat_id=${chat_id}`;
      const { data: chatResponse } = await axios.get(ruta, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const conversatmessages = _.orderBy(chatResponse.data, 'timestamp', 'ASC');
      set_messages(conversatmessages);

      console.log('HOLA ejecute load messages',)
    } catch (error) {
      Alert.alert(error.response?.data?.message || 'Error al cargar mensajes');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const obj = {
      id_remitente: user.id_usuario,
      id_destinatario: user.id_usuario == usuario_a ? usuario_b : usuario_a,
      contenido: newMessage,
      chat_id: chat_id,
    };

    try {
      await axios.post(`${authConfig.business_api}mensajes`, obj, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

        await axios.post('http://138.68.43.245:3000/mensajes', obj, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      
      // Emitir evento para notificar al destinatario en tiempo real
      socket?.emit('mensaje_enviado', obj);

      setNewMessage('');
      Keyboard.dismiss();
      await load_messages_from_conversation(chat_id);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.log('Error al enviar mensaje:', error);
      Alert.alert('Error al enviar mensaje');
    }
  };

  const renderItem = ({ item , index }) => {
    const isMe = item.id_remitente === user.id_usuario;
    return (
      <View
      key={'superview_' + index}
        style={[
          styles.messageContainer,
          isMe ? styles.messageRight : styles.messageLeft,
        ]}
      >
        <Text 
              key={'text_super_view' + index}
style={styles.messageText}>{item.contenido}</Text>
        <Text 
                      key={'text_super_view_date_time' + index}

style={styles.messageTime}>
          {dayjs(item.timestamp).subtract(6, 'hour').fromNow()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id_mensaje?.toString()}
          contentContainerStyle={[styles.messagesList, { paddingBottom: tabBarHeight + 70 }]}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={[styles.inputContainer, { marginBottom: tabBarHeight }]}>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu mensaje..."
            placeholderTextColor="#888"
            value={newMessage}
            onChangeText={setNewMessage}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2E2E2F',
  },
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
    maxWidth: '75%',
  },
  messageLeft: {
    backgroundColor: '#c5f1d3',
    alignSelf: 'flex-start',
  },
  messageRight: {
    backgroundColor: '#a3e4b3',
    alignSelf: 'flex-end',
    borderColor: '#1FFF62',
    borderWidth: 2,
  },
  messageText: {
    fontSize: 16,
    color: '#1a3c26',
  },
  messageTime: {
    fontSize: 11,
    color: '#1a3c26',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#b0e6c1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1fdf5',
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    borderRadius: 20,
    fontSize: 16,
    color: '#1a3c26',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#34C759',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
