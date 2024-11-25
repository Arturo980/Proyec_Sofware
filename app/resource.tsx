import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { launchCamera, CameraOptions } from 'react-native-image-picker';
import { useRouter } from 'expo-router';

export default function ResourceScreen() {
  const [quantity, setQuantity] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null); // Inicializa con null
  const router = useRouter();

  const openCamera = () => {
    const options: CameraOptions = {
      mediaType: 'photo',  // El valor debe ser estrictamente 'photo', 'video' o 'mixed'
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        // Asigna la URI si está definida, si no, asigna null
        setImageUri(response.assets[0].uri ?? null);
      }
    });
  };

  const handleSave = () => {
    console.log('Cantidad de petróleo registrada:', quantity);
    // Aquí podrías realizar alguna acción adicional, como guardar la cantidad y la imagen.
    router.push('/home');  // Vuelve a la pantalla principal después de guardar
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Registrar Nivel de Petróleo</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingresa la cantidad de petróleo"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />

      <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
        <Text style={styles.cameraButtonText}>Abrir Cámara</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3B3B3',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 18,
  },
  cameraButton: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  cameraButtonText: {
    color: 'white',
    fontSize: 18,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#F0A500',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
