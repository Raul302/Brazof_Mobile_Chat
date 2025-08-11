import { useContext, useState } from "react";
import { Dimensions, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";

import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";
import useCurrentTab from "../../Hooks/WhereIam_hook";


export default function CustomHeader() {

      const router = useRouter();


        const handleLogout = async () => {
    // await logout();
    router.replace('/closing_session'); // o simplemente 'login' según tu estructura de rutas
  }


        const [visible, setVisible] = useState(false);

  const toggleMenu = () => setVisible(!visible);
  
    const navigation = useNavigation();

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const currenTab = useCurrentTab();


    const { user } = useContext(AuthContext);


    const handleOptionPress = (option) => {
    console.log('Selected:', option);
    setVisible(false);
  };

    const different_header = (currenTab) => {

        if (currenTab !== 'chat'|| currenTab !== 'profile') {

            return true
        }
        return false

    }

    const showname = (name) => {
        if (!name) return 'US';
        
        const array_name = name.split(" ");
        
        // Handle single name or multiple names
        const firstInitial = array_name[0]?.charAt(0)?.toUpperCase() || 'U';
        const secondInitial = array_name[1]?.charAt(0)?.toUpperCase() || 'S';
        
        const formated_name = firstInitial + secondInitial;
        
        return formated_name;
    }
    return (

        <View style={different_header(currenTab) ?
            styles.custom_header
            :
            styles.custom_header_two
        }>
   {/* Menú modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        {/* Área semitransparente para cerrar el menú al tocar fuera */}
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>

          {/* Menú en sí */}
          <View style={styles.dropdown}>
            <TouchableOpacity  style={{justifyContent:'center',alignItems:'center'}} onPress={() => handleLogout()}>
            <Text style={ {backgroundColor:'red' , paddingLeft:20 , paddingRight:20 , paddingTop:10,paddingBottom:10,borderRadius:10,color:'white',justifyContent:'center' , alignItems:'center'}}>Cerrar session</Text>
            </TouchableOpacity>
          
          </View>

        </Pressable>
      </Modal>

            {
                different_header(currenTab)
                    ?
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.box_column}>
                            <Text style={styles.text}>
                                {user?.name}
                            </Text>
                            <Text style={styles.text}>

                                {user?.brand[0]?.uuid}

                            </Text>
                        </View>


                        <View style={{
                            borderColor: '#1FFF62',
                            borderWidth: 3,
                            backgroundColor: '#FFFFFF', height: 50, width: 50, borderRadius: 100, justifyContent: 'center', alignItems: 'center'
                        }}>
                            <TouchableOpacity onPress={toggleMenu} style={styles.button}>

                            <Text style={{ fontWeight: '600', color: '#000000' }}>
                                {user?.name &&
                                    [showname(user?.name)]
                                    
                                }
                            </Text>
                        </TouchableOpacity>
                        </View>
                        {/* <Image
                source={require('../../assets/images/profile_image.png')
                }
                resizeMode='contain'
                style={{
                    width: 50,
                    height: 50,
                }}
            /> */}
                    </View>
                    :

                    <View style={{ width: screenWidth, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'column' }}>
                            <Image
                                style={styles.logo}
                                source={require('../../assets/images/logowithouthbrackground.png')}
                            />
                           <View style={{ flexDirection:'row',justifyContent:'space-between',width:screenWidth }}>
                             <View
                            //  navigation.goBack();
                             style={{width:150,flexDirection:'row',alignItems:'center'}}>
                               <Pressable
                               onPress={(e) =>
                                 router.replace('callback')
                                }
                               style={{flexDirection:'row' , alignItems:'center'}}>
                                 <Image
                                    style={styles.arrow_left}
                                    tintColor={'#FFF'}
                                    source={require('../../assets/images/arrow-left.png')}
                                />
                                <Text style={{ color: '#FFF' }}>Back</Text>
                               </Pressable>
                            </View>

                            <View>
                              <Image
                                style={styles.notification_bell}
                                tintColor={'#FFF'}
                                source={require('../../assets/images/notification.png')}
                            />
                             </View>
                            </View>



                        </View>
                        <View>
                          
                        </View>




                    </View>
            }

         
        </View>

    )

}

const styles = StyleSheet.create({
     container: {
    marginTop: 100,
    alignItems: 'center',
  },

 
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 10,
    width: 200,
  },
  option: {
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
    arrow_left: {
 width: 25,
        height: 25
    },
    notification_bell: {
        width: 25,
        height: 25
    },
    logo: {
        width: 50,
        height: 50
    },
    text: {
        color: '#ffffff',

    },
    box_column: {
        marginRight: 10,
        // justifyContent:'flex-end',
        alignItems: 'flex-end'
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
    },
    custom_header_two: {
        borderBottomEndRadius: 10,
        borderStartEndRadius: 10,
        flexDirection: 'row',
        height: Dimensions.get('window').height * 0.1,
        width: '100%',
        justifyContent: "flex-end",
        alignItems: 'center',
        //   borderColor: '#1FFF62',
        // borderBottomColor: '#1FFF62',
        // backgroundColor: '#2E2E2F',
        // borderBottomWidth: 5,
        // shadowColor: "#1FFF62",
    }
})