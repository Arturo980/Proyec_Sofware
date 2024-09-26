// app/auth/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    console.log('Login successful');
    router.push('/home'); // Navega a la pantalla principal después del login
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../../../assets/images/minetrack.png')} style={styles.logo} />

      {/* Título */}
      <Text style={styles.subtitle}>Inicia sesión</Text>

      {/* Campo de Email */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Campo de Password */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
        />
      </View>

      {/* Botón de inicio de sesión */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      {/* ¿Olvidaste tu contraseña? y Registro */}
      <TouchableOpacity onPress={() => { /* Navegar a la pantalla de recuperación */ }}>
        <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { /* Navegar a la pantalla de registro */ }}>
        <Text style={styles.register}>¡Regístrate!</Text>
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
