import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TurnosScreen() {
  const [turnoData, setTurnoData] = useState({
    turnoSaliente: '',
    nombreSaliente: '',
    grupoSaliente: '',
    postura: '',
    estatusFinal: '',
    estatusReal: '',
    observacion: '',
  });

  const [turnos, setTurnos] = useState([]);
  const [showForm, setShowForm] = useState(false);

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

  // Guardar turnos en AsyncStorage
  const saveTurnos = async (newTurnos) => {
    try {
      const jsonValue = JSON.stringify(newTurnos);
      await AsyncStorage.setItem('turnos', jsonValue);
    } catch (e) {
      console.error("Error saving turnos", e);
    }
  };

  useEffect(() => {
    loadTurnos(); // Cargar turnos al iniciar el componente
  }, []);

  const handleAddTurno = () => {
    const newTurno = {
      fecha: new Date().toLocaleDateString('es-ES'), // Formato DD/MM/YYYY
      ...turnoData,
    };

    const updatedTurnos = [...turnos, newTurno];
    setTurnos(updatedTurnos);
    saveTurnos(updatedTurnos); // Guardar turnos actualizados
    setShowForm(false); // Ocultar el formulario
    resetForm(); // Resetear el formulario
  };

  const resetForm = () => {
    setTurnoData({
      turnoSaliente: '',
      nombreSaliente: '',
      grupoSaliente: '',
      postura: '',
      estatusFinal: '',
      estatusReal: '',
      observacion: '',
    });
  };

  const handleDeleteTurno = (index) => {
    Alert.alert(
      'Eliminar Turno',
      '¿Estás seguro de que deseas eliminar este turno?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            const updatedTurnos = turnos.filter((_, i) => i !== index);
            setTurnos(updatedTurnos);
            saveTurnos(updatedTurnos); // Guardar turnos actualizados
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.fecha}</Text>
      <Text style={styles.cell}>{item.turnoSaliente}</Text>
      <Text style={styles.cell}>{item.nombreSaliente}</Text>
      <Text style={styles.cell}>{item.grupoSaliente}</Text>
      <Text style={styles.cell}>{item.postura}</Text>
      <Text style={styles.cell}>{item.estatusFinal}</Text>
      <Text style={styles.cell}>{item.estatusReal}</Text>
      <Text style={styles.cell}>{item.observacion}</Text>
      <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteTurno(index)}>
        <Text style={styles.actionText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setShowForm(!showForm)}>
        <Text style={styles.buttonText}>{showForm ? "Cancelar" : "Agregar Nuevo Turno"}</Text>
      </TouchableOpacity>

      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Turno Saliente"
            style={styles.input}
            value={turnoData.turnoSaliente}
            onChangeText={(text) => setTurnoData({ ...turnoData, turnoSaliente: text })}
          />
          <TextInput
            placeholder="Nombre Saliente"
            style={styles.input}
            value={turnoData.nombreSaliente}
            onChangeText={(text) => setTurnoData({ ...turnoData, nombreSaliente: text })}
          />
          <TextInput
            placeholder="Grupo Saliente"
            style={styles.input}
            value={turnoData.grupoSaliente}
            onChangeText={(text) => setTurnoData({ ...turnoData, grupoSaliente: text })}
          />
          <TextInput
            placeholder="Postura"
            style={styles.input}
            value={turnoData.postura}
            onChangeText={(text) => setTurnoData({ ...turnoData, postura: text })}
          />
          <TextInput
            placeholder="Estatus Final Reportado"
            style={styles.input}
            value={turnoData.estatusFinal}
            onChangeText={(text) => setTurnoData({ ...turnoData, estatusFinal: text })}
          />
          <TextInput
            placeholder="Estatus Real"
            style={styles.input}
            value={turnoData.estatusReal}
            onChangeText={(text) => setTurnoData({ ...turnoData, estatusReal: text })}
          />
          <TextInput
            placeholder="Observación"
            style={styles.input}
            value={turnoData.observacion}
            onChangeText={(text) => setTurnoData({ ...turnoData, observacion: text })}
          />
          <TouchableOpacity style={styles.button} onPress={handleAddTurno}>
            <Text style={styles.buttonText}>Agregar Turno</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tableContainer}>
        <Text style={styles.tableHeader}>Tabla de Turnos</Text>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Fecha</Text>
          <Text style={styles.headerCell}>Turno Saliente</Text>
          <Text style={styles.headerCell}>Nombre Saliente</Text>
          <Text style={styles.headerCell}>Grupo Saliente</Text>
          <Text style={styles.headerCell}>Postura</Text>
          <Text style={styles.headerCell}>Estatus Final</Text>
          <Text style={styles.headerCell}>Estatus Real</Text>
          <Text style={styles.headerCell}>Observación</Text>
          <Text style={styles.headerCell}>Acción</Text>
        </View>
        <FlatList
          data={turnos}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
        />
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
});








