import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, Snackbar } from 'react-native-paper';
import { getEventTypeDetails } from '../../constants/eventTypes';
import { useAppTheme } from '../../constants/theme';
import { useTimelineContext } from '../../contexts/TimelineContext';
import { useAccordionAnimation } from '../../hooks/useAccordionAnimation';
import { useTimelineForm } from '../../hooks/useTimelineForm';
import type { TimelineEventFormProps } from '../../types/timeline';
import { LabelText, TitleText } from '../ui/Typography';
import { AccordionForm } from './AccordionForm';

export const TimelineEventForm: React.FC<TimelineEventFormProps> = ({
  projectDate,
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  updateEventIcons,
}) => {
  const theme = useAppTheme();
  const { events } = useTimelineContext();
  const { isExpanded, accordionAnimation, toggleAccordion } = useAccordionAnimation();
  
  const {
    formData,
    errors,
    showTimePicker,
    snackbar,
    isFormComplete,
    handleFieldChange,
    handleTimeChange,
    handleSubmit,
    resetForm,
    setShowTimePicker,
    setSnackbar,
  } = useTimelineForm(projectDate, onSubmit, updateEventIcons);

  const handleCancel = () => {
    resetForm();
    toggleAccordion();
  };

  const handleConfirm = () => {
    if (handleSubmit()) {
      toggleAccordion();
    }
  };

  const styles = StyleSheet.create({
    container: { padding: 12 },
    header: { marginBottom: 12, alignItems: 'center' },
    addEventButton: { marginBottom: 8 },
    savedEventsText: { marginTop: 12, marginBottom: 6 },
    savedEventsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    eventIcon: { margin: 2 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TitleText size="large" color={theme.colors.primary}>
          Event Timeline
        </TitleText>
      </View>

      <Button
        mode="contained"
        onPress={toggleAccordion}
        disabled={isLoading}
        style={styles.addEventButton}
        icon={isExpanded ? "minus" : "plus"}
      >
        {isExpanded ? "Cancel" : "Add Event"}
      </Button>

      <AccordionForm
        animation={accordionAnimation}
        formData={formData}
        errors={errors}
        showTimePicker={showTimePicker}
        projectDate={projectDate}
        isLoading={isLoading}
        isExpanded={isExpanded}
        isFormComplete={isFormComplete}
        onFieldChange={handleFieldChange}
        onTimePickerToggle={setShowTimePicker}
        onTimeChange={handleTimeChange}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />

      {events.length > 0 && (
        <View>
          <LabelText size="medium" color={theme.colors.onSurface} style={styles.savedEventsText}>
            Timeline Events:
          </LabelText>
          <View style={styles.savedEventsContainer}>
            {events.map((event, index) => {
              const eventDetail = getEventTypeDetails(event.eventType);
              const IconComponent = eventDetail?.Icon;
              return (
                <IconButton
                  key={`${event.eventId}-${index}`}
                  icon={() => IconComponent ? <IconComponent width={24} height={24} /> : null}
                  size={32}
                  style={styles.eventIcon}
                  mode="contained-tonal"
                />
              );
            })}
          </View>
        </View>
      )}

      <Snackbar
        visible={snackbar.visible}
        onDismiss={() => setSnackbar({ visible: false, message: '' })}
        duration={3000}
        style={{ backgroundColor: theme.colors.primary }}
      >
        {snackbar.message}
      </Snackbar>
    </View>
  );
};

export default TimelineEventForm;