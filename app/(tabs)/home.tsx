import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Polygon, Image as SvgImage } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [equipos, setEquipos] = useState<any[]>([]);
  const [turnos, setTurnos] = useState<any[]>([]); // Estado para los datos de turnos

  // Cargar los equipos desde AsyncStorage
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

  // Cargar los turnos desde AsyncStorage
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
    loadEquipos(); // Cargar equipos al iniciar el componente
    loadTurnos();  // Cargar turnos al iniciar el componente
  }, []);

  const exportToExcel = async () => {
    try {
      // Crear una nueva hoja de trabajo para turnos y equipos
      const turnosWorksheet = XLSX.utils.json_to_sheet(turnos);
      const equiposWorksheet = XLSX.utils.json_to_sheet(equipos);
      
      // Crear un nuevo libro de trabajo
      const workbook = XLSX.utils.book_new();
      
      // Agregar hojas al libro
      XLSX.utils.book_append_sheet(workbook, turnosWorksheet, 'Turnos');
      XLSX.utils.book_append_sheet(workbook, equiposWorksheet, 'Equipos');

      // Generar el contenido del archivo Excel en formato binario
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

      // Convertir el contenido a un formato que pueda ser utilizado
      const data = new Uint8Array(excelBuffer.length);
      for (let i = 0; i < excelBuffer.length; i++) {
        data[i] = excelBuffer.charCodeAt(i) & 0xff;
      }

      // Crear un URI para el archivo Excel
      const fileUri = `${FileSystem.documentDirectory}datos.xlsx`;

      // Convertir el Uint8Array a base64
      const base64Data = btoa(String.fromCharCode(...data));

      // Escribir el archivo en el sistema de archivos
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Compartir el archivo
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error exporting to Excel", error);
      Alert.alert("Error", "No se pudo exportar a Excel.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>

      <Svg height="300" width="300" style={styles.hexagon}>
        <Polygon
          points="150,0 300,75 300,225 150,300 0,225 0,75"
          fill="#F0A500"
        />
        <SvgImage
          href={require('@/assets/images/minetrack.png')} // Asegúrate de que esta ruta sea correcta
          x="50" // Ajusta la posición de la imagen dentro del hexágono
          y="25" // Ajusta la posición de la imagen dentro del hexágono
          width="200" // Ajusta el tamaño de la imagen
          height="200" // Ajusta el tamaño de la imagen
          preserveAspectRatio="xMidYMid slice"
        />
      </Svg>

      <Text style={styles.header}>Gestión de Datos</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Turnos')}>
          <Text style={styles.cardText}>Turnos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Equipos')}>
          <Text style={styles.cardText}>Equipos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exportButton} onPress={exportToExcel}>
        <Text style={styles.exportButtonText}>Exportar a XLSX</Text>
      </TouchableOpacity>
      </View>
      
      {/* Asegúrate de que el botón de exportar está aquí */}
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E4E4E',
    alignItems: 'center',
    paddingTop: 40,
  },
  hexagon: {
    marginVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 50,
    flexWrap: 'wrap', // Permite que los botones se envuelvan en pantallas pequeñas
  },
  card: {
    backgroundColor: '#F0A500',
    width: '40%', // Cambiado para ser más responsivo
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
  },
  cardText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  exportButton: {
    backgroundColor: '#007BFF', // Color del botón de exportar
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    width: '80%', // Ampliar el ancho del botón de exportar
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
