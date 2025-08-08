import { Tabs } from 'expo-router'
import { Image, StyleSheet, Text, View } from 'react-native'
import CustomHeader from '../../components/CustomHeader/CustomHeader'

export default function TabLayout() {

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
          borderTopWidth: 4,
          height: 60, // 🔹 Altura más compacta
          paddingBottom: 5,
          paddingTop: 5,
          shadowColor: "#1FFF62",
          ...styles.shadow
        }
      }}>
        

      <Tabs.Screen
        name="index"
        options={{
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
        name="search"
        options={{
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
          tabBarIcon: ({ focused }) => (
            <View style={{ width: 100, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ position: 'relative', width: 50, height: 50, top: -20 }}>
                <Image
                  source={require('../../assets/images/central_nfc.png')}
                  resizeMode='contain'
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
                {focused && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -4,
                      left: -4,
                      right: -4,
                      bottom: -4,
                      borderWidth: 4,
                      borderColor: '#1fff629f',
                      borderRadius: 100,
                    }}
                  />
                )}
              </View>
            </View>
          )
        }}
        />


      <Tabs.Screen
        name="inbox"
        options={{
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
              }}>Inbox </Text>
            </View>
          )
        }}
        />

      <Tabs.Screen
        name="profile"
        options={{
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
