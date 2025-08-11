import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { fetchData, procesarImagenesEntidades } from '../../context/apiClient';

export default function SearchIndex() {


  const { user }  = useContext ( AuthContext )
  const [publicidades, setPublicidades] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const isFocused = useIsFocused()


const router = useRouter()

useEffect(() => {
  if (!isFocused) return;

  // Verificar que user y brand estén definidos
  if (!user || !user.brand) return;

  // Validar si tiene pulsera/marca
  if (user.brand.length === 0) {
    router.replace('/nfc')
    return;
  }

  // Cargar publicidades
  cargarPublicidades();

}, [isFocused, user, router])

async function cargarPublicidades() {
  try {
    setLoading(true);
    const ads = await fetchData('/api/publicidad');

    if (ads && ads.length > 0) {
      // Asegurar compatibilidad de IDs antes de procesar imágenes
      ads.forEach((ad) => {
        ad.id = ad.id_publicidad;
      });

      await procesarImagenesEntidades(
        ads,
        'publicidad',
        'id_publicidad',
        'url',
        { width: 400, height: 200 },
      );

      setPublicidades(ads);
    } else {
      setPublicidades([]);
    }
  } catch (err) {
    console.error('Error cargando publicidades (Search):', err);
    setPublicidades([]);
  } finally {
    setLoading(false);
  }
}

  const filteredAds = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return publicidades;
    return publicidades.filter((p) => {
      const f = (v) => (v ? String(v).toLowerCase() : '');
      return (
        f(p.nombre).includes(q) ||
        f(p.descripcion).includes(q) ||
        f(p.oferta).includes(q) ||
        f(p.precio).includes(q) ||
        f(p?.producto?.nombre).includes(q) ||
        f(p?.evento?.nombre).includes(q)
      );
    });
  }, [publicidades, searchQuery]);

  return (
    <View
      style={{
        backgroundColor: '#000000',
        width: '100%',
        height: '100%',
        alignItems: 'center',
      }}
    >
      {/* Search box */}
      <View style={{ width: '100%', alignItems: 'center', paddingTop: 10, paddingBottom: 8 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: '#676D75',
            borderWidth: 0.5,
            borderColor: '#000',
            paddingLeft: 20,
            paddingRight: 20,
            width: '90%',
            height: 42,
            borderRadius: 20,
          }}
        >
          <Image
            source={require('../../assets/images/search.png')}
            style={{ width: 18, height: 18, tintColor: '#FFFFFF', marginRight: 10 }}
          />
          <TextInput
            style={{ color: '#FFFFFF', flex: 1 }}
            placeholderTextColor={'#FFFFFF'}
            placeholder='Buscar publicidad...'
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Publicidad list */}
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 120, paddingTop: 4 }}
          data={filteredAds}
          keyExtractor={(item) => String(item.id_publicidad || item.id)}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.85} style={{ width: '100%', marginBottom: 14 }}>
              <View style={{ width: '100%', backgroundColor: '#1a1a1a', borderRadius: 16, overflow: 'hidden' }}>
                {!!item.url && (
                  <Image
                    source={{ uri: item.url }}
                    style={{ width: '100%', height: 180, resizeMode: 'cover' }}
                  />
                )}
                <View style={{ padding: 12 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>
                    {item.nombre || 'Publicidad'}
                  </Text>
                  {!!item.descripcion && (
                    <Text style={{ color: '#cfcfcf', marginTop: 4 }} numberOfLines={2}>
                      {item.descripcion}
                    </Text>
                  )}
                  <View style={{ flexDirection: 'row', marginTop: 8, alignItems: 'center' }}>
                    {!!item.oferta && (
                      <Text style={{ color: '#1FFF62', fontWeight: '700', marginRight: 12 }}>
                        Oferta: {item.oferta}
                      </Text>
                    )}
                    {!!item.precio && <Text style={{ color: '#FFFFFF' }}>${item.precio}</Text>}
                  </View>
                  <View style={{ marginTop: 6 }}>
                    {!!item.producto?.nombre && (
                      <Text style={{ color: '#aaaaaa' }}>Producto: {item.producto.nombre}</Text>
                    )}
                    {!!item.evento?.nombre && (
                      <Text style={{ color: '#aaaaaa' }}>Evento: {item.evento.nombre}</Text>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={{ color: '#888', marginTop: 10, textAlign: 'center' }}>
              {publicidades.length === 0
                ? 'No hay publicidad disponible.'
                : 'Sin resultados para tu búsqueda.'}
            </Text>
          )}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      )}
    </View>
  )
}
