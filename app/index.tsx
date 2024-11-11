import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useOrientation from '@/hooks/useOrientation';

export default function MainScreen() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const orientation = useOrientation();

  useEffect(() => {
    // Espera hasta que el componente esté completamente montado
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkUserName = async () => {
      try {
        const userName = await AsyncStorage.getItem('userName');
        if (userName) {
          router.replace('./home');
        } else {
          router.replace('./auth/login');
        }
      } catch (error) {
        console.error('Error reading userName from AsyncStorage', error);
        router.replace('./auth/login');
      }
    };

    if (isMounted) {
      checkUserName();
    }
  }, [isMounted, router]);

  return null;
}