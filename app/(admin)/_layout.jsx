import { Tabs } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import CustomHeader from '../../components/CustomHeader/CustomHeader';

export default function AdminLayout() {
  return (
    <View style={{ backgroundColor: '#000000', flex: 1 }}>
      <CustomHeader />

      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarStyle: {
            borderColor: '#1FFF62',
            position: 'absolute',
            backgroundColor: '#2E2E2F',
            borderTopWidth: 4,
            height: 60, // 🔹 Altura más compacta
            paddingBottom: 5,
            paddingTop: 5,
            ...styles.shadow
          }
        }}
      >
        {/* TAB: USUARIOS */}
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
                <Image
                  source={require('../../assets/images/home.png')}
                  resizeMode='contain'
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: focused ? '#FFFFFF' : '#676D75'
                  }}
                />
                <Text
                  style={[
                    styles.tabText,
                    { color: focused ? '#FFFFFF' : '#676D75' }
                  ]}
                  numberOfLines={1} // 🔹 Evita que se parta en dos líneas
                >
                  Usuarios
                </Text>
              </View>
            )
          }}
        />

        {/* TAB: PERFIL */}
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
                <Image
                  source={require('../../assets/images/user.png')}
                  resizeMode='contain'
                  style={{
                    width: 20,
                    height: 20,
                    tintColor: focused ? '#FFFFFF' : '#676D75'
                  }}
                />
                <Text
                  style={[
                    styles.tabText,
                    { color: focused ? '#FFFFFF' : '#676D75' }
                  ]}
                  numberOfLines={1}
                >
                  Perfil
                </Text>
              </View>
            )
          }}
        />

      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70, // 🔹 Controla que no se parta el texto
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
  },
  shadow: {
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  }
});
