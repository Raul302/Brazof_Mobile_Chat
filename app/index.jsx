import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const router = useRouter();
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    console.log('ROL:', profile?.rol);

    if (!profile) {
      router.replace('/(auth)/login');
    } else if (profile.rol === 'Admin') {
      router.replace('/(admin)');
    } else {
      router.replace('/(tabs)');
    }
  }, [loading, profile]);

  return null;
}