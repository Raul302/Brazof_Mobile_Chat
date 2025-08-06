import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { apiNegocioFetch, oauthFetch, responseData } from "../../contexts/apiClient";
import { useAuth } from "../../contexts/AuthContext";

const InboxIndex = () => {
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { profile } = useAuth();

  const cargarDatos = async () => {
    try {
      const usuariosRes = await responseData(await oauthFetch('/usuarios'));
      setUsuarios(usuariosRes);

      const chatsRes = await responseData(await apiNegocioFetch(
        `/chats?evento_id=1&usuario_id=${profile.id_usuario}`
      ));
      setChats(chatsRes);

      return { usuarios: usuariosRes, chats: chatsRes }; // ⬅ importante
    } catch (err) {
      console.error(err);
      return { usuarios: [], chats: [] };
    }
  };

  useEffect(() => {
    const cargarTodo = async () => {
      setLoading(true);
      const { usuarios, chats } = await cargarDatos();
      const lista = await formatearChats(usuarios, chats);
      console.log('Chats formateados:', lista.length);
      setContacts(lista);
      setLoading(false);
    };
    cargarTodo();
    const interval = setInterval(cargarTodo, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatearChats = async (usuarios, chats) => {
    const lista = await Promise.all(
      chats.map(async (chat) => {
        const otroId = chat.usuario_a === profile.id_usuario
          ? chat.usuario_b
          : chat.usuario_a;

        const usuario = usuarios.find(u => u.id_usuario === otroId);

        let ultimoMensaje = '';
        try {
          const id = chat.id_chat;
          const mensajes = await responseData(
            await apiNegocioFetch(`/mensajes/chat/${id}?chat_id=${id}`)
          );

          if (mensajes && mensajes.length > 0) {
            ultimoMensaje = mensajes[mensajes.length - 1].contenido;
          }
        } catch (e) {
          console.error('Error obteniendo mensajes:', e);
        }

        return {
          id: chat.id_chat,
          user_a: chat.usuario_a,
          user_b: chat.usuario_b,
          name: usuario ? usuario.nombre_completo : `Usuario ${otroId}`,
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
