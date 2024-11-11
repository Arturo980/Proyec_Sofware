import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setName(''); // Restablece el estado del nombre cuando la pantalla se enfoca
    }, [])
  );

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();

        if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
          Alert.alert('Error', 'Se requieren permisos para la cámara y la biblioteca de medios.');
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
        Alert.alert('Error', 'Hubo un problema al solicitar permisos.');
      }
    };

    requestPermissions();
  }, []);

  const handleLogin = async () => {
    if (name.length < 3) {
      Alert.alert('Error', 'Error Campo vacío');
      return;
    }

    try {
      await AsyncStorage.setItem('userName', name);
      console.log('Login successful');
      if (name === 'Admin') {
        router.push('/AdminHome');
        return;
      } else {
        router.push('/home');
      }
    } catch (error) {
      console.error('Error saving name to AsyncStorage:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Image source={require('@/assets/images/minetrack.png')} style={styles.logo} />
        <Text style={styles.subtitle}>Ingrese su nombre</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tu nombre"
            value={name}
            onChangeText={setName}
            onSubmitEditing={handleLogin}
            returnKeyType="done"
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4E4E4E',
    paddingHorizontal: 16,
  },
  logo: {
    width: 250,
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
    backgroundColor: '#F0A500',
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