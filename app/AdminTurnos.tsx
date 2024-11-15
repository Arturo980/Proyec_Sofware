import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import optionsTurnos from './Jsons/optionsTurnos.json';

export default function AdminTurnosScreen() {
  const [optionsData, setOptionsData] = useState({});
  const [currentField, setCurrentField] = useState('');
  const [newOption, setNewOption] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editOption, setEditOption] = useState('');

  useEffect(() => {
    const loadOptionsData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('optionsTurnos');
        if (jsonValue != null) {
          setOptionsData(JSON.parse(jsonValue));
        } else {
          setOptionsData(optionsTurnos);
        }
      } catch (e) {
        console.error("Error loading optionsTurnos", e);
        setOptionsData(optionsTurnos); // Ensure optionsData is set even if there's an error
      }
    };
    loadOptionsData();
  }, []);

  const handleAddOption = () => {
    if (newOption.trim() === '' || !currentField) return;
    setOptionsData(prevState => {
      const updatedOptions = {
        ...prevState,
        [currentField]: prevState[currentField] ? [...prevState[currentField], newOption] : [newOption]
      };
      handleSaveOptions(updatedOptions);
      return updatedOptions;
    });
    setNewOption('');
    setCurrentField('');
  };

  const handleEditOption = () => {
    if (editOption.trim() === '' || !currentField) return;
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

  const handleDeleteOption = (index) => {
    if (!currentField) return;
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
              handleSaveOptions(newOptionsData);
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
      await AsyncStorage.setItem('optionsTurnos', JSON.stringify(optionsDataToSave));
      setOptionsData(optionsDataToSave); // Ensure state is updated after saving
      Alert.alert('Guardado', 'Las opciones se han guardado correctamente.');
    } catch (e) {
      console.error("Error saving options", e);
      Alert.alert('Error', 'Hubo un problema al guardar las opciones.');
    }
  };

  const renderOption = ({ item, index }) => (
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Administrar Turnos</Text>
      <FlatList
        data={Object.keys(optionsData).filter(field => optionsData[field] && optionsData[field].length > 0)}
        renderItem={({ item: field, index }) => (
          <View key={index} style={styles.fieldContainer}>
            <Text style={styles.fieldTitle}>{field}</Text>
            <FlatList
              data={optionsData[field]}
              renderItem={renderOption}
              keyExtractor={(item, index) => index.toString()}
            />
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
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveOptions(optionsData)}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
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
    marginTop: 20,
  },
});
