/*
File: components/ui/BaseFormModal.tsx
Description: This component has been refactored to no longer use the native React Native Modal.
Instead, it now uses a conditionally rendered View with absolute positioning and a high zIndex.
This will solve the stacking context issue, allowing dropdowns and other overlays to appear
correctly on top of the modal and receive touch events. I have also corrected the import paths
to align with your project's structure and aliases.
*/
import React from 'react';
import { ScrollView, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useAppTheme } from '../../constants/theme';
import { TitleText } from './Typography';

type BaseFormModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  closeButton?: React.ReactNode;
};

const BaseFormModal = ({ visible, onClose, title, children, closeButton }: BaseFormModalProps) => {
  const { colors } = useAppTheme();

  if (!visible) {
    return null;
  }

  return (
    // This is the main overlay container. It covers the whole screen.
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        {/* This container prevents a press on the modal content from closing the modal */}
        <TouchableWithoutFeedback>
          <View style={[styles.modalView, { backgroundColor: colors.surface }]}>
            {/* Render close button if provided */}
            {closeButton}
            <TitleText style={styles.modalTitle}>
              {title}
            </TitleText>
            <ScrollView style={styles.scrollView}>
              {children}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000, // High zIndex to ensure it's on top of other content
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '90%',
    position: 'relative', // Enable absolute positioning for children
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#007AFF', // Using a direct color value instead of colors.primary
    paddingTop: 20, // Add padding to avoid overlap with close button
  },
  scrollView: {
    width: '100%',
  },
});

export default BaseFormModal;
// import React from 'react';
// import { Modal, ScrollView, StyleSheet, View } from 'react-native';
// import { Button, Portal, Snackbar, Text } from 'react-native-paper';
// import { BaseFormContextType } from '../../contexts/useBaseFormContext';

// interface BaseFormModalProps<T = any> {
//   title: string;
//   subtitle?: string;
//   children: React.ReactNode;
//   context: BaseFormContextType<T>;
//   saveLabel?: string;
//   cancelLabel?: string;
// }

// const BaseFormModal = <T,>({ 
//   title, 
//   subtitle, 
//   children, 
//   context,
//   saveLabel = "Save",
//   cancelLabel = "Cancel"
// }: BaseFormModalProps<T>) => {
//   const { 
//     isModalVisible, 
//     closeModal, 
//     handleSubmit, 
//     isSubmitting, 
//     snackbar, 
//     hideSnackbar 
//   } = context;

//   return (
//     <Modal visible={isModalVisible} animationType="slide" onRequestClose={closeModal}>
//       <View style={styles.modalContainer}>
//         <ScrollView style={styles.container}>
//           <View style={styles.content}>
//             <Text variant="headlineSmall" style={styles.title}>{title}</Text>
//             {subtitle && <Text variant="bodyMedium" style={styles.subtitle}>{subtitle}</Text>}
//             {children}
//           </View>
//         </ScrollView>
        
//         <FormActions 
//           onSave={handleSubmit} 
//           onCancel={closeModal} 
//           isSubmitting={isSubmitting}
//           saveLabel={saveLabel}
//           cancelLabel={cancelLabel}
//         />
        
//         <Portal>
//           <Snackbar
//             visible={snackbar.visible}
//             onDismiss={hideSnackbar}
//             duration={3000}
//             style={{ backgroundColor: snackbar.type === 'success' ? '#4CAF50' : '#F44336' }}
//           >
//             {snackbar.message}
//           </Snackbar>
//         </Portal>
//       </View>
//     </Modal>
//   );
// };

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
//   modalContainer: { 
//     flex: 1, 
//     backgroundColor: '#f5f5f5' 
//   },
//   container: { 
//     flex: 1 
//   },
//   content: { 
//     padding: 16, 
//     paddingBottom: 32 
//   },
//   title: { 
//     textAlign: 'center', 
//     marginBottom: 8 
//   },
//   subtitle: { 
//     textAlign: 'center', 
//     marginBottom: 24, 
//     color: '#666' 
//   },
//   buttonContainer: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-around', 
//     padding: 16, 
//     borderTopWidth: 1, 
//     borderTopColor: '#e0e0e0', 
//     backgroundColor: '#ffffff' 
//   },
//   button: { 
//     flex: 1, 
//     marginHorizontal: 8 
//   },
// });

// export default BaseFormModal;

