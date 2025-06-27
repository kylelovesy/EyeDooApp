import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { NewEventFormData, SnackbarState } from '../types/timeline';
import { TTimelineEventForm } from '../types/timeline';

export const useTimelineForm = (
  projectDate: Date,
  onSubmit: (event: TTimelineEventForm) => void,
  updateEventIcons?: () => void
) => {
  const [formData, setFormData] = useState<NewEventFormData>({
    time: projectDate,
    notification: 'None',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({ visible: false, message: '' });

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.eventType) {
      newErrors.eventType = 'Please select an event type';
    }
    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const isFormComplete = useCallback((): boolean => {
    return !!(formData.eventType && formData.time);
  }, [formData.eventType, formData.time]);

  const handleFieldChange = useCallback((key: keyof NewEventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
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

  const resetForm = useCallback(() => {
    setFormData({ time: projectDate, notification: 'None' });
    setErrors({});
  }, [projectDate]);

  const handleSubmit = useCallback(() => {
    if (!validateForm()) {
      return false;
    }

    const eventData: TTimelineEventForm = {
      eventId: uuidv4(),
      eventType: formData.eventType!,
      time: formData.time!,
      details: formData.details || undefined,
      notification: formData.notification || 'None',
      status: 'Draft',
    };

    onSubmit(eventData);
    if (updateEventIcons) {
      updateEventIcons();
    }
    resetForm();
    setSnackbar({ visible: true, message: 'Event added successfully!' });
    return true;
  }, [formData, validateForm, onSubmit, updateEventIcons, resetForm]);

  return {
    formData,
    errors,
    showTimePicker,
    snackbar,
    isFormComplete: isFormComplete(),
    handleFieldChange,
    handleTimeChange,
    handleSubmit,
    resetForm,
    setShowTimePicker,
    setSnackbar,
  };
};