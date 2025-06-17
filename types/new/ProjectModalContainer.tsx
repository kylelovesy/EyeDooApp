import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import Swiper from 'react-native-swiper';
import { FormStep1 } from './FormStep1';
import { FormStep2 } from './FormStep2';
import { FormStep3 } from './FormStep3';
import { FormStep4 } from './FormStep4';
import { useProjectForm } from './ProjectFormContext';

export const ProjectModalContainer: React.FC = () => {
  const { 
    isModalVisible, 
    closeModal, 
    handleSubmit, 
    isSubmitting,
    isSubmittable,
    errors 
  } = useProjectForm();

  return (
    <Modal 
      visible={isModalVisible} 
      animationType="slide" 
      onRequestClose={closeModal}
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <Swiper 
          style={styles.wrapper} 
          showsButtons={true} 
          loop={false}
          showsPagination={true}
          paginationStyle={styles.pagination}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          buttonWrapperStyle={styles.buttonWrapper}
          nextButton={
            <View style={styles.navButton}>
              <Text style={styles.navButtonText}>Next</Text>
            </View>
          }
          prevButton={
            <View style={styles.navButton}>
              <Text style={styles.navButtonText}>Prev</Text>
            </View>
          }
        >
          {/* Form Step 1: Essential Information */}
          <View style={styles.slideContainer}>
            <FormStep1 />
          </View>
          
          {/* Form Step 2: Timeline Data */}
          <View style={styles.slideContainer}>
            <FormStep2 />
          </View>
          
          {/* Form Step 3: People Data */}
          <View style={styles.slideContainer}>
            <FormStep3 />
          </View>
          
          {/* Form Step 4: Photos Data */}
          <View style={styles.slideContainer}>
            <FormStep4 />
          </View>
        </Swiper>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!isSubmittable || isSubmitting}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Creating Project...' : 'Create Project'}
          </Button>
          <Button 
            mode="outlined" 
            onPress={closeModal} 
            style={styles.cancelButton}
            contentStyle={styles.cancelButtonContent}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </View>

        {/* Error Display */}
        {errors && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Please check the form for errors and try again.
            </Text>
          </View>
        )}

        {/* Loading Overlay */}
        {isSubmitting && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <ActivityIndicator size="large" color="#6200ee" />
              <Text style={styles.loadingText}>Creating your project...</Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
  },
  pagination: {
    bottom: 120,
  },
  dot: {
    backgroundColor: 'rgba(98, 0, 238, 0.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  },
  activeDot: {
    backgroundColor: '#6200ee',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
  },
  buttonWrapper: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  navButton: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
  cancelButtonContent: {
    paddingVertical: 8,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});

