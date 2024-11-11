import { useEffect, useState } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [autoRotationEnabled, setAutoRotationEnabled] = useState(true); // Asumimos que está habilitada inicialmente

  useEffect(() => {
    // Función para actualizar la orientación
    const updateOrientation = async () => {
      const orientationInfo = await ScreenOrientation.getOrientationAsync();
      if (orientationInfo === ScreenOrientation.Orientation.LANDSCAPE_LEFT || 
          orientationInfo === ScreenOrientation.Orientation.LANDSCAPE_RIGHT) {
        setOrientation('landscape');
      } else {
        setOrientation('portrait');
      }
    };

    // Listener para cambios en la orientación
    const subscription = ScreenOrientation.addOrientationChangeListener(() => {
      if (autoRotationEnabled) { // Solo actualizamos si la rotación automática está habilitada
        updateOrientation();
      }
    });

    // Llamar para establecer la orientación inicial
    updateOrientation();

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, [autoRotationEnabled]);

  // Simulamos la verificación del estado de la rotación automática
  useEffect(() => {
    const checkAutoRotation = async () => {
      try {
        // Intentamos verificar el estado del sistema. Actualmente, esto es simulado.
        // Podrías adaptar esta parte si encuentras una librería nativa que lo haga.
        const systemAllowsRotation = true; // Esto es un placeholder
        setAutoRotationEnabled(systemAllowsRotation);
      } catch (error) {
        console.error('Error checking auto-rotation setting:', error);
        setAutoRotationEnabled(true); // Asumimos que está habilitada en caso de error
      }
    };

    checkAutoRotation();
  }, []);

  return orientation;
}
