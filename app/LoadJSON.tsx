import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';

export default function LoadJSONScreen() {
  const router = useRouter();
  const [turnosFile, setTurnosFile] = useState(null);
  const [equiposFile, setEquiposFile] = useState(null);

  const handlePickTurnosFile = async () => {
    console.log('Opening Turnos file picker');
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      console.log('Turnos file picker result:', result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setTurnosFile(result.assets[0]);
        console.log('Turnos file selected:', result.assets[0].uri);
        Alert.alert('Archivo Seleccionado', `Se ha cargado el archivo de opciones de Turnos: ${result.assets[0].name}`);
      } else {
        console.log('Turnos file selection cancelled');
      }
    } catch (error) {
      console.error('Error picking Turnos file:', error);
    }
  };

  const handlePickEquiposFile = async () => {
    console.log('Opening Equipos file picker');
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      console.log('Equipos file picker result:', result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setEquiposFile(result.assets[0]);
        console.log('Equipos file selected:', result.assets[0].uri);
        Alert.alert('Archivo Seleccionado', `Se ha cargado el archivo de opciones de Equipos: ${result.assets[0].name}`);
      } else {
        console.log('Equipos file selection cancelled');
      }
    } catch (error) {
      console.error('Error picking Equipos file:', error);
    }
  };

  const handleLoadFiles = async () => {
    try {
      if (turnosFile) {
        console.log('Loading Turnos file:', turnosFile.uri);
        const turnosContent = await FileSystem.readAsStringAsync(turnosFile.uri);
        console.log('Turnos file content:', turnosContent);
        const parsedTurnos = JSON.parse(turnosContent);
        await AsyncStorage.setItem('optionsTurnos', JSON.stringify(parsedTurnos));
        Alert.alert('Cargado', 'El archivo JSON de Turnos se ha cargado correctamente.');
        console.log('Turnos file loaded successfully');
      } else {
        console.log('No Turnos file selected');
      }
      if (equiposFile) {
        console.log('Loading Equipos file:', equiposFile.uri);
        const equiposContent = await FileSystem.readAsStringAsync(equiposFile.uri);
        console.log('Equipos file content:', equiposContent);
        const parsedEquipos = JSON.parse(equiposContent);
        await AsyncStorage.setItem('optionsEquipos', JSON.stringify(parsedEquipos));
        Alert.alert('Cargado', 'El archivo JSON de Equipos se ha cargado correctamente.');
        console.log('Equipos file loaded successfully');
      } else {
        console.log('No Equipos file selected');
      }
      router.push('../AdminHome');
    } catch (error) {
      console.error('Error loading JSON files:', error);
      Alert.alert('Error', 'Hubo un problema al cargar los archivos JSON.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cargar Opciones en formato .JSON</Text>
      <TouchableOpacity style={styles.pickButton} onPress={handlePickTurnosFile}>
        <Text style={styles.buttonText}>Cargar opciones de Turnos</Text>
      </TouchableOpacity>
      {turnosFile && (
        <Text style={styles.fileNameText}>Archivo seleccionado: {turnosFile.name}</Text>
      )}
      <TouchableOpacity style={styles.pickButton} onPress={handlePickEquiposFile}>
        <Text style={styles.buttonText}>Cargar opciones de Equipos</Text>
      </TouchableOpacity>
      {equiposFile && (
        <Text style={styles.fileNameText}>Archivo seleccionado: {equiposFile.name}</Text>
      )}
      <TouchableOpacity style={styles.loadButton} onPress={handleLoadFiles}>
        <Text style={styles.buttonText}>Guardar Opciones</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E4E4E',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  pickButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  loadButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fileNameText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
});