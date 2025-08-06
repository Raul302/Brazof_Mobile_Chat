import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const LexContactsScreen = () => {
  const [search, setSearch] = useState('');

  const contacts = [
    { id: '1', name: 'María', lastMessage: '¿Nos vemos mañana?' },
    { id: '2', name: 'Carlos', lastMessage: 'Envió un archivo' },
    { id: '3', name: 'Ana', lastMessage: 'Gracias por tu ayuda' },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.contactItem}>
      <Text style={styles.avatar}>👤</Text>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lex Contacts</Text>

      <View style={styles.searchBar}>
        <TextInput
          placeholder="Buscar contacto..."
          style={styles.searchInput}
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

export default LexContactsScreen;
