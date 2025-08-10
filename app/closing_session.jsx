import { useRouter } from 'expo-router';
import { useContext, useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function Closing_session() {

  const route = useRouter()
  const { token, user , login  , logout} = useContext(AuthContext);
  



  useEffect(  ()=>{

    
   const timeout = setTimeout(async () => {
      await logout();
    
  }, 1000); // Run once after 1 second

  return () => clearTimeout(timeout); // Cleanup (if needed)


  },[])

  



  


  return (
    <View style={{
      backgroundColor: '#000000',
      width: '100%',
      height: '100%',
      alignItems: 'center',


    }}>
      {/* View container SearchBox */}
      <View style={{ height: '40%' }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: '#676D75',
          borderWidth: 0.5,
          borderColor: '#000',
          paddingLeft: 20,
          paddingRight: 20,
          width: '80%',
          // height: 40,
          borderRadius: 20,
          marginTop: 10
        }}>


        </View>
      </View>

      <ActivityIndicator size={100} />
      <Text style={{ color: '#FFFFFF' }}>
        Cerrando session ...
      </Text>
    </View>
  )
}
