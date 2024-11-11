import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView } from 'react-native';
import Svg, { Polygon, Image as SvgImage } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';

export default function HomeScreen() {
  const router = useRouter();
  const [equipos, setEquipos] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768;
  const [userName, setUserName] = useState('');

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

  
  const exportToExcel = async () => {
    try {
      const equiposValue = await AsyncStorage.getItem('equipos');
      const turnosValue = await AsyncStorage.getItem('turnos');
      const equiposData = equiposValue ? JSON.parse(equiposValue) : [];
      const turnosData = turnosValue ? JSON.parse(turnosValue) : [];
  
      // Filtrar los datos de turnos para excluir la columna photoUri
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
  
      // Solicitar permisos para acceder al almacenamiento y a la biblioteca de medios
      const { status: storageStatus } = await MediaLibrary.requestPermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      if (storageStatus !== 'granted' || mediaStatus !== 'granted') {
        throw new Error('Permiso para acceder al almacenamiento o a la biblioteca de medios denegado');
      }
  
      // Guardar el archivo en el directorio de descargas
      const downloadDir = `${FileSystem.documentDirectory}Download/`;
      const dirInfo = await FileSystem.getInfoAsync(downloadDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
      }
  
      const fileUri = `${downloadDir}${fileName}`;
      await FileSystem.writeAsStringAsync(fileUri, wbout, { encoding: FileSystem.EncodingType.Base64 });
  
      // Verificar si el archivo se ha creado correctamente
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error('El archivo no se ha creado correctamente');
      }
  
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      const album = await MediaLibrary.getAlbumAsync('Download');
      if (album == null) {
        await MediaLibrary.createAlbumAsync('Download', asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
  
      console.log(`Archivo exportado como: ${fileUri}`);
      alert(`Archivo exportado como: ${fileUri}`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert(`Error exporting to Excel: ${error.message}`);
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
      <Text style={styles.header}>Home</Text>

      <Svg height={isTablet ? 400 : 300} width={isTablet ? 400 : 300} style={styles.hexagon}>
        <Polygon
          points="150,0 300,75 300,225 150,300 0,225 0,75"
          fill="#F0A500"
        />
        <SvgImage
          href={require('@/assets/images/minetrack.png')}
          x={isTablet ? 75 : 50}
          y={isTablet ? 50 : 25}
          width={isTablet ? 250 : 200}
          height={isTablet ? 250 : 200}
          preserveAspectRatio="xMidYMid slice"
        />
      </Svg>
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Bienvenido {userName}</Text>
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('../Turnos')}>
          <Text style={styles.cardText}>Turnos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push('../Equipos')}>
          <Text style={styles.cardText}>Equipos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exportButton} onPress={exportToExcel}>
          <Text style={styles.exportButtonText}>Exportar a XLSX</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Salir</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#4E4E4E',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 30,
    marginTop: 10,
  },
  hexagon: {
    marginVertical: 20,
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
  card: {
    backgroundColor: '#F0A500',
    width: '48%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
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
    marginBottom: 40,
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
    marginTop: 20,
    alignItems: 'center',
    width: '80%',
    position: 'absolute',
    bottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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