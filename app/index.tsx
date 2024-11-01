import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

export default function MainScreen() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Espera hasta que el componente esté completamente montado
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      router.replace('./auth/login');
    }
  }, [isMounted, router]);

  return null;
}
