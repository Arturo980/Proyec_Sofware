import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import optionsEquipos from './Jsons/optionsEquipos.json';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useFocusEffect } from '@react-navigation/native';

export default function AdminEquiposScreen() {
  const [optionsData, setOptionsData] = useState({});
  const [currentField, setCurrentField] = useState('');
  const [newOption, setNewOption] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editOption, setEditOption] = useState('');
  const [newEquipo, setNewEquipo] = useState('');
  const [newMarca, setNewMarca] = useState('');
  const [isAddEquipoModalVisible, setIsAddEquipoModalVisible] = useState(false);
  const [isMarcaModalVisible, setIsMarcaModalVisible] = useState(false);

  const loadOptionsData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('optionsEquipos');
      if (jsonValue != null) {
        setOptionsData(JSON.parse(jsonValue));
      } else {
        setOptionsData(optionsEquipos);
      }
    } catch (e) {
      console.error("Error loading optionsEquipos", e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOptionsData();
    }, [])
  );

  useEffect(() => {
    loadOptionsData();
  }, []);

  const handleAddOption = () => {
    if (newOption.trim() === '') return;
    setOptionsData(prevState => {
      const updatedOptions = {
        ...prevState,
        [currentField]: prevState[currentField] ? [...prevState[currentField], newOption] : [newOption]
      };
      handleSaveOptions(updatedOptions); // Save options after adding a new option
      return updatedOptions;
    });
    setNewOption('');
    setCurrentField(''); // Reset current field to ensure re-render
  };

  const handleAddEquipo = () => {
    if (newEquipo.trim() === '' || newMarca.trim() === '') return;
    setOptionsData(prevState => {
      const updatedOptions = {
        ...prevState,
        Equipos: [...prevState.Equipos, { Equipo: newEquipo, Marca: [newMarca] }]
      };
      handleSaveOptions(updatedOptions); // Save options after adding a new equipo
      return updatedOptions;
    });
    setNewEquipo('');
    setNewMarca('');
    setIsAddEquipoModalVisible(false);
  };

  const handleEditOption = () => {
    if (editOption.trim() === '') return;
    setOptionsData(prevState => {
      const updatedOptions = [...prevState[currentField]];
      updatedOptions[editIndex] = editOption;
      const newOptionsData = { ...prevState, [currentField]: updatedOptions };
      handleSaveOptions(newOptionsData); // Save options after editing an option
      return newOptionsData;
    });
    setEditOption('');
    setEditIndex(null);
    setIsModalVisible(false);
  };

  const handleDeleteOption = (index) => {
    if (!currentField) return; // Ensure currentField is set
    Alert.alert(
      'Eliminar Opción',
      '¿Estás seguro de que deseas eliminar esta opción?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            setOptionsData(prevState => {
              const updatedOptions = [...prevState[currentField]];
              updatedOptions.splice(index, 1);
              const newOptionsData = { ...prevState, [currentField]: updatedOptions };
              handleSaveOptions(newOptionsData); // Save options after deleting an option
              return newOptionsData;
            });
          }
        }
      ]
    );
  };

  const handleSaveOptions = async (optionsDataToSave) => {
    if (!optionsDataToSave) return;
    try {
      await AsyncStorage.setItem('optionsEquipos', JSON.stringify(optionsDataToSave));
      Alert.alert('Guardado', 'Las opciones se han guardado correctamente.');
    } catch (e) {
      console.error("Error saving options", e);
      Alert.alert('Error', 'Hubo un problema al guardar las opciones.');
    }
  };

  const handleOpenAddEquipoModal = () => {
    setIsAddEquipoModalVisible(true);
  };

  const handleCloseAddEquipoModal = () => {
    setIsAddEquipoModalVisible(false);
  };

  const handleOpenMarcaModal = () => {
    setIsMarcaModalVisible(true);
  };

  const handleCloseMarcaModal = () => {
    setIsMarcaModalVisible(false);
  };

  const handleSelectMarca = (marca) => {
    setNewMarca(marca);
    setIsMarcaModalVisible(false);
  };

  const exportEquiposToJSON = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('optionsEquipos');
      const equiposData = jsonValue ? JSON.parse(jsonValue) : optionsEquipos;
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
      const equiposFileName = `${formattedDate}_equipos.json`;
      const equiposUri = FileSystem.documentDirectory + equiposFileName;

      await FileSystem.writeAsStringAsync(equiposUri, JSON.stringify(equiposData), { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(equiposUri);
    } catch (error) {
      console.error('Error exporting equipos to JSON:', error);
      alert(`Error exporting equipos to JSON: ${error.message}`);
    }
  };

  const renderOption = ({ item, index }) => {
    if (typeof item === 'object') {
      return (
        <View key={index} style={styles.optionRow}>
          <Text style={styles.optionText}>{`${item.Equipo}, ${item.Marca.join(', ')}`}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => { setEditIndex(index); setEditOption(item); setIsModalVisible(true); setCurrentField('Equipos'); }}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => { setCurrentField('Equipos'); handleDeleteOption(index); }}>
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.optionRow}>
          <Text style={styles.optionText}>{item}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => { setEditIndex(index); setEditOption(item); setIsModalVisible(true); }}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteOption(index)}>
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Administrar Opciones</Text>
      <FlatList
        data={Object.keys(optionsData).filter(field => optionsData[field] && optionsData[field].length > 0)} // Ensure fields are not empty
        renderItem={({ item: field, index }) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>{field}</Text>
            <FlatList
              data={optionsData[field]}
              renderItem={renderOption}
              keyExtractor={(item, index) => index.toString()}
            />
            {field === 'Equipos' ? (
              <>
                <View style={styles.addButtonContainer}>
                  <TouchableOpacity style={styles.addButton} onPress={handleOpenAddEquipoModal}>
                    <Text style={styles.buttonText}>Agregar</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <TextInput
                  placeholder={`Agregar nueva opción a ${field}`}
                  style={styles.input}
                  value={currentField === field ? newOption : ''}
                  onChangeText={setNewOption}
                  placeholderTextColor="#888"
                  onFocus={() => setCurrentField(field)}
                />
                <View style={styles.addButtonContainer}>
                  <TouchableOpacity style={styles.addButton} onPress={handleAddOption}>
                    <Text style={styles.buttonText}>Agregar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveOptions(optionsData)}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.exportButton} onPress={exportEquiposToJSON}>
        <Text style={styles.buttonText}>Exportar Equipos a JSON</Text>
      </TouchableOpacity>
      <Modal transparent={true} animationType="slide" visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Editar Opción</Text>
            <TextInput
              style={styles.input}
              value={editOption}
              onChangeText={setEditOption}
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleEditOption}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal transparent={true} animationType="slide" visible={isAddEquipoModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Agregar Equipo</Text>
            <TextInput
              placeholder="Nombre del Equipo"
              style={styles.input}
              value={newEquipo}
              onChangeText={setNewEquipo}
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.input} onPress={handleOpenMarcaModal}>
              <Text style={{ color: newMarca ? '#000' : '#888' }}>{newMarca || 'Seleccionar o agregar Marca'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddEquipo}>
              <Text style={styles.buttonText}>Agregar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCloseAddEquipoModal}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal transparent={true} animationType="slide" visible={isMarcaModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Seleccionar o Agregar Marca</Text>
            <FlatList
              data={[...new Set(optionsData.Equipos?.flatMap(e => e.Marca) || [])]}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.modalOption} onPress={() => handleSelectMarca(item)}>
                  <Text style={styles.modalOptionText}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            <TextInput
              placeholder="Agregar nueva Marca"
              style={styles.input}
              value={newMarca}
              onChangeText={setNewMarca}
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleCloseMarcaModal}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCloseMarcaModal}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  fieldContainer: {
    marginBottom: 20,
  },
  fieldTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#F0A500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#A9A9A9',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  exportButton: {
    backgroundColor: '#007bff',
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
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  optionText: {
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
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
  addButtonContainer: {
    marginTop: 20, // Add margin to create space
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
