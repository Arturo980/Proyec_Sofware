import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Polygon, Image as SvgImage } from 'react-native-svg';

export default function HomeScreen() {
  const navigation = useNavigation();  // Usa el hook para obtener la navegación

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Home</Text>

      <Svg height="300" width="300" style={styles.hexagon}>
        <Polygon
          points="150,0 300,75 300,225 150,300 0,225 0,75"
          fill="#F0A500"
        />
        <SvgImage
          href={require('@/assets/images/minetrack.png')} // Asegúrate de que esta ruta sea correcta
          x="50" // Ajusta la posición de la imagen dentro del hexágono
          y="25" // Ajusta la posición de la imagen dentro del hexágono
          width="200" // Ajusta el tamaño de la imagen
          height="200" // Ajusta el tamaño de la imagen
          preserveAspectRatio="xMidYMid slice"
        />
      </Svg>
      <Text style={styles.header}>Gestión de Datos</Text>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Turnos')}>
          <Text style={styles.cardText}>Turnos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Equipos')}>
          <Text style={styles.cardText}>Equipos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E4E4E',
    alignItems: 'center',
    paddingTop: 40,
  },
  hexagon: {
    marginVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 50,
  },
  card: {
    backgroundColor: '#F0A500',
    width: '30%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
  },
  cardText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
});




