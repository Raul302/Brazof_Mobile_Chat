import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { fetchData } from "../../context/apiClient";

export default function ProfileIndex() {

    const { user, updateUser } = useContext(AuthContext);
    console.log( ' USER ', user);

    const router = useRouter();
    const [nombreCompleto, setNombreCompleto] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [telefono, setTelefono] = useState(user?.telefono || "");
    const [direccion, setDireccion] = useState(user?.direccion || "");
    const [loading, setLoading] = useState(false);

    // PUT usando cliente compartido (maneja Bearer y CSRF para /oauth/*)
    const handleSave = async () => {
      try {
        setLoading(true);
        const body = {
          nombre_completo: nombreCompleto,
          email,
          telefono,
          direccion,
        };
        const resp = await fetchData(`/oauth/usuarios/${user?.id_usuario}`, {
          method: 'PUT',
          body,
        });

        let data;
        try { data = await resp.json(); } catch { data = null; }

        console.log('RES ', data?.errors || data);

        if (resp.ok) {
          const updated = (data && (data.data || data)) || {};
          // Mapear campos a nuestra forma local
          const next = {
            name: updated.name || updated.nombre_completo || nombreCompleto,
            email: updated.email ?? email,
            telefono: updated.telefono ?? telefono,
            direccion: updated.direccion ?? direccion,
          };
          await updateUser(prev => ({ ...(prev || {}), ...next }));
          Alert.alert('Perfil actualizado', 'Tus datos han sido actualizados correctamente.', [
            { text: 'OK', onPress: () => router.replace('/(tabs)/profile') },
          ]);
        } else {
          const msg = (data && (data.message || data.error)) || `No se pudo actualizar. (${resp.status})`;
          Alert.alert('Error', msg);
        }
      } catch (_e) {
        Alert.alert('Error', 'Ocurrió un error al actualizar tu perfil');
      } finally {
        setLoading(false);
      }
    };
return(

      <View style={styles.container}>
      
      <View style={styles.parent}>
     <View style={styles.child}>
     </View>
</View>
      {/* Botón regresar flotante, fuera del encabezado para no afectar su tamaño */}
      <Pressable onPress={() => router.replace('/(tabs)/profile')} style={styles.back_button}>
        <Image
          style={{ width: 25, height: 25 }}
          tintColor={'#FFF'}
          source={require('../../assets/images/arrow-left.png')}
        />
      </Pressable>
      {/* Se elimina el bloque de avatar/nombre/email para mantener el mismo alto visual del perfil */}

       <View style={{
        width: Dimensions.get('window').width , justifyContent:'center',alignItems:'center', marginTop: -96 }}>
          <Text style={styles.title}>Editar Perfil</Text>
          <View style={styles.card}>
            {/* Campos actualizables */}
            <Text style={styles.label}>Nombre completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu nombre"
              placeholderTextColor="#888"
              value={nombreCompleto}
              onChangeText={setNombreCompleto}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="tu@email.com"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              placeholder="Tu teléfono"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
            />

            <Text style={styles.label}>Dirección</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Tu dirección"
              placeholderTextColor="#888"
              multiline
              value={direccion}
              onChangeText={setDireccion}
            />

            <Pressable onPress={handleSave} style={styles.save_button} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.save_text}>Guardar cambios</Text>
              )}
            </Pressable>

          </View>

       </View>

       {/* Espaciador final */}
       <View style={{ height: 40 }} />
      
      </View>

)

}

const styles = StyleSheet.create({

   container_two: {
    overflow: 'hidden', // Crucial para recortar la imagen al círculo
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  container:{
    backgroundColor:'#2E2E2F',
    height:'100%'
  },
    parent : {
    height: '25%',
    width: '100%',
    transform: [{ scaleX: 2 }],
    borderBottomStartRadius: 300,
    borderBottomEndRadius: 300,
    overflow: 'hidden',
    borderTopColor:'#000000',
    borderRightColor:'#000000',
    borderLeftColor:'#000000',
    borderRightWidth:0.1,
    borderBottomWidth: 6,
    borderTopWidth:0,
    borderLeftWidth:0,
    borderBottomColor: '#1FFF62',
    },
    child : {
        flex : 1,
        transform : [ { scaleX : 0.5 } ],

        backgroundColor : '#000',
        alignItems : 'center',
        justifyContent : 'center',
    
    },
    back_button: {
      position: 'absolute',
      top: 24,
      left: 16,
      padding: 6,
      zIndex: 10,
    },
    card: {
      padding: 20,
      backgroundColor: '#000',
      width: '85%',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#1FFF62',
    },
    label: {
      color: '#FFF',
      marginTop: 10,
      marginBottom: 6,
      fontWeight: '600',
    },
    input: {
      backgroundColor: '#1b1b1b',
      color: '#FFF',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#333',
    },
    save_button: {
      marginTop: 18,
      backgroundColor: '#1FFF62',
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
    },
    save_text: {
      color: '#000',
      fontWeight: '700',
    },
    title: {
      color: '#FFF',
      fontSize: 20,
      fontWeight: '800',
      marginBottom: 10,
    },
})