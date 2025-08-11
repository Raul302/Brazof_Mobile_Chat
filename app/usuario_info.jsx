import { useLocalSearchParams, useRouter } from "expo-router";
import { Button, Dimensions, Image, StyleSheet, Text, View } from "react-native";

export default function UsuarioIndex() {

      const {nombre_completo,email,direccion,telefono,rol,uuid, contacto_emergencia } = useLocalSearchParams();

      // console.log('User',usuario);
    

  const router = useRouter()


  const handleLogout = async () => {
    // await logout();
    router.replace('/closing_session'); // o simplemente 'login' según tu estructura de rutas
  }



  
  return (

    <View style={styles.container}>

      <View style={styles.parent}>
        <View style={styles.child}>
        </View>
      </View>
      <View style={{ top: -90, borderRadius: 300, width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ borderRadius: 200 }}>
          <Image
            source={require('../assets/images/Avatar.png')}
            resizeMode="cover"
            style={{ borderRadius: 200, margin: 10, width: 150, height: 150 }}
          />
        </View>
        <Text style={{ fontSize: 24, fontWeight: 600, justifyContent: 'center', alignItems: 'center', color: '#FFF' }}>
          {nombre_completo}
        </Text>
        <Text style={{ justifyContent: 'center', alignItems: 'center', color: '#FFF' }}>
          {email}
        </Text>
      </View>

      <View style={{
        top: -50, width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center', height: '35%'
      }}>
        <View style={{ padding: 20, flexDirection: 'column', backgroundColor: '#000', alignItems: 'left', width: '80%', height: '100%', borderRadius: 10 }}>
          <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
             <View style={{ marginTop:10 , flexDirection:'row', width:Dimensions.get('window').width/2 - 50}}>

              <Image
                source={require('../assets/images/contact.png')}
                tintColor={'#FFF'}
                resizeMode="cover"
                style={{ marginRight: 10, width: 18, height: 18 }}
                />
             
                <Text style={{ fontWeight:600, color: '#FFF' }}>
                  Direccion : </Text>
                </View>
             <View style={{ marginTop:10 , flexDirection:'row', width:Dimensions.get('window').width/2 - 50}}>

                    <Text style={{ color: '#FFF' }}>
                           {direccion}</Text>
                  </View>

            </View>
            <View>
              
            </View>
            <View>
              {/* <Text style={{color:'#FFF'}}>Another text</Text> */}
            </View>
            <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
             <View style={{ marginTop:10 , flexDirection:'row', width:Dimensions.get('window').width/2 - 50}}>
                <Image
                source={require('../assets/images/contact.png')}
                tintColor={'#FFF'}
                resizeMode="cover"
                style={{ marginRight: 10, width: 18, height: 18 }}
              />
             
                <Text style={{ fontWeight:600, color: '#FFF' }}>
                  Telefono : </Text>
              </View>
             <View style={{ marginTop:10 , flexDirection:'row', width:Dimensions.get('window').width/2 - 50}}>
                    <Text style={{ color: '#FFF' }}>
                           {telefono}</Text>

                </View>   
            </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
             <View style={{ marginTop:10 , flexDirection:'row', width:Dimensions.get('window').width/2 - 50}}>
               <Image
                source={require('../assets/images/contact.png')}
                tintColor={'#FFF'}
                resizeMode="cover"
                style={{ marginRight: 10, width: 18, height: 18 }}
              />
             
                <Text style={{ fontWeight:600, color: '#FFF' }}>
                  Contacto de emergencia : </Text>
             </View>
             <View style={{ marginTop:10 , flexDirection:'row', width:Dimensions.get('window').width/2 - 50}}>
                    <Text style={{ color: '#FFF' }}>
                           {contacto_emergencia}</Text>

                </View>   
            </View>
            </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
             <View style={{ marginTop:10 , flexDirection:'row', width:Dimensions.get('window').width/2 - 50}}>
               <Image
                source={require('../assets/images/contact.png')}
                tintColor={'#FFF'}
                resizeMode="cover"
                style={{ marginRight: 10, width: 18, height: 18 }}
              />
             
                <Text style={{ fontWeight:600, color: '#FFF' }}>ROL : </Text>
             </View>
             <View style={{ marginTop:10 , flexDirection:'row', width:Dimensions.get('window').width/2 - 50}}>
                    <Text style={{ color: '#FFF' }}>
                           {rol}</Text>

                </View>   
            </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
             <View style={{ marginTop:10 , flexDirection:'row', width:Dimensions.get('window').width/2 - 50}}>
               <Image
                source={require('../assets/images/central_nfc.png')}
                // tintColor={'#FFF'}
                resizeMode="cover"
                style={{ marginRight: 10, width: 18, height: 18 }}
              />
             
                <Text style={{ fontWeight:600, color: '#FFF' }}>Electronic Tag : </Text>
             </View>
             <View style={{ marginTop:10 , flexDirection:'row', width:Dimensions.get('window').width/2 - 50}}>
                    <Text style={{ color: '#FFF' }}>
                           {uuid}</Text>

                </View>   
            </View>
          </View>

          {/* Another view  */}


            


         

        





        </View>

      </View>

   

      <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Button title="Cerrar session" onPress={handleLogout} color="red" />
      </View>

    </View>

    //   <View>
    //     <Text>

    //   <View style={{ padding: 20 }}>
    //     <Button title="Limpiar datos" onPress={logout} color="red" />
    //   </View>
    // </Text>




    // </View>
  )
}

const styles = StyleSheet.create({

  container_two: {
    overflow: 'hidden', // Crucial for clipping the image to the circular shape
    alignSelf: 'center', // Center the circular image horizontally if needed
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensures the image covers the circular area
  },

  container: {
    backgroundColor: '#2E2E2F',
    height: '100%'
  },
  parent: {
    height: '25%',
    width: '100%',
    transform: [{ scaleX: 2 }],
    borderBottomStartRadius: 300,
    borderBottomEndRadius: 300,
    overflow: 'hidden',
    borderTopColor: '#000000',
    borderRightColor: '#000000',
    borderLeftColor: '#000000',
    borderRightWidth: 0.1,
    borderBottomWidth: 6,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomColor: '#1FFF62',
  },
  child: {
    flex: 1,
    transform: [{ scaleX: 0.5 }],

    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',

  }
})