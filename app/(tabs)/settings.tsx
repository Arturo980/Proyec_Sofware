import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userName');
      Alert.alert('Logout', 'Has salido correctamente.');
      // Aquí puedes redirigir al usuario a la pantalla de inicio de sesión o cualquier otra pantalla
    } catch (error) {
      console.error('Error al borrar el AsyncStorage', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      <Text style={styles.subtitle}>Bienvenido a tu perfil!</Text>
      <Text style={styles.description}>
        Aquí puedes ver y editar tu información personal.
      </Text>
      <Button title="Salir" onPress={handleLogout} color="#FF6347" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default ProfileScreen;
