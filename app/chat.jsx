import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const FrankChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hola, ¿cómo estás?', sender: 'received' },
    { id: '2', text: '¡Bien, gracias!', sender: 'sent' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: Date.now().toString(), text: newMessage, sender: 'sent' },
      ]);
      setNewMessage('');
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'sent' ? styles.sentBubble : styles.receivedBubble,
      ]}
    >
      <Text style={{ color: item.sender === 'sent' ? '#fff' : '#333' }}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* KeyboardAvoidingView para que el teclado no tape el input */}
      <KeyboardAvoidingView
        style={styles.mainContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100} // Ajusta si tu header es más alto
      >
        <View style={styles.chatContainer}>
          <Text style={styles.title}>Frank Chat</Text>

          <FlatList
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesContainer}
          />

          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Escribe un mensaje..."
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              activeOpacity={0.7}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mainContainer: {
    flex: 1,
    paddingTop: 10, // espacio para que no toque el header
    paddingBottom: 60, // espacio para que no toque la tabBar
    alignItems: 'center',
  },
  chatContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  title: {
    backgroundColor: '#1FFA60',
    color: 'white',
    padding: 16,
    fontSize: 20,
    textAlign: 'center',
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#676D75',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 18,
    marginBottom: 10,
  },
  sentBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1FFA60',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  inputArea: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#1FFA60',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FrankChatScreen;
