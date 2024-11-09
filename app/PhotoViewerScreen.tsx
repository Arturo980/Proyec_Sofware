import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useRoute } from '@react-navigation/native';

const PhotoViewerScreen = () => {
  const route = useRoute();
  const { photoUris = "" } = route.params || {};  // Default to empty string if photoUris is undefined

  console.log("Received params in PhotoViewerScreen:", route.params);

  // Split the photoUris string into an array if it's a string
  const photoUrisArray = typeof photoUris === "string" ? photoUris.split(",") : photoUris;

  if (!Array.isArray(photoUrisArray) || photoUrisArray.length === 0) {
    console.log("No photos found, displaying loading screen.");
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00f" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const images = photoUrisArray.map(uri => ({ url: uri.trim() }));

  console.log("Displaying images with photoUris:", photoUrisArray);

  return (
    <View style={styles.container}>
      <ImageViewer imageUrls={images} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});

export default PhotoViewerScreen;

