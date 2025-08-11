import { Tabs } from 'expo-router'
import { useContext } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import CustomHeader from '../../components/CustomHeader/CustomHeader'
import { AuthContext } from '../../context/AuthContext'

import { useTabAccess } from '../../Hooks/useTabAccess'

export default function TabLayout() {

  const { canAccessTab } = useTabAccess()

  
  const { user , login , token } = useContext( AuthContext );
  

  const thereisbrand = () => {

    return true

    // if( user.brand[0].uuid) {
    //   return true
    // } else {
    //   return false
    // }
  }


  return (

    <View style={{ backgroundColor:'#000000',  flex : 1}}>

    <CustomHeader /> 

    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown:false,
        tabBarStyle: {
          borderColor: '#1FFF62',
          position: 'absolute',
          backgroundColor: '#2E2E2F',
          borderTopWidth: 5,
          shadowColor: "#1FFF62",
          
          ...styles.shadow
        }
      }}>
        

      <Tabs.Screen
        name="index"
        options={{
         href: canAccessTab('index') ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('../../assets/images/home.png')}
                resizeMode='contain'
                style={{
                  width: 20,
                  height: 20,
                  tintColor: focused ? '#FFFFFF' : '#676D75'
                }}
                />
              <Text style={{
                fontSize: 10, color: focused ? '#FFFFFF' : '#676D75'
              }}>HOME </Text>
            </View>
          )
        }}
        />


         <Tabs.Screen
         
        name="details"
          options={{
          href: null,
        }}
        />


          <Tabs.Screen
         
        name="details_event"
          options={{
          href: null,
        }}
        />

          <Tabs.Screen
         
        name="edit_profile"
          options={{
          href: null,
        }}
        />

          <Tabs.Screen
         
        name="individual_chat"
          options={{
          href: null,
        }}
        />


        


      <Tabs.Screen
        name="search"
        options={{
                   href: canAccessTab('search') ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 100, alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('../../assets/images/search.png')}
                resizeMode='contain'
                style={{
                  width: 20,
                  height: 20,
                  tintColor: focused ? '#FFFFFF' : '#676D75'
                }}
                />
              <Text style={{
                
                fontSize: 10, color: focused ? '#FFFFFF' : '#676D75'
              }}>Search </Text>
            </View>
          )
        }}
        />


      <Tabs.Screen
        name="nfc"
        options={{
                             href: canAccessTab('nfc') ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 100, alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={

                  
                  thereisbrand() ? require('../../assets/images/central_nfc.png')  
                  :
                  require('../../assets/images/central_nfc_prohibited_with_border.png')
                }
                resizeMode='contain'
                style={{
                  width: 50,
                  height: 50,
                  top: -20,
                  // tintColor: focused ? '#FFFFFF' : '#0060dfff'
                }}
                />

            </View>
          )
        }}
        />


      <Tabs.Screen
        name="chat"
        options={{
                                       href: canAccessTab('chat') ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('../../assets/images/message.png')}
                resizeMode='contain'
                style={{
                  width: 20,
                  height: 20,
                  tintColor: focused ? '#FFFFFF' : '#676D75'
                }}
                />
              <Text style={{
                fontSize: 10, color: focused ? '#FFFFFF' : '#676D75'
              }}>Chat </Text>
            </View>
          )
        }}
        />

      <Tabs.Screen
        name="profile"
        options={{
                                       href: canAccessTab('profile') ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('../../assets/images/user.png')}
                resizeMode='contain'
                style={{
                  width: 20,
                  height: 20,
                  tintColor: focused ? '#FFFFFF' : '#676D75'
                }}
              />
              <Text style={{
                fontSize: 10, color: focused ? '#FFFFFF' : '#676D75'
              }}>Profile </Text>
            </View>
          )
        }}
        />



    </Tabs>
    
    </View>
  )
}

const styles = StyleSheet.create({
  shadow: {
    shadowOpacity: 0.58,
    shadowRadius: 16.00,

    elevation: 50,
  }
})
