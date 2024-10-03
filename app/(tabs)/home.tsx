// app/home.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Actividad</Text>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.card}
        onPress={() => router.push('./resource')}>
          <FontAwesome name="check-square-o" size={30} color="black" />
          <Text style={styles.cardText}>Nivel de Recurso</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <FontAwesome name="info-circle" size={30} color="black" />
          <Text style={styles.cardText}>Estado</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <MaterialIcons name="description" size={30} color="black" />
          <Text style={styles.cardText}>Observaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <FontAwesome name="map-marker" size={30} color="black" />
          <Text style={styles.cardText}>Ubicación</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.fab}>
        <FontAwesome name="share" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3B3B3',
    alignItems: 'center',
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '90%',
  },
  card: {
    backgroundColor: '#fff',
    width: '40%',
    height: 120,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#666',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
