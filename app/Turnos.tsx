import React, { useState, useEffect } from 'react';
import { Dimensions, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, Platform, SectionList } from 'react-native';
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
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { width } = Dimensions.get('window');

  const isTablet = width >= 768;  

  useEffect(() => {
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
    loadTurnos();
  }, []);

  useEffect(() => {
    const saveTurnos = async () => {
      try {
        const jsonValue = JSON.stringify(turnos);
        await AsyncStorage.setItem('turnos', jsonValue);
      } catch (e) {
        console.error("Error saving turnos", e);
      }
    };
    saveTurnos();
  }, [turnos]);

  const handleAddTurno = () => {
    const newTurno = {
      fecha: new Date().toLocaleDateString('es-ES'),
      ...turnoData,
    };

    if (isEditing) {
      const updatedTurnos = [...turnos];
      updatedTurnos[editingIndex] = newTurno;
      setTurnos(updatedTurnos);
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      setTurnos([...turnos, newTurno]);
    }

    setShowForm(false);
    resetForm();
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
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            setTurnos(turnos.filter((_, i) => i !== index));
            setModalVisible(false);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAll = async () => {
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

  const handleEditTurno = (index) => {
    setTurnoData(turnos[index]);
    setShowForm(true);
    setIsEditing(true);
    setEditingIndex(index);
    setModalVisible(false);
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
      <TouchableOpacity style={styles.menuButton} onPress={() => { setSelectedIndex(index); setModalVisible(true); }}>
        <Text style={styles.menuText}>Opciones</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setShowForm(!showForm)}>
        <Text style={styles.buttonText}>{showForm ? "Cancelar" : "Agregar Nuevo Turno"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteAllButton} onPress={handleDeleteAll}>
        <Text style={styles.buttonText}>Eliminar Todo</Text>
      </TouchableOpacity>

      {showForm && (
        <View style={styles.formContainer}>
          <TextInput placeholder="Turno Saliente" style={styles.input} placeholderTextColor="#888" value={turnoData.turnoSaliente} onChangeText={(text) => setTurnoData({ ...turnoData, turnoSaliente: text })} />
          <TextInput placeholder="Nombre Saliente" style={styles.input} placeholderTextColor="#888" value={turnoData.nombreSaliente} onChangeText={(text) => setTurnoData({ ...turnoData, nombreSaliente: text })} />
          <TextInput placeholder="Grupo Saliente" style={styles.input} placeholderTextColor="#888" value={turnoData.grupoSaliente} onChangeText={(text) => setTurnoData({ ...turnoData, grupoSaliente: text })} />
          <TextInput placeholder="Postura" style={styles.input} placeholderTextColor="#888" value={turnoData.postura} onChangeText={(text) => setTurnoData({ ...turnoData, postura: text })} />
          <TextInput placeholder="Estatus Final Reportado" style={styles.input} placeholderTextColor="#888" value={turnoData.estatusFinal} onChangeText={(text) => setTurnoData({ ...turnoData, estatusFinal: text })} />
          <TextInput placeholder="Estatus Real" style={styles.input} placeholderTextColor="#888" value={turnoData.estatusReal} onChangeText={(text) => setTurnoData({ ...turnoData, estatusReal: text })} />
          <TextInput placeholder="Observación" style={styles.input} placeholderTextColor="#888" value={turnoData.observacion} onChangeText={(text) => setTurnoData({ ...turnoData, observacion: text })} />
          <TouchableOpacity style={styles.button} onPress={handleAddTurno}>
            <Text style={styles.buttonText}>{isEditing ? "Actualizar Turno" : "Agregar Turno"}</Text>
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
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SectionList
        sections={[
          { title: 'Formulario', data: [{}], renderItem: renderHeader },
          { title: 'Turnos', data: turnos, renderItem: renderItem }
        ]}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.noDataText}>No hay turnos registrados.</Text>}
        style={styles.list}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Opciones</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleEditTurno(selectedIndex)}
            >
              <Text style={styles.modalButtonText}>Actualizar Turno</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleDeleteTurno(selectedIndex)}
            >
              <Text style={styles.modalButtonText}>Eliminar Turno</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E4E4E',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  deleteAllButton: {
    backgroundColor: '#FF5733',
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 5,
  },
  formContainer: {
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    backgroundColor: '#ffff',
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tableContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  tableHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    paddingVertical: 5,
    borderRightWidth: 1,
    textAlign: 'center',
  },
  menuButton: {
    backgroundColor: '#6c757d',
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  menuText: {
    color: '#fff',
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  list: {
    marginVertical: 10,
  },
});