// app/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="user-circle" size={100} color="#fff" />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>

      <View style={styles.infoSection}>
        <TouchableOpacity style={styles.infoCard}>
          <FontAwesome name="edit" size={24} color="black" />
          <Text style={styles.cardText}>Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoCard}>
          <FontAwesome name="cog" size={24} color="black" />
          <Text style={styles.cardText}>Configuraciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoCard}>
          <FontAwesome name="lock" size={24} color="black" />
          <Text style={styles.cardText}>Cambiar Contraseña</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3B3B3',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#fff',
  },
  infoSection: {
    width: '90%',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
  },
  cardText: {
    marginLeft: 20,
    fontSize: 18,
    color: 'black',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#666',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
  },
});
