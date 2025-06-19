import React from 'react';
import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Portal, Snackbar, Text } from 'react-native-paper';
import { BaseFormContextType } from '../../contexts/useBaseFormContext';

interface BaseFormModalProps<T = any> {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  context: BaseFormContextType<T>;
  saveLabel?: string;
  cancelLabel?: string;
}

const BaseFormModal = <T,>({ 
  title, 
  subtitle, 
  children, 
  context,
  saveLabel = "Save",
  cancelLabel = "Cancel"
}: BaseFormModalProps<T>) => {
  const { 
    isModalVisible, 
    closeModal, 
    handleSubmit, 
    isSubmitting, 
    snackbar, 
    hideSnackbar 
  } = context;

  return (
    <Modal visible={isModalVisible} animationType="slide" onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <Text variant="headlineSmall" style={styles.title}>{title}</Text>
            {subtitle && <Text variant="bodyMedium" style={styles.subtitle}>{subtitle}</Text>}
            {children}
          </View>
        </ScrollView>
        
        <FormActions 
          onSave={handleSubmit} 
          onCancel={closeModal} 
          isSubmitting={isSubmitting}
          saveLabel={saveLabel}
          cancelLabel={cancelLabel}
        />
        
        <Portal>
          <Snackbar
            visible={snackbar.visible}
            onDismiss={hideSnackbar}
            duration={3000}
            style={{ backgroundColor: snackbar.type === 'success' ? '#4CAF50' : '#F44336' }}
          >
            {snackbar.message}
          </Snackbar>
        </Portal>
      </View>
    </Modal>
  );
};

const FormActions: React.FC<{
  onSave: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  saveLabel?: string;
  cancelLabel?: string;
}> = ({ onSave, onCancel, isSubmitting, saveLabel = "Save", cancelLabel = "Cancel" }) => (
  <View style={styles.buttonContainer}>
    <Button mode="outlined" onPress={onCancel} style={styles.button} disabled={isSubmitting}>
      {cancelLabel}
    </Button>
    <Button mode="contained" onPress={onSave} style={styles.button} loading={isSubmitting} disabled={isSubmitting}>
      {isSubmitting ? 'Saving...' : saveLabel}
    </Button>
  </View>
);

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  container: { 
    flex: 1 
  },
  content: { 
    padding: 16, 
    paddingBottom: 32 
  },
  title: { 
    textAlign: 'center', 
    marginBottom: 8 
  },
  subtitle: { 
    textAlign: 'center', 
    marginBottom: 24, 
    color: '#666' 
  },
  buttonContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    padding: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#e0e0e0', 
    backgroundColor: '#ffffff' 
  },
  button: { 
    flex: 1, 
    marginHorizontal: 8 
  },
});

export default BaseFormModal;
