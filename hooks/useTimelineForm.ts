/*-------------------------------------*/
// hooks/useTimelineForm.ts
// Status: Complete with validation and proper structure

// What it does: 
// This is the heart of your form's business logic. 
// It's responsible for managing the form's state (formData), handling input changes (handleFieldChange), 
// and preparing the data for submission with proper validation.
/*-------------------------------------*/

import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  NewEventFormData, SnackbarState, TTimelineEventForm
} from '../types/timeline';
// FIX: Import the correct schema for a single event form.
import { TimelineEventFormSchema } from '../types/timeline';

interface UseTimelineFormProps {
  projectDate: Date;
  onSubmit: (data: TTimelineEventForm) => void;
  updateEventIcons?: () => void;
  editingEvent?: TTimelineEventForm | null;
  onUpdate?: (eventId: string, data: TTimelineEventForm) => void;
  onDelete?: (eventId: string) => void;
}

export const useTimelineForm = ({ 
  projectDate, 
  onSubmit, 
  updateEventIcons,
  editingEvent,
  onUpdate,
  onDelete,
}: UseTimelineFormProps) => {
  const [formData, setFormData] = useState<NewEventFormData>({
    time: projectDate,
    notification: 'None',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ 
    visible: false, 
    message: '' 
  });

  // FIX: Add populateForm function to handle editing
  const populateForm = useCallback((event: TTimelineEventForm) => {
    setFormData({
      eventId: event.eventId,
      eventType: event.eventType,
      time: event.time,
      description: event.description,
      notification: event.notification || 'None',
      isEditMode: true,
    });
  }, []);

  // FIX: Populate form when editingEvent changes
  useEffect(() => {
    if (editingEvent) {
      populateForm(editingEvent);
    } else {
      // Reset form when not editing
      setFormData({
        time: projectDate,
        notification: 'None',
      });
    }
  }, [editingEvent, populateForm, projectDate]);
  
  const validateForm = useCallback((): boolean => {
    try {
      const validationResult = TimelineEventFormSchema.pick({ eventType: true, time: true }).safeParse(formData);
      
      if (!validationResult.success) {
        const formattedErrors: Record<string, string> = {};
        const fieldErrors = validationResult.error.flatten().fieldErrors;
        
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (messages && messages.length > 0) {
            formattedErrors[field] = messages[0];
          }
        });
        
        setErrors(formattedErrors);
        return false;
      }

      setErrors({});
      return true;
    } catch (error) {
      console.warn('Zod validation failed, using fallback validation:', error);
      
      const newErrors: Record<string, string> = {};
      
      if (!formData.eventType) {
        newErrors.eventType = 'Please select an event type';
      }
      if (!formData.time) {
        newErrors.time = 'Please select a time';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
  }, [formData]);

  const isFormComplete = useCallback((): boolean => {
    return !!(formData.eventType && formData.time);
  }, [formData.eventType, formData.time]);

  const handleFieldChange = useCallback((key: keyof NewEventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  }, [errors]);

  const handleTimeChange = useCallback((event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const newDateTime = new Date(projectDate);
      newDateTime.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      handleFieldChange('time', newDateTime);
    }
  }, [projectDate, handleFieldChange]);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setFormData({ 
      time: projectDate, 
      notification: 'None' 
    });
    setErrors({});
    setShowTimePicker(false);
  }, [projectDate]);

  const handleDelete = useCallback((): boolean => {
    if (editingEvent && onDelete) {
      try {
        onDelete(editingEvent.eventId);
        setSnackbar({
          visible: true,
          message: 'Event deleted successfully!'
        });
        resetForm();
        if (updateEventIcons) {
          updateEventIcons();
        }
        return true;
      } catch (error) {
        console.error('Failed to delete event:', error);
        setSnackbar({ 
          visible: true, 
          message: 'Failed to delete event. Please try again.' 
        });
        return false;
      }
    }
    return false;
  }, [editingEvent, onDelete, resetForm, updateEventIcons]);

  const handleSubmit = useCallback((): boolean => {
    if (!validateForm()) {
      setSnackbar({ 
        visible: true, 
        message: 'Please fix the errors before submitting.' 
      });
      return false;
    }

    try {
      if (editingEvent && onUpdate) {
        // Update existing event
        const updatedEventData: TTimelineEventForm = {
          eventId: editingEvent.eventId,
          eventType: formData.eventType!,
          time: formData.time!,
          description: formData.description || undefined,
          notification: formData.notification || 'None',
          status: editingEvent.status || 'Draft',
        };

        onUpdate(editingEvent.eventId, updatedEventData);

        if (updateEventIcons) {
          updateEventIcons();
        }
        
        resetForm();
        setSnackbar({
          visible: true,
          message: 'Event updated successfully!'
        });
      } else {
        // Create new event
        const eventData: TTimelineEventForm = {
          eventId: uuidv4(),
          eventType: formData.eventType!,
          time: formData.time!,
          description: formData.description || undefined,
          notification: formData.notification || 'None',
          status: 'Draft',
        };

        onSubmit(eventData);
        
        if (updateEventIcons) {
          updateEventIcons();
        }
        
        resetForm();
        setSnackbar({ 
          visible: true, 
          message: 'Event added successfully!' 
        });
      }      
      return true;
    } catch (error) {
      console.error('Failed to submit form:', error);
      setSnackbar({ 
        visible: true, 
        message: 'Failed to save event. Please try again.' 
      });
      return false;
    }
  }, [formData, validateForm, onSubmit, updateEventIcons, resetForm, editingEvent, onUpdate]);

  return {
    formData,
    errors,
    showTimePicker,
    snackbar,
    isFormComplete: isFormComplete(),
    handleFieldChange,
    handleTimeChange,
    handleSubmit,
    handleDelete,
    resetForm,
    validateForm,
    setShowTimePicker,
    setSnackbar,
    populateForm,
  };
};
