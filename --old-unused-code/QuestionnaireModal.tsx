// src/components/modals/QuestionnaireModal.tsx
import React, { useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    PanGestureHandler,
    StyleSheet,
    View
} from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import Animated, {
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { spacing } from '../../constants/theme';
import { CustomButton } from '../ui/CustomButton';
import { Screen } from '../ui/Screen';
import { QuestionnaireA } from './QuestionnaireA';
import { QuestionnaireB } from './QuestionnaireB';
import { QuestionnaireC } from './QuestionnaireC';
import { QuestionnaireD } from './QuestionnaireD';

interface QuestionnaireModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: (projectData: any) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
  visible,
  onClose,
  onComplete,
}) => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    questionnaireA: null,
    questionnaireB: null,
    questionnaireC: null,
    questionnaireD: null,
  });
  
  const translateX = useSharedValue(0);
  const panRef = useRef(null);

  const questionnaires = [
    { id: 'A', title: 'Essential Info', component: QuestionnaireA },
    { id: 'B', title: 'Timeline', component: QuestionnaireB },
    { id: 'C', title: 'People & Roles', component: QuestionnaireC },
    { id: 'D', title: 'Photography Plan', component: QuestionnaireD },
  ];

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      const shouldMoveToNext = event.translationX < -screenWidth * 0.3;
      const shouldMoveToPrev = event.translationX > screenWidth * 0.3;

      if (shouldMoveToNext && currentStep < questionnaires.length - 1) {
        translateX.value = withSpring(-screenWidth);
        runOnJS(setCurrentStep)(currentStep + 1);
      } else if (shouldMoveToPrev && currentStep > 0) {
        translateX.value = withSpring(screenWidth);
        runOnJS(setCurrentStep)(currentStep - 1);
      } else {
        translateX.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleStepData = (stepId: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      [`questionnaire${stepId}`]: data,
    }));
  };

  const handleNext = () => {
    if (currentStep < questionnaires.length - 1) {
      translateX.value = withSpring(-screenWidth);
      setCurrentStep(currentStep + 1);
      translateX.value = withSpring(0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      translateX.value = withSpring(screenWidth);
      setCurrentStep(currentStep - 1);
      translateX.value = withSpring(0);
    }
  };

  const isFormValid = () => {
    // Check if at least the essential info (QuestionnaireA) is filled
    return formData.questionnaireA !== null;
  };

  const handleSaveProject = () => {
    if (!isFormValid()) {
      Alert.alert('Incomplete Form', 'Please fill in the essential information before saving.');
      return;
    }

    // Combine all questionnaire data into a project
    const projectData = {
      title: formData.questionnaireA?.title || 'New Project',
      clientName: `${formData.questionnaireA?.personA?.firstName || ''} & ${formData.questionnaireA?.personB?.firstName || ''}`,
      eventDate: formData.questionnaireA?.weddingDate || new Date(),
      venue: formData.questionnaireA?.locations?.[0]?.locationAddress || '',
      status: 'draft',
      type: 'wedding',
      questionnaireData: formData,
    };

    onComplete(projectData);
  };

  const handleClose = () => {
    const hasData = Object.values(formData).some(data => data !== null);
    
    if (hasData) {
      Alert.alert(
        'Unsaved Changes',
        'Are you sure you want to close? Any unsaved changes will be lost.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Close', 
            style: 'destructive',
            onPress: () => {
              setFormData({
                questionnaireA: null,
                questionnaireB: null,
                questionnaireC: null,
                questionnaireD: null,
              });
              setCurrentStep(0);
              translateX.value = 0;
              onClose();
            }
          }
        ]
      );
    } else {
      onClose();
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {questionnaires.map((_, index) => (
        <View
          key={index}
          style={[
            styles.stepDot,
            {
              backgroundColor: index === currentStep 
                ? theme.colors.primary 
                : theme.colors.outline,
            }
          ]}
        />
      ))}
    </View>
  );

  const CurrentQuestionnaire = questionnaires[currentStep].component;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <Screen>
        <View style={styles.header}>
          <IconButton
            icon="close"
            size={24}
            onPress={handleClose}
            style={styles.closeButton}
          />
          {renderStepIndicator()}
          <View style={styles.headerSpacer} />
        </View>

        <PanGestureHandler ref={panRef} onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.content, animatedStyle]}>
            <CurrentQuestionnaire
              onDataChange={(data) => handleStepData(questionnaires[currentStep].id, data)}
              initialData={formData[`questionnaire${questionnaires[currentStep].id}`]}
            />
          </Animated.View>
        </PanGestureHandler>

        <View style={styles.footer}>
          <View style={styles.navigationButtons}>
            <CustomButton
              title="Previous"
              variant="outline"
              onPress={handlePrevious}
              disabled={currentStep === 0}
              style={styles.navButton}
            />
            <CustomButton
              title="Next"
              variant="outline"
              onPress={handleNext}
              disabled={currentStep === questionnaires.length - 1}
              style={styles.navButton}
            />
          </View>
          
          {isFormValid() && (
            <CustomButton
              title="Save New Project"
              variant="primary"
              onPress={handleSaveProject}
              style={styles.saveButton}
            />
          )}
        </View>
      </Screen>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  closeButton: {
    margin: 0,
  },
  headerSpacer: {
    flex: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
    width: screenWidth,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navButton: {
    flex: 0.45,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
});

export default QuestionnaireModal;

