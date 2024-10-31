import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    // Verifica si el nombre tiene al menos 3 caracteres
    if (name.length < 3) {
      Alert.alert('Error', 'Error Campo vacío');
      return; // Evita continuar si el nombre es inválido
    }

    try {
      // Guarda el nombre en AsyncStorage
      await AsyncStorage.setItem('userName', name);
      console.log('Login successful');
      router.push('/home'); // Navega a la pantalla principal después del login
    } catch (error) {
      console.error('Error saving name to AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('@/assets/images/minetrack.png')} style={styles.logo} />

      {/* Título */}
      <Text style={styles.subtitle}>Ingrese su nombre</Text>

      {/* Campo de Nombre */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          value={name}
          onChangeText={setName}
          onSubmitEditing={handleLogin} // Redirige al presionar Enter
          returnKeyType="done" // Cambia el tipo de botón de retorno
        />
      </View>

      {/* Botón de inicio de sesión (opcional) */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Siguiente</Text>
      </TouchableOpacity>

    </View>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4E4E4E',  // Fondo gris similar
    paddingHorizontal: 16,
  },
  logo: {
    width: 250,  // Ajusta el tamaño del logo
    height: 250,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#EAEAEA',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#F0A500',  // Botón amarillo
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#757573',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  register: {
    color: '#757573',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
});
