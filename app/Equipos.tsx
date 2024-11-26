import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SectionList, Alert, Modal, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import optionsEquiposJson from './Jsons/optionsEquipos.json';
import optionsTurnos from './Jsons/optionsTurnos.json';
import { useRouter } from 'expo-router';

export default function EquiposScreen() {
  const [equipoData, setEquipoData] = useState({
    equipo: '',
    marca: '',
    numeroInterno: '',
    operador: '',
    estado: '',
    porcentajePetroleo: '',
    observacion: '',
    photoUri: [],  // Handle multiple photos
    turno: '',  // Add new field
    estandarPetroleo: '',  // Add new field
    adherenciaPetroleo: '',  // Add new field
    ubicacion: '',  // Add new field
    estandarES: '',  // Add new field
    nivel: '',  // Add new field
    report: '',  // Add new field
    grupo: '',
    NombreSaliente: '',  // Add new field
    NombreEntrante: '',  // Add new field
  });

  const [equipos, setEquipos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateIndex, setUpdateIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [options, setOptions] = useState([]);
  const [optionsEquipos, setOptionsEquipos] = useState({
    Equipos: [],
    NuInterno: [],
    Estado: [],
    Petroleo: [],
    EstandarPetroleo: [],
    AdherenciaPetroleo: [],
    Ubicacion: [],
    EstandarES: [],
    Nivel: [],
    Report: [],
    Grupo: []
  });
  const router = useRouter();

  const loadEquipos = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('equipos');
      if (jsonValue != null) {
        const loadedEquipos = JSON.parse(jsonValue);
        // Sort equipos by date in descending order
        loadedEquipos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        setEquipos(loadedEquipos);
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
    const loadOptionsEquipos = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('optionsEquipos');
        if (jsonValue != null) {
          setOptionsEquipos(JSON.parse(jsonValue));
        } else {
          setOptionsEquipos(optionsEquiposJson);
        }
      } catch (e) {
        console.error("Error loading optionsEquipos", e);
      }
    };
    loadOptionsEquipos();
    loadEquipos();
  }, []);

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Se requiere permiso para acceder a la cámara.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync();
      if (result.cancelled) {
        alert('La toma de la foto fue cancelada.');
        return;
      }

      if (!result.assets || !result.assets[0].uri) {
        alert('No se pudo obtener la URI de la foto.');
        return;
      }

      const fileName = result.assets[0].uri.split('/').pop();
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.moveAsync({
        from: result.assets[0].uri,
        to: fileUri,
      });

      setEquipoData(prevState => ({
        ...prevState,
        photoUri: [...prevState.photoUri, fileUri], // Add new photo
      }));

      Alert.alert('Foto Agregada', 'La foto se ha agregado correctamente.');
    } catch (error) {
      console.error("Error taking photo", error);
      Alert.alert('Error', 'Hubo un problema al tomar la foto.');
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleAddEquipo = async () => {
    try {
      const NombreSaliente = await AsyncStorage.getItem('userName');
      if (NombreSaliente != null) {
        const newEquipo = { fecha: getCurrentDate(), ...equipoData, NombreSaliente }; // Date as the first data
        const updatedEquipos = [newEquipo, ...equipos]; // Add new equipo at the beginning
        setEquipos(updatedEquipos);
        saveEquipos(updatedEquipos);
        setShowForm(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error adding equipo", error);
    }
  };

  const handleUpdateEquipo = async () => {
    try {
      const NombreEntrante = await AsyncStorage.getItem('userName');
      if (NombreEntrante != null) {
        const normalizedNombreSaliente = normalizeString(equipoData.NombreSaliente);
        const normalizedNombreEntrante = normalizeString(NombreEntrante);

        if (normalizedNombreSaliente === normalizedNombreEntrante) {
          Alert.alert('Error', 'El mismo usuario no puede actualizar el equipo.');
          return;
        }

        if (!equipoData.adherenciaPetroleo) {
          Alert.alert('Error', 'El campo de adherencia de petróleo no puede estar vacío.');
          return;
        }

        if (!equipoData.porcentajePetroleo || equipoData.porcentajePetroleo.trim() === '') {
          Alert.alert('Error', 'El campo de % petróleo no puede estar vacío.');
          return;
        }

        const updatedEquipos = equipos.map((equipo, index) => 
          index === updateIndex ? { fecha: getCurrentDate(), ...equipoData, NombreEntrante } : equipo
        );
        setEquipos(updatedEquipos);
        saveEquipos(updatedEquipos);
        setShowForm(false);
        resetForm();
        setIsUpdating(false);
        setUpdateIndex(null);
      }
    } catch (error) {
      console.error("Error updating equipo", error);
    }
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
      photoUri: [],  // Reset to empty array
      turno: '', // Reset new field
      estandarPetroleo: '',  // Reset new field
      adherenciaPetroleo: '',  // Reset new field
      ubicacion: '',  // Reset new field
      estandarES: '',  // Reset new field
      nivel: '',  // Reset new field
      report: '',  // Reset new field
      grupo: '',    
      NombreSaliente: '',  // Reset new field
      NombreEntrante: '',  // Reset new field
    });
  };

  const openModal = (field, index = null) => {
    if (isUpdating && field !== 'adherenciaPetroleo') {
      return; // Block other modals when updating
    }
  
    setCurrentField(field);
    setSelectedIndex(index);
    let uniqueOptions = [];
    if (field === 'equipo') {
      uniqueOptions = optionsEquipos.Equipos ? [...new Set(optionsEquipos.Equipos.map(e => e.Equipo))] : [];
    } else if (field === 'marca' && equipoData.equipo) {
      const selectedEquipo = optionsEquipos.Equipos.find(e => e.Equipo === equipoData.equipo);
      uniqueOptions = selectedEquipo ? [...new Set(selectedEquipo.Marca)] : [];
    } else {
      switch (field) {
        case 'numeroInterno':
          uniqueOptions = optionsEquipos.NuInterno || [];
          break;
        case 'estado':
          uniqueOptions = optionsEquipos.Estado || [];
          break;
        case 'porcentajePetroleo':
          uniqueOptions = optionsEquipos.Petroleo || [];
          break;
        case 'estandarPetroleo':
          uniqueOptions = optionsEquipos.EstandarPetroleo || [];
          break;
        case 'adherenciaPetroleo':
          uniqueOptions = optionsEquipos.AdherenciaPetroleo || [];
          break;
        case 'ubicacion':
          uniqueOptions = optionsEquipos.Ubicacion || [];
          break;
        case 'estandarES':
          uniqueOptions = optionsEquipos.EstandarES || [];
          break;
        case 'nivel':
          uniqueOptions = optionsEquipos.Nivel || [];
          break;
        case 'report':
          uniqueOptions = optionsEquipos.Report || [];
          break;
        case 'grupo':
          uniqueOptions = optionsEquipos.Grupo || [];
          break;
        default:
          uniqueOptions = [];
      }
    }
    setOptions(uniqueOptions);
    setIsModalVisible(true);
    if (field === 'options') {
      setModalVisible(true);
    }
  };

  const handleSelectOption = (option) => {
    if (currentField === 'equipo') {
      const selectedEquipo = optionsEquipos.Equipos.find(e => e.Equipo === option);
      setEquipoData({
        ...equipoData,
        equipo: option,
        marca: selectedEquipo && Array.isArray(selectedEquipo.Marca) ? selectedEquipo.Marca[0] : '' // Handle multiple brands
      });
    } else if (currentField === 'marca') {
      setEquipoData({
        ...equipoData,
        marca: option
      });
    } else {
      setEquipoData({
        ...equipoData,
        [currentField]: option
      });
    }
    setIsModalVisible(false);
  };

  const handleEditEquipo = async (index) => {
    try {
      const NombreEntrante = await AsyncStorage.getItem('userName');
      if (NombreEntrante != null) {
        const equipoToEdit = equipos[index];
        const normalizedNombreSaliente = normalizeString(equipoToEdit.NombreSaliente);
        const normalizedNombreEntrante = normalizeString(NombreEntrante);

        if (normalizedNombreSaliente === normalizedNombreEntrante) {
          Alert.alert('Error', 'El mismo usuario no puede actualizar el equipo.');
          return;
        }

        if (!equipoToEdit.porcentajePetroleo || equipoToEdit.porcentajePetroleo.trim() === '') {
          Alert.alert('Error', 'El campo de % petróleo no puede estar vacío.');
          return;
        }

        setEquipoData(equipoToEdit);
        setShowForm(true);
        setIsUpdating(true);
        setUpdateIndex(index);
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error editing equipo", error);
    }
  };

  const handleDeleteEquipo = (index) => {
    Alert.alert(
      'Eliminar Equipo',
      '¿Estás seguro de que deseas eliminar este equipo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: async () => {
            const equipoToDelete = equipos[index];
            const updatedEquipos = equipos.filter((_, i) => i !== index);
            setEquipos(updatedEquipos);
            await AsyncStorage.setItem('equipos', JSON.stringify(updatedEquipos));
            
            // Eliminar fotos
            if (equipoToDelete.photoUri) {
              for (const uri of equipoToDelete.photoUri) {
                await FileSystem.deleteAsync(uri, { idempotent: true });
              }
            }

            setIsUpdating(false);
            setUpdateIndex(null);
            setModalVisible(false);
          }
        }
      ]
    );
  };

  const handleViewPhoto = (index) => {
    const equipo = equipos[index];
    if (equipo && equipo.photoUri && equipo.photoUri.length > 0) {
      console.log("Navigating to PhotoViewerScreen with photoUris:", equipo.photoUri);  
      router.push({
        pathname: '/PhotoViewerScreen',
        params: { photoUris: equipo.photoUri },  // Pasar el arreglo de fotos
      });
    } else {
      console.log("No photos found for equipo:", equipo);  
      Alert.alert('No hay fotos disponibles', 'Por favor, toma una foto primero.');
    }
  };

  const handleDeleteAll = async () => {
    Alert.alert(
      'Eliminar Todos los Equipos',
      '¿Estás seguro de que deseas eliminar todos los equipos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar Todo',
          onPress: async () => {
            try {
              // Eliminar fotos de todos los equipos
              for (const equipo of equipos) {
                if (equipo.photoUri) {
                  for (const uri of equipo.photoUri) {
                    await FileSystem.deleteAsync(uri, { idempotent: true });
                  }
                }
              }

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

  const deletePhoto = (index) => {
    setEquipoData(prevState => {
      const updatedPhotoUri = prevState.photoUri.filter((_, i) => i !== index);
      return { ...prevState, photoUri: updatedPhotoUri };
    });
  };

  const renderHeader = () => (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setShowForm(!showForm)}>
        <Text style={styles.buttonText}>{showForm ? "Cancelar" : "Agregar Nuevo Equipo"}</Text>
      </TouchableOpacity>
      {showForm && (
        <View style={styles.formContainer}>
          <TouchableOpacity onPress={() => openModal('equipo')}>
            <Text style={styles.input}>{equipoData.equipo || "Equipo"}</Text>
          </TouchableOpacity>
          {isModalVisible && currentField === 'equipo' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Equipo</Text>
                  <ScrollView style={styles.scrollview}>
                    {options.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TouchableOpacity onPress={() => openModal('marca')}>
            <Text style={styles.input}>{equipoData.marca || "Marca"}</Text>
          </TouchableOpacity>
          {isModalVisible && currentField === 'marca' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Marca</Text>
                  <ScrollView style={styles.scrollview}>
                    {options.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TouchableOpacity onPress={() => openModal('numeroInterno')}>
            <Text style={styles.input}>{equipoData.numeroInterno || "Número Interno"}</Text>
          </TouchableOpacity>
          {isModalVisible && currentField === 'numeroInterno' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Número Interno</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsEquipos.NuInterno.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TextInput
            placeholder="Operador"
            style={styles.input}
            value={equipoData.operador}
            onChangeText={(text) => setEquipoData({ ...equipoData, operador: text })}
            placeholderTextColor="#888"
          />

          <TouchableOpacity onPress={() => openModal('estado')}>
            <Text style={styles.input}>{equipoData.estado || "Estado"}</Text>
          </TouchableOpacity>
          {isModalVisible && currentField === 'estado' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Estado</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsEquipos.Estado.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TouchableOpacity onPress={() => openModal('porcentajePetroleo')}>
            <Text style={styles.input}>{equipoData.porcentajePetroleo || "% Petróleo"}</Text>
          </TouchableOpacity>
          {isModalVisible && currentField === 'porcentajePetroleo' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona % Petróleo</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsEquipos.Petroleo.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TouchableOpacity onPress={() => openModal('estandarPetroleo')}>
            <Text style={styles.input}>{equipoData.estandarPetroleo || "Estándar Petróleo"}</Text>
          </TouchableOpacity>
          {isModalVisible && currentField === 'estandarPetroleo' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Estándar Petróleo</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsEquipos.EstandarPetroleo.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TouchableOpacity onPress={() => openModal('adherenciaPetroleo')}>
            <Text style={styles.input}>{equipoData.adherenciaPetroleo || "Adherencia Petróleo"}</Text>
          </TouchableOpacity>
          {isModalVisible && currentField === 'adherenciaPetroleo' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Adherencia Petróleo</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsEquipos.AdherenciaPetroleo.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TouchableOpacity onPress={() => openModal('ubicacion')}>
            <Text style={styles.input}>{equipoData.ubicacion || "Ubicación"}</Text>
          </TouchableOpacity>
          {isModalVisible && currentField === 'ubicacion' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Ubicación</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsEquipos.Ubicacion.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TouchableOpacity onPress={() => openModal('estandarES')}>
            <Text style={styles.input}>{equipoData.estandarES || "Estándar ES"}</Text>
          </TouchableOpacity>
          {isModalVisible && currentField === 'estandarES' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Estándar ES</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsEquipos.EstandarES.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TouchableOpacity onPress={() => openModal('nivel')}>
            <Text style={styles.input}>{equipoData.nivel || "Nivel"}</Text>
          </TouchableOpacity>
          {isModalVisible && currentField === 'nivel' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Nivel</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsEquipos.Nivel.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TouchableOpacity onPress={() => openModal('report')}>
            <Text style={styles.input}>{equipoData.report || "Report"}</Text>
          </TouchableOpacity>
          {isModalVisible && currentField === 'report' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Report</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsEquipos.Report.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TouchableOpacity onPress={() => openModal('grupo')}>
            <Text style={styles.input}>{equipoData.grupo || "Grupo"}</Text>
          </TouchableOpacity>
          {isModalVisible && currentField === 'grupo' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Grupo</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsEquipos.Grupo.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TextInput
            placeholder="Observación"
            style={styles.input}
            value={equipoData.observacion}
            onChangeText={(text) => setEquipoData({ ...equipoData, observacion: text })}
            placeholderTextColor="#888"
          />

          <TouchableOpacity onPress={() => openModal('turno')}>
            <Text style={styles.input}>{equipoData.turno || "Turno"}</Text>
          </TouchableOpacity>
          {isModalVisible && currentField === 'turno' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Turno</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsTurnos.turnoSaliente.map((option, index) => (
                      <TouchableOpacity key={index} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}

          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Tomar Foto</Text>
          </TouchableOpacity>
          {equipoData.photoUri && equipoData.photoUri.length > 0 && (
            <ScrollView horizontal style={styles.photoPreviewContainer}>
              {equipoData.photoUri.map((uri, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image
                    source={{ uri }}
                    style={styles.photoPreview}
                  />
                  <TouchableOpacity style={styles.deletePhotoButton} onPress={() => deletePhoto(index)}>
                    <Text style={styles.deletePhotoButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.button} onPress={isUpdating ? handleUpdateEquipo : handleAddEquipo}>
            <Text style={styles.buttonText}>{isUpdating ? "Actualizar Equipo" : "Agregar Equipo"}</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.fecha}</Text>
      <Text style={styles.cell}>{item.equipo}</Text>
      <Text style={styles.cell}>{item.marca}</Text>
      <Text style={styles.cell}>{item.numeroInterno}</Text>
      <Text style={styles.cell}>{item.operador}</Text>
      <Text style={styles.cell}>{item.estado}</Text>
      <Text style={styles.cell}>{item.porcentajePetroleo}</Text>
      <Text style={styles.cell}>{item.observacion}</Text>
      <Text style={styles.cell}>{item.turno}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.optionsButton]} onPress={() => openModal('options', index)}>
          <Text style={styles.actionText}>Opciones</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSectionHeader = ({ section: { title } }) => {
    if (title === 'Equipos') {
      return (
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Fecha</Text>
          <Text style={styles.headerCell}>Equipo</Text>
          <Text style={styles.headerCell}>Marca</Text>
          <Text style={styles.headerCell}>Número Interno</Text>
          <Text style={styles.headerCell}>Operador</Text>
          <Text style={styles.headerCell}>Estado</Text>
          <Text style={styles.headerCell}>% Petróleo</Text>
          <Text style={styles.headerCell}>Observación</Text>
          <Text style={styles.headerCell}>Turno</Text>
          <Text style={styles.headerCell}>Acciones</Text>
        </View>
      );
    }
    return null;
  };

  const renderModalContent = () => (
    <ScrollView style={styles.scrollview}>
      {options.map((option, index) => (
        <TouchableOpacity key={index} onPress={() => handleSelectOption(option)} style={styles.modalOption}>
          <Text style={styles.modalOptionText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

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
              onPress={() => handleEditEquipo(selectedIndex)}
            >
              <Text style={styles.modalButtonText}>Actualizar Equipo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={() => handleDeleteEquipo(selectedIndex)}
            >
              <Text style={styles.modalButtonText}>Eliminar Equipo</Text>
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
  viewButton: {
    backgroundColor: '#FFD700', // Yellow color
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteAllButtonMargin: {
    marginBottom: 20, // Add margin to create space
  },
  photoPreviewContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  photoWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  photoPreview: {
    width: 100,
    height: 100,
  },
  deletePhotoButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'red',
    borderRadius: 50,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deletePhotoButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
};