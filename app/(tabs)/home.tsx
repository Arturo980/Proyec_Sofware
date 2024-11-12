import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView, Image } from 'react-native';
import Svg, { Polygon, Image as SvgImage } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import useOrientation from '@/hooks/useOrientation';
import * as Permissions from 'expo-permissions';
import * as DocumentPicker from 'expo-document-picker';

import { Platform, PermissionsAndroid } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [equipos, setEquipos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;
  const [userName, setUserName] = useState('');
  const orientation = useOrientation();

  useFocusEffect(
    useCallback(() => {
      const fetchUserName = async () => {
        try {
          const name = await AsyncStorage.getItem('userName');
          if (name) {
            setUserName(name);
          }
        } catch (error) {
          console.error('Error fetching userName from AsyncStorage', error);
        }
      };
      fetchUserName();
    }, [])
  );

  const loadEquipos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('equipos');
      if (jsonValue != null) {
        setEquipos(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Error loading equipos", e);
    }
  };

  const loadTurnos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('turnos');
      if (jsonValue != null) {
        setTurnos(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Error loading turnos", e);
    }
  };

  useEffect(() => {
    loadEquipos();
    loadTurnos();
  }, []);

  
  // Función para exportar a Excel
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const { status } = await MediaLibrary.requestPermissionsAsync(); // Solicitamos permisos directamente desde MediaLibrary
  
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede exportar sin permisos de almacenamiento.');
        return false;
      }
  
      return true;
    }
  
    return true;
  };
  
  // Función para exportar a Excel
  const exportToExcel = async () => {
    try {
      // Verificar y solicitar permisos
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permiso denegado', 'No se puede exportar sin permisos de almacenamiento.');
        return;
      }

      const equiposValue = await AsyncStorage.getItem('equipos');
      const turnosValue = await AsyncStorage.getItem('turnos');
      const equiposData = equiposValue ? JSON.parse(equiposValue) : [];
      const turnosData = turnosValue ? JSON.parse(turnosValue) : [];

      const filteredTurnosData = turnosData.map(({ photoUri, ...rest }) => rest);
      const turnosWorksheet = XLSX.utils.json_to_sheet(filteredTurnosData);
      const equiposWorksheet = XLSX.utils.json_to_sheet(equiposData);
      const workbook = XLSX.utils.book_new();

      const userName = await AsyncStorage.getItem('userName');
      if (!userName) {
        throw new Error('No se encontró el nombre de usuario en AsyncStorage');
      }

      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
      const fileName = `${formattedDate}_${userName}.xlsx`;

      XLSX.utils.book_append_sheet(workbook, turnosWorksheet, 'Turnos');
      XLSX.utils.book_append_sheet(workbook, equiposWorksheet, 'Equipos');

      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

      // Usar cacheDirectory para almacenar el archivo temporal
      const downloadDirectory = FileSystem.cacheDirectory; // Usar cacheDirectory
      const fileUri = `${downloadDirectory}${fileName}`;

      // Guardar el archivo en caché
      await FileSystem.writeAsStringAsync(fileUri, wbout, { encoding: FileSystem.EncodingType.Base64 });

      console.log("Archivo guardado en caché:", fileUri);

      // Verificar si Sharing está disponible
      if (await Sharing.isAvailableAsync()) {
        // Compartir el archivo
        await Sharing.shareAsync(fileUri);
        Alert.alert('Éxito', 'Archivo compartido exitosamente');
      } else {
        Alert.alert('Error', 'No se puede compartir el archivo. Sharing no está disponible en este dispositivo.');
      }

    } catch (error) {
      console.error('Error exporting and sharing to Excel:', error);
      Alert.alert('Error', `Error exportando y compartiendo a Excel: ${error.message}`);
    }
  };


  const handleLogout = async () => {
    try {
      const turnosValue = await AsyncStorage.getItem('turnos');
      const turnosData = turnosValue ? JSON.parse(turnosValue) : [];
  
      // Eliminar fotos de las rutas de photoUri
      for (const turno of turnosData) {
        if (turno.photoUri) {
          try {
            await FileSystem.deleteAsync(turno.photoUri, { idempotent: true });
          } catch (error) {
            console.error('Error deleting photoUri:', error);
          }
        }
      }
  
      await AsyncStorage.removeItem('userName');
      router.push('auth/login');
    } catch (error) {
      console.error('Error al borrar AsyncStorage:', error);
    }
  };

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      
      <View style={styles.navbar}>
        <View style={styles.leftContainer}>
          <Image source={require('@/assets/images/Minetrack2.png')} style={styles.image} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Home</Text>
        </View>
      </View>


      <View style={styles.container}>
        <Text style={styles.welcomeText}>Bienvenido {userName} 👋</Text>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.cardWrapper}>
          <Image source={require('@/assets/images/Turnos.png')} style={styles.cardImage} />
          <TouchableOpacity style={styles.card} onPress={() => router.push('../Turnos')}>
            <Text style={styles.cardText}>Turnos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardWrapper}>
          <Image source={require('@/assets/images/equipo.png')} style={styles.cardImage} />
          <TouchableOpacity style={styles.card} onPress={() => router.push('../Equipos')}>
            <Text style={styles.cardText}>Equipos</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.exportButton} onPress={exportToExcel}>
          <Text style={styles.exportButtonText}>Exportar a XLSX</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>© Todos los derechos reservados</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  navbar: {   
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  leftContainer: {
    alignItems: 'flex-start',    
  },
  centerContainer: {
    position: 'absolute',        
    left: 0,                      
    right: 0,                     
    alignItems: 'center',
  },
  image: {
    width: 60, 
    height: 60,
    marginRight: 10, 
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff', 
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#4E4E4E',
    alignItems: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 20,
    marginTop: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 20,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 50,
  },
  cardWrapper: {
    alignItems: 'center',   
    marginBottom: 20,      
    width: '48%',          
  },
  card: {
    backgroundColor: '#F0A500',
    width: '100%',         
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,        
  },
  cardImage: {
    width: '100%',  
    height: undefined,
    aspectRatio: 1.8,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  exportButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 1,
    width: '100%',
    marginTop: 100,
    paddingHorizontal: 10,
  },
  footerText: {
    color: '#fff',
    fontSize: 12,
  },
});


/*
const handleExportToExcel = async () => {
    try {
      const userName = await AsyncStorage.getItem('userName');
      if (!userName) {
        throw new Error('No se encontró el nombre de usuario en AsyncStorage');
      }

      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
      const fileName = `${formattedDate}_${userName}.xlsx`;

      // Aquí va tu lógica para exportar a Excel, usando fileName como el nombre del archivo
      console.log(`Exportando archivo como: ${fileName}`);

      // Ejemplo de cómo podrías usar fileName en tu lógica de exportación
      // await exportToExcel(data, fileName);

      Alert.alert("Éxito", `Archivo exportado como: ${fileName}`);
    } catch (error) {
      console.error("Error exporting to Excel", error);
      Alert.alert("Error", "No se pudo exportar a Excel.");
    }
  };
  */