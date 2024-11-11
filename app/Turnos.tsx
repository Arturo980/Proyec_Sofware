import React, { useState, useEffect } from 'react';
import { Dimensions, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, KeyboardAvoidingView, Platform, SectionList, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import optionsTurnos from './Jsons/optionsTurnos.json';
import * as FileSystem from 'expo-file-system';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useRouter } from 'expo-router';

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
    photoUri: [],  // Cambiado para manejar múltiples fotos
  });
  const [turnos, setTurnos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [editingIndex, setEditingIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const { width } = Dimensions.get('window');
  const [currentPickerField, setCurrentPickerField] = useState(null);
  const router = useRouter();
  const isTablet = width >= 768;


  useEffect(() => {
    const loadUserName = async () => {
      try {
        const NombreRegistrante = await AsyncStorage.getItem('userName');
        if (NombreRegistrante != null) {
          setTurnoData(prevState => ({ ...prevState, NombreRegistrante }));
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
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Se requiere permiso para acceder a la cámara.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync();
      console.log('Result:', result); 

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
      console.log('File URI:', fileUri); 

      await FileSystem.moveAsync({
        from: result.assets[0].uri,
        to: fileUri,
      });

      // Agregar la foto al array de photosUri
      setTurnoData(prevState => ({
        ...prevState,
        photoUri: [...prevState.photoUri, fileUri], // Agregar una nueva foto
      }));

      Alert.alert('Foto Agregada', 'La foto se ha agregado correctamente.');
    } catch (error) {
      console.error("Error taking photo", error);
      Alert.alert('Error', 'Hubo un problema al tomar la foto.');
    }
  };

  const handleAddTurno = async () => {
    setIsAdding(true)
    setIsEditing(false);
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
      photoUri: [],  // Resetear a arreglo vacío
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
    setIsEditing(true);
    setEditingIndex(index);
    setModalVisible(false);
    setIsAdding(false);
  }}
      ]
    );
  } 

  const handleViewPhoto = (index) => {
    const turno = turnos[index];
    if (turno && turno.photoUri && turno.photoUri.length > 0) {
      console.log("Navigating to PhotoViewerScreen with photoUris:", turno.photoUri);  
      router.push({
        pathname: '/PhotoViewerScreen',
        params: { photoUris: turno.photoUri },  // Pasar el arreglo de fotos
      });
    } else {
      console.log("No photos found for turno:", turno);  
      Alert.alert('No hay fotos disponibles', 'Por favor, toma una foto primero.');
    }
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
    setIsAdding(false);
    setEditingIndex(index);
    setModalVisible(false);
  };


  
  const handlePickerOpen = (field) => {
    setCurrentPickerField(field);
    setPickerVisible(true);
  };

  const handleFieldFocus = (field) => {
    setCurrentPickerField(field);
    setPickerVisible(true);
  };

  const handlePickerChange = (itemValue) => {
    setTurnoData((prevData) => ({ ...prevData, [currentPickerField]: itemValue }));
    setPickerVisible(false);
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  
  // Función para abrir el modal y establecer el campo actual
  const openModal = (field) => {
    setCurrentField(field);
    setIsModalVisible(true);
  };
  
  // Función para manejar la selección de una opción
  const handleSelectOption = (option) => {
    setTurnoData({
      ...turnoData,
      [currentField]: option
    });
    setIsModalVisible(false);
  };
  
  const renderHeader = () => (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setShowForm(!showForm)}>
        <Text style={styles.buttonText}>{showForm ? "Cancelar" : "Agregar Nuevo Turno"}</Text>
      </TouchableOpacity>
  
      {showForm && (
        <View style={styles.formContainer}>
          <TouchableOpacity onPress={() => openModal('turnoSaliente')}>
            <Text style={styles.input} editable={isAdding}>{turnoData.turnoSaliente || "Turno Saliente"}</Text>
          </TouchableOpacity>
  
          {/* Modal para turnoSaliente */}
          {isModalVisible && currentField === 'turnoSaliente' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Turno Saliente</Text>
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
  
          <TouchableOpacity onPress={() => openModal('nombreSaliente')}>
            <Text style={styles.input} editable={isAdding}>{turnoData.nombreSaliente || "Nombre Saliente"}</Text>
          </TouchableOpacity>
  
          {/* Modal para nombreSaliente */}
          {isModalVisible && currentField === 'nombreSaliente' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Nombre Saliente</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsTurnos.nombreSaliente.map((option, index) => (
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
  
          <TouchableOpacity onPress={() => openModal('grupoSaliente')}>
            <Text style={styles.input} editable={isAdding}>{turnoData.grupoSaliente || "Grupo Saliente"}</Text>
          </TouchableOpacity>
  
          {/* Modal para grupoSaliente */}
          {isModalVisible && currentField === 'grupoSaliente' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Grupo Saliente</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsTurnos.grupoSaliente.map((option, index) => (
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

          <TouchableOpacity onPress={() => openModal('postura')}>
            <Text style={styles.input} editable={isAdding}>{turnoData.postura || "Postura"}</Text>
          </TouchableOpacity>
  
          {/* Modal para postura */}
          {isModalVisible && currentField === 'postura' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Postura</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsTurnos.postura.map((option, index) => (
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

          <TouchableOpacity onPress={() => openModal('estatusFinal')}>
            <Text style={styles.input} editable={isAdding}>{turnoData.estatusFinal || "Estatus Final"}</Text>
          </TouchableOpacity>
  
          {/* Modal para estatusFinal */}
          {isModalVisible && currentField === 'estatusFinal' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Estatus Final</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsTurnos.estatusFinal.map((option, index) => (
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

          <TouchableOpacity onPress={() => openModal('estatusReal')}>
            <Text style={styles.input} editable={isAdding}>{turnoData.estatusReal || "Estatus Real"}</Text>
          </TouchableOpacity>
  
          {/* Modal para estatusReal */}
          {isModalVisible && currentField === 'estatusReal' && (
            <Modal transparent={true} animationType="slide" visible={isModalVisible}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Selecciona Estatus Real</Text>
                  <ScrollView style={styles.scrollview}>
                    {optionsTurnos.estatusReal.map((option, index) => (
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
            
          {/* Observación */}
          <TextInput
            placeholder="Observación"
            style={styles.input}
            editable={isAdding}
            placeholderTextColor="#888"
            value={turnoData.observacion}
            onChangeText={(text) => setTurnoData({ ...turnoData, observacion: text })}
          />
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>Tomar Foto</Text>
          </TouchableOpacity>
          {turnoData.photoUri && turnoData.photoUri.length > 0 && (
            turnoData.photoUri.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={{ width: 100, height: 100, marginBottom: 10 }}
              />
            ))
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
        visible={photoModalVisible}
        transparent={true}
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ImageViewer
            imageUrls={[{ url: turnos[selectedIndex]?.photoUri }]}
            enableSwipeDown={true}
            onSwipeDown={() => setPhotoModalVisible(false)}
          />
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%', // Limitar altura del modal
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
});