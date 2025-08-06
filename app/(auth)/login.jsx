import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { authConfig } from '../../Constants/authConfig';

export default function Login() {
  const router = useRouter();
  const webviewRef = useRef(null);
  const [showAuth, setShowAuth] = useState(false);

  // const clientId = '2';
  // const redirectUri = 'brazof://callback';
  const authUrl = `${authConfig.server_uri}login?client_id=${authConfig.clientId}&redirect_uri=${encodeURIComponent(
    authConfig.redirectUrl
  )}&response_type=code&scope=read&state=${authConfig.state}`;

  const onNavStateChange = (navState) => {
    const { url } = navState;
    console.log('WebView navigated to:', url);

    if (url.startsWith(redirectUri)) {
      const match = url.match(/[?&]code=([^&]+)/);
      const code = match?.[1];
      if (code) {
        console.log('URL ', url );
        console.log('OAuth code received:', code);
        exchangeCodeForToken(code);
        setShowAuth(false);
        router.replace('/(tabs)');
      }
      return false
    }

    return true
  };

  const exchangeCodeForToken = async (code) => {
    // TODO: call your token exchange endpoint here
    console.log('Exchanging code for token:', code);
  };

  return (

    
    <View style={styles.container}>

       <Image
        style={styles.logo}
        source={require('../../assets/images/logowithouthbrackground.png')}
      />


       <Text style={styles.textHeader}>Login</Text>
       <Text style={styles.normalText}>Discover an amazing experience with Us</Text>


      {!showAuth && (
        <TouchableOpacity style={styles.loginBtn} onPress={() => setShowAuth(true)}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      )}

      {showAuth && (
        <View style={styles.webviewContainer}>
          <ActivityIndicator style={styles.spinner} size="large" color="#1FFF62" />
          <WebView
            ref={webviewRef}
            source={{ uri: authUrl }}
            onShouldStartLoadWithRequest={onNavStateChange}
            startInLoadingState
            javaScriptEnabled
            domStorageEnabled
          />
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowAuth(false)}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({


  
  container_content: {
    // backgroundColor: '#4b3ccfff',
    width: '77%',
    marginTop:'5%'

  },
  text_with_shadow: {
    color: '#FFFFFF',
    marginTop: '5%',
    marginLeft: 'auto',
    textShadowColor: "#FFFFFF",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,

  },
  view_separator: {
    marginTop: '30%',
    width: '100%',
    alignItems: 'center',
     backgroundColor: ' #1FFF62',
    boxShadow: '0px 0px 10px 10px #1FFF62',
    borderRadius:20,
    // height:'5%'
  },
  input: {
    width: 300,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,

  },
  normalText: {
    marginTop: '20%',
    marginBottom:100,
    width: '70%',
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
      textShadowColor: "#1FFF62",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },

  textHeader: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold'
  },

  logo: {
    width: 200,
    height: 200,
    marginTop: '10%'
  },

  container: {
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  // container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loginBtn: {
    backgroundColor: '#1FFF62',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  loginText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  webviewContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    bottom: 50,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1FFF62',
  },
  spinner: { position: 'absolute', top: '50%', left: '50%' },
  closeBtn: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#000',
    padding: 12,
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontSize: 16 },
});