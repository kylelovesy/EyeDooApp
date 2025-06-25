import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useProjects } from '../../contexts/ProjectContext';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const { currentProject } = useProjects();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  if (!currentProject) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', margin: 20 }}>
          No project selected. Please select a project first.
        </Text>
        <Button onPress={() => router.back()} title="Go Back" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && currentProject && !isProcessing) {
        setIsProcessing(true);
        try {
            const photo = await cameraRef.current.takePictureAsync();
            if (photo) {
                // Immediately copy the photo to permanent storage
                const imageName = `${uuidv4()}.jpg`;
                const permanentUri = `${FileSystem.documentDirectory}${imageName}`;
                
                try {
                    await FileSystem.copyAsync({ 
                        from: photo.uri, 
                        to: permanentUri 
                    });
                    
                    // Pass the permanent URI and project ID to the tagging screen
                    router.replace({ 
                        pathname: '/(app)/tagPhoto', 
                        params: { 
                            photoUri: permanentUri,
                            projectId: currentProject.id
                        } 
                    });
                } catch (copyError) {
                    console.error('Failed to copy image to permanent storage:', copyError);
                    Alert.alert(
                        'Storage Error',
                        'Failed to save the photo to permanent storage. Please try again.',
                        [{ text: 'OK' }]
                    );
                }
            }
        } catch (error) {
            console.error('Failed to take picture:', error);
            Alert.alert('Camera Error', 'Failed to take picture. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing='back' ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, isProcessing && styles.buttonDisabled]} 
            onPress={takePicture}
            disabled={isProcessing}
          >
            <MaterialCommunityIcons 
              name={isProcessing ? "loading" : "camera-iris"} 
              size={40} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});