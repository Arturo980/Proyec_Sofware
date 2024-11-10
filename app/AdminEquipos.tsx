import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SectionList, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
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
    NombreRegistrante: '',
  });

  const [equipos, setEquipos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateIndex, setUpdateIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    const loadUserName = async () => {
      try {
        const NombreRegistrante = await AsyncStorage.getItem('userName');
        if (NombreRegistrante != null) {
          setEquipoData(prevState => ({ ...prevState, NombreRegistrante }));
        }
      } catch (e) {
        console.error("Error loading userName", e);
      }
    };
    loadUserName();
  }, []);

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

  const saveEquipos = async (newEquipos) => {
    try {
      const jsonValue = JSON.stringify(newEquipos);
      await AsyncStorage.setItem('equipos', jsonValue);
    } catch (e) {
      console.error("Error saving equipos", e);
    }
  };

  useEffect(() => {
    loadEquipos();
  }, []);

  const handleAddEquipo = () => {
    const newEquipo = { ...equipoData };
    const updatedEquipos = [...equipos, newEquipo];
    setEquipos(updatedEquipos);
    saveEquipos(updatedEquipos);
    setShowForm(false);
    resetForm();
  };

  const handleUpdateEquipo = () => {
    const updatedEquipos = equipos.map((equipo, index) => 
      index === updateIndex ? equipoData : equipo
    );
    setEquipos(updatedEquipos);
    saveEquipos(updatedEquipos);
    setShowForm(false);
    resetForm();
    setIsUpdating(false);
    setUpdateIndex(null);
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
      NombreRegistrante: '',
    });
  };

  const handleDeleteEquipo = (index) => {
    Alert.alert(
      'Eliminar Equipo',
      '¿Estás seguro de que deseas eliminar este equipo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            const updatedEquipos = equipos.filter((_, i) => i !== index);
            setEquipos(updatedEquipos);
            saveEquipos(updatedEquipos);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAllEquipos = () => {
    Alert.alert(
      'Eliminar Todos los Equipos',
      '¿Estás seguro de que deseas eliminar todos los equipos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Todos',
          onPress: () => {
            setEquipos([]);
            saveEquipos([]);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditEquipo = (index) => {
    setEquipoData(equipos[index]);
    setShowForm(true);
    setIsUpdating(true);
    setUpdateIndex(index);
  };

  const openModal = (index) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const renderHeader = () => (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setShowForm(!showForm)}>
        <Text style={styles.buttonText}>{showForm ? "Cancelar" : "Agregar Nuevo Equipo"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.deleteAllButton]} onPress={handleDeleteAllEquipos}>
        <Text style={styles.buttonText}>Eliminar Todos los Equipos</Text>
      </TouchableOpacity>
      {showForm && (
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Equipo"
            style={styles.input}
            value={equipoData.equipo}
            onChangeText={(text) => setEquipoData({ ...equipoData, equipo: text })}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Marca"
            style={styles.input}
            value={equipoData.marca}
            onChangeText={(text) => setEquipoData({ ...equipoData, marca: text })}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Número Interno"
            style={styles.input}
            value={equipoData.numeroInterno}
            onChangeText={(text) => setEquipoData({ ...equipoData, numeroInterno: text })}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Operador"
            style={styles.input}
            value={equipoData.operador}
            onChangeText={(text) => setEquipoData({ ...equipoData, operador: text })}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Estado"
            style={styles.input}
            value={equipoData.estado}
            onChangeText={(text) => setEquipoData({ ...equipoData, estado: text })}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="% Petróleo"
            style={styles.input}
            value={equipoData.porcentajePetroleo}
            onChangeText={(text) => setEquipoData({ ...equipoData, porcentajePetroleo: text })}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Observación"
            style={styles.input}
            value={equipoData.observacion}
            onChangeText={(text) => setEquipoData({ ...equipoData, observacion: text })}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.button} onPress={isUpdating ? handleUpdateEquipo : handleAddEquipo}>
            <Text style={styles.buttonText}>{isUpdating ? "Actualizar Equipo" : "Agregar Equipo"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.equipo}</Text>
      <Text style={styles.cell}>{item.marca}</Text>
      <Text style={styles.cell}>{item.numeroInterno}</Text>
      <Text style={styles.cell}>{item.operador}</Text>
      <Text style={styles.cell}>{item.estado}</Text>
      <Text style={styles.cell}>{item.porcentajePetroleo}</Text>
      <Text style={styles.cell}>{item.observacion}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.optionsButton]} onPress={() => openModal(index)}>
          <Text style={styles.actionText}>Opciones</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => {
    if (title === 'Equipos') {
      return (
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Equipo</Text>
          <Text style={styles.headerCell}>Marca</Text>
          <Text style={styles.headerCell}>Número Interno</Text>
          <Text style={styles.headerCell}>Operador</Text>
          <Text style={styles.headerCell}>Estado</Text>
          <Text style={styles.headerCell}>% Petróleo</Text>
          <Text style={styles.headerCell}>Observación</Text>
          <Text style={styles.headerCell}>Acciones</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SectionList
        sections={[
          { title: 'Formulario', data: [{}], renderItem: renderHeader },
          { title: 'Equipos', data: equipos, renderItem: renderItem }
        ]}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.noDataText}>No hay equipos registrados.</Text>}
        renderSectionHeader={renderSectionHeader}
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
              onPress={() => {
                handleEditEquipo(selectedIndex);
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Actualizar Equipo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={() => {
                handleDeleteEquipo(selectedIndex);
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButtonText}>Eliminar Equipo</Text>
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
    </KeyboardAvoidingView>
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
    backgroundColor: '#fff',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  tableContainer: {
    backgroundColor: '#fff',
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
  },
  cancelButton: {
    backgroundColor: '#A9A9A9',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});