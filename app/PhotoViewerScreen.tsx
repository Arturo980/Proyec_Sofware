import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useRoute } from '@react-navigation/native'; // React Navigation's useRoute

const PhotoViewerScreen = () => {
  const route = useRoute();
  const { photoUri } = route.params || {};  // Access the photoUri passed in params

  console.log("Received params in PhotoViewerScreen:", route.params);  // Log the received params

  if (!photoUri) {
    console.log("No photoUri found, displaying loading screen.");  // Log if photoUri is not found
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const images = [
    {
      url: photoUri,
    },
  ];

  console.log("Displaying image with photoUri:", photoUri);  // Log the image URL to be displayed

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
});

export default PhotoViewerScreen;




