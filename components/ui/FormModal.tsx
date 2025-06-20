import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, Portal, Snackbar } from 'react-native-paper';
import { useAppTheme } from '../../constants/theme';
import { BaseFormContextType } from '../../contexts/useBaseFormContext';
import BaseFormModal from './BaseFormModal';
import { BodyText } from './Typography';

interface FormModalProps<T = any> {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  context: BaseFormContextType<T>;
  saveLabel?: string;
  cancelLabel?: string;
}

const FormModal = <T,>({ 
  title, 
  subtitle, 
  children, 
  context,
  saveLabel = "Save",
  cancelLabel = "Cancel"
}: FormModalProps<T>) => {
  const { colors } = useAppTheme();
  const { 
    isModalVisible, 
    closeModal, 
    handleSubmit, 
    isSubmitting, 
    snackbar, 
    hideSnackbar,
    isValid
  } = context;

  // Create close button component
  const closeButton = (
    <IconButton
      icon="close"
      size={24}
      onPress={closeModal}
      style={styles.closeButton}
      iconColor={colors.onSurface}
    />
  );

  return (
    <>
      <BaseFormModal 
        visible={isModalVisible} 
        onClose={closeModal} 
        title={title}
        closeButton={closeButton}
      >
      
        {subtitle && <BodyText style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>{subtitle}</BodyText>}
        <View style={styles.content}>
          {children}
        </View>
        
        {/* Only Submit button, centered */}
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={handleSubmit} 
            style={styles.button} 
            loading={isSubmitting} 
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? 'Saving...' : saveLabel}
          </Button>
        </View> 
        {/* <FormActions 
          onSave={handleSubmit} 
          onCancel={closeModal} 
          isSubmitting={isSubmitting}
          saveLabel={saveLabel}
          cancelLabel={cancelLabel}
        /> */}
      </BaseFormModal>
      
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
    </>
  );
};
const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1002,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    elevation: 2,
  },
  content: { 
    width: '100%',
    paddingBottom: 16,
  },
  subtitle: { 
    textAlign: 'center', 
    marginBottom: 24,
    width: '100%'
  },
  buttonContainer: { 
    paddingTop: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#e0e0e0', 
    width: '100%',
    alignItems: 'center',
  },
  button: { 
    width: '100%',
    maxWidth: 300,
  },
});
// const FormActions: React.FC<{
//   onSave: () => void;
//   onCancel: () => void;
//   isSubmitting: boolean;
//   saveLabel?: string;
//   cancelLabel?: string;
// }> = ({ onSave, onCancel, isSubmitting, saveLabel = "Save", cancelLabel = "Cancel" }) => (
//   <View style={styles.buttonContainer}>
//     <Button mode="outlined" onPress={onCancel} style={styles.button} disabled={isSubmitting}>
//       {cancelLabel}
//     </Button>
//     <Button mode="contained" onPress={onSave} style={styles.button} loading={isSubmitting} disabled={isSubmitting}>
//       {isSubmitting ? 'Saving...' : saveLabel}
//     </Button>
//   </View>
// );

// const styles = StyleSheet.create({
//   content: { 
//     width: '100%',
//     paddingBottom: 16 
//   },
//   subtitle: { 
//     textAlign: 'center', 
//     marginBottom: 24,
//     width: '100%'
//   },
//   buttonContainer: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-around', 
//     paddingTop: 16, 
//     borderTopWidth: 1, 
//     borderTopColor: '#e0e0e0', 
//     width: '100%'
//   },
//   button: { 
//     flex: 1, 
//     marginHorizontal: 8 
//   },
// });

export default FormModal; 