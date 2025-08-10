import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { ActivityIndicator, Image, TextInput, View } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

export default function SearchIndex() {


  const { user }  = useContext ( AuthContext )

  const isFocused = useIsFocused()


const router = useRouter()

useEffect(() => {
  if (!isFocused) return;

  // Verificar que user y brand estén definidos
  if (!user || !user.brand) return;

  // Validar si tiene pulsera/marca
  if (user.brand.length === 0) {
    router.replace('/nfc')
    // Alert.alert(
    //   'Acceso restringido',
    //   'No cumples con los requisitos para acceder a esta sección.',
    // )
    return;
  }

  // Si todo bien, cargar datos
    //  load_chats();


}, [isFocused, user])


  return (
    <View style={{
      backgroundColor: '#000000',
      width: '100%',
      height: '100%',
      alignItems: 'center',


    }}>
      {/* View container SearchBox */}
      <View style={{ height:'40%'}}>
<View style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#676D75',
        borderWidth: 0.5,
        borderColor: '#000',
        paddingLeft:20,
        paddingRight:20,
        width:'80%',
        // height: 40,
        borderRadius: 20,
        marginTop:10
      }}>
        <Image
          source={require('../../assets/images/search.png')
          }
          style={{
            width: 18,
            height: 18,
            tintColor:'#FFFFFF'
          }}
        />
        <TextInput style={{ color:'#FFFFFF',width:'100%'}} placeholderTextColor={'#FFFFFF'} placeholder='Search event...'>
        </TextInput>
      </View>
      </View>

      <ActivityIndicator />
      
    </View>
  )
}
