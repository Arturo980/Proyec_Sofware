import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userName'); // Borra el AsyncStorage
      router.push('auth/login'); // Redirige a la pantalla de login
    } catch (error) {
      console.error('Error al borrar AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Perfil</Text>
      <Button title="Salir" onPress={handleLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra horizontalmente
  },
});

export default ProfileScreen;
