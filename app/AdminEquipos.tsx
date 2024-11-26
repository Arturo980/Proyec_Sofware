import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import optionsEquipos from './Jsons/optionsEquipos.json';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useFocusEffect } from '@react-navigation/native';

export default function AdminEquiposScreen() {
  const [optionsData, setOptionsData] = useState({ Equipos: [] });
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
        Equipos: prevState.Equipos ? [...prevState.Equipos, { Equipo: newEquipo, Marca: newMarca.split(',').map(m => m.trim()) }] : [{ Equipo: newEquipo, Marca: newMarca.split(',').map(m => m.trim()) }]
      };
      handleSaveOptions(updatedOptions); // Save options after adding a new equipo
      return updatedOptions;
    });
    setNewEquipo('');
    setNewMarca('');
    setIsAddEquipoModalVisible(false);
    setIsMarcaModalVisible(false); // Close the brand modal after adding a new team
  };

  const handleSaveNonEquiposOption = () => {
    if (!editOption || !currentField || !optionsData[currentField]) return;
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

  const handleSaveEquiposOption = () => {
    if (!editOption || !currentField || !optionsData[currentField]) return;
    setOptionsData(prevState => {
      const updatedOptions = [...prevState[currentField]];
      updatedOptions[editIndex] = { ...updatedOptions[editIndex], Equipo: editOption.Equipo, Marca: editOption.Marca };
      const newOptionsData = { ...prevState, [currentField]: updatedOptions };
      handleSaveOptions(newOptionsData); // Save options after editing an option
      return newOptionsData;
    });
    setEditOption('');
    setEditIndex(null);
    setIsModalVisible(false);
  };

  const handleSaveNuInternoAndBelowOption = () => {
    if (!editOption || !currentField || !optionsData[currentField]) return;
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

  const handleEditEquiposOption = () => {
    if (!editOption || !currentField || !optionsData[currentField]) return;
    setOptionsData(prevState => {
      const updatedOptions = [...prevState[currentField]];
      updatedOptions[editIndex] = { ...updatedOptions[editIndex], Equipo: editOption.Equipo, Marca: editOption.Marca };
      const newOptionsData = { ...prevState, [currentField]: updatedOptions };
      handleSaveOptions(newOptionsData); // Save options after editing an option
      return newOptionsData;
    });
    setEditOption('');
    setEditIndex(null);
    setIsModalVisible(false);
  };

  const handleSaveEditedEquipo = () => {
    console.log('handleSaveEditedEquipo called');
    console.log('editOption:', editOption);
    console.log('currentField:', currentField);
    console.log('editIndex:', editIndex);
    if (!editOption || !currentField || !optionsData.Equipos) {
      console.error('Missing required data for saving edited equipo');
      return;
    }
    const updatedOptions = [...optionsData.Equipos];
    updatedOptions[editIndex] = { ...updatedOptions[editIndex], Equipo: editOption.Equipo, Marca: editOption.Marca };
    const newOptionsData = { ...optionsData, Equipos: updatedOptions };
    console.log('newOptionsData:', newOptionsData);
    handleSaveOptions(newOptionsData); // Save options after editing an option
    setOptionsData(newOptionsData);
    setEditOption('');
    setEditIndex(null);
    setIsModalVisible(false);
  };

  const handleEditOption = () => {
    console.log('handleEditOption called');
    console.log('currentField:', currentField);
    console.log('editOption:', editOption);
    if (!currentField) {
      console.error('currentField is not set');
      return;
    }
    if (currentField === 'Equipos') {
      console.log('Editing Equipos');
      handleSaveEditedEquipo();
    } else if (['NuInterno', 'Estado', 'Petroleo', 'EstandarPetroleo', 'AdherenciaPetroleo', 'Ubicacion', 'EstandarES', 'Nivel', 'Report', 'Grupo'].includes(currentField)) {
      console.log('Editing NuInterno and below');
      handleSaveNuInternoAndBelowOption();
    } else {
      console.log('Editing non-Equipos option');
      handleSaveNonEquiposOption();
    }
  };

  const handleEditOption1 = () => {
    if (!editOption || typeof editOption !== 'string' || editOption.trim() === '' || !currentField) return;
    setOptionsData(prevState => {
      const updatedOptions = [...prevState[currentField]];
      updatedOptions[editIndex] = editOption;
      const newOptionsData = { ...prevState, [currentField]: updatedOptions };
      handleSaveOptions(newOptionsData);
      return newOptionsData;
    });
    setEditOption('');
    setEditIndex(null);
    setIsModalVisible(false);
  };

  const handleSaveOptions1 = async (optionsDataToSave) => {
    if (!optionsDataToSave) return;
    try {
      await AsyncStorage.setItem('optionsTurnos', JSON.stringify(optionsDataToSave));
      setOptionsData(optionsDataToSave); // Ensure state is updated after saving
      Alert.alert('Guardado', 'Las opciones se han guardado correctamente.');
    } catch (e) {
      console.error("Error saving options", e);
      Alert.alert('Error', 'Hubo un problema al guardar las opciones.');
    }
  };

  const handleSaveOptions = async (optionsDataToSave) => {
    if (!optionsDataToSave) return;
    try {
      await AsyncStorage.setItem('optionsEquipos', JSON.stringify(optionsDataToSave));
      setOptionsData(optionsDataToSave); // Ensure state is updated after saving
      console.log('Options saved successfully');
      Alert.alert('Guardado', 'Los cambios se han guardado correctamente.'); // Add alert here
    } catch (e) {
      console.error("Error saving options", e);
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
    setNewMarca(prev => prev ? `${prev}, ${marca}` : marca);
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

  const handleAddEditMarca = () => {
    if (newMarca.trim() === '') return;
    if (currentField === 'Equipos') {
      setEditOption(prev => ({ ...prev, Marca: [...(prev.Marca || []), newMarca] }));
    } else {
      setNewMarca(prev => prev ? `${prev}, ${newMarca}` : newMarca);
    }
    setNewMarca('');
    setIsMarcaModalVisible(false);
  };

  const handleSelectEditMarca = (marca) => {
    setEditOption(prev => ({ ...prev, Marca: [...(prev.Marca || []), marca] }));
    setIsMarcaModalVisible(false);
  };

  const handleRemoveEditMarca = (marcaToRemove) => {
    setEditOption(prev => ({
      ...prev,
      Marca: prev.Marca.filter(marca => marca !== marcaToRemove)
    }));
  };

  const handleDeleteEquipo = (index) => {
    if (!optionsData.Equipos || index < 0 || index >= optionsData.Equipos.length) return; // Ensure valid index
    Alert.alert(
      'Eliminar Equipo',
      '¿Estás seguro de que deseas eliminar este equipo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            setOptionsData(prevState => {
              const updatedEquipos = [...prevState.Equipos];
              updatedEquipos.splice(index, 1);
              const newOptionsData = { ...prevState, Equipos: updatedEquipos };
              handleSaveOptions(newOptionsData); // Save options after deleting an equipo
              return newOptionsData;
            });
          }
        }
      ]
    );
  };

  const handleDeleteOption = (index, field) => {
    if (!field || !optionsData[field] || index < 0 || index >= optionsData[field].length) return; // Ensure valid index
    Alert.alert(
      'Eliminar Opción',
      '¿Estás seguro de que deseas eliminar esta opción?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            setOptionsData(prevState => {
              const updatedOptions = [...prevState[field]];
              updatedOptions.splice(index, 1);
              const newOptionsData = { ...prevState, [field]: updatedOptions };
              handleSaveOptions(newOptionsData); // Save options after deleting an option
              return newOptionsData;
            });
          }
        }
      ]
    );
  };

  const handleRemoveNewMarca = (marcaToRemove) => {
    setNewMarca(prev => prev.split(',').map(m => m.trim()).filter(m => m !== marcaToRemove).join(', '));
  };

  const renderOption = ({ item, index, field }) => {
    if (typeof item === 'object') {
      return (
        <View key={index} style={styles.optionRow}>
          <Text style={styles.optionText}>{`${item.Equipo}, ${Array.isArray(item.Marca) ? item.Marca.join(', ') : ''}`}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => { setEditIndex(index); setEditOption(item); setIsModalVisible(true); setCurrentField('Equipos'); }}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => { setCurrentField('Equipos'); handleDeleteEquipo(index); }}>
            <Text style={styles.buttonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.optionRow}>
          <Text style={styles.optionText}>{item}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => { setEditIndex(index); setEditOption(item); setIsModalVisible(true); setCurrentField(field); }}>
            <Text style={styles.buttonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteOption(index, field)}>
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
              renderItem={({ item, index }) => renderOption({ item, index, field })}
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
      <TouchableOpacity style={styles.exportButton} onPress={exportEquiposToJSON}>
        <Text style={styles.buttonText}>Exportar Opciones de Equipos</Text>
      </TouchableOpacity>
      <Modal transparent={true} animationType="slide" visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Editar Opción</Text>
            {currentField === 'Equipos' ? (
              <>
                <TextInput
                  style={styles.input}
                  value={editOption.Equipo || ''}
                  onChangeText={(text) => setEditOption({ ...editOption, Equipo: text })}
                  placeholder={editOption.Equipo || 'Nombre del Equipo'}
                  placeholderTextColor="#888"
                />
                <View style={styles.marcaContainer}>
                  {editOption.Marca && editOption.Marca.map((marca, index) => (
                    <View key={index} style={styles.marcaTag}>
                      <Text style={styles.marcaText}>{marca}</Text>
                      <TouchableOpacity style={styles.removeMarcaButton} onPress={() => handleRemoveEditMarca(marca)}>
                        <Text style={styles.removeMarcaButtonText}>Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.addMarcaButton} onPress={() => setIsMarcaModalVisible(true)}>
                  <Text style={styles.addMarcaButtonText}>Agregar Marca</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TextInput
                style={styles.input}
                value={typeof editOption === 'string' ? editOption : ''}
                onChangeText={setEditOption}
                placeholder={`Editar ${currentField}`}
                placeholderTextColor="#888"
              />
            )}
            <TouchableOpacity style={styles.saveButton} onPress={handleEditOption} disabled={!editOption || (typeof editOption === 'string' && editOption.trim() === '')}>
              <Text style={styles.buttonText}>{currentField === 'Equipos' ? 'Editar Equipo' : 'Editar'}</Text>
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
            <View style={styles.marcaContainer}>
              {newMarca.split(',').map(m => m.trim()).filter(m => m).map((marca, index) => (
                <View key={index} style={styles.marcaTag}>
                  <Text style={styles.marcaText}>{marca}</Text>
                  <TouchableOpacity style={styles.removeMarcaButton} onPress={() => handleRemoveNewMarca(marca)}>
                    <Text style={styles.removeMarcaButtonText}>Eliminar</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.input} onPress={() => setIsMarcaModalVisible(true)}>
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
                <TouchableOpacity style={styles.modalOption} onPress={() => {
                  if (currentField === 'Equipos') {
                    handleSelectEditMarca(item);
                  } else {
                    handleSelectMarca(item);
                  }
                }}>
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
            <TouchableOpacity style={styles.saveButton} onPress={handleAddEditMarca}>
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
  marcaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 5,
  },
  marcaText: {
    flex: 1,
    fontSize: 16,
  },
  removeMarcaButton: {
    backgroundColor: '#FF6B6B',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeMarcaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  marcaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  marcaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  marcaText: {
    fontSize: 14,
    color: '#333',
    marginRight: 10,
  },
  removeMarcaButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  removeMarcaButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addMarcaButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  addMarcaButtonText: {
    color: '#888',
    fontSize: 16,
  },
});
