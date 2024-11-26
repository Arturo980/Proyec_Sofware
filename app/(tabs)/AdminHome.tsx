import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ScrollView, Image } from 'react-native';
import Svg, { Polygon, Image as SvgImage } from 'react-native-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { exportTurnosToJSON } from '../AdminTurnos';
import { exportEquiposToJSON } from '../AdminEquipos';

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

  const exportTurnos = async () => {
    try {
      await exportTurnosToJSON();
    } catch (error) {
      console.error('Error exporting turnos to JSON:', error);
      alert(`Error exporting turnos to JSON: ${error.message}`);
    }
  };

  const exportEquipos = async () => {
    try {
      await exportEquiposToJSON();
    } catch (error) {
      console.error('Error exporting equipos to JSON:', error);
      alert(`Error exporting equipos to JSON: ${error.message}`);
    }
  };

  const deleteAllTurnos = async () => {
    Alert.alert(
      'Eliminar Todos los Turnos',
      '¿Estás seguro de que deseas eliminar todos los turnos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Todo',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('turnos');
              setTurnos([]);
            } catch (e) {
              console.error("Error deleting all turnos", e);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const deleteAllEquipos = async () => {
    Alert.alert(
      'Eliminar Todos los Equipos',
      '¿Estás seguro de que deseas eliminar todos los equipos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Todo',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('equipos');
              setEquipos([]);
            } catch (e) {
              console.error("Error deleting all equipos", e);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userName');
      router.push('auth/login');
    } catch (error) {
      console.error('Error al borrar AsyncStorage:', error);
    }
  };

  const handleLoadJSON = () => {
    router.push('../LoadJSON');
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
          <TouchableOpacity style={styles.card} onPress={() => router.push('../AdminTurnos')}>
            <Text style={styles.cardText}>Administrador de Turnos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cardWrapper}>
          <Image source={require('@/assets/images/equipo.png')} style={styles.cardImage} />
          <TouchableOpacity style={styles.card} onPress={() => router.push('../AdminEquipos')}>
            <Text style={styles.cardText}>Administrador de Equipos</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.importButton} onPress={handleLoadJSON}>
          <Text style={styles.importButtonText}>Importar Opciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteAllButton} onPress={deleteAllTurnos}>
          <Text style={styles.deleteAllButtonText}>Eliminar todos los turnos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteAllButton} onPress={deleteAllEquipos}>
          <Text style={styles.deleteAllButtonText}>Eliminar todos los equipos</Text>
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
  importButton: {
    backgroundColor: '#007BFF', // Change to blue
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  importButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteAllButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  deleteAllButtonText: {
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
