import * as WebBrowser from 'expo-web-browser';
import { useContext, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { authConfig } from '../../Constants/authConfig';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const clientId = authConfig.clientId;
  const redirectUri = authConfig.redirect_uri; // ej: 'brazof://callback'

  const authUrl = `${authConfig.server_uri}login?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${authConfig.scopes.join(' ')}&state=${authConfig.state}`;

  async function exchangeCodeForTokens(code) {
    try {
      const response = await fetch(`${authConfig.server_uri}token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          client_id: authConfig.clientId,
          client_secret: authConfig.clientSecret,
          redirect_uri: redirectUri,
          code,
        }),
      });

      const tokenData = await response.json();

      if (response.ok) {
        await login(tokenData.access_token, tokenData.refresh_token || '');
        // No hacemos navegación manual aquí, el federado se encarga
      } else {
        console.error('Error en token:', tokenData);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  }

  async function handleLogin() {
    setLoading(true);
    try {
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

      if (result.type === 'success' && result.url) {
        const match = result.url.match(/[?&]code=([^&]+)/);
        const code = match?.[1];

        if (code) {
          await exchangeCodeForTokens(code);
        } else {
          console.error('No se encontró código en la URL de redirección.');
        }
      } else if (result.type === 'dismiss') {
        console.log('El usuario canceló el login.');
      }
    } catch (error) {
      console.error('Error en openAuthSessionAsync:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../assets/images/logowithouthbrackground.png')} />
      <Text style={styles.textHeader}>Login</Text>
      <Text style={styles.normalText}>Discover an amazing experience with Us</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1FFF62" />
      ) : (
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  logo: { width: 200, height: 200, marginBottom: 30 },
  textHeader: { color: '#fff', fontSize: 30, fontWeight: 'bold' },
  normalText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 20,
    textAlign: 'center',
    width: '80%',
  },
  loginBtn: {
    backgroundColor: '#1FFF62',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  loginText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
