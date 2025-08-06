import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from "react-native";
import { authConfig } from '../../Constants/authConfig';

export default function CustomHeader() {
    const [user, setUser] = useState(null);

    useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) return;

        const response = await fetch(`${authConfig.api_server}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data.data); // El "data" de successResponse
        } else {
          console.log('Error al obtener usuario:', data);
        }
      } catch (error) {
        console.log('Error de red:', error);
      }
    };

    loadUser();
  }, []);

    return (
        <View style={styles.custom_header}>
            <View style={styles.box_column}>
                <Text style={styles.text}>
                    {user ? user.nombre_completo : 'Cargando...'}
                </Text>
                <Text style={styles.text}>
                    {user ? user.correo : 'Cargando...'}
                </Text>
            </View>

            <Image
                source={require('../../assets/images/profile_image.png')
                }
                resizeMode='contain'
                style={{
                    width: 50,
                    height: 50,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: '#ffffff',
    },
    box_column: {
        marginRight: 20
        //    backgroundColor:'#ffffff'
        // shadowColor: "#1FFF62",
    },
    custom_header: {
        borderBottomEndRadius: 10,
        borderStartEndRadius: 10,
        flexDirection: 'row',
        height: '7%',
        width: '100%',
        justifyContent: "flex-end",
        alignItems: 'center',
        //   borderColor: '#1FFF62',
        borderBottomColor: '#1FFF62',
        backgroundColor: '#2E2E2F',
        borderBottomWidth: 5,
        // shadowColor: "#1FFF62",
    }
})