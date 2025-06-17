// src/components/modal/ProjectModalContainer.tsx
import React from 'react';
import { Button, Modal, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';
import { useProjectForm } from '../../contexts/ProjectFormContext';
import { FormStep1 } from './FormStep1';
import { FormStep2 } from './FormStep2';
import { FormStep3 } from './FormStep3';
import { FormStep4 } from './FormStep4';

export const ProjectModalContainer = ({ userId }: { userId: string }) => {
  const { isModalVisible, closeModal, handleSubmit, isSubmittable } = useProjectForm();

  return (
    <Modal visible={isModalVisible} animationType="slide" onRequestClose={closeModal}>
      <View style={styles.container}>
        <Swiper style={styles.wrapper} showsButtons={true} loop={false}>
          {/* Each form is a slide in the swiper */}
          <FormStep1 />
          <FormStep2 />
          <FormStep3 />
          <FormStep4 />
        </Swiper>
        <View style={styles.buttonContainer}>
          <Button
            title="Create Project"
            onPress={() => handleSubmit(userId)}
            disabled={!isSubmittable}
          />
          <Button title="Cancel" onPress={closeModal} color="gray" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  wrapper: {},
  buttonContainer: { padding: 20 },
  button: {
    marginBottom: 10,
  },
  // Add styles for slide, input, title, errorText etc. to be shared by form steps
});