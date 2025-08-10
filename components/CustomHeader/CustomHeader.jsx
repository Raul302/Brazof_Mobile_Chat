import { useContext } from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../../context/AuthContext";

import { useNavigation } from '@react-navigation/native';
import { useRouter } from "expo-router";
import useCurrentTab from "../../Hooks/WhereIam_hook";


export default function CustomHeader() {

      const router = useRouter();

    const navigation = useNavigation();

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const currenTab = useCurrentTab();


    const { user } = useContext(AuthContext);


    const different_header = (currenTab) => {

        if (currenTab !== 'chat'|| currenTab !== 'profile') {

            return true
        }
        return false

    }

    const showname = (name) => {

        const array_name = name.split(" ");

        const formated_name = (array_name[0].charAt(0).toUpperCase() + array_name[1].charAt(0).toUpperCase())

        return formated_name ?? 'US'
    }
    return (

        <View style={different_header(currenTab) ?
            styles.custom_header
            :
            styles.custom_header_two
        }>
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
                            <Text style={{ fontWeight: '600', color: '#000000' }}>
                                {user?.name &&
                                    [showname(user?.name)]

                                }
                            </Text>
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