import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EquiposScreen() {
  const [equipoData, setEquipoData] = useState({
    equipo: '',
    marca: '',
    numeroInterno: '',
    operador: '',
    estado: '',
    porcentajePetroleo: '',
    observacion: '',
  });

  const [equipos, setEquipos] = useState([]);
  const [showForm, setShowForm] = useState(false);

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

  // Guardar equipos en AsyncStorage
  const saveEquipos = async (newEquipos) => {
    try {
      const jsonValue = JSON.stringify(newEquipos);
      await AsyncStorage.setItem('equipos', jsonValue);
    } catch (e) {
      console.error("Error saving equipos", e);
    }
  };

  useEffect(() => {
    loadEquipos(); // Cargar equipos al iniciar el componente
  }, []);

  const handleAddEquipo = () => {
    const newEquipo = {
      ...equipoData,
    };

    const updatedEquipos = [...equipos, newEquipo];
    setEquipos(updatedEquipos);
    saveEquipos(updatedEquipos); // Guardar equipos actualizados
    setShowForm(false); // Ocultar el formulario
    resetForm(); // Resetear el formulario
  };

  const resetForm = () => {
    setEquipoData({
      equipo: '',
      marca: '',
      numeroInterno: '',
      operador: '',
      estado: '',
      porcentajePetroleo: '',
      observacion: '',
    });
  };

  const handleDeleteEquipo = (index) => {
    Alert.alert(
      'Eliminar Equipo',
      '¿Estás seguro de que deseas eliminar este equipo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            const updatedEquipos = equipos.filter((_, i) => i !== index);
            setEquipos(updatedEquipos);
            saveEquipos(updatedEquipos); // Guardar equipos actualizados
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.equipo}</Text>
      <Text style={styles.cell}>{item.marca}</Text>
      <Text style={styles.cell}>{item.numeroInterno}</Text>
      <Text style={styles.cell}>{item.operador}</Text>
      <Text style={styles.cell}>{item.estado}</Text>
      <Text style={styles.cell}>{item.porcentajePetroleo}</Text>
      <Text style={styles.cell}>{item.observacion}</Text>
      <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteEquipo(index)}>
        <Text style={styles.actionText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setShowForm(!showForm)}>
        <Text style={styles.buttonText}>{showForm ? "Cancelar" : "Agregar Nuevo Equipo"}</Text>
      </TouchableOpacity>
      
      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Equipo"
            style={styles.input}
            value={equipoData.equipo}
            onChangeText={(text) => setEquipoData({ ...equipoData, equipo: text })}
          />
          <TextInput
            placeholder="Marca"
            style={styles.input}
            value={equipoData.marca}
            onChangeText={(text) => setEquipoData({ ...equipoData, marca: text })}
          />
          <TextInput
            placeholder="Número Interno"
            style={styles.input}
            value={equipoData.numeroInterno}
            onChangeText={(text) => setEquipoData({ ...equipoData, numeroInterno: text })}
          />
          <TextInput
            placeholder="Operador"
            style={styles.input}
            value={equipoData.operador}
            onChangeText={(text) => setEquipoData({ ...equipoData, operador: text })}
          />
          <TextInput
            placeholder="Estado"
            style={styles.input}
            value={equipoData.estado}
            onChangeText={(text) => setEquipoData({ ...equipoData, estado: text })}
          />
          <TextInput
            placeholder="% Petróleo"
            style={styles.input}
            value={equipoData.porcentajePetroleo}
            onChangeText={(text) => setEquipoData({ ...equipoData, porcentajePetroleo: text })}
          />
          <TextInput
            placeholder="Observación"
            style={styles.input}
            value={equipoData.observacion}
            onChangeText={(text) => setEquipoData({ ...equipoData, observacion: text })}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddEquipo}>
            <Text style={styles.buttonText}>Agregar Equipo</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tableContainer}>
        <Text style={styles.tableHeader}>Tabla de Equipos</Text>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Equipo</Text>
          <Text style={styles.headerCell}>Marca</Text>
          <Text style={styles.headerCell}>Número Interno</Text>
          <Text style={styles.headerCell}>Operador</Text>
          <Text style={styles.headerCell}>Estado</Text>
          <Text style={styles.headerCell}>% Petróleo</Text>
          <Text style={styles.headerCell}>Observación</Text>
          <Text style={styles.headerCell}>Acción</Text>
        </View>
        
        {equipos.length === 0 ? ( // Verificación de equipos
          <Text style={styles.noDataText}>No hay equipos registrados.</Text>
        ) : (
          <FlatList
            data={equipos}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.list}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E4E4E',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  formContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  tableContainer: {
    backgroundColor: '#fff', // Color de fondo de la tabla
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  tableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#F0A500', // Color amarillo para el botón
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#FF6B6B', // Color para el botón de eliminar
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 20,
  },
});
