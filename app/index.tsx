// app/index.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function MainScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button title="Go to Login" onPress={() => router.push('./auth/login')} />
      <Button title="Go to Home" onPress={() => router.push('./home')} />
      <Button title="Go to Profile" onPress={() => router.push('./profile')} />
      <Button title="Go to Recurso" onPress={() => router.push('./resource')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});