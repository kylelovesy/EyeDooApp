/*-------------------------------------*/
// hooks/useTimelineForm.ts
// Status: Complete with validation and proper structure

// What it does: 
// This is the heart of your form's business logic. 
// It's responsible for managing the form's state (formData), handling input changes (handleFieldChange), 
// and preparing the data for submission with proper validation.
/*-------------------------------------*/

import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  NewEventFormData,
  SnackbarState,
  TTimelineEventForm
} from '../types/timeline';
// FIX: Import the correct schema for a single event form.
import { TimelineEventFormSchema } from '../types/timeline';

interface UseTimelineFormProps {
  projectDate: Date;
  onSubmit: (event: TTimelineEventForm) => void;
  updateEventIcons?: () => void;
}

export const useTimelineForm = ({ 
  projectDate, 
  onSubmit, 
  updateEventIcons 
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

  const validateForm = useCallback((): boolean => {
    try {
      // FIX: Use the correct schema for a single event.
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

  const resetForm = useCallback(() => {
    setFormData({ 
      time: projectDate, 
      notification: 'None' 
    });
    setErrors({});
    setShowTimePicker(false);
  }, [projectDate]);

  const handleSubmit = useCallback((): boolean => {
    if (!validateForm()) {
      setSnackbar({ 
        visible: true, 
        message: 'Please fix the errors before submitting.' 
      });
      return false;
    }

    try {
      // FIX: Ensure all fields from formData are included in the event object.
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
      
      return true;
    } catch (error) {
      console.error('Failed to submit form:', error);
      setSnackbar({ 
        visible: true, 
        message: 'Failed to add event. Please try again.' 
      });
      return false;
    }
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
    validateForm,
    setShowTimePicker,
    setSnackbar,
  };
};

// /*-------------------------------------*/
// // hooks/useTimelineForm.ts
// // Status: Complete with validation and proper structure

// // What it does: 
// // This is the heart of your form's business logic. 
// // It's responsible for managing the form's state (formData), handling input changes (handleFieldChange), 
// // and preparing the data for submission with proper validation.
// /*-------------------------------------*/

// import { useCallback, useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import type {
//   NewEventFormData,
//   SnackbarState,
//   TTimelineEventForm
// } from '../types/timeline';
// import { TimelineEventFormSchema } from '../types/timeline';

// interface UseTimelineFormProps {
//   projectDate: Date;
//   onSubmit: (event: TTimelineEventForm) => void;
//   updateEventIcons?: () => void;
// }



// /**
//  * Custom hook for managing timeline event form state and logic
//  * 
//  * Provides complete form management including:
//  * - Form data state management
//  * - Validation with Zod schema
//  * - Error handling and display
//  * - Time picker management
//  * - Submission workflow
//  * - User feedback via snackbars
//  * 
//  * @param projectDate - Base date for the project/wedding day
//  * @param onSubmit - Callback when new event is created
//  * @param updateEventIcons - Optional callback to refresh event icons
//  * @returns Form state and handlers
//  */
// export const useTimelineForm = ({ 
//   projectDate, 
//   onSubmit, 
//   updateEventIcons 
// }: UseTimelineFormProps) => {
//    // ============================================================================
//   // STATE MANAGEMENT
//   // ============================================================================
  
//   // Initialize form data with sensible defaults
//   const [formData, setFormData] = useState<NewEventFormData>({
//     time: projectDate,
//     notification: 'None',
//   });
  
//   // Form validation errors
//   const [errors, setErrors] = useState<Record<string, string>>({});
  
//   // Time picker visibility state
//   const [showTimePicker, setShowTimePicker] = useState(false);
  
//   // User feedback state
//   const [snackbar, setSnackbar] = useState<SnackbarState>({ 
//     visible: false, 
//     message: '' 
//   });

//   // ============================================================================
//   // VALIDATION LOGIC
//   // ============================================================================

//   /**
//    * Validates form data using Zod schema with fallback validation
//    * @returns true if form is valid, false otherwise
//    */
//   const validateForm = useCallback((): boolean => {
//     try {
//       // Primary validation using Zod schema
//       const validationResult = TimelineEventFormSchema.safeParse({
//         eventId: uuidv4(),
//         eventType: formData.eventType,
//         time: formData.time,
//         details: formData.details,
//         notification: formData.notification || 'None',
//         status: 'Draft'
//       });
      
//       if (!validationResult.success) {
//         // Map Zod errors to our error state format
//         const formattedErrors: Record<string, string> = {};
//         const fieldErrors = validationResult.error.flatten().fieldErrors;
        
//         // Convert array errors to string messages
//         Object.entries(fieldErrors).forEach(([field, messages]) => {
//           if (messages && messages.length > 0) {
//             formattedErrors[field] = messages[0];
//           }
//         });
        
//         setErrors(formattedErrors);
//         return false;
//       }

//       // Clear errors if validation passes
//       setErrors({});
//       return true;
//     } catch (error) {
//       // Fallback validation if Zod schema is not available
//       console.warn('Zod validation failed, using fallback validation:', error);
      
//       const newErrors: Record<string, string> = {};
      
//       if (!formData.eventType) {
//         newErrors.eventType = 'Please select an event type';
//       }
//       if (!formData.time) {
//         newErrors.time = 'Please select a time';
//       }
      
//       setErrors(newErrors);
//       return Object.keys(newErrors).length === 0;
//     }
//   }, [formData]);

//   // ============================================================================
//   // COMPUTED VALUES
//   // ============================================================================

//   /**
//    * Checks if form has minimum required fields for enabling save button
//    * @returns true if form can be submitted
//    */
//   const isFormComplete = useCallback((): boolean => {
//     return !!(formData.eventType && formData.time);
//   }, [formData.eventType, formData.time]);

//   // ============================================================================
//   // EVENT HANDLERS
//   // ============================================================================

//   /**
//    * Updates form field value and clears any existing validation error
//    * @param key - Field name to update
//    * @param value - New field value
//    */
//   const handleFieldChange = useCallback((key: keyof NewEventFormData, value: any) => {
//     setFormData(prev => ({ ...prev, [key]: value }));
    
//     // Clear error for this field when user starts making changes
//     if (errors[key]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[key];
//         return newErrors;
//       });
//     }
//   }, [errors]);

//   /**
//    * Handles time picker selection and updates form data
//    * @param event - Time picker event
//    * @param selectedDate - Selected date/time
//    */
//   const handleTimeChange = useCallback((event: any, selectedDate?: Date) => {
//     setShowTimePicker(false);
//     if (selectedDate) {
//       // Create new date based on project date but with selected time
//       const newDateTime = new Date(projectDate);
//       newDateTime.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
//       handleFieldChange('time', newDateTime);
//     }
//   }, [projectDate, handleFieldChange]);

//   /**
//    * Resets all form state to initial values
//    */
//   const resetForm = useCallback(() => {
//     setFormData({ 
//       time: projectDate, 
//       notification: 'None' 
//     });
//     setErrors({});
//     setShowTimePicker(false);
//   }, [projectDate]);

//   /**
//    * Main submission handler with validation and error handling
//    * @returns true if submission was successful, false otherwise
//    */
//   const handleSubmit = useCallback((): boolean => {
//     // Validate form before submission
//     if (!validateForm()) {
//       setSnackbar({ 
//         visible: true, 
//         message: 'Please fix the errors before submitting.' 
//       });
//       return false;
//     }

//     try {
//       // Create the event object with required fields
//       const eventData: TTimelineEventForm = {
//         eventId: uuidv4(),
//         eventType: formData.eventType!,
//         time: formData.time!,
//         description: formData.description || undefined,
//         notification: formData.notification || 'None',
//         status: 'Draft',
//       };

//       // Submit the data to parent component
//       onSubmit(eventData);
      
//       // Update icons if callback provided
//       if (updateEventIcons) {
//         updateEventIcons();
//       }
      
//       // Reset form and show success feedback
//       resetForm();
//       setSnackbar({ 
//         visible: true, 
//         message: 'Event added successfully!' 
//       });
      
//       return true;
//     } catch (error) {
//       // Handle submission errors
//       console.error('Failed to submit form:', error);
//       setSnackbar({ 
//         visible: true, 
//         message: 'Failed to add event. Please try again.' 
//       });
//       return false;
//     }
//   }, [formData, validateForm, onSubmit, updateEventIcons, resetForm]);

//   // ============================================================================
//   // HOOK INTERFACE
//   // ============================================================================

//   return {
//     // Form state
//     formData,
//     errors,
//     showTimePicker,
//     snackbar,
    
//     // Computed values
//     isFormComplete: isFormComplete(),
    
//     // Event handlers
//     handleFieldChange,
//     handleTimeChange,
//     handleSubmit,
//     resetForm,
//     validateForm,
    
//     // State setters for external control
//     setShowTimePicker,
//     setSnackbar,
//   };
// };
