/*-------------------------------------*/
// components/timeline/TimelineEventForm.tsx
// Status: Complete - Consolidated and cleaned up
// What it does: 
// Main component for the timeline event form that assembles various input fields
// and uses AccordionForm.tsx to structure the layout. Uses custom hooks for
// clean separation of concerns.
/*-------------------------------------*/

import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, Snackbar } from 'react-native-paper';

// Theme
import { useAppTheme } from '../../constants/theme';

// Custom UI
import { LabelText, TitleText } from '../ui/Typography';
import { AccordionForm } from './AccordionForm';

// Timeline
import { getEventTypeDetails } from '../../constants/eventTypes';
import { useTimelineContext } from '../../contexts/TimelineContext';
import { useAccordionAnimation } from '../../hooks/useAccordionAnimation';
import { useTimelineForm } from '../../hooks/useTimelineForm';
import type { TimelineEventFormProps, TTimelineEventForm } from '../../types/timeline';

export const TimelineEventForm: React.FC<TimelineEventFormProps> = ({
  projectDate,
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  updateEventIcons,
  onUpdate,
  onDelete,
  editingEvent: propEditingEvent,
}) => {
  const theme = useAppTheme();
  const { events } = useTimelineContext();
  const { isExpanded, accordionAnimation, toggleAccordion } = useAccordionAnimation();

  // State to track if we're editing an existing event
  const [editingEvent, setEditingEvent] = useState<TTimelineEventForm | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
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
    populateForm,
  } = useTimelineForm({ 
    projectDate, 
    onSubmit, 
    updateEventIcons: updateEventIcons ? updateEventIcons : () => {},
    editingEvent,
    onUpdate,
    onDelete,
  });

  // Handle clicking on an event icon to edit
  const handleEventIconClick = (event: TTimelineEventForm) => {
    // No need to convert since events are already TTimelineEventForm
    setEditingEvent(event);
    setIsEditMode(true);
    
    // Populate form with event data
    if (populateForm) {
      populateForm(event);
    }
    
    // Open accordion if it's not already open
    if (!isExpanded) {
      toggleAccordion();
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingEvent(null);
    setIsEditMode(false);
    toggleAccordion();
    onCancel?.();
  };

  const handleConfirm = () => {
    if (handleSubmit()) {
      setEditingEvent(null);
      setIsEditMode(false);
      toggleAccordion();
    }
  };
  
  // Handle adding a new event (not editing)
  const handleAddNewEvent = () => {
    setEditingEvent(null);
    setIsEditMode(false);
    resetForm();
    toggleAccordion();
  };

  // Reset edit mode when accordion is closed
  useEffect(() => {
  if (!isExpanded) {
    setEditingEvent(null);
    setIsEditMode(false);
    }
  }, [isExpanded]);

  // Add delete handler
  const handleEventDelete = async (event: TTimelineEventForm | null): Promise<boolean> => {
    if (!event) {
      console.warn('TimelineEventForm: No event to delete');
      return false;
    }

    console.log('TimelineEventForm: Delete event:', event.eventId);
    
    try {
      // Call the delete function passed as prop
      if (onDelete) {
        await onDelete(event.eventId);
      }
      
      // Reset form state
      setEditingEvent(null);
      setIsEditMode(false);
      toggleAccordion();
      
      return true; // Return success
    } catch (error) {
      console.error('TimelineEventForm: Error deleting event:', error);
      return false; // Return failure
    }
  };

  const styles = StyleSheet.create({
    container: { 
      padding: 12 
    },
    header: { 
      marginBottom: 12, 
      alignItems: 'center' 
    },
    addEventButton: { 
      marginBottom: 8 
    },
    savedEventsText: { 
      marginTop: 12, 
      marginBottom: 6 
    },
    savedEventsContainer: { 
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      gap: 6 
    },
    eventIcon: { 
      margin: 2 
    },
    editingEventIcon: {
      margin: 2,
      backgroundColor: theme.colors.primaryContainer,
    },
  });

   // Determine button text and accordion title
   const getButtonText = () => {
    if (isExpanded && isEditMode) return "Cancel Edit";
    if (isExpanded) return "Hide Form";
    if (isEditMode) return "Edit Event";
    return "Add Event";
  };

  const getAccordionTitle = () => {
    return isEditMode ? "Edit Event" : "Add Event";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TitleText size="large" color={theme.colors.onSurface}>
          Event Timeline
        </TitleText>
      </View>

      {/* FIX: The button text is now consistent. */}
      <Button
        mode="contained"
        onPress={isEditMode ? handleCancel : (isExpanded ? toggleAccordion : handleAddNewEvent)}
        disabled={isLoading}
        style={styles.addEventButton}
        icon={isExpanded ? "chevron-up" : (isEditMode ? "pencil" : "plus")}
      >
        {getButtonText()}
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
        isEditMode={isEditMode}
        editingEvent={editingEvent}
        title={getAccordionTitle()}
        onFieldChange={handleFieldChange}
        onTimePickerToggle={setShowTimePicker}
        onTimeChange={handleTimeChange}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        onDelete={handleEventDelete}
      />

      {events.length > 0 && (
        <View>
          <LabelText 
            size="medium" 
            color={theme.colors.onSurface} 
            style={styles.savedEventsText}
          >
            Timeline Events:
          </LabelText>
          <View style={styles.savedEventsContainer}>
            {events.map((event, index) => {
              const eventDetail = getEventTypeDetails(event.eventType);
              const IconComponent = eventDetail?.Icon;
              const isCurrentlyEditing = editingEvent?.eventId === event.eventId;

              return (
                <IconButton
                  key={`${event.eventId}-${index}`}
                  icon={() => IconComponent ? <IconComponent width={24} height={24} /> : null}
                  size={32}
                  style={[
                    styles.eventIcon,
                    isCurrentlyEditing && styles.editingEventIcon
                  ]}
                  mode="contained-tonal"
                  onPress={() => handleEventIconClick(event)}
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