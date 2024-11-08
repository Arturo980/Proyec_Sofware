import React, { useState, useEffect } from 'react';
import { Dimensions, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, Platform, SectionList, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
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
    NombreRegistrante: '',
    photoUri: ''
  });

  const [turnos, setTurnos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(true); // Estado para saber si estás agregando o actualizando
  const [editingIndex, setEditingIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { width } = Dimensions.get('window');

  const isTablet = width >= 768;  

  useEffect(() => {
    const loadUserName = async () => {
      try {
        const NombreRegistrante = await AsyncStorage.getItem('userName');
        if (NombreRegistrante != null) {
          setTurnoData(prevState => ({ ...prevState, NombreRegistrante}));
        }
      } catch (e) {
        console.error("Error loading userName", e);
      }
    };

    const loadTurnos = async () => {
      try {
        const storedTurnos = await AsyncStorage.getItem('turnos');
        if (storedTurnos) {
          setTurnos(JSON.parse(storedTurnos));
        }
      } catch (e) {
        console.error("Error loading turnos", e);
      }
    };

    loadUserName();
    loadTurnos();
  }, []);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requiere permiso para acceder a la cámara.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      setTurnoData(prevState => ({ ...prevState, photoUri: result.uri }));
      Alert.alert('Foto Agregada', 'La foto se ha agregado correctamente.');
    }
  };

  const handleAddTurno = async () => {
    const newTurno = {
      fecha: new Date().toLocaleDateString('es-ES'),
      ...turnoData,
    };
    let updatedTurnos;
    if (isEditing) {
      updatedTurnos = [...turnos];
      updatedTurnos[editingIndex] = newTurno;
      setIsEditing(false);
      setEditingIndex(null);
    } else {
      updatedTurnos = [newTurno, ...turnos];
    }
    setTurnos(updatedTurnos);
    await AsyncStorage.setItem('turnos', JSON.stringify(updatedTurnos));
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
      NombreRegistrante: '',
      photoUri: '',
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
          onPress: async () => {
            const updatedTurnos = turnos.filter((_, i) => i !== index);
            setTurnos(updatedTurnos);
            await AsyncStorage.setItem('turnos', JSON.stringify(updatedTurnos));
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

  const handleViewPhoto = (index) => {
    setSelectedIndex(index);
    setPhotoModalVisible(true);
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
      <TouchableOpacity style={styles.grayButton} onPress={() => { setSelectedIndex(index); setModalVisible(true); }}>
        <Text style={styles.buttongtext}>Opciones</Text>
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
          <TextInput placeholder="Turno Saliente" style={styles.input} editable={isAdding && !isEditing} placeholderTextColor="#888" value={turnoData.turnoSaliente} onChangeText={(text) => setTurnoData({ ...turnoData, turnoSaliente: text })} />
          <TextInput placeholder="Nombre Saliente" style={styles.input} editable={isAdding && !isEditing} placeholderTextColor="#888" value={turnoData.nombreSaliente} onChangeText={(text) => setTurnoData({ ...turnoData, nombreSaliente: text })} />
          <TextInput placeholder="Grupo Saliente" style={styles.input} editable={isAdding && !isEditing} placeholderTextColor="#888" value={turnoData.grupoSaliente} onChangeText={(text) => setTurnoData({ ...turnoData, grupoSaliente: text })} />
          <TextInput placeholder="Postura" style={styles.input} editable={isAdding && !isEditing} placeholderTextColor="#888" value={turnoData.postura} onChangeText={(text) => setTurnoData({ ...turnoData, postura: text })} />
          <TextInput placeholder="Estatus Final Reportado" style={styles.input} editable={isAdding && !isEditing} placeholderTextColor="#888" value={turnoData.estatusFinal} onChangeText={(text) => setTurnoData({ ...turnoData, estatusFinal: text })} />
          <TextInput placeholder="Estatus Real" style={styles.input} editable={!isAdding || isEditing} placeholderTextColor="#888" value={turnoData.estatusReal} onChangeText={(text) => setTurnoData({ ...turnoData, estatusReal: text })} />
          <TextInput placeholder="Observación" style={styles.input} editable={isAdding && !isEditing} placeholderTextColor="#888" value={turnoData.observacion} onChangeText={(text) => setTurnoData({ ...turnoData, observacion: text })} />
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Tomar Foto</Text>
          </TouchableOpacity>
          {turnoData.photoUri && (
            <Image
              source={{ uri: turnoData.photoUri }}
              style={{ width: 100, height: 100 }}
            />
          )}
          <TouchableOpacity style={styles.button} onPress={handleAddTurno}>
            <Text style={styles.buttonText}>{isEditing ? "Actualizar Turno" : "Agregar Turno"}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.tableContainer}>
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
              style={[styles.modalButton, styles.updateButton]}
              onPress={() => handleEditTurno(selectedIndex)}
            >
              <Text style={styles.modalButtonText}>Actualizar Turno</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={() => handleDeleteTurno(selectedIndex)}
            >
              <Text style={styles.modalButtonText}>Eliminar Turno</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.viewButton]}
              onPress={() => handleViewPhoto(selectedIndex)}
            >
              <Text style={styles.modalButtonText}>Ver Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={photoModalVisible}
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Foto del Turno</Text>
            {selectedIndex !== null && turnos[selectedIndex] && turnos[selectedIndex].photoUri ? (
              <Image
                source={{ uri: turnos[selectedIndex].photoUri }}
                style={{ width: 300, height: 300 }}
              />
            ) : (
              <Text style={styles.noDataText}>No hay foto disponible.</Text>
            )}
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setPhotoModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
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
    padding: 20,
  },
  grayButton: {
    backgroundColor: '#A9A9A9',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 5,
  },
  buttongtext: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
    backgroundColor: '#fff',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  tableContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 0,
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
    backgroundColor: '#fff',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#F0A500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteAllButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10, // Increase padding to make the button larger
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  optionsButton: {
    backgroundColor: '#A9A9A9',
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
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
    width: '100%',
  },
  updateButton: {
    backgroundColor: '#1E90FF',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10
  },
  cancelButton: {
    backgroundColor: '#A9A9A9',
  },
  viewButton: {
    backgroundColor: '#FFD700',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});