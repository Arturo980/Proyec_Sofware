import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView } from 'react-native';
import Svg, { Polygon, Image as SvgImage } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; // Importar useRouter

export default function HomeScreen() {
  const router = useRouter(); // Usar useRouter en lugar de useNavigation
  const [equipos, setEquipos] = useState<any[]>([]);
  const [turnos, setTurnos] = useState<any[]>([]);

  // Obtener las dimensiones de la pantalla
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768; // Considerar como tablet si el ancho es mayor o igual a 768px

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
    loadEquipos();
    loadTurnos();
  }, []);

  const exportToExcel = async () => {
    try {
        // Cargar los datos directamente sin actualizar el estado
        const equiposValue = await AsyncStorage.getItem('equipos');
        const turnosValue = await AsyncStorage.getItem('turnos');

        // Analizar los datos JSON y verificar que no estén vacíos
        const equiposData = equiposValue ? JSON.parse(equiposValue) : [];
        const turnosData = turnosValue ? JSON.parse(turnosValue) : [];

        // Crear las hojas de cálculo
        const turnosWorksheet = XLSX.utils.json_to_sheet(turnosData);
        const equiposWorksheet = XLSX.utils.json_to_sheet(equiposData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, turnosWorksheet, 'Turnos');
        XLSX.utils.book_append_sheet(workbook, equiposWorksheet, 'Equipos');

        // Escribir el archivo XLSX
        const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
        const uri = FileSystem.documentDirectory + 'datos.xlsx';
        await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });

        // Compartir el archivo
        await Sharing.shareAsync(uri);
    } catch (error) {
        console.error("Error exporting to Excel", error);
        Alert.alert("Error", "No se pudo exportar a Excel.");
    }
};

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userName'); // Borra el AsyncStorage
      router.push('auth/login'); // Redirige a la pantalla de login usando router
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

      {/* Aumentar separación del botón de salida */}
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
    width: '48%', // Ajustar ancho para dos columnas
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
    width: '100%', // Exportar ocupa el ancho completo
    marginBottom: 40, // Aumentar separación de "Exportar"
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