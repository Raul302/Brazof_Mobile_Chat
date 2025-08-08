import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fetchData } from "../contexts/apiClient";
import { useAuth } from "../contexts/AuthContext";

const InboxIndex = () => {
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState([]);
  const navigation = useNavigation();
  const { profile } = useAuth();

  useEffect(() => {
    const cargarTodo = async () => {
      const chats = await fetchData(`/api/chats?evento_id=1&usuario_id=${profile.id}`);

      // Se agrega el nombre completo del usuario a cada chat
      for (const chat of chats) {
        const otroId = chat.usuario_a === profile.id ? chat.usuario_b : chat.usuario_a;
        const usuario = await fetchData(`/api/usuarios/${otroId}`);
        chat.nombre_completo = usuario.nombre_completo || `Usuario ${otroId}`;
      }

      const lista = await formatearChats(chats);
      setContacts(lista);
    };
    cargarTodo();
    const interval = setInterval(cargarTodo, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatearChats = async (chats) => {
    const lista = await Promise.all(
      chats.map(async (chat) => {
        let ultimoMensaje = '';

        try {
          const id = chat.id_chat;
          const mensajes = await fetchData(`/api/mensajes/chat/${id}?chat_id=${id}`);

          if (mensajes.ok && mensajes.length > 0) {
            ultimoMensaje = mensajes[mensajes.length - 1].contenido;
          }
        } catch (e) {
          console.error('Error obteniendo mensajes:', e);
        }

        return {
          id: chat.id_chat,
          user_a: chat.usuario_a,
          user_b: chat.usuario_b,
          name: chat.nombre_completo,
          lastMessage: ultimoMensaje || 'Sin mensajes aún'
        };
      })
    );

    return lista;
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => navigation.navigate("chat", { chat: item })}
    >
      <Text style={styles.avatar}>👤</Text>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus Chats</Text>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Buscar contacto..."
          style={styles.searchInput}
          placeholderTextColor={'#444'}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contactList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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

export default InboxIndex;
